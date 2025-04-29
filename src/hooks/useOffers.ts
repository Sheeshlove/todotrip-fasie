import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useMemo } from 'react';

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
  priceRange: [number, number];
  dateRange: [Date | null, Date | null];
  allInclusive: boolean;
  hotOffers: boolean;
  aiRecommended: boolean;
  searchQuery: string;
  sortBy: string | null;
}

// Default filter state for reuse
const defaultFilters: FilterState = {
  priceRange: [0, 100000],
  dateRange: [null, null],
  allInclusive: false,
  hotOffers: false,
  aiRecommended: false,
  searchQuery: '',
  sortBy: null
};

// Cache time constants
const STALE_TIME = 2 * 60 * 1000; // 2 minutes
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

// Memoized fetch function to avoid recreation
const fetchOffers = async (page: number, filters: FilterState): Promise<OffersResponse> => {
  try {
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
      const searchTerm = `%${filters.searchQuery}%`;
      query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm},location.ilike.${searchTerm}`);
    }

    if (filters.dateRange?.[0] && filters.dateRange?.[1]) {
      const fromDate = filters.dateRange[0].toISOString();
      const toDate = filters.dateRange[1].toISOString();
      
      // Filter offers that are valid during the selected date range
      query = query
        .or(`valid_until.gte.${fromDate},valid_until.is.null`)
        .or(`valid_from.lte.${toDate},valid_from.is.null`);
    }

    // Apply sorting
    if (filters.sortBy === 'cheapToExpensive') {
      query = query.order('price', { ascending: true });
    } else if (filters.sortBy === 'expensiveToCheap') {
      query = query.order('price', { ascending: false });
    } else {
      // Default sorting by creation date (newest first)
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    const from = (page - 1) * 12;
    const to = from + 11;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(error.message || 'Failed to fetch offers');
    }

    return {
      offers: data || [],
      total: count || 0,
      page,
      pageSize: 12
    };
  } catch (error) {
    console.error("Error in fetchOffers:", error);
    throw error;
  }
};

// Stable key generation that avoids unnecessary stringification
const getOffersQueryKey = (page: number, filters: FilterState) => {
  // Create a stable array key using individual filter properties
  return [
    'offers', 
    page, 
    filters.priceRange[0], 
    filters.priceRange[1],
    filters.dateRange[0]?.toISOString() || null,
    filters.dateRange[1]?.toISOString() || null,
    filters.allInclusive,
    filters.hotOffers,
    filters.aiRecommended,
    filters.searchQuery,
    filters.sortBy
  ];
};

export const useOffers = (page: number, filters: FilterState = defaultFilters) => {
  const queryClient = useQueryClient();
  
  // Memoize filters to prevent unnecessary re-renders
  const stableFilters = useMemo(() => ({
    ...defaultFilters,
    ...filters
  }), [
    filters.priceRange?.[0],
    filters.priceRange?.[1],
    filters.dateRange?.[0],
    filters.dateRange?.[1],
    filters.allInclusive,
    filters.hotOffers,
    filters.aiRecommended,
    filters.searchQuery,
    filters.sortBy
  ]);
  
  // Get a stable query key
  const queryKey = useMemo(() => 
    getOffersQueryKey(page, stableFilters), 
    [page, stableFilters]
  );
  
  // Prefetch next page when current page changes
  useEffect(() => {
    // Don't prefetch if we're at the last known page
    const currentData = queryClient.getQueryData<OffersResponse>(
      getOffersQueryKey(page, stableFilters)
    );
    
    if (currentData && currentData.page * currentData.pageSize < currentData.total) {
      // Prefetch next page
      queryClient.prefetchQuery({
        queryKey: getOffersQueryKey(page + 1, stableFilters),
        queryFn: () => fetchOffers(page + 1, stableFilters),
        staleTime: STALE_TIME
      });
    }
  }, [page, stableFilters, queryClient]);

  return useQuery({
    queryKey,
    queryFn: () => fetchOffers(page, stableFilters),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    placeholderData: (previousData) => previousData,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
