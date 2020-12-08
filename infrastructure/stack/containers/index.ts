import { Cluster,  ContainerDependencyCondition, ContainerImage, FargateService, FargateTaskDefinition, LogDriver, LogDrivers, PropagatedTagSource, Secret } from '@aws-cdk/aws-ecs'
import * as cdk from '@aws-cdk/core';
import {ISecret} from '@aws-cdk/aws-secretsmanager'
import {ISecurityGroup, IVpc, SecurityGroup} from '@aws-cdk/aws-ec2'


interface ContainerProps {
    listenPort: number;
    databaseLogin: ISecret;
    isDebug: boolean;
    vpc: IVpc;
    databaseName: string;
}

export class StackContainer extends cdk.Construct {
    service: FargateService
    serviceSecurityGroup: ISecurityGroup
    constructor(scope: cdk.Construct, id: string, props: ContainerProps){
        super(scope, id);
        const {listenPort, databaseLogin, isDebug, vpc, databaseName} = props
        const cluster = new Cluster(this, 'cluster', {
            vpc,
            containerInsights: !isDebug
        })
        const taskDefinition = new FargateTaskDefinition(this, 'taskDefinition', {
            cpu: 256,
            memoryLimitMiB: 512
        })
        const image = ContainerImage.fromRegistry('servian/techchallengeapp:latest')
        const environment = {
            VTT_LISTENHOST: "0.0.0.0",
            VTT_LISTENPORT: `${listenPort}`,
            VTT_DBNAME: databaseName,
            VTT_DBPORT: '5432'
        }
        const secrets = {
            VTT_DBUSER: Secret.fromSecretsManager(databaseLogin, 'username'),
            VTT_DBPASSWORD: Secret.fromSecretsManager(databaseLogin, 'password'),
            VTT_DBHOST: Secret.fromSecretsManager(databaseLogin, 'host'),
        }
        const dbMigration = taskDefinition.addContainer('dbMigration', {
            image,
            environment,
            entryPoint: ['./TechChallengeApp', 'updatedb', '-s'],
            secrets,
            logging: LogDrivers.awsLogs({
                streamPrefix: '/ecs/TaskApi/dbMigrations',
            }),
            essential: false
        })
        const app = taskDefinition.addContainer('app', {
            image,
            environment,
            secrets,
            essential: true,
            entryPoint: ['./TechChallengeApp', 'serve'],
            logging: LogDrivers.awsLogs({
                streamPrefix: '/ecs/TaskApi/app',
            })
        })
        app.addPortMappings({
            containerPort: listenPort
        })
        app.addContainerDependencies({
            container: dbMigration,
            condition: ContainerDependencyCondition.SUCCESS
        })
        this.serviceSecurityGroup = new SecurityGroup(this, 'serviceSg', {
            vpc
        })
        this.service = new FargateService(this, 'service', {
            cluster,
            taskDefinition,
            assignPublicIp: false,
            desiredCount: isDebug ? 1 : 2,
            propagateTags: PropagatedTagSource.SERVICE,
            enableECSManagedTags: true,
            securityGroups: [this.serviceSecurityGroup]
        })
    }
}