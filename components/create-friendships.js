require('dotenv').config();
const client = require('./twitter-client');
const logging = require('./logging');
const errorHandler = require('./error-handler');

function createFriendship(id, tweet, cb) {
	client.post('friendships/create', {user_id: id}, (error, tweet) =>
		error
			? cb(error)
			: cb(null, tweet));
}

function streamHandler(stream) {
	stream.on('data', (tweet) =>
		createFriendship(tweet['user']['id'], tweet, (error, result) =>
			error
				? errorHandler(error)
				: logging.createdFriendship(result)));
	
	stream.on('error', (error) => errorHandler(error));
}

function initialise() {
	client.stream('statuses/filter', {track: process.env.TRACK}, (stream) => streamHandler(stream));
}

module.exports = initialise;
