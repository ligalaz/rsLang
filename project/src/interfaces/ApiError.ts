export interface ApiError {
  error: ErrorDescriptions;
}

type ErrorDescriptions = {
  data: string;
  error: string;
  originalStatus: number;
  status: string | number;
};
