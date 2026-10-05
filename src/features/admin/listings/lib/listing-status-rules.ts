interface ListingStatusFields {
  moderationStatus: string;
  status: string;
}

/** UX visibility rules only — the backend remains authoritative for transition validity. */
export function canApproveListing(listing: ListingStatusFields): boolean {
  return listing.moderationStatus !== 'approved';
}

export function canRejectListing(listing: ListingStatusFields): boolean {
  return listing.moderationStatus !== 'rejected';
}

export function canRestoreListing(listing: ListingStatusFields): boolean {
  return listing.status !== 'active';
}
