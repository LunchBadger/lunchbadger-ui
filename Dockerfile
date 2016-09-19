FROM node:6

RUN npm install -g http-server
ADD dist /opt/lunchbadger

WORKDIR /opt/lunchbadger
ENTRYPOINT ["http-server", "-p", "8000", "."]
