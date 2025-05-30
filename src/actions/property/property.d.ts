type Category = {
	id: string;
	name: string;
	slug: string;
};

type SubCategory = {
	cat: Category;
	id: string;
	name: string;
	slug: string;
};
type CategorySections = { cat: string; subs: { name: string }[] }[];

type PropertyResponse = {
	count: number;
	properties: Property[];
};

type Property = {
	id: string;
	title: string;
	description: string | null;
	price: number;
	currency: 'ngn' | 'usd';
	status: 'pending' | 'approve' | 'sold';
	purpose: 'rent' | 'sell';
	is_featured: boolean;
	category: string;
	subcategory: string;
	address: Address;
	media_urls: string[];
	owner: Owner;
	amenities: Amenity[];
};

type Address = {
	street: string;
	city: string;
	state: string;
	country: string;
	postal_code: string | null;
	latitude: number;
	longitude: number;
	place_id: string;
	country_code: string | null;
};

type Owner = {
	id: string;
	email: string;
	username: string;
	phone: string;
	first_name: string;
	last_name: string;
};

type Amenity = any;
