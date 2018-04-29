import * as OktaJwtVerifier from "@okta/jwt-verifier";
import { FastifyRequest, FastifyReply } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import logger from "../helpers/logger";

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: "https://dev-459696.oktapreview.com/oauth2/default",
  assertClaims: {
    aud: "api://default"
  }
});

export async function verifyJWT(
  request: FastifyRequest<IncomingMessage>,
  reply: FastifyReply<ServerResponse>,
  next: any
) {
  const authHeader = (request.req.headers["authorization"] || "") as String;
  const matches = authHeader.match(/Bearer (.*)/);
  if (!matches) {
    logger.warn("Missing authorization token in request headers");
    reply.code(401);
    return next(new Error("Unauthorized"));
  }

  try {
    const accessTokenString: String = matches[1];
    const jwt = await oktaJwtVerifier.verifyAccessToken(accessTokenString);
    logger.info("Valid Token");
    next();
  } catch (err) {
    logger.warn("Invalid token", err);
    reply.code(401);
    next(new Error("Unauthorized"));
  }
}
