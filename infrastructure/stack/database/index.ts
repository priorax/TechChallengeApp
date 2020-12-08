import { InstanceType, IVpc, SubnetType, InstanceClass, InstanceSize, Vpc} from '@aws-cdk/aws-ec2';
import {DatabaseInstance, DatabaseSecret, IDatabaseInstance, PostgresEngineVersion, DatabaseInstanceEngine, Credentials} from '@aws-cdk/aws-rds'
import {ISecret} from '@aws-cdk/aws-secretsmanager'
import * as cdk from '@aws-cdk/core';
import { RemovalPolicy } from '@aws-cdk/core';

interface DatabaseProps {
    isDebug: boolean;
    vpc: IVpc;
    databaseName: string;
}

export class StackDatabase extends cdk.Construct {
    database: IDatabaseInstance;
    secret: ISecret
    databaseName: string
    constructor(scope: cdk.Construct, id: string, props: DatabaseProps){
        super(scope, id);
        const {vpc, isDebug, databaseName} = props
        this.secret = new DatabaseSecret(this, 'dbPassword', {
            username: 'root',
            replaceOnPasswordCriteriaChanges: true
        })
        this.database = new DatabaseInstance(this, 'Database', {
            engine: DatabaseInstanceEngine.postgres({version: PostgresEngineVersion.VER_10_7}),
            vpc,
            vpcSubnets: {
                subnetType: SubnetType.PRIVATE
            },
            databaseName,
            credentials: Credentials.fromSecret(this.secret),
            copyTagsToSnapshot: true,
            storageEncrypted: true,
            instanceType: InstanceType.of(InstanceClass.BURSTABLE3, InstanceSize.SMALL),
            multiAz: !isDebug,
            removalPolicy: isDebug ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN
        })
    }
}