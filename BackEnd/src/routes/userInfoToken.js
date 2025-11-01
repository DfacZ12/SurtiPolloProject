import express from 'express';
import { jsonResponse } from '../../lib/jsonResponse.js';

const router = express.Router();

router.get('/', (req, res) => {

    res.status(201).json(jsonResponse(201,req.user ));
});

export default router;