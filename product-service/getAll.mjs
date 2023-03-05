import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({ region: "us-east-1" });
const dynamoDB = DynamoDBDocumentClient.from(ddbClient);
// import products from "./mock-data/mockData.mjs";

export const getProductsList = async () => {
	const ProductsTableName = process.env.TABLE_NAME_PRODUCTS;
	const ProductsStockTableName = process.env.TABLE_NAME_PRODUCTS_STOCK;

	const getProducts = async () => {
		const { Items } = await dynamoDB.send(new ScanCommand({
			TableName: ProductsTableName
		}))
		return Items;
	}

	const getProductsStock = async () => {
		const { Items } = await dynamoDB.send(new ScanCommand({
			TableName: ProductsStockTableName
		}))
		return Items;
	}

	const products = await getProducts();
	const stocks = await getProductsStock();

	return {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
		},
		body: JSON.stringify({
			products: products.map((product) => ({
				...product, count: stocks.find(stock => stock.product_id === product.id)?.count
			})),
		}),
	};
}