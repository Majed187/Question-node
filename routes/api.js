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
async function addQuestion(db, req, res) {
	const data = await db
		.get('questions')
		.push({
			question: req.body.question,
			answer: req.body.answer,
			id: uuid()
		})
		.write();

	res.json(data);
}

async function updateQuestion(db, req, res) {
	const { id } = req.params;
	const data = await db
		.get('questions')
		.splice(id, 1, {
			question: req.body.question,
			answer: req.body.answer,
			id: uuid()
		})
		.write();
	res.json(data);
}
async function deleteQuestion(db, req, res) {
	const { id } = req.params;

	const data = await db
		.get('questions')
		.splice(id, 1)
		.write();
	res.json(data);
}
router.get('/questions', withDB(questionJSON, getQuestion));
router.put('/questions/:id', withDB(questionJSON, updateQuestion));
router.post('/questions', withDB(questionJSON, addQuestion));
router.delete(
	'/questions/:id',
	withDB(questionJSON, deleteQuestion),
	readWriteErrors
);
module.exports = router;
