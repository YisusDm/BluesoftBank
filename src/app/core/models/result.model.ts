export interface Result<T = void> {
  isSuccess: boolean;
  value?: T;
  error?: string;
}
