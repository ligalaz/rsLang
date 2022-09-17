import { logout } from "../store/auth-slice";
import { toast } from "react-toastify";
import { notify } from "../utils/notifications";
import { ApiError } from "../interfaces/ApiError";

export async function unauthorizedErrorHandler<T>(
  args: T,
  {
    dispatch,
    queryFulfilled,
  }: { dispatch: CallableFunction; queryFulfilled: unknown }
) {
  try {
    await queryFulfilled;
  } catch (err: unknown) {
    const error = err as ApiError;
    if (error.error.originalStatus === 401) {
      notify("Authorization required", toast.error);
      dispatch(logout());
    }
  }
}
