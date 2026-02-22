import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFoundPage.css';

export default function NotFoundPage() {
    return (
        <main className="nf-page" id="not-found-page">
            <motion.div
                className="nf-content"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="nf-emoji">📭</div>
                <h1 className="nf-title">This page doesn't exist... yet!</h1>
                <p className="nf-desc">
                    The birthday link you followed is either invalid or no longer active.
                    Ask the sender to double-check the link! 💌
                </p>
                <Link to="/" className="nf-link" id="nf-home-link">
                    Go back home →
                </Link>
            </motion.div>
        </main>
    );
}
