import * as redis from 'redis';
import { promisify } from 'util';

export class RedisClient {
  /**
     * create a redis client
     */
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      console.log('Redis error: ', String(err));
    });
    this._set = promisify(this.client.set).bind(this.client);
    this._get = promisify(this.client.get).bind(this.client);
    this._del = promisify(this.client.del).bind(this.client);
  }

  /**
     * checking if the client is connected to the database
     * @returns {boolean}
     */
  isAlive() {
    return this.client.connected;
  }

  /**
     * getting the value from the database
     * @return {promise<string>}
     * @async
     */
  async get(key) {
    return this._get(key);
  }

  /**
     * set a value in the database
     * @param {string} key - key too store
     * @param {string} value - Value to store
     * @param {number} duration - Duration in seconds
     * @async
     */
  async set(key, value, duration) {
    await this._set(key, value, 'EX', duration);
  }

  /**
     * Delete a value from the database
     * @param {string} key
     * @async
     */
  async del(key) {
    await this._del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
