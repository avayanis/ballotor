import * as config from "config";
import * as request from "request-promise";

// types
import { FastifyRequest } from "fastify";
import { IncomingMessage } from "http";

export async function createUser(body: any) {
  const { firstName, lastName, email, password } = body;
  const payload = {
    profile: {
      firstName,
      lastName,
      email,
      login: email
    },
    credentials: {
      password: { value: password }
    }
  };

  return request({
    method: "POST",
    uri: `${config.get("okta.origin")}/api/v1/users?activate=true`,
    body: payload,
    json: true,
    headers: {
      Authorization: `SSWS ${config.get("okta.apiKey")}`
    }
  });
}
