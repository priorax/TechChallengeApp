import {Vpc, IVpc} from '@aws-cdk/aws-ec2'
import * as cdk from '@aws-cdk/core';

interface VpcProps {
    isDebug: boolean;
}

export class StackVpc extends cdk.Construct {
    vpc: IVpc;
    
    constructor(scope: cdk.Construct, id: string, props: VpcProps){
        super(scope, id);
        this.vpc = new Vpc(this, 'VPC', {
            natGateways: props.isDebug ? 1 : 2
        })
    }
}