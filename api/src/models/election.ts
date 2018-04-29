import log from "../helpers/logger";

import { DynamoDB } from "aws-sdk";
import { promisifyAll } from "bluebird";

import { IPromisifedDynamoDBDocumentClient } from "../interfaces/aws-sdk";
import {
  IElection,
  IElectionResult,
  IElectionCandidateResult
} from "../interfaces/election";

const dynamodb: IPromisifedDynamoDBDocumentClient = promisifyAll(
  new DynamoDB.DocumentClient({
    apiVersion: "2012-10-08",
    region: "us-west-1"
  })
);

export async function getElectionById(id: string): Promise<IElection> {
  const query = {
    TableName: "elections",
    Key: {
      election_id: id
    }
  };

  const result = await dynamodb.getAsync(query);

  return convertElectionResult(result.Item as IElectionResult);
}

export async function fetchAvailableElections(): Promise<IElection[]> {
  const today = new Date();
  const query = {
    TableName: "elections",
    ExpressionAttributeValues: {
      ":current": today.getTime() / 1000
    },
    FilterExpression: ":current < election_end_date"
  };

  const results = await dynamodb.scanAsync(query);
  const electionResults = results.Items as IElectionResult[];
  let elections: IElection[] = [];

  electionResults.forEach(result => {
    elections.push(convertElectionResult(result));
  });

  return elections;
}

export async function fetchElectionCandidates(
  id: string
): Promise<IElectionCandidateResult[]> {
  const query = {
    TableName: "election_candidates",
    ExpressionAttributeValues: {
      ":id": id
    },
    FilterExpression: "election_id = :id"
  };

  const results = await dynamodb.scanAsync(query);
  const candidates = results.Items as IElectionCandidateResult[];

  return candidates;
}

function convertElectionResult(result: IElectionResult): IElection {
  return {
    id: result.election_id,
    title: result.election_title,
    description: result.election_description,
    end_date: result.election_end_date
  };
}
