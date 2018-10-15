const path = require('path');
const express = require('express');
const withDB = require('../lib/with-db');
const uuid = require('uuid/v1');
const router = express.Router();
const questionJSON = path.join(__dirname, '..', 'data', 'qustion.json');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

async function getQuestions(db, req, res) {
	const data = await db.get('questions').value();
	res.json(data);
}

async function getQuestion(db, req, res) {
	console.log();
	const { id } = req.params;

	const data = db
		.get('questions')
		.find({ id })
		.value();

	if (!data) {
		res.status(404).json({
			status: 404,
			message: `the question with the given id :${id} is not exsist`
		});
	}

	res.json(data);
}

async function addQuestion(db, req, res) {
	if (!req.body.question || !req.body.answer) {
		const err = new Error();
		err.status = 400;
		res.json({
			status: err.status,
			message: err.message
		});
	}
	const data = await db
		.get('questions')
		.push({
			question: req.body.question,
			answer: req.body.answer,
			id: uuid()
		})
		.write();
	return res.json(data[data.length - 1]);
}

async function updateQuestion(db, req, res, next) {
	const { id } = req.params;
	const question = db
		.get('questions')
		.find({ id })
		.value();
	if (!question) {
		const err = new Error();
		res.status(404).json({
			status: 404,
			message: `No such question with id ${id}`
		});
		next(err);
	}

	const data = await db
		.get('questions')
		.find(question)
		.assign({
			question: req.body.question,
			answer: req.body.answer
		})
		.write();
	res.json(data);
}

async function deleteQuestion(db, req, res, next) {
	const { id } = req.params;
	const question = db
		.get('questions')
		.find({ id })
		.value();

	if (!question) {
		const err = new Error();
		res.status(404).json({
			status: 404,
			message: `No such question with id ${id}`
		});
		return next(err);
	}
	await db
		.get('questions')
		.remove(question)
		.write();

	res.json(question);
}

router.get('/questions', withDB(questionJSON, getQuestions));
router.get('/questions/:id', withDB(questionJSON, getQuestion));
router.put('/questions/:id', withDB(questionJSON, updateQuestion));
router.post('/questions', withDB(questionJSON, addQuestion));
router.delete('/questions/:id', withDB(questionJSON, deleteQuestion));

module.exports = router;
