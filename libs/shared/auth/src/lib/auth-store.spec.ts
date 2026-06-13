import { describe, expect, it } from 'vitest';

import { AuthStore } from './auth-store';

describe('AuthStore', () => {
  it('starts unauthenticated with no roles', () => {
    const store = new AuthStore();
    expect(store.isAuthenticated()).toBe(false);
    expect(store.roles()).toEqual([]);
    expect(store.username()).toBeNull();
    expect(store.hasRole('admin')).toBe(false);
  });

  it('exposes roles and identity after setUser', () => {
    const store = new AuthStore();
    store.setUser({ username: 'a', roles: ['user', 'guest'] });
    expect(store.isAuthenticated()).toBe(true);
    expect(store.username()).toBe('a');
    expect(store.hasRole('user')).toBe(true);
    expect(store.hasRole('admin')).toBe(false);
    expect(store.hasAnyRole('admin', 'user')).toBe(true);
    expect(store.hasAnyRole('admin')).toBe(false);
  });

  it('clears on setUser(null)', () => {
    const store = new AuthStore();
    store.setUser({ username: 'a', roles: ['admin'] });
    store.setUser(null);
    expect(store.isAuthenticated()).toBe(false);
    expect(store.roles()).toEqual([]);
  });
});
