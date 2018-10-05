const express = require('express');
const apiRouter = require('./routes/api');

const args = process.argv.slice(2);
const app = express();
const port = args[0] || 3000;

app.use('/api/v1', apiRouter);

app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;

	next(err);
});

app.listen(port, () => {
	console.log(`Now listening on port ${port}`);
});
