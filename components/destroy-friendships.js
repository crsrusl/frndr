require('dotenv').config();
const client = require('./twitter-client');
const errorHandler = require('./error-handler');
const _ = require('lodash');
const async = require('async');
const logging = require('./../components/logging');

function removeFriend(id, cb) {
	client.post('friendships/destroy', {user_id: id}, (error) => error ? cb(error) : cb());
}

function getRelationship(ids, cb) {
	client.get('friendships/lookup', {user_id: ids.join()}, (error, users) =>
		error
			? errorHandler(error)
			: getFollowedBy(users, cb));
}

function getFollowedBy(users, cb) {
	async.each(users, (user, innerCb) =>
		_.includes(user['connections'], 'followed_by') ? innerCb() : removeFriend(user['id'], innerCb), (error) => error ? errorHandler(error) : cb());
}

function getRelationshipGroup(ids, cb) {
	async.each(ids, (group, innerCb) =>
			getRelationship(group, (error) =>
				error
					? innerCb(error)
					: innerCb()),
		(error) => cb(error));
}

function initialise() {
	client.get('friends/ids', {screen_name: process.env.SCREEN_NAME, count: 5000}, (error, response, body) =>
		error
			? logging.error(error)
			: getRelationshipGroup(_.chunk(response["ids"], 100), (error) =>
				error
					? logging.error(error)
					: console.log('Finished')));
}

module.exports = initialise;