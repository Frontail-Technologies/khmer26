import { describe, expect, it } from 'vitest';
import { buildCategoryTree, getDescendantIds } from './build-category-tree';
import type { CategoryItem } from '../types';

function cat(id: string, parentId: string | null = null): CategoryItem {
  return { id, nameEn: id, nameKm: id, slug: id, parentId };
}

describe('buildCategoryTree', () => {
  it('nests categories at 3+ levels, not just 2', () => {
    const flat = [cat('root'), cat('child', 'root'), cat('grandchild', 'child')];

    const tree = buildCategoryTree(flat);

    expect(tree).toHaveLength(1);
    expect(tree[0].id).toBe('root');
    expect(tree[0].children).toHaveLength(1);
    expect(tree[0].children[0].id).toBe('child');
    expect(tree[0].children[0].children).toHaveLength(1);
    expect(tree[0].children[0].children[0].id).toBe('grandchild');
  });

  it('treats categories with a missing/unknown parentId as roots', () => {
    const flat = [cat('a'), cat('b', 'does-not-exist')];
    const tree = buildCategoryTree(flat);
    expect(tree.map((n) => n.id).sort()).toEqual(['a', 'b']);
  });
});

describe('getDescendantIds', () => {
  it('excludes the category itself and all nested descendants', () => {
    const flat = [
      cat('root'),
      cat('child-a', 'root'),
      cat('child-b', 'root'),
      cat('grandchild', 'child-a'),
      cat('unrelated'),
    ];

    const excluded = getDescendantIds(flat, 'root');

    expect(excluded.has('root')).toBe(true);
    expect(excluded.has('child-a')).toBe(true);
    expect(excluded.has('child-b')).toBe(true);
    expect(excluded.has('grandchild')).toBe(true);
    expect(excluded.has('unrelated')).toBe(false);
  });

  it('does not exclude siblings or unrelated branches', () => {
    const flat = [cat('a'), cat('a1', 'a'), cat('b'), cat('b1', 'b')];
    const excluded = getDescendantIds(flat, 'a');
    expect(excluded.has('b')).toBe(false);
    expect(excluded.has('b1')).toBe(false);
  });
});
