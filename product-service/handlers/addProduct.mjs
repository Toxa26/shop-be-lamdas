import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as generateId } from 'uuid';

const ddbClient = new DynamoDBClient({ region: "us-east-1" });
const dynamoDB = DynamoDBDocumentClient.from(ddbClient);

import * as dotenv from 'dotenv';
dotenv.config();

export const createProduct = async (event) => {
	console.log('Creating product was called!');
	console.log('Event:', event);

	const ProductsTableName = process.env.TABLE_NAME_PRODUCTS;
	const ProductsStockTableName = process.env.TABLE_NAME_PRODUCTS_STOCK;

	try {
		const { body } = event;
		const { title, description, price, count } = JSON.parse(body);

		if (!title || !description || !price || !count) {
			return {
				statusCode: 400,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Credentials": true,
				},
				body: JSON.stringify( { message: 'Product data is invalid!' })
			}
		}

		const productId = generateId();

		await dynamoDB.send(new PutCommand({
			TableName: ProductsTableName,
			Item: { id: productId, title, description, price },
		}));

		await dynamoDB.send(new PutCommand({
			TableName: ProductsStockTableName,
			Item: { product_id: productId, count },
		}));

		return {
			statusCode: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
			},
			body: JSON.stringify({
				id: productId,
				title,
				description,
				price,
				count,
			}),
		};
	} catch (err) {
		return {
			statusCode: 500,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": true,
			},
			body: JSON.stringify( { message: err.message || 'Something went wrong!' })
		}
	}
};