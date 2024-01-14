export function serverError(code: number, message: string): Error {
  const error = new Error(message) as any;
  error.code = code;
  return error;
}
