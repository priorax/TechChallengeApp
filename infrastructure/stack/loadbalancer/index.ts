import {IVpc} from '@aws-cdk/aws-ec2';
import { ApplicationListener, ApplicationLoadBalancer, ApplicationProtocol, IApplicationListener, IApplicationLoadBalancer, ListenerAction } from '@aws-cdk/aws-elasticloadbalancingv2'
import * as cdk from '@aws-cdk/core';

interface LBProps {
    isDebug: boolean;
    vpc: IVpc
}

export class StackLoadBalancer extends cdk.Construct {

    alb: IApplicationLoadBalancer
    listener: IApplicationListener
    constructor(scope: cdk.Construct, id: string, props: LBProps){
        super(scope, id);
        this.alb = new ApplicationLoadBalancer(this, 'alb', {
            vpc: props.vpc,
            internetFacing: true,
            deletionProtection: !props.isDebug,
        })
        this.listener = new ApplicationListener(this, 'albListener', {
            loadBalancer: this.alb,
            defaultAction: ListenerAction.fixedResponse(404),
            protocol: ApplicationProtocol.HTTP
        })
    }


}