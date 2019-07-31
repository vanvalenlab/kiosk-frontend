import Redis from 'ioredis';
import config from './config';

// function createClient() {
//   const client = redis.createClient(config.redis);
//
//   // handle any errors whilst connecting to Redis.
//   client.on('error', (err) => {
//     logger.error(`Error while communicating with Redis: ${err}`);
//   });
//
//   return client;
// }

// const client = createClient();

const client = new Redis({
  sentinels: [config.redis],
  showFriendlyErrorStack: true,
  name: 'mymaster',
});

export default client;
