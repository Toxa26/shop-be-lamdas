import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { GetCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({ region: "us-east-1" });
const dynamoDB = DynamoDBDocumentClient.from(ddbClient);
// import products from "./mockData.mjs";

export const getProductById = async (event) => {
	const ProductsTableName = process.env.TABLE_NAME_PRODUCTS;
	const ProductsStockTableName = process.env.TABLE_NAME_PRODUCTS_STOCK;

	const getProduct = async (productId) => {
		const { Item } = await dynamoDB.send(
			new GetCommand({
				TableName: ProductsTableName,
				Key: {
					id: productId
				},
			})
		);

		return Item;
	};

	const getCount = async (productId) => {
		const { Item } = await dynamoDB.send(
			new GetCommand({
				TableName: ProductsStockTableName,
				Key: {
					product_id: productId
				},
			})
		);

		return Item ? Item.count : 0;
	};

	const id = event.pathParameters.productId;
	const product = await getProduct(id);
	const count = await getCount(id);

	if (product) {
		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
			},
			body: JSON.stringify({ ...product, count }),
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
};