import log from "../helpers/logger";

import { DynamoDB } from "aws-sdk";
import { promisifyAll } from "bluebird";

import { IPromisifedDynamoDBDocumentClient } from "../interfaces/aws-sdk";
import { ICandidateFull, ICandidateResult } from "../interfaces/candidate";

const dynamodb: IPromisifedDynamoDBDocumentClient = promisifyAll(
  new DynamoDB.DocumentClient({
    apiVersion: "2012-10-08",
    region: "us-west-1"
  })
);

export async function getCandidateById(id: string): Promise<ICandidateFull> {
  const query = {
    TableName: "candidates",
    Key: {
      candidate_id: id
    }
  };

  const result = await dynamodb.getAsync(query);
  const candidate = result.Item as ICandidateResult;

  return convertCandidateResult(candidate);
}

function convertCandidateResult(result: ICandidateResult): ICandidateFull {
  return {
    id: result.candidate_id,
    portrait: result.portrait,
    first: result.first_name,
    last: result.last_name,
    title: result.title,
    description: result.description,
    summary: result.summary,
    images: result.images,
    dob: result.dob
  };
}
