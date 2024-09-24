import express from 'express';
import bodyParser from 'body-parser';
import explorerMiddleware from './middlewares/explorerMiddleware.js';
import { requestLogger } from './utils/logger.js';
import indexRouter from './routes/index.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use('/', indexRouter);
app.use('/explorer', explorerMiddleware({ endpointURL: '/graphql' }));
app.get('/', (req, res) => { 
    res.status(200).sendFile('index.html', { root: __dirname });
});

export default app;
