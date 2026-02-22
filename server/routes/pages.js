import express from 'express';
import BirthdayPage from '../models/BirthdayPage.js';

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

export default router;
