import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Index from '@/app/(app)/index'; // Adjust the import path as necessary
import { useAuth } from '@/contexts/AuthContext';
import { handleSignOut } from '@/utils/firebase/auth';

// Mock the dependencies
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/utils/firebase/auth', () => ({
  handleSignOut: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

const fileName = `app/\\(app\\)/index\.tsx`;

describe('Index Component', () => {
  const componentName = 'Index\(\)';

  const mockUser = { email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
  });

  it('renders welcome message with user email', () => {
    const { getByTestId } = render(<Index />);
    const welcomeText = getByTestId('user-email-text');
    expect(welcomeText.props.children).toEqual(['Welcome, ', 'test@example.com']);
  });

  it('renders sign out button', () => {
    const { getByText } = render(<Index />);
    expect(getByText('Sign Out')).toBeTruthy();
  });

  it('calls handleSignOut when sign out button is pressed', () => {
    const { getByText } = render(<Index />);
    const signOutButton = getByText('Sign Out');
    fireEvent.press(signOutButton);
    expect(handleSignOut).toHaveBeenCalled();
  });

  it('logs error when sign out fails', async () => {
    const mockError = new Error('Sign out failed');
    (handleSignOut as jest.Mock).mockRejectedValue(mockError);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const { getByText } = render(<Index />);
    const signOutButton = getByText('Sign Out');
    fireEvent.press(signOutButton);

    // Wait for the next tick of the event loop
    await new Promise(resolve => setImmediate(resolve));

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(`${fileName}/${componentName}.*([Ss]ign out.*error)|([Ee]rror.*sign out)`),
      mockError
    );
  });
});