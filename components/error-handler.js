const c = require('colors/safe');
const logging = require('./logging');

module.exports = (error, cb) => {
	if (error[0]) {
		switch (error[0].code) {
			case 88: { // Rate limit exceeded
				logging.rateLimitStatus((result) => {
					console.log(`${error[0].code} ${c.red(error[0].message)}`);
					console.log(`Rate limit: ${c.red(result.limit)}, Rate remaining: ${c.red(result.remaining)}, Rate reset: ${c.red(result.reset)}`);
					cb ? cb() : process.exit();
				});
				break;
			}
			case 108: {
				console.log(`${error[0].code} ${c.red(error[0].message)}`);
				cb ? cb() : null;
				break;
			}
			case 161: { // Unable to follow more people
				console.log(`${error[0].code}  ${c.red('You are unable to follow more people at this time.')}`);
				cb ? cb() : process.exit();
				process.exit();
				break;
			}
			default: {
				console.log(error);
				cb ? cb() : process.exit();
				process.exit();
			}
		}
	} else {
		console.error(error);
	}
};