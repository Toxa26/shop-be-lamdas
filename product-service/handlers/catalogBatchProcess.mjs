import AWS from 'aws-sdk';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({ region: "us-east-1" });
const dynamoDB = DynamoDBDocumentClient.from(ddbClient);

import * as dotenv from 'dotenv';

dotenv.config();

export const catalogBatchProcess = async (event) => {
	const sns = new AWS.SNS();

	try {
		const asyncRes = await Promise.all(event.Records.map(async ({ body }) => {
			const product = JSON.parse(body);
			const { id, title, description, price, count } = product;

			product.count = +product.count;
			product.price = +product.price;

			await dynamoDB.send(new PutCommand({
				TableName: process.env.TABLE_NAME_PRODUCTS,
				Item: { id, title, description, price },
			}));

			await dynamoDB.send(new PutCommand({
				TableName: process.env.TABLE_NAME_PRODUCTS_STOCK,
				Item: { product_id: id, count }
			}));

			const message = {
				Subject: 'Product was added',
				Message: JSON.stringify(product),
				TopicArn: process.env.SNS_ARN,
			};

			await sns.publish(message).promise();
		}));

		return {
			statusCode: 200,
			body: JSON.stringify({ message: 'Products created successfully.' })
		};
	} catch (error) {
		console.error(error);

		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify(error),
		};
	}
};