#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TaskApiStack } from './stack';

const app = new cdk.App();
const stack = new TaskApiStack(app, 'TaskApiStack');