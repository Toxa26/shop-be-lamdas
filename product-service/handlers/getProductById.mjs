import { products } from "../mockData.mjs";

export const getProductById = async (event) => {
	const { id } = event.pathParameters;
	const product = products.find((product) => id === product.id);

	if (product) {
		return {
			statusCode: 200,
			body: JSON.stringify({
				product,
			}),
		};
	} else {
		return {
			statusCode: 404,
			body: JSON.stringify({
				message: `Product with ${id} id does not exist.`,
			}),
		};
	}
}