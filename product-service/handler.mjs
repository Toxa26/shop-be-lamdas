import { getProductsList } from "./handlers/getProductsList.mjs";
import { getProductById } from "./handlers/getProductById.mjs";

export { getProductsList, getProductById };

// const { products } = require('./mockData');
// const headers = {
// 	"Access-Control-Allow-Methods": "*",
// 	"Access-Control-Allow-Headers": "*",
// 	"Access-Control-Allow-Origin": "*",
// };
//
// module.exports.getProductsList = async () => {
// 	return {
// 		statusCode: 200,
// 		headers,
// 		body: JSON.stringify({
// 			products,
// 		}),
// 	};
// }
//
// module.exports.getProductById = async (event) => {
// 	const { id } = event.pathParameters;
// 	const product = products.find((product) => id === product.id);
//
// 	if (product) {
// 		return {
// 			statusCode: 200,
// 			headers,
// 			body: JSON.stringify({
// 				product,
// 			}),
// 		};
// 	} else {
// 		return {
// 			statusCode: 404,
// 			headers,
// 			body: JSON.stringify({
// 				message: `Product with ${id} id does not exist.`,
// 			}),
// 		};
// 	}
// }
//
