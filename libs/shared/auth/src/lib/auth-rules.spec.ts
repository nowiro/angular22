import { describe, expect, it } from 'vitest';

import { hasAnyRole, isRole, rolesFromStrings } from './auth-rules';

describe('hasAnyRole', () => {
  it('is true when granted contains a required role', () => {
    expect(hasAnyRole(['user', 'guest'], ['user'])).toBe(true);
    expect(hasAnyRole(['admin', 'user', 'guest'], ['admin'])).toBe(true);
  });

  it('is false when no required role is granted', () => {
    expect(hasAnyRole(['guest'], ['admin'])).toBe(false);
    expect(hasAnyRole([], ['user'])).toBe(false);
  });

  it('supports any-of with multiple required roles', () => {
    expect(hasAnyRole(['user', 'guest'], ['admin', 'user'])).toBe(true);
    expect(hasAnyRole(['guest'], ['admin', 'user'])).toBe(false);
  });
});

describe('isRole / rolesFromStrings', () => {
  it('accepts known roles and rejects everything else', () => {
    expect(isRole('admin')).toBe(true);
    expect(isRole('user')).toBe(true);
    expect(isRole('superuser')).toBe(false);
    expect(isRole(null)).toBe(false);
    expect(isRole(42)).toBe(false);
  });

  it('keeps only known roles from an untrusted realm-role list', () => {
    expect(rolesFromStrings(['admin', 'offline_access', 'user', 'uma_authorization'])).toEqual(['admin', 'user']);
    expect(rolesFromStrings([])).toEqual([]);
  });
});
