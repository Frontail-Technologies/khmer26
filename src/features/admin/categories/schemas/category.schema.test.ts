import { describe, expect, it } from 'vitest';
import { categoryFormSchema } from './category.schema';

const valid = {
  nameEn: 'Laptops',
  nameKm: 'កុំព្យូទ័រ',
  slug: 'laptops',
  parentId: null,
  displayOrder: 0,
  isActive: true,
};

describe('categoryFormSchema', () => {
  it('accepts a valid payload', () => {
    expect(categoryFormSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a slug with uppercase or spaces', () => {
    const result = categoryFormSchema.safeParse({ ...valid, slug: 'Not A Slug' });
    expect(result.success).toBe(false);
  });

  it('rejects names shorter than 2 characters', () => {
    const result = categoryFormSchema.safeParse({ ...valid, nameEn: 'A' });
    expect(result.success).toBe(false);
  });

  it('accepts a uuid parentId and rejects a non-uuid one', () => {
    expect(
      categoryFormSchema.safeParse({ ...valid, parentId: '11111111-1111-1111-8111-111111111111' })
        .success
    ).toBe(true);
    expect(categoryFormSchema.safeParse({ ...valid, parentId: 'not-a-uuid' }).success).toBe(false);
  });
});
