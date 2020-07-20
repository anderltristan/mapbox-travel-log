const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const middlewares = require('./middlewares');
const logs = require('./api/logs')

// connect to db
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// set up middleware
const app = express();
app.use(morgan('common'));
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
}));
app.use(express.json());

// set up routes
app.get('/', (req, res) => {
    res.json({
        message: 'hello world',
    });
});

app.use('/api/logs', logs);

// setting up middlewares/error handling
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

// listen on port
const port = process.env.port || 8080;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});