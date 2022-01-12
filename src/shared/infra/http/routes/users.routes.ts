import { Router } from 'express';
import uploadConfig from '@config/upload'

import multer from 'multer';
import { UpdateUserAvatarController } from '@modules/accounts/useCases/updateUserAvatar/UpdateUserAvatarController';
import { CreateUserController } from '@modules/accounts/useCases/createUser/CreateUserController';
import { ensureAuthenticated } from '@shared/infra/http/middlewares/ensureAuthenticate';

const usersRoutes = Router();

const uploadAvatar = multer(uploadConfig);

const createUserController = new CreateUserController();
const updateUserAvatarController = new UpdateUserAvatarController();

usersRoutes.post("/", createUserController.handle);

usersRoutes.patch("/avatar", ensureAuthenticated, uploadAvatar.single("avatar"), updateUserAvatarController.handle);


export { usersRoutes }