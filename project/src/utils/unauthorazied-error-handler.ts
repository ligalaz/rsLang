import { logout } from "../store/auth-slice";

export async function unauthorizedErrorHandler<T>(
  args: T,
  {
    dispatch,
    queryFulfilled,
  }: { dispatch: CallableFunction; queryFulfilled: unknown }
) {
  try {
    await queryFulfilled;
  } catch (error: unknown) {
    // TODO: define caching error with 401 status
    dispatch(logout());
  }
}
