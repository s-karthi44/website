import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EnvelopeCard.css';

const TAG_EMOJI = {
    heartfelt: '❤️',
    funny: '😂',
    inspirational: '✨',
    sweet: '🍬',
};

export default function EnvelopeCard({ wish, isOpened, onOpen }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const cardRef = useRef(null);

    const handleClick = () => {
        if (!isOpened) onOpen(wish._id || wish.id);
    };

    const accentColor = wish.color || '#D4A853';

    return (
        <motion.div
            ref={cardRef}
            className={`envelope-card ${isOpened ? 'opened' : ''}`}
            style={{ '--accent': accentColor }}
            onClick={handleClick}
            whileHover={!isOpened ? { y: -6, boxShadow: '0 16px 40px rgba(31,50,100,0.18)' } : {}}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            role="button"
            tabIndex={0}
            aria-label={`Envelope from ${wish.is_mystery && !isOpened ? '???' : wish.from_name}`}
            onKeyDown={e => e.key === 'Enter' && handleClick()}
        >
            {/* ── Envelope Front ─────────────────────── */}
            <AnimatePresence initial={false}>
                {!isOpened && (
                    <motion.div
                        className="envelope-front"
                        key="front"
                        initial={{ opacity: 1, rotateX: 0 }}
                        exit={{ opacity: 0, rotateX: -90, transition: { duration: 0.35, ease: 'easeIn' } }}
                    >
                        {/* Flap */}
                        <div className="envelope-flap" aria-hidden="true">
                            <div className="flap-triangle" />
                        </div>

                        {/* Wax seal */}
                        <div className="wax-seal" aria-hidden="true">{wish.emoji}</div>

                        {/* Sender name */}
                        <p className="envelope-from">
                            {wish.is_mystery ? '???' : wish.from_name}
                        </p>

                        {/* Tag badge */}
                        <span className={`tag-badge tag-${wish.tag}`}>
                            {TAG_EMOJI[wish.tag]} {wish.tag}
                        </span>

                        {/* Open hint */}
                        <p className="envelope-tap-hint">Tap to open 💌</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Wish Card (inside) ─────────────────── */}
            <AnimatePresence initial={false}>
                {isOpened && (
                    <motion.div
                        className="wish-card"
                        key="card"
                        initial={{ opacity: 0, y: 20, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                    >
                        <div className="wish-card-emoji" aria-hidden="true">{wish.emoji}</div>
                        <div className="wish-card-tag">
                            <span className={`tag-badge tag-${wish.tag}`}>
                                {TAG_EMOJI[wish.tag]} {wish.tag}
                            </span>
                        </div>
                        <p className="wish-card-message">{wish.message}</p>
                        <p className="wish-card-from">
                            — {wish.from_name}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
