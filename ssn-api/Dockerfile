FROM node:8.11.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install --production

# Bundle app source
COPY dist/ ./dist

# Move app configs over
COPY config/ ./config

CMD [ "npm", "start" ]