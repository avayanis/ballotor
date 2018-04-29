import { FastifyInstance } from "fastify";
import ElectionRoutes from "./election";
import UserRoutes from "./user";

export default function(server: FastifyInstance) {
  server.register(ElectionRoutes, { prefix: "/api/v1" });
  server.register(UserRoutes, { prefix: "/api/v1" });
}
