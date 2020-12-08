import * as cdk from '@aws-cdk/core';
import {StackVpc} from './vpc'

interface StackProps extends cdk.StackProps {
    isDebug: boolean
}

export class TaskApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = new StackVpc(this, 'vpc', {isDebug: props?.isDebug ?? true})
    // The code that defines your stack goes here
  }
}