import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../context/AppContext';
import './SenderModal.css';

export default function SenderModal({ senderName }) {
    const { state, dispatch } = useAppState();
    const { senderModalOpen, senderWish } = state;

    const close = useCallback(() => dispatch({ type: 'CLOSE_SENDER_MODAL' }), [dispatch]);

    // Escape key to close
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') close(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [close]);

    // Prevent body scroll when modal open
    useEffect(() => {
        document.body.style.overflow = senderModalOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [senderModalOpen]);

    return (
        <AnimatePresence>
            {senderModalOpen && (
                <motion.div
                    className="sender-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={close}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Special message from the sender"
                >
                    <motion.div
                        className="sender-modal-card"
                        initial={{ scale: 0.85, opacity: 0, y: 40 }}
                        animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 22 } }}
                        exit={{ scale: 0.85, opacity: 0, y: 40 }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            id="sender-modal-close"
                            className="sender-modal-close"
                            onClick={close}
                            aria-label="Close message"
                        >
                            ×
                        </button>

                        {/* Header */}
                        <div className="sender-modal-header">
                            <div className="sender-modal-emoji">
                                {senderWish?.emoji || '💛'}
                            </div>
                            <p className="sender-modal-label">A Special Message</p>
                        </div>

                        {/* Body */}
                        <div className="sender-modal-body">
                            <p className="sender-modal-message">
                                {senderWish?.message || 'Something very special is being written just for you… 💛'}
                            </p>
                            <p className="sender-modal-from">
                                — With all my love, {senderWish?.from_name || senderName || 'Someone Special'} 💌
                            </p>
                        </div>

                        {/* v1.1 placeholder */}
                        <div className="sender-modal-footer">
                            <p>More surprises coming soon… this is just the beginning 🎁</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
