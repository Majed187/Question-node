const path = require('path');
const express = require('express');
const withDB = require('../lib/with-db');
const uuid = require('uuid/v1');
const router = express.Router();
const questionJSON = path.join(__dirname, '..', 'data', 'qustion.json');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

function readWriteErrors(err, req, res, next) {
	const newErr = new Error();

	switch (err.code) {
	case 'ENOENT':
		newErr.message = `Cannot read file: ${err.path}`;
		break;
	default:
		newErr.message = 'Internal server error';
	}

	newErr.status = 500;
	next(newErr);
}

async function getQuestion(db, req, res) {
	if (!db.has('questions').value()) {
		await db.set('questions', []).write();
	}
	const data = db.get('questions').value();
	res.json(data);
}

router.get('/questions', withDB(questionJSON, getQuestion), readWriteErrors);

module.exports = router;
