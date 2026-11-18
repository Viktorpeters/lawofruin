/* The signed-in reader, attached to each request by middleware/auth.ts. */
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string };
    }
  }
}
export {};
