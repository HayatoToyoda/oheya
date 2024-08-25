// __tests__/utils/firebase/userService.test.ts

import { ref, onValue } from 'firebase/database';
import { getUserProfile } from '@/utils/firebase/userService';

jest.mock('firebase/database');

describe('getUserProfile', () => {
  // Handles case when userId does not exist
  it('should handle case when userId does not exist', () => {
    const mockUserId = 'user123';

    const callback = jest.fn();

    getUserProfile(mockUserId, callback);

    expect(ref).toHaveBeenCalledWith(expect.anything(), `users/${mockUserId}`);
    expect(onValue).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(null);
  });
});