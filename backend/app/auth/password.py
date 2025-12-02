import bcrypt
import hashlib


def _prepare_password(password: str) -> bytes:
    """
    Prepare password for bcrypt hashing.
    Bcrypt has a 72-byte limit, so we hash long passwords with SHA-256 first.
    """
    password_bytes = password.encode('utf-8')
    # If password is longer than 72 bytes, pre-hash with SHA-256
    if len(password_bytes) > 72:
        return hashlib.sha256(password_bytes).hexdigest().encode('utf-8')
    return password_bytes


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    prepared_password = _prepare_password(plain_password)
    return bcrypt.checkpw(prepared_password, hashed_password.encode('utf-8'))


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    prepared_password = _prepare_password(password)
    # Use bcrypt with 12 rounds (default)
    hashed = bcrypt.hashpw(prepared_password, bcrypt.gensalt(rounds=12))
    return hashed.decode('utf-8')
