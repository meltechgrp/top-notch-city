type LocationData = {
  latitude: number;
  longitude: number;
};

type GooglePlace = {
  placeId?: string;
  displayName: string;
  location: LocationData;
  addressComponents: ParsedAddress;
};

type ParsedAddress = {
  city?: string;
  state?: string;
  country?: string;
  street?: string;
  lga?: string;
};

type GooglePlaceResult = {
  placeId: string;
  displayName: { text: string };
  formattedAddress: string;
  location: LocationData;
  id: string;
  addressComponents: AddressComponent[];
};

type AddressComponent = {
  languageCode: string;
  longText: string;
  shortText: string;
  types: string[];
};

type Address = {
  display_address: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  place_id?: string;
  country_code: string | null;
  id?: string;
};

type UploadedFile = {
  uri: string;
  id: string;
};

type Enquiry = {
  full_name: string;
  email: string;
  message: string;
  type: "sell" | "enquiry" | "general" | "visit" | "offer";
  address?: string;
  property_id?: string;
};

type EnquiryList = {
  id: string;
  type: "sell" | "enquiry" | "general" | "visit" | "offer";
  full_name: string;
  address: string;
  email: string;
  message: string;
  user_id: string;
  property_id: string;
  created_at: string; // or you can use Date if you parse it
};
