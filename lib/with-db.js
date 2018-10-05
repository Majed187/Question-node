const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

function withDB(path, callback) {
	const adapter = new FileAsync(path);

	return async (...rest) => {
		const db = await lowdb(adapter);
		await db.defaults({}).write();

		callback(db, ...rest);
	};
}

module.exports = withDB;
