import * as AWS from "aws-sdk";

export interface IPromisifedDynamoDB extends AWS.DynamoDB {
  [x: string]: any;
}

export interface IPromisifedDynamoDBDocumentClient
  extends AWS.DynamoDB.DocumentClient {
  [x: string]: any;
}
