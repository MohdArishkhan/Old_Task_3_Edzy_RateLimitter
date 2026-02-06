import { User } from '../../src/models/User';

describe('User Model', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('User creation', () => {
    it('should create a user with valid data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.password).not.toBe(userData.password); // Should be hashed
      expect(savedUser.role).toBe('user'); // Default role
      expect(savedUser.isActive).toBe(true); // Default value
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it('should not create user without required fields', async () => {
      const user = new User({});
      
      try {
        await user.save();
        throw new Error('Validation should have failed');
      } catch (error: any) {
        expect(error.errors.name).toBeDefined();
        expect(error.errors.email).toBeDefined();
        expect(error.errors.password).toBeDefined();
      }
    });

    it('should not create user with invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      const user = new User(userData);
      
      try {
        await user.save();
        throw new Error('Validation should have failed');
      } catch (error: any) {
        expect(error.errors.email).toBeDefined();
      }
    });

    it('should not create user with short password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      };

      const user = new User(userData);
      
      try {
        await user.save();
        throw new Error('Validation should have failed');
      } catch (error: any) {
        expect(error.errors.password).toBeDefined();
      }
    });

    it('should not create users with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const user1 = new User(userData);
      await user1.save();

      const user2 = new User(userData);
      
      try {
        await user2.save();
        throw new Error('Duplicate email should have been rejected');
      } catch (error: any) {
        expect(error.code).toBe(11000); // MongoDB duplicate key error
      }
    });
  });

  describe('Password methods', () => {
    let user: any;

    beforeEach(async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      user = new User(userData);
      await user.save();
    });

    it('should hash password before saving', async () => {
      expect(user.password).not.toBe('password123');
      expect(user.password.length).toBeGreaterThan(20); // Hashed password should be longer
    });

    it('should compare password correctly', async () => {
      const isValidPassword = await user.comparePassword('password123');
      expect(isValidPassword).toBe(true);

      const isInvalidPassword = await user.comparePassword('wrongpassword');
      expect(isInvalidPassword).toBe(false);
    });

    it('should not include password in JSON output', () => {
      const userJson = user.toJSON();
      expect(userJson.password).toBeUndefined();
      expect(userJson.name).toBe('John Doe');
      expect(userJson.email).toBe('john@example.com');
    });
  });

  describe('User roles', () => {
    it('should set default role to user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const user = new User(userData);
      await user.save();

      expect(user.role).toBe('user');
    });

    it('should allow setting admin role', async () => {
      const userData = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      };

      const user = new User(userData);
      await user.save();

      expect(user.role).toBe('admin');
    });

    it('should not allow invalid role', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'invalidrole',
      };

      const user = new User(userData);
      
      try {
        await user.save();
        throw new Error('Invalid role should have been rejected');
      } catch (error: any) {
        expect(error.errors.role).toBeDefined();
      }
    });
  });
});