import AWS from 'aws-sdk';
import csv from 'csv-parser';

import * as dotenv from 'dotenv';
dotenv.config();

export const importFileParser = async (event) => {
	const BUCKET = 'aws-az-shop-import';
	const s3 = new AWS.S3({ region: 'us-east-1' });
	const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

	try {
		for (const record of event.Records) {
			const objectKey = record.s3.object.key;

			const s3Stream = s3.getObject({
				Bucket: BUCKET,
				Key: objectKey
			}).createReadStream();

			await new Promise((resolve) => {
				s3Stream
				.pipe(csv())
				.on('data', async (data) => {
					await sqs
					.sendMessage({
						QueueUrl: process.env.SQS_URL,
						MessageBody: JSON.stringify(data),
					})
					.promise();
				})
				.on('end', async () => {
					await s3.copyObject({
						Bucket: BUCKET,
						CopySource: `${BUCKET}/${objectKey}`,
						Key: objectKey.replace('uploaded', 'parsed')
					}).promise();

					await s3.deleteObject({
						Bucket: BUCKET,
						Key: objectKey
					}).promise();

					resolve({
						statusCode: 200,
						body: JSON.stringify({ message: 'Csv file successfully received and parsed.' })
					});
				});
			});
		}
	} catch (error) {
		console.log(error);
	}
};
