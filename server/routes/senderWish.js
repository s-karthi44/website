import express from 'express';
import Wish from '../models/Wish.js';

const router = express.Router();

/**
 * GET /api/sender-wish/:pageId
 * Returns the sender's special wish (is_sender = true). Fetched lazily on unlock.
 */
router.get('/:pageId', async (req, res) => {
    try {
        const wish = await Wish.findOne({
            page_id: req.params.pageId,
            is_sender: true,
        }).lean();

        if (!wish) {
            return res.status(404).json({ error: 'Sender wish not found' });
        }

        res.json(wish);
    } catch (err) {
        console.error('[GET /sender-wish/:pageId]', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
