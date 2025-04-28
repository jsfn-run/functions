FROM ghcr.io/jsfn-run/runner
ENV MULTIPLEXED=true

COPY --chown=1000:1000 . /home/fn
RUN cd /home/fn && npm install --omit=dev
