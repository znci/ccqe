import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).sendFile('index.html', { root: './src/' });
});

router.get('/privacy', (req, res) => {
    res.status(200).sendFile('privacy.html', { root: './src/' });
});

export default router;