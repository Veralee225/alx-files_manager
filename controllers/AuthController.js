import sha1 from 'sha1';
import uuidv4 from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(rq, rs) {
    const athr = rq.header('Authorization') || null;
    if (!athr) return rs.status(401).send({ error: 'Unauthorized' });
    const crdnt = athr.split(' ')[1];
    if (!crdnt) return rs.status(401).send({ error: 'Unauthorized' });
    const emailPass = Buffer.from(crdnt, 'base-64').toString('utf-8');
    const fltr = {
      email: emailPass.split(':')[0],
      password: sha1(emailPass.split(':')[1]),
    };
    const usr = await dbClient.users.findOne(fltr);
    if (!usr) {
      return rs.status(401).send({ error: 'Unauthorized' });
    }
    const tkn = uuidv4();
    const k = `auth_${tkn}`;
    const expry = 24 * 60 * 60;
    await redisClient.set(k, usr._id.toString(), expry);
    return rs.status(200).send({ token: tkn });
  }

  static async getDisconnect(rq, rs) {
    const token = rq.header('X-Token') || null;
    if (!token) return rs.status(401).send('Unauthorized');
    const usr = await redisClient.get(`auth_${token}`);
    if (!usr) return rs.status(401).send('Unauthorized');
    redisClient.del(`auth_${token}`);
    return rs.status(204).send();
  }
}

export default AuthController;
