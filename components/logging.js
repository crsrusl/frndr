const client = require('./twitter-client');
const moment = require('moment');

module.exports = {
	userError(user, error) {
		console.error(`@${user.screen_name} (${error[0].message})`);
	},
	
	createdFriendship(result) {
		console.log(`@${result.screen_name} (Created friendship)`);
	},
	
	error(error) {
		console.error(error);
	},
	
	destroyedFriendship(user, cb) {
		console.log(`@${user.screen_name} (Destroyed friendship)`);
		cb();
	},
	
	rateLimitStatus(cb) {
		client.get('application/rate_limit_status', {}, (err, result, response) => {
			if (err) return error(err);
			
			const headers = response.headers;
			cb({
				'limit': headers['x-rate-limit-limit'],
				'remaining': headers['x-rate-limit-remaining'],
				'reset': moment.unix(headers['x-rate-limit-reset']).format('dddd, MMMM Do, YYYY h:mm:ss A')
			});
		});
	}
};