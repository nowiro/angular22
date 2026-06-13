import { describe, expect, it } from 'vitest';

import { MOCK_USERS } from './mock-auth';

describe('MOCK_USERS', () => {
  it('grants a flat, descending role set per principal', () => {
    expect(MOCK_USERS.admin.roles).toEqual(['admin', 'user', 'guest']);
    expect(MOCK_USERS.user.roles).toEqual(['user', 'guest']);
    expect(MOCK_USERS.guest.roles).toEqual(['guest']);
  });
});
