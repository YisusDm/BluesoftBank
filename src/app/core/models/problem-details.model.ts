export interface ProblemDetails {
  status: number;
  code?: string;
  title?: string;
  message?: string;
  detail?: string;
  suggestedAction?: string;
  instance?: string;
  timestamp?: string;
  errors?: Record<string, string[]>;
}
