import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
    res.send('singout Route');
});

export default router;