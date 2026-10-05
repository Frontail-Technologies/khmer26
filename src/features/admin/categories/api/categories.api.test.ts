import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  getAdminCategoryFields,
  updateAdminCategoryField,
  deleteAdminCategoryField,
  deleteAdminCategory,
} from './categories.api';

function mockApiFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn().mockImplementation(async (url: string | URL) => {
    const urlStr = String(url);
    if (urlStr.includes('/auth/csrf')) {
      return {
        ok: true,
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ success: true, data: { csrfToken: 'test-csrf' } }),
      };
    }
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: { get: () => 'application/json' },
      json: async () => body,
    };
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('category-field canonical backend mapping', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('reads fields from GET /admin/categories/:id/fields and unwraps the { fields } envelope', async () => {
    const fetchMock = mockApiFetch({
      success: true,
      data: {
        fields: [
          {
            assignmentId: 'assign-1',
            categoryId: 'cat-1',
            isRequired: true,
            isFilterable: false,
            displayOrder: 1,
            field: { id: 'field-1', name: 'mileage', labelEn: 'Mileage', fieldType: 'number', options: [] },
          },
        ],
      },
    });

    const result = await getAdminCategoryFields('cat-1');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/categories/cat-1/fields');
    expect(result).toHaveLength(1);
    expect(result[0]!.assignment.id).toBe('assign-1');
    expect(result[0]!.field.key).toBe('mileage');
  });

  it('mutates a field assignment via /admin/category-fields/:id, not a nested /admin/categories/:catId/fields/:id route', async () => {
    const fetchMock = mockApiFetch({ success: true, data: {} });
    await updateAdminCategoryField('assign-1', { isRequired: true });

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/category-fields/assign-1');
    expect(String(targetCall[0])).not.toContain('/admin/categories/');
  });

  it('removes a field assignment via DELETE /admin/category-fields/:id', async () => {
    const fetchMock = mockApiFetch({ success: true, data: {} });
    await deleteAdminCategoryField('assign-1');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/category-fields/assign-1');
    expect(targetCall[1]?.method).toBe('DELETE');
  });

  it('deletes an empty category via DELETE /admin/categories/:id', async () => {
    const fetchMock = mockApiFetch({ success: true, data: { message: 'Category deleted' } });
    await deleteAdminCategory('cat-100');

    const targetCall = fetchMock.mock.calls.find(([u]) => !String(u).includes('/auth/csrf'))!;
    expect(String(targetCall[0])).toContain('/admin/categories/cat-100');
    expect(targetCall[1]?.method).toBe('DELETE');
  });

  it('surfaces backend conflict error when category has listings or subcategories', async () => {
    mockApiFetch(
      {
        success: false,
        error: {
          code: 'CATEGORY_HAS_LISTINGS',
          message: 'Category has listings. Reassign listings before deleting.',
        },
      },
      409
    );

    await expect(deleteAdminCategory('cat-with-listings')).rejects.toThrow(
      'Category has listings. Reassign listings before deleting.'
    );
  });
});
