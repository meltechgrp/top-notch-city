module.exports = {
	client: {
		service: {
			name: 'top-notch-city',
			localSchemaFile: './graphql.schema.json',
		},
		includes: ['./src/graphql/**'],
	},
};
