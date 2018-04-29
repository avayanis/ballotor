import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function routes(server: FastifyInstance, options: any) {
  server.get(
    "/election",
    async (request: FastifyRequest<{}>, reply: FastifyReply<{}>) => {
      return { hello: "world" };
    }
  );
}
