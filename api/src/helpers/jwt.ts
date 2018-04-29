import * as OktaJwtVerifier from "@okta/jwt-verifier";
import * as config from "config";
import logger from "../helpers/logger";

// test
import { IncomingMessage } from "http";
import { FastifyRequest } from "fastify";

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: `${config.get("okta.origin")}/oauth2/default`,
  assertClaims: {
    aud: "api://default"
  }
});

export async function getJWT(
  request: FastifyRequest<IncomingMessage>
): Promise<any> {
  const authHeader = (request.req.headers["authorization"] || "") as String;
  const matches = authHeader.match(/Bearer (.*)/);
  if (!matches) {
    logger.warn("Missing authorization token in request headers");
    return null;
  }

  try {
    const accessTokenString: String = matches[1];
    const jwt = await oktaJwtVerifier.verifyAccessToken(accessTokenString);
    logger.info("Valid Token");
    return jwt;
  } catch (err) {
    logger.warn("Invalid token", err);
    return null;
  }
}
