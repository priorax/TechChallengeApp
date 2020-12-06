import * as cdk from '@aws-cdk/core';
import {StackVpc} from './vpc'
import {StackDatabase} from './database'

interface StackProps extends cdk.StackProps {
    isDebug: boolean
}

export class TaskApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const prop = {isDebug: props?.isDebug ?? true}
    const {vpc} = new StackVpc(this, 'vpc', prop)
    const database = new StackDatabase(this, 'database', {
        ...prop,
        vpc
    })
    // The code that defines your stack goes here
  }
}