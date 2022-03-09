FROM node:lts-slim
WORKDIR /app

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive && \
  apt-get upgrade -y && apt-get install -y docker && apt-get clean all

RUN mkdir logs
COPY infrastructure ./infrastructure/
COPY resolvers ./resolvers/
COPY schema ./schema/
COPY index.js ./
COPY package.json ./package.json
RUN npm install

EXPOSE 4000
CMD ["node", "index.js"]