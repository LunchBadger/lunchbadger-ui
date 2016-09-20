FROM ubuntu:16.04

RUN apt-get update && apt-get install -y apt-transport-https wget sudo
RUN wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb https://deb.nodesource.com/node_6.x xenial main" > /etc/apt/sources.list.d/nodesource.list && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update && apt-get install -y \
  nodejs \
  xvfb \
  python-pip \
  google-chrome-stable \
  default-jre

RUN pip install docker-compose

ADD containers/test/entrypoint.sh /opt

WORKDIR /opt/lunchbadger
ENTRYPOINT [ "/opt/entrypoint.sh"]
CMD ["npm", "run", "test:nodocker"]
