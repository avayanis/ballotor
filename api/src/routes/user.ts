import * as config from "config";
import * as request from "request-promise";
import { verifyJWT } from "../helpers/validators";
import { createUser } from "../controllers/user";
import logger from "../helpers/logger";

// types
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { IncomingMessage, ServerResponse } from "http";

export default async function routes(server: FastifyInstance, options: any) {
  server.post(
    "/user",
    async (
      request: FastifyRequest<IncomingMessage>,
      reply: FastifyReply<ServerResponse>
    ) => {
      try {
        const user = await createUser(request.body);
        return { success: true };
      } catch (err) {
        logger.warn(err);
        return { success: false };
      }
    }
  );
}
