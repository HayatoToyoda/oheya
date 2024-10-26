import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import UserProfile from '@/app/(app)/profile/[uid]'; // Adjust the import path as necessary
import { getUserProfile } from '@/utils/firebase/userService';
import { User } from '@/types/user';

// Mock the expo-router hooks
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
}));

// Mock the getUserProfile function
jest.mock('@/utils/firebase/userService', () => ({
  getUserProfile: jest.fn(),
}));

// Mock the Image component
jest.mock('react-native', () => {
  const rn = jest.requireActual('react-native');
  rn.Image = 'Image';
  return rn;
});

const fileName = `app/\\(app\\)/profile/\\[uid\\]\.tsx`;

describe('UserProfile', () => {
  const componentName = `UserProfile\(\)`;

  const mockUid = 'testUid123';
  const mockUser: User = {
    uid: mockUid,
    profilePicture: 'https://example.com/profile.jpg',
    bio: 'Test bio',
    followerCount: 100,
    followingCount: 50,
    postCount: 25,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({ uid: mockUid });
  });

  it('does not call getUserProfile() when uid in URI params is empty', () => {
    (require('expo-router').useLocalSearchParams as jest.Mock).mockReturnValue({ uid: '' });
    
    render(<UserProfile />); 
    expect(getUserProfile).not.toHaveBeenCalled()
  })

  it('renders loading indicator initially', () => {
    const { getByTestId } = render(<UserProfile />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders user profile data when loaded', async () => {
    (getUserProfile as jest.Mock).mockImplementation((uid, callback) => {
      act(() => {
        callback(mockUser);
      });
      return jest.fn(); // Return a mock unsubscribe function
    });

    const { getByText } = render(<UserProfile />);

    await waitFor(() => {
      expect(getByText(mockUid)).toBeTruthy();
      expect(getByText('Test bio')).toBeTruthy();
      expect(getByText(`Followers: ${mockUser.followerCount}`)).toBeTruthy();
      expect(getByText(`Following: ${mockUser.followingCount}`)).toBeTruthy();
      expect(getByText(`Posts: ${mockUser.postCount}`)).toBeTruthy();
    });
  });

  it('renders "User not found" when user data is null', async () => {
    (getUserProfile as jest.Mock).mockImplementation((uid, callback) => {
      act(() => {
        callback(null);
      });
      return jest.fn();
    });

    const { getByText } = render(<UserProfile />);

    await waitFor(() => {
      expect(getByText('User not found')).toBeTruthy();
    });
  });

  it('renders "Bio unset yet" when bio is empty', async () => {
    const userWithoutBio = { ...mockUser, bio: '' };
    (getUserProfile as jest.Mock).mockImplementation((uid, callback) => {
      act(() => {
        callback(userWithoutBio);
      });
      return jest.fn();
    });

    const { getByText } = render(<UserProfile />);

    await waitFor(() => {
      expect(getByText('Bio unset yet')).toBeTruthy();
    });
  });

  it('calls getUserProfile with correct UID', () => {
    render(<UserProfile />);
    expect(getUserProfile).toHaveBeenCalledWith(mockUid, expect.any(Function));
  });

  it('logs correct messages', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    (getUserProfile as jest.Mock).mockImplementation((uid, callback) => {
      act(() => {
        callback(mockUser);
      });
      return jest.fn();
    });

    render(<UserProfile />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(`${fileName}\/${componentName}.*[Uu][Ii][Dd].*`), mockUid);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(`${fileName}\/${componentName}.*[Ll]oad.*`));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(`${fileName}\/${componentName}.*[Rr]ender.*user.*profile.*`));
    });
  });
});