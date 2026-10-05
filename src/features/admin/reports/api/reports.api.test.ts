import { describe, expect, it } from 'vitest';
import { normalizeReportRow } from './reports.api';
import type { RawReportRow } from '../types';

function rawRow(overrides: Partial<RawReportRow['report']> = {}): RawReportRow {
  return {
    report: {
      id: 'report-1',
      reporterUserId: 'user-1',
      targetType: 'listing',
      listingId: null,
      userId: null,
      sellerProfileId: null,
      conversationId: null,
      messageId: null,
      reasonId: 'reason-1',
      details: 'extra context',
      status: 'open',
      resolvedAt: null,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      ...overrides,
    },
    reason: { id: 'reason-1', label: 'Spam' },
  };
}

describe('normalizeReportRow', () => {
  it('flattens the nested {report, reason} join into a flat DTO', () => {
    const flat = normalizeReportRow(rawRow({ listingId: 'listing-1' }));
    expect(flat.id).toBe('report-1');
    expect(flat.reason).toBe('Spam');
    expect(flat.details).toBe('extra context');
    expect(flat.targetId).toBe('listing-1');
  });

  it('derives targetId from whichever FK matches the targetType', () => {
    expect(normalizeReportRow(rawRow({ targetType: 'user', userId: 'u-1' })).targetId).toBe('u-1');
    expect(
      normalizeReportRow(rawRow({ targetType: 'seller', sellerProfileId: 's-1' })).targetId
    ).toBe('s-1');
    expect(
      normalizeReportRow(rawRow({ targetType: 'chat', conversationId: 'c-1' })).targetId
    ).toBe('c-1');
  });

  it('falls back to a placeholder label if the reason join is missing', () => {
    const row = rawRow();
    row.reason = undefined;
    expect(normalizeReportRow(row).reason).toBe('Unknown reason');
  });
});
