// Observability seams. Structured one-line request logs + an error-tracking hook.
// captureError is a no-op by default; with SENTRY_DSN set you'd forward to Sentry
// (documented; the SDK isn't a dependency here). Both are safe offline.

export function logRequest({ method, path, status, ms, identity }) {
  console.log(`[api] ${method} ${path} ${status} ${ms}ms id=${identity || "-"}`);
}

export function captureError(err, context = {}) {
  // Swap point: if (process.env.SENTRY_DSN) Sentry.captureException(err, { extra: context });
  console.error(`[api] error${context.path ? ` ${context.path}` : ""}:`, (err && err.message) || err);
}
