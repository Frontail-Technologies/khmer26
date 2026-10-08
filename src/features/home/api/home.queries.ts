import { queryOptions } from '@tanstack/react-query';
import { marketplaceKeys } from '@/lib/query/keys';
import { getHome } from './home.api';

export const homeQueryOptions = () =>
  queryOptions({
    queryKey: marketplaceKeys.home(),
    queryFn: getHome,
    staleTime: 60 * 1000,
  });
