/**
 * Custom hook to use Ant Design message and modal with App context
 */
import { App } from 'antd';

export function useMessage() {
  const { message, modal } = App.useApp();
  return { message, modal };
}
