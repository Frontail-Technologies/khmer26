import type { CategoryItem } from '../types';

export interface CategoryTreeNode extends CategoryItem {
  children: CategoryTreeNode[];
}

/** Builds an N-level category tree from a flat, parentId-linked list. */
export function buildCategoryTree(categories: CategoryItem[]): CategoryTreeNode[] {
  const nodesById = new Map<string, CategoryTreeNode>();
  for (const category of categories) {
    nodesById.set(category.id, { ...category, children: [] });
  }

  const roots: CategoryTreeNode[] = [];
  for (const category of categories) {
    const node = nodesById.get(category.id)!;
    const parent = category.parentId ? nodesById.get(category.parentId) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/** Returns the ids of `categoryId` and all of its descendants (inclusive). */
export function getDescendantIds(categories: CategoryItem[], categoryId: string): Set<string> {
  const childrenByParent = new Map<string, string[]>();
  for (const category of categories) {
    if (!category.parentId) continue;
    const siblings = childrenByParent.get(category.parentId) ?? [];
    siblings.push(category.id);
    childrenByParent.set(category.parentId, siblings);
  }

  const result = new Set<string>([categoryId]);
  const queue = [categoryId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const childId of childrenByParent.get(current) ?? []) {
      if (!result.has(childId)) {
        result.add(childId);
        queue.push(childId);
      }
    }
  }

  return result;
}
