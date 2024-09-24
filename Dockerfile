FROM node:alpine
WORKDIR /usr/ccqe
COPY package.json .
RUN npm install\
    && npm install typescript -g \
    && npm install prisma -g
COPY . .
RUN tsc
RUN prisma generate
CMD ["node", "./dist/server.js"]