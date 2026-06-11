import { describe, expect, it } from 'vitest';

import { stepStatus } from './step-status';

function state(valid: boolean, touched: boolean) {
  return { valid: () => valid, touched: () => touched };
}

describe('stepStatus', () => {
  it('returns "done" for a valid step regardless of touched', () => {
    expect(stepStatus(state(true, false))).toBe('done');
    expect(stepStatus(state(true, true))).toBe('done');
  });

  it('returns "incomplete" for an invalid, touched step', () => {
    expect(stepStatus(state(false, true))).toBe('incomplete');
  });

  it('returns "untouched" for an invalid, pristine step', () => {
    expect(stepStatus(state(false, false))).toBe('untouched');
  });
});
