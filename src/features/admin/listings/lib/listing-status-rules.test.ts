import { describe, expect, it } from 'vitest';
import { canApproveListing, canRejectListing, canRestoreListing } from './listing-status-rules';

describe('listing status rules', () => {
  it('allows approving anything not already approved', () => {
    expect(canApproveListing({ moderationStatus: 'pending_review', status: 'active' })).toBe(true);
    expect(canApproveListing({ moderationStatus: 'approved', status: 'active' })).toBe(false);
  });

  it('allows rejecting anything not already rejected', () => {
    expect(canRejectListing({ moderationStatus: 'pending_review', status: 'active' })).toBe(true);
    expect(canRejectListing({ moderationStatus: 'rejected', status: 'active' })).toBe(false);
  });

  it('allows restoring anything not already active', () => {
    expect(canRestoreListing({ moderationStatus: 'approved', status: 'sold' })).toBe(true);
    expect(canRestoreListing({ moderationStatus: 'approved', status: 'active' })).toBe(false);
  });
});
