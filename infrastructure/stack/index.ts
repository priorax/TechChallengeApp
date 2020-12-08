import * as cdk from '@aws-cdk/core';
import {StackVpc} from './vpc'
import {StackDatabase} from './database'
import {StackLoadBalancer} from './loadbalancer'
import { StackContainer } from './containers';
import { Port, Protocol } from '@aws-cdk/aws-ec2';
import { ApplicationProtocol, ListenerCondition } from '@aws-cdk/aws-elasticloadbalancingv2';
interface StackProps extends cdk.StackProps {
    isDebug: boolean
}

export class TaskApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const databaseName = 'app'
    const prop = {isDebug: props?.isDebug ?? true}
    const {vpc} = new StackVpc(this, 'vpc', prop)
    const {database, secret} = new StackDatabase(this, 'database', {
        ...prop,
        vpc,
        databaseName
    })
    const {listener} = new StackLoadBalancer(this, 'loadBalancer',
    {
      ...prop,
      vpc
    })
    const containerPort = 3000
    const {service, serviceSecurityGroup} = new StackContainer(this, 'containers', {
      ...prop, 
      vpc,
      listenPort: containerPort,
      databaseLogin: secret,
      databaseName
    })
    database.connections.allowFrom(serviceSecurityGroup, Port.tcp(5432), 'Inbound from API')
    const targetGroup = listener.addTargets('service', {
      conditions: [
        ListenerCondition.pathPatterns(['/*'])
      ],
      targets: [service],
      priority: 1,
      port: containerPort,
      protocol: ApplicationProtocol.HTTP,
      healthCheck: {
        enabled: true,
        healthyHttpCodes: [200, 201, 202, 204].join(','),
        healthyThresholdCount: 5,
        interval: cdk.Duration.seconds(30),
        unhealthyThresholdCount: 2,
        path: '/healthcheck/',
        port: `${containerPort}`
      },
      deregistrationDelay: cdk.Duration.seconds(10)
    })
    service.autoScaleTaskCount({
      maxCapacity: 6,
      minCapacity: props?.isDebug ? 1 : 2
    }).scaleOnRequestCount('requestScaling', {
      requestsPerTarget: 500,
      targetGroup
    })
  }
}