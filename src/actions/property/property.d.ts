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
type CategorySections = {
	name: string;
	id: string;
	data: { name: string; id: string; catId: string }[];
}[];

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
	interaction: Interaction;
};

type Owner = {
	id: string;
	email: string;
	username: string;
	phone: string;
	first_name: string;
	last_name: string;
};

type Amenity = {
	name: string;
	icon: string;
	value: string;
};

type Interaction = {
	viewed: boolean;
	liked: boolean;
	added_to_wishlist: boolean;
};

type Place = {
	name: string;
	vicinity: string;
};
