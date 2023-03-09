import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(rq, rs) {
    const alive = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    return rs.status(200).send(alive);
  }

  static async getStats(rq, rs) {
    const nbr = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    return rs.status(200).send(nbr);
  }
}

export default AppController;
