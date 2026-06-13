import { describe, expect, it } from 'vitest';

import { A22_ERROR_CATALOG, errorDescriptor, errorGroup, errorKindFromHttpStatus, isRetryable } from './error-catalog';
import { A22ErrorGroup, A22ErrorKind } from './error-kind';

const ALL_KINDS = Object.values(A22ErrorKind);

describe('error catalogue', () => {
  it('has exactly one descriptor per kind, self-consistent', () => {
    for (const kind of ALL_KINDS) {
      const d = A22_ERROR_CATALOG[kind];
      expect(d).toBeDefined();
      expect(d.kind).toBe(kind);
      expect(d.icon).not.toBe('');
      expect(d.title).not.toBe('');
      expect(d.message).not.toBe('');
      expect(['error', 'warning', 'info']).toContain(d.tone);
      expect(Object.values(A22ErrorGroup)).toContain(d.group);
    }
  });

  it('catalogue covers every enum member and nothing else', () => {
    const byName = (a: string, b: string) => a.localeCompare(b);
    expect(Object.keys(A22_ERROR_CATALOG).sort(byName)).toEqual([...ALL_KINDS].sort(byName));
  });

  it('attaches an HTTP status to client/server kinds only', () => {
    for (const kind of ALL_KINDS) {
      const d = A22_ERROR_CATALOG[kind];
      const isHttp = d.group === A22ErrorGroup.Client || d.group === A22ErrorGroup.Server;
      expect(d.httpStatus !== undefined).toBe(isHttp);
    }
  });

  it('keeps the legacy testId for the disabled screen, errorscoped for the rest', () => {
    expect(errorDescriptor(A22ErrorKind.FeatureDisabled).testId).toBe('app-disabled');
    expect(errorDescriptor(A22ErrorKind.NotFound).testId).toBe('error-not-found');
    expect(errorDescriptor(A22ErrorKind.Unexpected).testId).toBe('error-unexpected');
  });

  it('reports the group of a kind', () => {
    expect(errorGroup(A22ErrorKind.NotFound)).toBe(A22ErrorGroup.Client);
    expect(errorGroup(A22ErrorKind.ServiceUnavailable)).toBe(A22ErrorGroup.Server);
    expect(errorGroup(A22ErrorKind.Offline)).toBe(A22ErrorGroup.Network);
    expect(errorGroup(A22ErrorKind.Unexpected)).toBe(A22ErrorGroup.Application);
  });
});

describe('errorKindFromHttpStatus', () => {
  it('maps known statuses exactly', () => {
    expect(errorKindFromHttpStatus(404)).toBe(A22ErrorKind.NotFound);
    expect(errorKindFromHttpStatus(403)).toBe(A22ErrorKind.Forbidden);
    expect(errorKindFromHttpStatus(500)).toBe(A22ErrorKind.InternalServerError);
    expect(errorKindFromHttpStatus(503)).toBe(A22ErrorKind.ServiceUnavailable);
  });

  it('falls back by range for unknown 4xx / 5xx', () => {
    expect(errorKindFromHttpStatus(418)).toBe(A22ErrorKind.BadRequest);
    expect(errorKindFromHttpStatus(599)).toBe(A22ErrorKind.InternalServerError);
  });

  it('treats non-error statuses as unexpected', () => {
    expect(errorKindFromHttpStatus(200)).toBe(A22ErrorKind.Unexpected);
    expect(errorKindFromHttpStatus(302)).toBe(A22ErrorKind.Unexpected);
    expect(errorKindFromHttpStatus(0)).toBe(A22ErrorKind.Unexpected);
  });
});

describe('isRetryable', () => {
  it('offers retry for server, network and unexpected', () => {
    expect(isRetryable(A22ErrorKind.InternalServerError)).toBe(true);
    expect(isRetryable(A22ErrorKind.Offline)).toBe(true);
    expect(isRetryable(A22ErrorKind.Unexpected)).toBe(true);
  });

  it('does not offer retry for plain client/application states', () => {
    expect(isRetryable(A22ErrorKind.NotFound)).toBe(false);
    expect(isRetryable(A22ErrorKind.Forbidden)).toBe(false);
    expect(isRetryable(A22ErrorKind.FeatureDisabled)).toBe(false);
  });
});
