const express = require('express');
const apiRouter = require('./routes/api');
const args = process.argv.slice(2);
const app = express();
const port = args[0] || 3000;

app.use(express.json());
app.use('/api/v1', apiRouter);
app.use((req, res, next) => {
	const err = new Error(`Not Found , Check your ${req.path}`);
	err.status = 404;
	next(err);
});

app.use((err, req, res, _) => {
	err.status = err.status || 500;
	err.message = err.message || 'Sorry, something awful happend :(';
	res.status(err.status).json({
		message: err.message
	});
});

app.listen(port, () => {
	console.log(`Now listening on port ${port}`);
});
