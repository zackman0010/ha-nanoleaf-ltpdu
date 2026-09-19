// HA's websocket connection rejects service-call failures with a plain
// {code, message} object, not an Error — String() on that yields "[object
// Object]", so pull .message out explicitly before falling back to String().
export function describeError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") {
    return (err as { message: string }).message;
  }
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}
