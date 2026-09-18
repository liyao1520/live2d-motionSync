export class PlayerError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'PlayerError';
  }
}
export function asError(error: unknown, code = 'INTERNAL_ERROR'): PlayerError {
  return error instanceof PlayerError
    ? error
    : new PlayerError(code, error instanceof Error ? error.message : String(error), error);
}
export function check(condition: unknown, code: string, message: string): asserts condition {
  if (!condition) throw new PlayerError(code, message);
}
export function aborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new PlayerError('CANCELLED', 'Operation cancelled');
}
