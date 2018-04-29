import * as uuid from "uuid";
import * as electionModel from "./election";

import log from "../helpers/logger";

import { DynamoDB } from "aws-sdk";
import { promisifyAll } from "bluebird";

import { IPromisifedDynamoDBDocumentClient } from "../interfaces/aws-sdk";

const dynamodb: IPromisifedDynamoDBDocumentClient = promisifyAll(
  new DynamoDB.DocumentClient({
    apiVersion: "2012-10-08",
    region: "us-west-1"
  })
);

export async function putVote(
  user_id: string,
  election_id: string,
  candidate_id: string
): Promise<Boolean> {
  const current = new Date();
  const query = {
    TableName: "votes",
    Item: {
      user_id,
      election_id,
      candidate_id,
      vote_id: uuid.v4(),
      vote_date: current.getTime()
    },
    ConditionExpression:
      "attribute_not_exists(user_id) AND attribute_not_exists(election_id)"
  };

  const result = await dynamodb.putAsync(query);

  if (!result) {
    return false;
  }

  return await !!electionModel.incrementVote(election_id);
}
