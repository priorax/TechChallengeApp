import { InstanceType, IVpc, SubnetType, InstanceClass, InstanceSize} from '@aws-cdk/aws-ec2';
import {DatabaseInstance, DatabaseSecret, IDatabaseInstance, PostgresEngineVersion, DatabaseInstanceEngine, Credentials} from '@aws-cdk/aws-rds'
import {HostedRotation, HostedRotationType, ISecret} from '@aws-cdk/aws-secretsmanager'
import * as cdk from '@aws-cdk/core';
import { RemovalPolicy } from '@aws-cdk/core';

interface DatabaseProps {
    isDebug: boolean;
    vpc: IVpc
}

export class StackDatabase extends cdk.Construct {
    db: IDatabaseInstance;
    secret: ISecret

    constructor(scope: cdk.Construct, id: string, props: DatabaseProps){
        super(scope, id);
        const {vpc, isDebug} = props
        this.secret = new DatabaseSecret(this, 'dbPassword', {
            username: 'root',
            replaceOnPasswordCriteriaChanges: true
        })
        this.db = new DatabaseInstance(this, 'Database', {
            engine: DatabaseInstanceEngine.postgres({version: PostgresEngineVersion.VER_10_7}),
            vpc,
            vpcSubnets: {
                subnetType: SubnetType.PRIVATE
            },
            credentials: Credentials.fromSecret(this.secret),
            copyTagsToSnapshot: true,
            storageEncrypted: true,
            instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.SMALL),
            multiAz: !isDebug,
            removalPolicy: isDebug ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN
        })
    }
}