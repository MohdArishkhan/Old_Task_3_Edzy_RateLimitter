import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { createError, asyncCatch } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getAllUsers = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
  const search = req.query.search as string || '';

  const skip = (page - 1) * limit;

  // Build search filter
  const searchFilter = search
    ? {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
    : {};

  const filter = { isActive: true, ...searchFilter };

  // Get total count for pagination
  const total = await User.countDocuments(filter);
  
  // Get users with pagination
  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const pages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        pages,
        total,
        limit,
      },
    },
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const getUserById = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id, isActive: true });
  
  if (!user) {
    throw createError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user (Admin only or own profile)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
export const updateUser = asyncCatch(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  // Check if user exists
  const user = await User.findOne({ _id: id, isActive: true });
  if (!user) {
    throw createError('User not found', 404);
  }

  // Check if user can update this profile
  const isOwnProfile = req.user?._id.toString() === id;
  const isAdmin = req.user?.role === 'admin';

  if (!isOwnProfile && !isAdmin) {
    throw createError('Access denied', 403);
  }

  // Regular users cannot change their role
  if (!isAdmin && role && role !== user.role) {
    throw createError('Access denied. Cannot change role', 403);
  }

  // Check if email is already taken by another user
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email, _id: { $ne: id } });
    if (existingUser) {
      throw createError('Email is already taken', 409);
    }
  }

  // Update user
  const updateData: any = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role && isAdmin) updateData.role = role;

  const updatedUser = await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  logger.info(`User updated: ${updatedUser?.email} by ${req.user?.email}`);

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: updatedUser,
  });
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
export const deleteUser = asyncCatch(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  // Check if user exists
  const user = await User.findOne({ _id: id, isActive: true });
  if (!user) {
    throw createError('User not found', 404);
  }

  // Cannot delete self
  if (req.user?._id.toString() === id) {
    throw createError('Cannot delete your own account', 400);
  }

  // Soft delete - set isActive to false
  await User.findByIdAndUpdate(id, { isActive: false });

  logger.info(`User deleted: ${user.email} by ${req.user?.email}`);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
export const changePassword = asyncCatch(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;
  
  // Get user with password
  const user = await User.findById(req.user?._id).select('+password');
  if (!user) {
    throw createError('User not found', 404);
  }

  // Verify current password
  const isValidPassword = await user.comparePassword(currentPassword);
  if (!isValidPassword) {
    throw createError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.info(`Password changed for user: ${user.email}`);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});