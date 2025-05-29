interface PlacePredictionResponse {
	predictions: PlacePrediction[];
	status: string;
}

interface PlacePrediction {
	description: string;
	place_id: string;
}

type LatLng = {
	lat: number;
	lng: number;
};

type Geometry = {
	location: LatLng;
};

type PlaceResult = {
	formatted_address: string;
	geometry: Geometry;
	vicinity: string;
};

type PlaceResponse = {
	result: PlaceResult;
	status: string;
};

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
