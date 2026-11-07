/**
 * DEV-only route (/debug/crash) that throws during render,
 * so the Error Boundary fallback can be demonstrated at the defence.
 */
export default function CrashTestPage(): never {
  throw new Error("Intentional crash — testing the Error Boundary");
}
