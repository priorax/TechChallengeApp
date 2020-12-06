# 8. database provider choide

Date: 2020-06-12

## Status

Proposed

## Context

As the database has not been deployed yet, there needs to be a decision on where it should run.

Options include:

 - Self-managed database running on an EC2

 - Amazon Relational Database Service (RDS)

 - Using Amazon Aurora (Postgres Compatiable)

 - Using Amazon Aurora Serverless (Postgres Compatiable)
 
 - Running Postgres as a side car container and syncing the data between containers using a shared file system.

## Decision

Use of RDS.

This will provide minimal operational overhead moving forwards as well as providing high availability with minimal downtime in case of an avaliability zone failure.

The tight integration with both IAM and Amazon Secrets Manager also allows for easy password creation and rotation without human intervention.

Using Aurora Serverless could potentially end up being more cost effective, however due to the unknown scale of this application, the performance hit while scaling is unknown. Aurora Serverless v2 may remedy this and should be considered as a future transition path.

## Consequences

Higher cost of running compared to EC2, but lower operational costs.
