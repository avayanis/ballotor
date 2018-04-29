import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { verifyJWT } from "../helpers/validators";

export default async function routes(server: FastifyInstance, options: any) {
  server.get(
    "/user",
    { beforeHandler: verifyJWT },
    async (request: FastifyRequest<{}>, reply: FastifyReply<{}>) => {
      return { hello: "world" };
    }
  );
}
