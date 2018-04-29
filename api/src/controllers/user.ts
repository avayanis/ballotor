import * as crypto from "crypto";
import * as config from "config";
import * as request from "request-promise";
import * as uuid from "uuid";
import { ParseSSN } from "ssn";
import logger from "../helpers/logger";

// types
import { FastifyRequest } from "fastify";
import { IncomingMessage } from "http";

function hashSSN(ssn: string) {
  return crypto
    .createHash("sha512")
    .update(ssn)
    .digest("hex");
}

async function checkSSNTaken(hashedSSN: string) {
  const oktaOrigin = config.get("okta.origin");
  const uri = encodeURI(
    `${oktaOrigin}/api/v1/users?search=profile.ssn_hash eq "${hashedSSN}"`
  );
  const options = {
    method: "GET",
    uri,
    json: true,
    headers: {
      Authorization: `SSWS ${config.get("okta.apiKey")}`
    }
  };
  const usersWithSameSSN = await request(options);
  return usersWithSameSSN.length > 0;
}

export async function getUserByEmail(email: string) {
  return request({
    method: "GET",
    uri: `${config.get("okta.origin")}/api/v1/users/${email}`,
    json: true,
    headers: {
      Authorization: `SSWS ${config.get("okta.apiKey")}`
    }
  });
}

export async function createUser(body: any) {
  const { firstName, lastName, email, password, ssn } = body;
  const parseSSN = new ParseSSN(ssn);
  const ssnString = parseSSN.ssn().toString();
  const hashedSSN = hashSSN(ssnString);
  const ssnTaken = await checkSSNTaken(hashedSSN);
  if (ssnTaken) {
    throw new Error("Social Security Number already registered.");
  }

  const payload = {
    profile: {
      firstName,
      lastName,
      email,
      login: email,
      uuid: uuid.v4(),
      ssn_hash: hashedSSN
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
