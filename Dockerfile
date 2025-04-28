FROM ghcr.io/jsfn-run/runner
ENV MULTIPLEXED=true

ADD functions /home/fn
