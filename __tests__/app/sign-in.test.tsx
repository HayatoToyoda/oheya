import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignIn from '@/app/sign-in';
import { handleSignIn } from '@/utils/firebase/auth';
import { router } from 'expo-router';

// Mock the dependencies
jest.mock('@/utils/firebase/auth', () => ({
  handleSignIn: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
  Link: 'Link',
}));

describe('SignIn Component', () => {
  const fileName = 'app/sign-in.tsx';
  const componentName = 'SignIn()';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<SignIn />);
    
    expect(getByTestId('page-title')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByTestId('sign-in-button')).toBeTruthy();
    expect(getByText(/Not\sregistered\?/)).toBeTruthy();
    expect(getByText('Sign up now!')).toBeTruthy();
  });

  it('updates email and password inputs', () => {
    const { getByPlaceholderText } = render(<SignIn />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('calls handleSignIn and navigates on successful sign in', async () => {
    const { getByPlaceholderText, getByTestId } = render(<SignIn />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signInButton = getByTestId('sign-in-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(handleSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(router.replace).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message on sign in failure', async () => {
    const mockError = new Error('Sign in failed');
    const consoleSpy = jest.spyOn(console, 'log');
    (handleSignIn as jest.Mock).mockRejectedValue(mockError);

    const { getByPlaceholderText, getByTestId, findByText } = render(<SignIn />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signInButton = getByTestId('sign-in-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(signInButton);

    const errorMessage = await findByText('Invalid credential.');
    expect(errorMessage).toBeTruthy();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(`${fileName}/${componentName}.*([Ss]ign in.*error)|([Ee]rror.*sign.*in)`),
        mockError
      );
    });
  });
});