require('dotenv').config();
const { createClient } = require('redis');

const redisClient = createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
  legacyMode: true, // 반드시 설정 !!
});

const connect = async () => {
  redisClient.on('error', err => {
    console.error('Redis Client Error', err);
  });
  await redisClient.connect();
  console.log('Redis connected!');
};

connect();

module.exports = { redisClient, connect };
