import products from "./mockData.mjs";

export const getProductById = async (event) => {
	const { id } = event.pathParameters;
	const product = products.find((product) => id === product.id);

	if (product) {
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
			},
			body: JSON.stringify({
				product,
			}),
		};
	} else {
		return {
			statusCode: 404,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
			},
			body: JSON.stringify({
				message: `Product with ${id} id does not exist.`,
			}),
		};
	}
}