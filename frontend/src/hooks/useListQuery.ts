import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';

interface UseListQueryProps<TFilter> {
  queryKey: string;
  fetchFn: (page: number, limit: number, sort: string, order: string, filters: TFilter) => Promise<any>;
  defaultSort?: string;
  defaultOrder?: string;
  defaultFilters: TFilter;
}

export const useListQuery = <T, TFilter extends Record<string, any>>({
  queryKey,
  fetchFn,
  defaultSort = 'created_at',
  defaultOrder = 'desc',
  defaultFilters,
}: UseListQueryProps<TFilter>) => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState(defaultSort);
  const [order, setOrder] = useState(defaultOrder);
  const [filters, setFilters] = useState<TFilter>(defaultFilters);
  const limit = 10;

  const filterKey = JSON.stringify(filters);

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: [queryKey, currentPage, sort, order, filterKey],
    queryFn: async () => {
      const response = await fetchFn(currentPage, limit, sort, order, filters);
      const wrappedData = response.data;
      if (wrappedData?.status === 'success') {
        const result = {
          data: Array.isArray(wrappedData.data) ? wrappedData.data : wrappedData.data?.data || [],
          meta: wrappedData.meta,
        };

        return result;
      }
      console.warn('useListQuery - Unexpected response structure:', wrappedData);
      return wrappedData;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const updateFilter = useCallback((key: keyof TFilter, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const fetchData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    data: (Array.isArray(data?.data) ? data.data : []) as T[],
    loading: isLoading,
    currentPage,
    setCurrentPage,
    totalPages: data?.meta?.totalPages || 1,
    total: data?.meta?.total || 0,
    sort,
    setSort,
    order,
    setOrder,
    filters,
    updateFilter,
    limit,
    refetch,
    fetchData,
  };
};