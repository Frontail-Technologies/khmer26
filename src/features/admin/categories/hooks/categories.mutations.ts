import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminKeys } from '@/lib/query/keys';
import {
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  createAdminCategoryField,
  updateAdminCategoryField,
  deleteAdminCategoryField,
  createAdminFieldDefinition,
  updateAdminFieldDefinition,
  deleteAdminFieldDefinition,
} from '../api/categories.api';
import { toast } from 'sonner';

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.all });
      toast.success('Category created');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create category';
      toast.error(msg);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAdminCategory>[1] }) =>
      updateAdminCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.all });
      toast.success('Category updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update category';
      toast.error(msg);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.all });
      toast.success('Category deleted');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to delete category';
      toast.error(msg);
    },
  });
}

export function useAssignCategoryField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: Parameters<typeof createAdminCategoryField>[1] }) =>
      createAdminCategoryField(categoryId, data),
    onSuccess: (_result, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.fields(categoryId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.fieldLibrary() });
      toast.success('Field assigned to category');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to assign field';
      toast.error(msg);
    },
  });
}

export function useUpdateCategoryFieldAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assignmentId,
      data,
    }: {
      assignmentId: string;
      categoryId: string;
      data: Parameters<typeof updateAdminCategoryField>[1];
    }) => updateAdminCategoryField(assignmentId, data),
    onSuccess: (_result, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.fields(categoryId) });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update field assignment';
      toast.error(msg);
    },
  });
}

export function useRemoveCategoryFieldAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assignmentId }: { assignmentId: string; categoryId: string }) =>
      deleteAdminCategoryField(assignmentId),
    onSuccess: (_result, { categoryId }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.fields(categoryId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.fieldLibrary() });
      toast.success('Field removed from category');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to remove field assignment';
      toast.error(msg);
    },
  });
}

export function useCreateFieldDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAdminFieldDefinition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.fieldLibrary() });
      toast.success('Field created');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to create field';
      toast.error(msg);
    },
  });
}

export function useUpdateFieldDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateAdminFieldDefinition>[1] }) =>
      updateAdminFieldDefinition(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.fieldLibrary() });
      toast.success('Field updated');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to update field';
      toast.error(msg);
    },
  });
}

export function useDeleteFieldDefinition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminFieldDefinition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories.fieldLibrary() });
      toast.success('Field deleted');
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Failed to delete field';
      toast.error(msg);
    },
  });
}
