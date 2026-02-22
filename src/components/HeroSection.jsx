import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HeroSection.css';

const FLOATING_EMOJIS = ['🎈', '🎉', '⭐', '✨', '🎊', '🎁', '💖', '🌟', '🎀', '🍰', '💫', '🥳'];

function FloatingEmoji({ emoji, style }) {
    return (
        <span className="floating-emoji" style={style} aria-hidden="true">
            {emoji}
        </span>
    );
}

export default function HeroSection({ receiverName, senderName }) {
    const floaters = Array.from({ length: 18 }, (_, i) => ({
        emoji: FLOATING_EMOJIS[i % FLOATING_EMOJIS.length],
        style: {
            left: `${5 + (i * 5.2) % 90}%`,
            animationDelay: `${(i * 0.4) % 6}s`,
            animationDuration: `${6 + (i * 0.7) % 6}s`,
            fontSize: `${1.1 + (i * 0.15) % 1.5}rem`,
        },
    }));

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <section className="hero-section" aria-label="Birthday hero">
            {/* Floating background emojis */}
            <div className="emoji-field" aria-hidden="true">
                {floaters.map((f, i) => (
                    <FloatingEmoji key={i} emoji={f.emoji} style={f.style} />
                ))}
            </div>

            {/* Hero content */}
            <motion.div
                className="hero-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.p className="hero-subtitle-top" variants={itemVariants}>
                    🎂 Happy Birthday
                </motion.p>

                <motion.h1 className="hero-name" variants={itemVariants}>
                    {receiverName || 'You'}
                    <span className="hero-name-underline" aria-hidden="true" />
                </motion.h1>

                <motion.p className="hero-subtitle" variants={itemVariants}>
                    A surprise from <span className="hero-sender">{senderName || 'Someone Special'}</span> 💌
                </motion.p>

                <motion.p className="hero-hint" variants={itemVariants}>
                    Open every envelope below to unlock a very special message 🎁
                </motion.p>
            </motion.div>
        </section>
    );
}
