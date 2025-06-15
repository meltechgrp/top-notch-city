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
	created_at: string;
	updated_at: string;
	currency: Currency;
	status: PropertyStatus;
	purpose: PropertyPurpose;
	is_featured: boolean;
	category: string;
	subcategory: string;
	address: Address;
	media_urls: string[];
	owner: Owner;
	amenities: Amenity[];
	interaction?: Interaction;
	owner_interaction?: Owner_interaction;
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
	viewed: number;
	liked: number;
};

type Owner_interaction = {
	viewed: boolean;
	liked: boolean;
	added_to_wishlist: boolean;
};

type Place = {
	name: string;
	vicinity: string;
};

type FlatCategoryItem = { type: 'category'; id: string; name: string };
type FlatSubcategoryItem = {
	type: 'subcategory';
	id: string;
	name: string;
	categoryId: string;
};
type FlatItem = FlatCategoryItem | FlatSubcategoryItem;

type Wishlist = {
	id: string;
	title: string;
	description: string | null;
	price: number;
	currency: Currency;
	status: PropertyStatus;
	purpose: PropertyPurpose;
	category: string;
	subcategory: string;
	// address: Address;
	media_urls: string[];
};

enum PropertyStatus {
	pending,
	approve,
	sold,
	reject,
	flag,
	expire,
}
enum PropertyPurpose {
	rent,
	sell,
}
enum Currency {
	ngn,
	usd,
}
