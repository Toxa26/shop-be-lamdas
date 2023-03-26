export const basicAuthorizer = async (event) => {
	const generatePolicyDocument = (effect, resource) => {
		return {
			Version: '2012-10-17',
			Statement: [{
				Action: 'execute-api:Invoke',
				Effect: effect,
				Resource: resource
			}]
		};
	};
	const generateResponse = (principalId, effect, resource) => {
		return { principalId, policyDocument: generatePolicyDocument(effect, resource) };
	};

	try {
		console.log('event:', event);

		const { authorizationToken, methodArn } = event;
		const token = authorizationToken.split(' ')[1];
		const [user, password] = Buffer.from(token, 'base64').toString().split(':');
		const storedPassword = process.env[user];
		const effect = storedPassword && storedPassword === password ? 'Allow' : 'Deny';

		return generateResponse(token, effect, methodArn);
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
