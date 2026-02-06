import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateUserSchema, changePasswordSchema } from '../validation/userValidation';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

// All routes require authentication
router.use(authenticate);

// Get all users (admin only)
router.get('/', authorize('admin'), getAllUsers);

// Change password (authenticated users)
router.put('/change-password', validate(changePasswordSchema), changePassword);

// Get user by ID
router.get('/:id', getUserById);

// Update user (admin or own profile)
router.put('/:id', validate(updateUserSchema), updateUser);

// Delete user (admin only)
router.delete('/:id', authorize('admin'), deleteUser);

export default router;