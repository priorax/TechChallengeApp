# 9. container orchestration choice

Date: 2020-12-06

## Status

Proposed

## Context

Maintaining a large fleet of containers can become awkward to manage, thus some tool should be picked to allow for placement and management of containers.

Options include:

 - Self managed Kubernetes (k8s) on EC2

 - Amazon's managed Kubernetes service (EKS)

 - Amazon's proprietary container engine (ECS)

## Decision

Use of ECS.

While EKS could provide a better developer experience in that they can locally simulate k8s, the tight, out of the box integration with a variety of AWS services allows for rapid development of the infrastructure.

It also allows for use of Fargate, thus allowing for more granular scaling.

## Consequences

Prevents the solution from being able to be run in a production-like environment locally.
