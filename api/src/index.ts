import * as config from "config";
import * as fastify from "fastify";
import * as pino from "pino";

const logger = pino({
  name: "typescript-sample-main",
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: !(process.env.NODE_ENV === "production")
});

const server = fastify();

server.get("/", (req, res) => {
  res.send({ hello: "world" });
});

server.listen(config.get("http.port"), config.get("http.host"), err => {
  if (err) throw err;

  logger.info(`server listening on ${server.server.address().port}`);
});
