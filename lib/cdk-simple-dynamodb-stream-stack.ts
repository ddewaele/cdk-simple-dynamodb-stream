import * as cdk from 'aws-cdk-lib';
import { aws_lambda as lambda, aws_dynamodb as dynamodb, aws_sns as sns, aws_sns_subscriptions as subscriptions, aws_cloudwatch as cloudwatch, CfnOutput } from 'aws-cdk-lib';
import { BillingMode } from 'aws-cdk-lib/aws-dynamodb';

import { Construct } from 'constructs';
import * as path from 'path';

export class CdkSimpleDynamodbStreamStack extends cdk.Stack {
  
  public readonly table: cdk.aws_dynamodb.Table;
  public readonly simpleLoggingLambda: cdk.aws_lambda.Function;
  public readonly tableName: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table
    this.table = new dynamodb.Table(this, 'StreamingDataTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_IMAGE,
    });

    // Lambda function that checks the data in DynamoDB Stream
    this.simpleLoggingLambda = new lambda.Function(this, 'SimpleLoggingLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, '../lambda/simple-lambda')), // Path to your Lambda function code
      environment: {
        TABLE_NAME: this.table.tableName,
      },
    });

    // Grant checkerLambda permissions to read from the DynamoDB Stream and publish to SNS
    this.table.grantStreamRead(this.simpleLoggingLambda);

    // Trigger checkerLambda from DynamoDB Stream
    this.simpleLoggingLambda.addEventSourceMapping('CheckerEventSource', {
      eventSourceArn: this.table.tableStreamArn,
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 5, // Adjust as needed
    });

    // Output the URL
    this.tableName = new CfnOutput(this, 'DynamoDBTableName', {
      value: this.table.tableName,
    });

  }
}
