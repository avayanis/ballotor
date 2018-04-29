import * as candidateModel from "../models/candidate";
import * as electionModel from "../models/election";
import * as voteModel from "../models/vote";
import * as uuid from "uuid";

import log from "../helpers/logger";

import {} from "aws-sdk";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { promisifyAll } from "bluebird";

import { ICandidatePreview, ICandidateFull } from "../interfaces/candidate";
import { IElection } from "../interfaces/election";

import { electionVoteSchema } from "./schemas/election";
import { verifyJWT } from "../helpers/validators";
import { getJWT } from "../helpers/jwt";
import { IncomingMessage } from "http";
import { getUserByEmail } from "../controllers/user";

async function getElectionById(
  request: FastifyRequest<{}>,
  reply: FastifyReply<{}>
) {
  const electionId = request.params["election_id"];

  try {
    const election = await electionModel.getElectionById(electionId);

    reply.send(election);
  } catch (err) {
    log.error(err);

    reply.code(500).send({ message: "Opps, something went wrong" });
  }
}

async function listElections(
  request: FastifyRequest<{}>,
  reply: FastifyReply<{}>
) {
  try {
    const elections = await electionModel.fetchAvailableElections();

    reply.send(elections);
  } catch (err) {
    log.error(err);

    reply.code(500).send({ message: "Opps, something went wrong" });
  }
}

async function listElectionCandidates(
  request: FastifyRequest<{}>,
  reply: FastifyReply<{}>
) {
  try {
    const electionId = request.params["election_id"];
    const results = await electionModel.fetchElectionCandidates(electionId);
    let previews: ICandidatePreview[] = [];

    let promises: Promise<ICandidateFull>[] = results.map(result => {
      return candidateModel.getCandidateById(result.candidate_id);
    });

    let candidates = await Promise.all(promises);
    candidates.forEach(candidate => {
      previews.push({
        id: candidate.id,
        portrait: candidate.portrait,
        first: candidate.first,
        last: candidate.last,
        summary: candidate.summary
      });
    });

    reply.send(candidates);
  } catch (err) {
    log.error(err);

    reply.code(500).send({ message: "Opps, something went wrong" });
  }
}

async function getCandidateById(
  request: FastifyRequest<{}>,
  reply: FastifyReply<{}>
) {
  try {
    const id = request.params["candidate_id"];
    const candidate = await candidateModel.getCandidateById(id);

    reply.send(candidate);
  } catch (err) {
    log.error(err);

    reply.code(500).send({ message: "Opps, something went wrong" });
  }
}

async function voteForCandidate(
  request: FastifyRequest<IncomingMessage>,
  reply: FastifyReply<{}>
) {
  try {
    const electionId = request.params["election_id"];
    const candidateId = request.body["candidate_id"];
    const jwt = await getJWT(request);
    if (!jwt) {
      return reply.code(400).send({ message: "Invalid Token" });
    }

    const email = jwt.claims.sub;
    const user = await getUserByEmail(email);
    const user_id = user.profile.uuid;

    const result = await voteModel.putVote(user_id, electionId, candidateId);

    reply.send({ status: "success" });
  } catch (err) {
    console.log(err);
    switch (err.code) {
      case "ConditionalCheckFailedException":
        reply.code(400).send({ message: "duplicate vote" });
        break;
      default:
        log.error(err);
        reply.code(500).send({ message: "Opps, something went wrong" });
    }
  }
}

export default async function routes(server: FastifyInstance, options: any) {
  server.get("/elections", listElections);
  server.get("/elections/:election_id", getElectionById);
  server.get("/elections/:election_id/candidates", listElectionCandidates);
  server.post(
    "/elections/:election_id/vote",
    {
      schema: electionVoteSchema,
      beforeHandler: verifyJWT
    },
    voteForCandidate
  );
  server.get("/candidates/:candidate_id", getCandidateById);
  server.get(
    "/elections/uuid",
    (request: FastifyRequest<{}>, reply: FastifyReply<{}>) => {
      reply.send({ uuid: uuid.v4() });
    }
  );
}
