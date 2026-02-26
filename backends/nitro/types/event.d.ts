declare module 'h3' {
  interface H3EventContext {
    auth?: {
      user: { id: string; name?: string | null; email?: string | null; image?: string | null };
      session?: unknown;
    };
  }
}
