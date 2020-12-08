# 10. multiple stacks

Date: 2020-12-08

## Status

Proposed

## Context

Running a highly avaliable configuration for a development environment is good for ensuring parity, between systems, however it also costs money.

## Decision

Some compromises in system availability have been made to lower costs whilst running in a non-production context.

## Consequences

The following changes are made that seperate production and non-production:

| Resource | Production Value | Non Production Value|Impact | 
|---|---|--|--|
|NAT Gateway Count| 2 |1|If the first availability zone goes down, we will not be able to pull images in non-production
|Database availability| Multi-AZ |Single-AZ|If the first availability zone is offline, there is no immediate fallback.
|Minimal count of running tasks| 2 | 1 | The system will run on a single task by default, but will still scale to meet demand.