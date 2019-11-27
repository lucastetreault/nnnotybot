FROM keybaseio/client:nightly-node
WORKDIR /app
COPY . /app
RUN npm install
CMD node /app/notybot.js