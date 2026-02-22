import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../context/AppContext';
import { useFetchSenderWish } from '../hooks/useBirthdayPage';
import SenderModal from './SenderModal';
import './SenderEnvelope.css';

export default function SenderEnvelope({ senderName }) {
    const { state, dispatch } = useAppState();
    const fetchSenderWish = useFetchSenderWish();

    const { unlockPhase, allOpened, wishes, openedWishIds } = state;
    const total = wishes.length;
    const opened = openedWishIds.length;

    const [showTip, setShowTip] = useState(false);
    const [ribbonGone, setRibbonGone] = useState(false);
    const [lockGone, setLockGone] = useState(false);
    const [glowActive, setGlowActive] = useState(false);

    // --- Drive the unlock animation sequence ---
    useEffect(() => {
        if (unlockPhase !== 'animating') return;

        let t1, t2, t3, t4;
        setGlowActive(true);

        t1 = setTimeout(() => setRibbonGone(true), 2000);
        t2 = setTimeout(() => setLockGone(true), 3200);
        t3 = setTimeout(() => {
            dispatch({ type: 'SET_UNLOCK_PHASE', payload: 'unlocked' });
            fetchSenderWish();
        }, 4500);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [unlockPhase]);

    const handleClick = () => {
        if (unlockPhase === 'locked' || unlockPhase === 'animating') {
            setShowTip(true);
            setTimeout(() => setShowTip(false), 2200);
            return;
        }
        if (unlockPhase === 'unlocked') {
            dispatch({ type: 'OPEN_SENDER_MODAL' });
        }
    };

    const isLocked = unlockPhase === 'locked';
    const isAnimating = unlockPhase === 'animating';
    const isUnlocked = unlockPhase === 'unlocked';

    return (
        <>
            <section className="sender-section" aria-label="Sender's special envelope">
                <motion.div
                    id="sender-envelope"
                    className={`sender-envelope 
            ${isLocked ? 'locked' : ''} 
            ${isAnimating ? 'animating' : ''} 
            ${isUnlocked ? 'unlocked' : ''}
            ${glowActive ? 'pulse-glow' : ''}
          `}
                    onClick={handleClick}
                    animate={isAnimating ? { x: [0, -8, 8, -6, 6, -3, 0] } : {}}
                    transition={{ duration: 0.5, delay: 4.0 }}
                    whileHover={isUnlocked ? { y: -8, scale: 1.02 } : {}}
                >
                    {/* Ribbon */}
                    {!ribbonGone && (
                        <motion.div
                            className="sender-ribbon"
                            aria-hidden="true"
                            animate={isAnimating ? { scaleX: 0, scaleY: 0, opacity: 0 } : {}}
                            transition={{ duration: 0.6, delay: 2.0 }}
                        >
                            <div className="ribbon-h" />
                            <div className="ribbon-v" />
                        </motion.div>
                    )}

                    {/* Lock icon */}
                    {!lockGone && (
                        <motion.div
                            className="sender-lock"
                            aria-label={isLocked ? 'Locked' : ''}
                            animate={isAnimating ? { rotate: 360, scale: 0, opacity: 0 } : {}}
                            transition={{ duration: 0.7, delay: 3.2 }}
                        >
                            🔒
                        </motion.div>
                    )}

                    {/* Envelope body */}
                    <div className="sender-envelope-body">
                        <div className="sender-wax-seal">💛</div>
                        <h2 className="sender-label">
                            From {senderName || 'Someone Special'} 💛
                        </h2>
                        <p className="sender-sublabel">
                            {isUnlocked
                                ? 'Tap to open your special message 🎉'
                                : isAnimating
                                    ? '✨ Unlocking...'
                                    : 'Open Last 💛'}
                        </p>

                        {isLocked && (
                            <p className="sender-progress">
                                Open all wishes to unlock • {opened} / {total} opened
                            </p>
                        )}
                    </div>

                    {/* Unlock shimmer overlay */}
                    {isUnlocked && (
                        <div className="sender-shimmer" aria-hidden="true" />
                    )}

                    {/* Locked tooltip */}
                    <AnimatePresence>
                        {showTip && (
                            <motion.div
                                className="sender-tooltip"
                                role="tooltip"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                            >
                                Open all your friends' wishes first! 💌
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {isLocked && (
                    <p className="sender-unlock-hint">
                        🔐 Unlock by opening all {total} wishes above
                    </p>
                )}
            </section>

            {/* Full-screen modal */}
            <SenderModal senderName={senderName} />
        </>
    );
}
