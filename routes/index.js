import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const express = require('express');

function router(app) {
  const route = express.Router();
  app.use('/', route);

  route.get('/status', (rq, rs) => {
    AppController.getStatus(rq, rs);
  });

  route.get('/stats', (rq, rs) => {
    AppController.getStats(rq, rs);
  });

  route.post('/users', (rq, rs) => {
    UsersController.postNew(rq, rs);
  });

  route.get('/connect', (rq, rs) => {
    AuthController.getConnect(rq, rs);
  });

  route.get('/disconnect', (rq, rs) => {
    AuthController.getDisconnect(rq, rs);
  });

  route.get('/users/me', (rq, rs) => {
    UsersController.getMe(rq, rs);
  });

  route.post('/files', (rq, rs) => {
    FilesController.postUpload(rq, rs);
  });
}

export default router;
