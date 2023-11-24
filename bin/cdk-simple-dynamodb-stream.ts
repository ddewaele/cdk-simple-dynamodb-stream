#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkSimpleDynamodbStreamStack } from '../lib/cdk-simple-dynamodb-stream-stack';

const app = new cdk.App();
new CdkSimpleDynamodbStreamStack(app, 'CdkSimpleDynamodbStreamStack', {});