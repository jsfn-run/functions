FROM ghcr.io/cloud-cli/node:latest

COPY ./functions/ /home/fn/functions/
ENV MULTIPLEXED true
