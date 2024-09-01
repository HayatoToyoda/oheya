// __tests__/utils/firebase/auth.test.ts

import { createUser, handleSignIn, handleSignOut } from '@/utils/firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth } from '@/firebaseConfig';
import { EmailInUseError, WeakPasswordError } from '@/types/errors/auth';
import { DatabaseError } from '@/types/errors/database';

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/database', () => ({
  ref: jest.fn(),
  set: jest.fn(),
}));

jest.mock('@/firebaseConfig', () => ({
  auth: {},
  database: {},
}));

describe('Auth Functions', () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  const fileName = 'utils/firebase/auth.ts';

  describe('createUser', () => {
    const moduleName = 'createUser()';

    it('should create a user successfully', async () => {
      const mockUserCredential = {
        user: { uid: 'testUid', delete: jest.fn() },
      };
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
      (ref as jest.Mock).mockReturnValue({});
      (set as jest.Mock).mockResolvedValue(undefined);

      await createUser('test@example.com', 'password123');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(set).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          uid: 'testUid',
          profilePicture: '',
          bio: '',
          followerCount: 0,
          followingCount: 0,
          postCount: 0,
        })
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(`${fileName}/${moduleName}.*[Ss]uccessful`));
    });

    it('should throw EmailInUseError when email is already in use', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({ code: 'auth/email-already-in-use' });

      await expect(createUser('existing@example.com', 'password123')).rejects.toThrow(EmailInUseError);
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(`${fileName}/${moduleName}.*([Aa]lready.*use)|([Uu]se.*already)`));
    });

    it('should throw WeakPasswordError when password is too weak', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({ code: 'auth/weak-password' });

      await expect(createUser('test@example.com', 'weak')).rejects.toThrow(WeakPasswordError);
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(`${fileName}/${moduleName}.*([Pp]assword.*weak)|([Ww]eak.*password)`));
    });

    it('should handle database error and delete user', async () => {
      const mockDelete = jest.fn();
      const mockUserCredential = {
        user: { uid: 'testUid', delete: mockDelete },
      };
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
      (ref as jest.Mock).mockReturnValue({});
      (set as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(createUser('test@example.com', 'password123')).rejects.toThrow(DatabaseError);
      expect(mockDelete).toHaveBeenCalled();
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(`${fileName}/${moduleName}.*([Dd]atabase.*error)|([Ee]rror.*database)`));
    });
  });

  describe('handleSignIn', () => {
    const moduleName = 'handleSignIn()';

    it('should sign in successfully', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({});

      await handleSignIn('test@example.com', 'password123');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(`^${fileName}/${moduleName}.*[Ss]uccess`));
    });

    it('should handle sign in error', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Sign in failed'));

      await handleSignIn('test@example.com', 'wrongpassword');

      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(`^${fileName}/${moduleName}.*([Ss]ign in.*error)|([Ee]rror.*sign in)`), expect.any(Error));
    });
  });

  describe('handleSignOut', () => {
    const moduleName = 'handleSignOut()'

    it('should sign out successfully', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);

      await handleSignOut();

      expect(signOut).toHaveBeenCalledWith(auth);
      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(`^${fileName}/${moduleName}.*[Ss]uccessful`));
    });

    it('should handle sign out error', async () => {
      (signOut as jest.Mock).mockRejectedValue(new Error('Sign out failed'));

      await handleSignOut();

      expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(`^${fileName}/${moduleName}.*([Ss]ign out.*error)|([Ee]rror.*sign out)`), expect.any(Error));
    });
  });
});