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
