import { getUserProfile } from '@/utils/firebase/userService';
import { database } from '@/firebaseConfig';
import { ref, onValue, off, DatabaseReference, DataSnapshot } from 'firebase/database';
import { User } from '@/types/user';

describe('getUserProfile', () => {
  const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

  it('should retrieve user profile successfully', (done) => {
    const userId = 'testUserId';
    const mockUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      followerCount: 0,
      followingCount: 0,
      postCount: 0
    };
    const expectedUserProfile: User = { uid: userId, ...mockUserData };

    const mockRef = {} as DatabaseReference;
    (ref as jest.Mock).mockReturnValue(mockRef);

    (onValue as jest.Mock).mockImplementation((_, callback, options) => {
      expect(options).toEqual({ onlyOnce: true });
      callback({
        val: () => mockUserData,
        exists: () => true,
      } as DataSnapshot);
      return jest.fn();
    });

    getUserProfile(userId, (userProfile) => {
      expect(userProfile).toEqual(expectedUserProfile);
      expect(ref).toHaveBeenCalledWith(database, `users/${userId}`);
      expect(onValue).toHaveBeenCalledWith(mockRef, expect.any(Function), { onlyOnce: true });
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'utils/firebase/userService.ts/getUserProfile() - User profile retrieved successfully:',
        expectedUserProfile
      );
      done();
    });
  });

  it('should handle case when userId does not exist', (done) => {
    const mockUserId = 'nonExistentUser';

    const mockRef = {} as DatabaseReference;
    (ref as jest.Mock).mockReturnValue(mockRef);

    (onValue as jest.Mock).mockImplementation((_, callback, options) => {
      expect(options).toEqual({ onlyOnce: true });
      callback({
        val: () => null,
        exists: () => false,
      } as DataSnapshot);
      return jest.fn();
    });

    getUserProfile(mockUserId, (userProfile) => {
      expect(userProfile).toBeNull();
      expect(ref).toHaveBeenCalledWith(database, `users/${mockUserId}`);
      expect(onValue).toHaveBeenCalledWith(mockRef, expect.any(Function), { onlyOnce: true });
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'utils/firebase/userService.ts/getUserProfile() - User profile not found for userId:',
        mockUserId
      );
      done();
    });
  });

  it('should unsubscribe listener when returned function is called', () => {
    const userId = 'testUserId';
    const mockUnsubscribe = jest.fn();

    const mockRef = {} as DatabaseReference;
    (ref as jest.Mock).mockReturnValue(mockRef);
    (onValue as jest.Mock).mockReturnValue(mockUnsubscribe);

    const unsubscribe = getUserProfile(userId, jest.fn());

    unsubscribe();

    expect(off).toHaveBeenCalledWith(mockRef, 'value', mockUnsubscribe);
    expect(mockConsoleLog).toHaveBeenCalledWith(
      'utils/firebase/userService.ts/getUserProfile() - Listener unsubscribed for userId:',
      userId
    );
  });
});