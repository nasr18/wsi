import { createServer } from "http";

import app from "./app";

const port = process.env.PORT ?? 3000;
const server = createServer(app);

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught exception", err);
  shutdownProperly(1);
});

process.on("unhandledRejection", (reason: {} | null | undefined) => {
  console.error("Unhandled Rejection at promise", reason);
  shutdownProperly(2);
});

process.on("SIGINT", () => {
  console.info("Caught SIGINT");
  shutdownProperly(128 + 2);
});

process.on("SIGTERM", () => {
  console.info("Caught SIGTERM");
  shutdownProperly(128 + 2);
});

process.on("exit", () => {
  console.info("Exiting");
});

function shutdownProperly(exitCode: number) {
  Promise.resolve()
    .then(() => server.close())
    .then(() => {
      console.info("Shutdown complete");
      process.exit(exitCode);
    })
    .catch((err) => {
      console.error("Error during shutdown", err);
      process.exit(1);
    });
}

server.listen(port, () =>
  console.log("Finding-You server running on port ", port)
);
