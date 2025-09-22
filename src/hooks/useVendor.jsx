import {
  useGetvendorPromoCodeQuery,
  useGetvendorQuery,
} from "../services/vendorApi";

// Custom hook to fetch vendor list by service category id
export function useVendors(serviceCategoryId) {
  const { data, error, isLoading, isFetching, refetch } =
    useGetvendorQuery(serviceCategoryId);

  return {
    vendors: data?.data || [],
    isLoading,
    isFetching,
    error,
    refetch,
  };
}

// Custom hook to fetch promo code details by promo code id
export function useVendorPromoCode(promoCodeId) {
  const { data, error, isLoading, isFetching, refetch } =
    useGetvendorPromoCodeQuery(promoCodeId);

  return {
    promoCodeData: data || null,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}
