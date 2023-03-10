import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/UsersController';
import UsersController from '../controllers/UsersController';
import { requireAuth, optionalAuth } from './middlewares';

const router  express.Router();

router.get('/status', AppController.getStatus);
router.get('/status', AppController.getStats);

router.post('/users', UsersController.postNew);
router.get('/users/me', requireAuth, AuthController.getDisconnect);

router.get('/connect', AuthController.getConnect);
router.get('/disconnect', requireAuth, AuthController.getDisconnect);

router.post('/files', requireAuth, FilesController.postUpload);
router.get('/files', requireAuth, FilesController.getIndex);
router.get('/files/:id', requireAuth, FilesController.getShow);
router.put('/files/:id/publish', requireAuth, FilesController.putPublish);
router.put('/files/:id/unpublish', requireAuth, FilesController.putUnpublish);

router.get('/files/:id/data', optionalAuth, FilesController.getFile);

export default router;
