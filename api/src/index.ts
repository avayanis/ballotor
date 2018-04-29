import * as config from "config";
import * as fastify from "fastify";
import * as pino from "pino";
import * as OktaJwtVerifier from "@okta/jwt-verifier";
import registerRoutes from "./routes";

const logger = pino({
  name: "typescript-sample-main",
  level: process.env.LOG_LEVEL || "info",
  prettyPrint: !(process.env.NODE_ENV === "production")
});

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: "https://dev-459696.oktapreview.com/oauth2/default",
  assertClaims: {
    aud: "api://default"
  }
});

const server = fastify();
registerRoutes(server);

server.addHook("preHandler", (request, reply, next) => {
  const authHeader = (request.req.headers["authorization"] || "") as String;
  const matches = authHeader.match(/Bearer (.*)/);
  if (!matches) {
    logger.warn("Missing authorization token in request headers");
    reply.code(401);
    next(new Error("Unauthorized"));
    return;
  }

  let accessTokenString: String = matches[1];
  logger.warn(accessTokenString);
  oktaJwtVerifier
    .verifyAccessToken(accessTokenString) // local validation
    .then((jwt: any) => {
      logger.warn("Valid Token");
      next();
    })
    .catch((err: any) => {
      logger.warn("Invalid token", err);
      reply.code(401);
      next(new Error("Unauthorized"));
    });
});

server.listen(config.get("http.port"), config.get("http.host"), err => {
  if (err) throw err;

  logger.info(`server listening on ${server.server.address().port}`);
});
