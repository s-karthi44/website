import express from 'express';
import Wish from '../models/Wish.js';

const router = express.Router();

/**
 * GET /api/wishes/:pageId
 * Returns all friend wishes for a page (is_sender = false), ordered by display_order.
 */
router.get('/:pageId', async (req, res) => {
    try {
        const wishes = await Wish.find({
            page_id: req.params.pageId,
            is_sender: false,
        })
            .sort({ display_order: 1 })
            .lean();

        res.json(wishes);
    } catch (err) {
        console.error('[GET /wishes/:pageId]', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
