import { FastifyRequest, FastifyReply } from "fastify";
import { IncomingMessage, ServerResponse } from "http";
import { getJWT } from "../helpers/jwt";

export async function verifyJWT(
  request: FastifyRequest<IncomingMessage>,
  reply: FastifyReply<ServerResponse>,
  next: any
) {
  const jwt = await getJWT(request);
  if (!jwt) {
    reply.code(401);
    next(new Error("Unauthorized"));
    return;
  }

  next();
}
