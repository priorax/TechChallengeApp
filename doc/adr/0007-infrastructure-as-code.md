# 7. infrastructure as code tool choice

Date: 2020-06-12

## Status

Proposed

## Context

As of current time of writing, infrastructure is manually configured for each deployment, thus infrastructure as code is required to help standardise environments.

## Decision

Use of [AWS Cloud Development Kit](https://github.com/aws/aws-cdk/) as an abstraction on top of [AWS Cloudformation](https://aws.amazon.com/cloudformation/)

This is to allow for easy adoption by developers without expecting them to learn a domain-specific language or schema.

As well as this we get access to libraries such as cdk-assert to assist in testability of infrastructure prior to deployment.

## Consequences

- The deployment is limited in now vendor locked to AWS (but could be refactored to use cdk-tf if cloud agnostic approach is needed)

- Node and npm become a dependency for the solution
