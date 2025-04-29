import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export interface Offer {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string | null;
  location: string | null;
  duration: string | null;
  all_inclusive: boolean | null;
  hot_offer: boolean | null;
  ai_recommended: boolean | null;
  details: string | null;
  included: string[] | null;
  valid_from: string | null;
  valid_until: string | null;
  created_at: string | null;
}

export interface OffersResponse {
  offers: Offer[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FilterState {
  priceRange: [number, number] | null;
  dateRange: [Date, Date] | null;
  allInclusive: boolean;
  hotOffers: boolean;
  aiRecommended: boolean;
  searchQuery: string;
  sortBy: 'cheapToExpensive' | 'expensiveToCheap' | 'default';
}

// Default filter state for reuse
const defaultFilters: FilterState = {
  priceRange: null,
  dateRange: null,
  allInclusive: false,
  hotOffers: false,
  aiRecommended: false,
  searchQuery: '',
  sortBy: 'default'
};

// Cache time constants
const STALE_TIME = 2 * 60 * 1000; // 2 minutes
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

// Memoized fetch function to avoid recreation
const fetchOffers = async (page: number, filters: FilterState): Promise<OffersResponse> => {
  let query = supabase
    .from('offers')
    .select('*', { count: 'exact' });

  // Apply filters
  if (filters.priceRange) {
    query = query
      .gte('price', filters.priceRange[0])
      .lte('price', filters.priceRange[1]);
  }

  if (filters.allInclusive) {
    query = query.eq('all_inclusive', true);
  }

  if (filters.hotOffers) {
    query = query.eq('hot_offer', true);
  }

  if (filters.aiRecommended) {
    query = query.eq('ai_recommended', true);
  }

  if (filters.searchQuery) {
    query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%,location.ilike.%${filters.searchQuery}%`);
  }

  if (filters.dateRange?.[0] && filters.dateRange?.[1]) {
    query = query
      .or(`valid_until.gte.${filters.dateRange[0].toISOString()},valid_until.is.null`)
      .or(`valid_from.lte.${filters.dateRange[1].toISOString()},valid_from.is.null`);
  }

  // Apply sorting
  if (filters.sortBy === 'cheapToExpensive') {
    query = query.order('price', { ascending: true });
  } else if (filters.sortBy === 'expensiveToCheap') {
    query = query.order('price', { ascending: false });
  }

  // Apply pagination
  const from = (page - 1) * 12;
  const to = from + 11;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error('Failed to fetch offers');
  }

  return {
    offers: data || [],
    total: count || 0,
    page,
    pageSize: 12
  };
};

// Pre-fetches the next page of offers to reduce loading time when paginating
const prefetchNextPage = (queryClient: any, page: number, filters: FilterState) => {
  queryClient.prefetchQuery({
    queryKey: ['offers', page + 1, filters],
    queryFn: () => fetchOffers(page + 1, filters),
    staleTime: STALE_TIME
  });
};

// Generates a query key from filters for caching
const getOffersQueryKey = (page: number, filters: FilterState) => 
  ['offers', page, filters];

export const useOffers = (page: number, filters: FilterState = defaultFilters) => {
  const queryClient = useQueryClient();
  
  // Prefetch next page when current page changes
  useEffect(() => {
    // Don't prefetch if we're at the last known page
    const currentData = queryClient.getQueryData<OffersResponse>(
      getOffersQueryKey(page, filters)
    );
    
    if (currentData && currentData.page * currentData.pageSize < currentData.total) {
      prefetchNextPage(queryClient, page, filters);
    }
  }, [page, filters, queryClient]);

  return useQuery({
    queryKey: getOffersQueryKey(page, filters),
    queryFn: () => fetchOffers(page, filters),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    keepPreviousData: true, // Keep previous data while loading new data
  });
};
