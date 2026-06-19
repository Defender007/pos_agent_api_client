export const BUSINESS_SEGMENTS = [
  { label: "Fast Foods", value: "fast_foods" },
  { label: "Hotels/GuestHouses", value: "hotels_guesthouses" },
  { label: "Fuel Stations", value: "fuel_stations" },
  { label: "Airlines Operations", value: "airlines_operations" },
  { label: "Restaurants", value: "restaurants" },
  { label: "Logistics/Courier", value: "logistics_courier" },
  { label: "Wholesale", value: "wholesale" },
  { label: "Church/NGO", value: "church_ngo" },
  { label: "Stores/Supermarkets", value: "stores_supermarkets" },
  { label: "MDAs", value: "mdas" },
  { label: "Others", value: "others" },
] as const;

export type BusinessSegment = (typeof BUSINESS_SEGMENTS)[number]["value"];

export function getBusinessSegmentLabel(segment?: string | null) {
  return (
    BUSINESS_SEGMENTS.find((option) => option.value === segment)?.label ||
    segment ||
    "—"
  );
}
