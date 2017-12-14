module.exports = (response, cb) => {
	console.log({
		'x-rate-limit-limit': response.headers['x-rate-limit-limit'],
		'x-rate-limit-remaining': response.headers['x-rate-limit-remaining'],
		'x-rate-limit-reset': response.headers['x-rate-limit-reset']
	});
	
	cb ? cb() : null;
};