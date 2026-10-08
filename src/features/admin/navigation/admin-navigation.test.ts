import { describe, expect, it } from 'vitest';
import { ADMIN_NAV_CONFIG } from './admin-navigation';

function allHrefs(): string[] {
  const hrefs: string[] = [];
  for (const group of ADMIN_NAV_CONFIG) {
    for (const item of group.items) {
      hrefs.push(item.href);
      for (const sub of item.subItems ?? []) {
        hrefs.push(sub.href);
      }
    }
  }
  return hrefs;
}

describe('ADMIN_NAV_CONFIG', () => {
  it('links to all canonical admin routes', () => {
    const hrefs = allHrefs();
    expect(hrefs).toContain('/admin');
    expect(hrefs).toContain('/admin/listings');
    expect(hrefs).toContain('/admin/categories');
    expect(hrefs).toContain('/admin/reports');
    expect(hrefs).toContain('/admin/verifications');
    expect(hrefs).toContain('/admin/locations');
    expect(hrefs).toContain('/admin/users');
    expect(hrefs).toContain('/admin/reviews');
    expect(hrefs).toContain('/admin/content/homepage');
    expect(hrefs).toContain('/admin/promotions');
    expect(hrefs).toContain('/admin/subscriptions');
    expect(hrefs).toContain('/admin/payments');
    expect(hrefs).toContain('/admin/notifications');
    expect(hrefs).toContain('/admin/chats');
    expect(hrefs).toContain('/admin/reported-chats');
    expect(hrefs).toContain('/admin/roles');
    expect(hrefs).toContain('/admin/settings');
    expect(hrefs).toContain('/admin/audit-log');
  });

  it('no longer links to the removed Static Pages feature', () => {
    const hrefs = allHrefs();
    expect(hrefs).not.toContain('/admin/content/pages');
  });
});
