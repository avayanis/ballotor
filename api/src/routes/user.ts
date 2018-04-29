import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function routes(server: FastifyInstance, options: any) {
  server.get(
    "/user",
    async (request: FastifyRequest<{}>, reply: FastifyReply<{}>) => {
      return { hello: "world" };
    }
  );
}
