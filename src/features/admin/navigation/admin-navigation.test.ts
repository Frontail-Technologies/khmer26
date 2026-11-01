import { describe, expect, it } from 'vitest';
import { ADMIN_DESTINATIONS, ADMIN_NAV_CONFIG, ADMIN_SETUP_SECTIONS, isNavItemActive } from './admin-navigation';

describe('admin navigation', () => {
  it('keeps every admin route reachable from the menu or the Setup page (admin-host paths)', () => {
    const hrefs = ADMIN_DESTINATIONS.map((destination) => destination.href);
    for (const route of [
      '/', '/queue', '/listings', '/users', '/verifications', '/reports', '/chats', '/support',
      '/payments', '/subscriptions', '/promotions', '/setup',
      '/categories', '/listing-fields', '/locations', '/reports/reasons',
      '/content/homepage', '/content/featured', '/content/banners', '/content/tips', '/content/pages', '/content/keywords',
      '/reviews', '/reported-chats', '/notifications', '/settings', '/roles', '/audit-log',
    ]) {
      expect(hrefs).toContain(route);
    }
  });

  it('has a flat menu (no nested sub-menus)', () => {
    for (const group of ADMIN_NAV_CONFIG) {
      for (const item of group.items) expect(item.subItems ?? []).toHaveLength(0);
    }
  });

  it('lists policy pages on the Setup page', () => {
    const content = ADMIN_SETUP_SECTIONS.find((section) => section.id === 'content');
    expect(content?.links.find((link) => link.href === '/content/pages')?.title).toBe('Policy Pages');
  });

  it('highlights Setup for setup screens and Reports only for report pages', () => {
    const setup = ADMIN_NAV_CONFIG.flatMap((group) => group.items).find((item) => item.title === 'Setup')!;
    const reports = ADMIN_NAV_CONFIG.flatMap((group) => group.items).find((item) => item.title === 'Reports')!;
    expect(isNavItemActive(setup, '/content/banners')).toBe(true);
    expect(isNavItemActive(setup, '/reports/reasons')).toBe(true);
    expect(isNavItemActive(reports, '/reports/reasons')).toBe(false);
    expect(isNavItemActive(reports, '/reports/abc')).toBe(true);
    expect(isNavItemActive(setup, '/admin/categories')).toBe(true);
  });
});
