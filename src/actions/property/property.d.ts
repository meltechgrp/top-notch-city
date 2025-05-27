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
