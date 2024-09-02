// __tests__/AuthProvider.test.tsx

import React from 'react';
import { View, Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';

// Mock the Firebase auth module
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

jest.mock('@/firebaseConfig', () => ({
  auth: {},
}));

// A test component to consume the Auth context
function TestComponent() {
  const { user, isLoading } = useAuth();
  return (
    <View>
      <Text testID="user">{user ? user.email : 'No user'}</Text>
      <Text testID="loading">{isLoading ? 'Loading' : 'Loaded'}</Text>
    </View>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides user and loading state from context', async () => {
    const mockUser = { email: 'test@example.com' };
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn(); // Return a mock unsubscribe function
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('user').children[0]).toEqual('test@example.com');
      expect(getByTestId('loading').children[0]).toEqual('Loaded');
    });
  });

  it('shows loading before user is set', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      // Simulate a delay before setting the user
      setTimeout(() => callback(null), 100);
      return jest.fn(); // Return a mock unsubscribe function
    });

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('loading').children[0]).toEqual('Loading');

    await waitFor(() => {
      expect(getByTestId('user').children[0]).toEqual('No user');
      expect(getByTestId('loading').children[0]).toEqual('Loaded');
    });
  });
});