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

type Property = {
	title: string;
	description?: string;
	price: number;
	currency: 'ngn' | 'usd';
};
