export function configuration() {
  return {
    server: {
      port: Number(process.env.PORT ?? 3002),
    },
  };
}
