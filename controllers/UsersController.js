import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const { ObjectId } = require('mongodb');

class UsersController {
  static async postNew(rq, rs) {
    const usrEmail = rq.body.email;
    if (!usrEmail) {
      return rs.status(400).send({ error: 'Missing email' });
    }

    const pass = rq.body.password;
    if (!pass) {
      return rs.status(400).send({ error: 'Missing password' });
    }

    const usr = await dbClient.users.findOne({ email: usrEmail });
    if (usr) {
      return rs.status(400).send({ error: 'Already exist' });
    }

    const encPass = sha1(pass);
    const newUsr = {
      email: usrEmail,
      password: encPass,
    };
    const rslt = await dbClient.users.insertOne(newUsr);
    const rtrnedUsr = {
      id: rslt.insertedId,
      email: usrEmail,
    };
    return rs.status(201).send(rtrnedUsr);
  }

  static async getMe(rq, rs) {
    const token = rq.header('X-Token') || null;
    if (!token) return rs.status(401).send({ error: 'Unauthorized' });
    const usrId = await redisClient.get(`auth_${token}`);
    const usr = await dbClient.users.findOne({ _id: ObjectId(usrId) });
    if (!usr) return rs.status(401).send({ error: 'Unauthorized' });
    const rtrndUsr = {
      id: usr._id,
      email: usr.email,
    };
    delete usr.password;
    return rs.status(200).send(rtrndUsr);
  }
}

export default UsersController;
