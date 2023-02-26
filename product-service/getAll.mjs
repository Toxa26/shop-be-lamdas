import products from "./mockData.mjs";

export const getProductsList = async () => {
	return {
		statusCode: 200,
		body: JSON.stringify({
			products,
		}),
	};
}