import IORedis from 'ioredis';
import config from '##/config/config.js';

const redis = new IORedis(config.redis.url, {
  db: config.redis.db,
  enableAutoPipelining: true,
  lazyConnect: true,
});

function openConnection() {
  return redis.connect();
}

function closeConnection() {
  return redis.disconnect();
}

export { openConnection, closeConnection };
export default redis;
