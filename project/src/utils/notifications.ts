import { ToastOptions, ToastContent } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type CallbackFunctionVariadic = (
  content: ToastContent<unknown>,
  options?: ToastOptions<INotifyOptions>
) => void;

export interface INotifyOptions {
  position?: string;
  autoClose?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  progress?: undefined;
}

export const notify = (text: string, callback: CallbackFunctionVariadic) => {
  callback(text, {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
