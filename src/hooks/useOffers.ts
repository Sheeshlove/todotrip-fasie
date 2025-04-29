
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
  console.log("Fetching offers with filters:", filters);
  
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
      console.error("Supabase error:", error);
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

// Generates a query key from filters for caching
const getOffersQueryKey = (page: number, filters: FilterState) => 
  ['offers', page, JSON.stringify(filters)];

export const useOffers = (page: number, filters: FilterState = defaultFilters) => {
  const queryClient = useQueryClient();
  
  // Prefetch next page when current page changes
  useEffect(() => {
    // Don't prefetch if we're at the last known page
    const currentData = queryClient.getQueryData<OffersResponse>(
      getOffersQueryKey(page, filters)
    );
    
    if (currentData && currentData.page * currentData.pageSize < currentData.total) {
      // Prefetch next page
      queryClient.prefetchQuery({
        queryKey: getOffersQueryKey(page + 1, filters),
        queryFn: () => fetchOffers(page + 1, filters),
        staleTime: STALE_TIME
      });
    }
  }, [page, filters, queryClient]);

  return useQuery({
    queryKey: getOffersQueryKey(page, filters),
    queryFn: () => fetchOffers(page, filters),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    keepPreviousData: true, // Keep previous data while loading new data
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
