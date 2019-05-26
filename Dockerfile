FROM node:10-alpine
ENV NODE_ENV production
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5554
CMD npm start