// __tests__/AppLayout.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import AppLayout from '@/app/(app)/_layout'; // Adjust the import path as necessary
import { useAuth } from '@/contexts/AuthContext';

// Mock the dependencies
jest.mock('expo-router', () => ({
  Redirect: jest.fn(() => null),
  Stack: jest.fn(() => null),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Authenticated Layout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading text when isLoading is true', () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoading: true, user: null });

    const { getByText } = render(<AppLayout />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('redirects to sign-in when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoading: false, user: null });

    render(<AppLayout />);
    expect(require('expo-router').Redirect).toHaveBeenCalledWith({ href: '/sign-in' }, {});
  });

  it('renders Stack when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoading: false, user: { id: '1', name: 'Test User' } });

    render(<AppLayout />);

    const { Stack } = require('expo-router');
    expect(Stack).toHaveBeenCalled();
  });
});