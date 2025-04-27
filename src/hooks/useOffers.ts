
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  location?: string;
  duration?: string;
  details?: string;
  included?: string[];
  all_inclusive: boolean;
  hot_offer: boolean;
  ai_recommended: boolean;
  valid_from?: string;
  valid_until?: string;
}

interface FilterState {
  priceRange: [number, number];
  sortBy: string | null;
  allInclusive: boolean;
  hotOffers: boolean;
  aiRecommended: boolean;
  dateRange?: [Date | null, Date | null];
  searchQuery?: string;
}

interface OffersResponse {
  offers: Offer[];
  total: number;
  page: number;
  pageSize: number;
}

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

export const useOffers = (page: number, filters: FilterState) => {
  return useQuery({
    queryKey: ['offers', page, filters],
    queryFn: () => fetchOffers(page, filters),
  });
};
