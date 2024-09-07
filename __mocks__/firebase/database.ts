// __mocks__/firebase/database.ts

import { DataSnapshot, DatabaseReference, Query } from 'firebase/database';

export const ref = jest.fn().mockReturnValue({} as DatabaseReference);

const createMockDataSnapshot = (value: any): DataSnapshot => ({
  val: jest.fn().mockReturnValue(value),
  exists: jest.fn().mockReturnValue(!!value),
  child: jest.fn(),
  forEach: jest.fn(),
  hasChild: jest.fn().mockReturnValue(false),
  hasChildren: jest.fn().mockReturnValue(false),
  toJSON: jest.fn().mockReturnValue(value),
  key: null,
  ref: {} as DatabaseReference,
  size: 0,
  priority: null,
  exportVal: jest.fn().mockReturnValue(value),
});

export const onValue = jest.fn((query: Query, callback: (snapshot: DataSnapshot) => void) => {
  callback(createMockDataSnapshot(null));
  return jest.fn(); // Return an unsubscribe function
});

export const off = jest.fn();
export const getDatabase = jest.fn();

export default {
  ref,
  onValue,
  off,
  getDatabase
};