
import { useQuery } from '@tanstack/react-query';

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
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
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: '12',
    minPrice: filters.priceRange[0].toString(),
    maxPrice: filters.priceRange[1].toString(),
    sortBy: filters.sortBy || '',
    allInclusive: filters.allInclusive.toString(),
    hotOffers: filters.hotOffers.toString(),
    aiRecommended: filters.aiRecommended.toString(),
    search: filters.searchQuery || '',
    startDate: filters.dateRange?.[0]?.toISOString() || '',
    endDate: filters.dateRange?.[1]?.toISOString() || '',
  });

  const response = await fetch(`/api/offers?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch offers');
  }
  return response.json();
};

export const useOffers = (page: number, filters: FilterState) => {
  return useQuery({
    queryKey: ['offers', page, filters],
    queryFn: () => fetchOffers(page, filters),
  });
};
