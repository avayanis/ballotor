import * as config from "config";
import * as fastify from "fastify";
import * as OktaJwtVerifier from "@okta/jwt-verifier";
import * as cors from "cors";
import logger from "./helpers/logger";
import registerRoutes from "./routes";

const server = fastify();
server.use(cors());
server.register(require("fastify-formbody"));
registerRoutes(server);

server.listen(config.get("http.port"), config.get("http.host"), err => {
  if (err) throw err;

  logger.info(`server listening on ${server.server.address().port}`);
});
