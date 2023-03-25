import AWS from 'aws-sdk';

export const importProductsFile = async (event) => {
	const BUCKET = 'aws-az-shop-import';
	const s3 = new AWS.S3({ region: 'us-east-1' });

	try {
		const { name = '' } = event.queryStringParameters;

		if (!name) {
			return {
				statusCode: 400,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Headers': '*',
					'Access-Control-Allow-Credentials': true,
				},
				body: JSON.stringify({ error: 'Missing name parameter' }),
			};
		}

		const params = {
			Bucket: BUCKET,
			Key: `uploaded/${name}`,
			Expires: 3600,
			ContentType: 'text/csv'
		};

		const url = await s3.getSignedUrlPromise('putObject', params);

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify(url),
		};
	} catch (error) {
		console.error(error);

		return {
			statusCode: 500,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': '*',
				'Access-Control-Allow-Credentials': true,
			},
			body: JSON.stringify(error),
		};
	}
};
