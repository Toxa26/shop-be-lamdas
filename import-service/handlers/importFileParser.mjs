import AWS from 'aws-sdk';
import csv from 'csv-parser';

export const importFileParser = async (event) => {
	const BUCKET = 'aws-az-shop-import';
	const s3 = new AWS.S3({ region: 'us-east-1' });

	try {
		for (const record of event.Records) {
			const objectKey = record.s3.object.key;

			const s3Stream = s3.getObject({
				Bucket: BUCKET,
				Key: objectKey
			}).createReadStream();

			s3Stream.pipe(csv())
			.on('data', data => {
				console.log('csv record: ', data);
			})
			.on('end', async () => {
				await s3.copyObject({
					Bucket: BUCKET,
					CopySource: `${BUCKET}/${objectKey}`,
					Key: objectKey.replace('uploaded', 'parsed')
				}).promise();

				await s3.deleteObject({
					Bucket: BUCKET,
					key: objectKey
				}).promise();
			});
		}
	} catch (error) {
		console.log(error);
	}
};
