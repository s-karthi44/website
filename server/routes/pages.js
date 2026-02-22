import express from 'express';
import BirthdayPage from '../models/BirthdayPage.js';
import Wish from '../models/Wish.js';
import PageSession from '../models/PageSession.js';

const router = express.Router();

/**
 * GET /api/pages/:slug
 * Returns a birthday page by slug (must be active).
 */
router.get('/:slug', async (req, res) => {
    try {
        const page = await BirthdayPage.findOne({
            slug: req.params.slug,
            is_active: true,
        }).lean();

        if (!page) {
            return res.status(404).json({ error: 'Page not found' });
        }

        res.json(page);
    } catch (err) {
        console.error('[GET /pages/:slug]', err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/pages/:pageId/wishes
 * Returns all friend wishes for a page (is_sender = false), ordered by display_order.
 */
router.get('/:pageId/wishes', async (req, res) => {
    try {
        const wishes = await Wish.find({
            page_id: req.params.pageId,
            is_sender: false,
        })
            .sort({ display_order: 1 })
            .lean();

        res.json(wishes);
    } catch (err) {
        console.error('[GET /pages/:pageId/wishes]', err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/pages/:pageId/sender-wish
 * Returns the sender's special wish (is_sender = true). Fetched lazily on unlock.
 */
router.get('/:pageId/sender-wish', async (req, res) => {
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
        console.error('[GET /pages/:pageId/sender-wish]', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
