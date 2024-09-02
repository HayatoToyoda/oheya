// __tests__/SignUpForm.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpForm from '@/app/sign-up'; // Adjust the import path as necessary
import { createUser } from '@/utils/firebase/auth';
import { EmailInUseError, WeakPasswordError } from '@/types/errors/auth';
import { DatabaseError } from '@/types/errors/database';
import { router } from 'expo-router';

// Mock the dependencies
jest.mock('@/utils/firebase/auth', () => ({
  createUser: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
  Link: 'Link',
}));

describe('SignUpForm Component', () => {
  const fileName = 'app/sign-up.tsx';
  const componentName = 'SignUpForm()';

  const consoleSpy = jest.spyOn(console, 'log');
  const signUpErrorMessagePattern = `([Ss]ign up.*error)|([Ee]rror sign.*up)`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(<SignUpForm />);
    
    expect(getByTestId('page-title')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByTestId('sign-up-button')).toBeTruthy();
    expect(getByText(/Already\sregistered\?/)).toBeTruthy();
    expect(getByText('Sign in now!')).toBeTruthy();
  });

  it('updates email and password inputs', () => {
    const { getByPlaceholderText } = render(<SignUpForm />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('calls createUser and navigates on successful sign up', async () => {
    const { getByTestId, getByPlaceholderText } = render(<SignUpForm />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByTestId('sign-up-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signUpButton);

    await waitFor(() => {
      expect(createUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(router.replace).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message when email is already in use', async () => {
    (createUser as jest.Mock).mockRejectedValue(new EmailInUseError('test error message'));

    const { getByTestId, getByPlaceholderText, findByText } = render(<SignUpForm />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByTestId('sign-up-button');

    fireEvent.changeText(emailInput, 'existing@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signUpButton);

    const errorMessage = await findByText('The email address is already in use.');
    expect(errorMessage).toBeTruthy();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(`${fileName}/${componentName}.*${signUpErrorMessagePattern}`),
        expect.any(EmailInUseError)
      );
    });
  });

  it('displays error message when password is too weak', async () => {
    (createUser as jest.Mock).mockRejectedValue(new WeakPasswordError('test weak password error'));

    const { getByTestId, getByPlaceholderText, findByText } = render(<SignUpForm />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByTestId('sign-up-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'weak');
    fireEvent.press(signUpButton);

    const errorMessage = await findByText('The password is too weak.');
    expect(errorMessage).toBeTruthy();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(`${fileName}/${componentName}.*${signUpErrorMessagePattern}`),
        expect.any(WeakPasswordError)
      );
    });
  });

  it('displays error message when there is a database error', async () => {
    (createUser as jest.Mock).mockRejectedValue(new DatabaseError('test database error'));

    const { getByTestId, getByPlaceholderText, findByText } = render(<SignUpForm />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByTestId('sign-up-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signUpButton);

    const errorMessage = await findByText('Database operation failed.');
    expect(errorMessage).toBeTruthy();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(`${fileName}/${componentName}.*${signUpErrorMessagePattern}`),
        expect.any(DatabaseError)
      );
    });
  });

  it('displays a generic error message for unexpected errors', async () => {
    (createUser as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

    const { getByTestId, getByPlaceholderText, findByText } = render(<SignUpForm />);
    
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const signUpButton = getByTestId('sign-up-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(signUpButton);

    const errorMessage = await findByText('An unexpected error occurred.');
    expect(errorMessage).toBeTruthy();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(`${fileName}/${componentName}.*${signUpErrorMessagePattern}`),
        expect.any(Error)
      );
    });
  });
});