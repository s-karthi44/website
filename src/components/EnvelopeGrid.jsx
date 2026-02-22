import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../context/AppContext';
import { useOpenWish } from '../hooks/useBirthdayPage';
import EnvelopeCard from './EnvelopeCard';
import './EnvelopeGrid.css';

export default function EnvelopeGrid() {
    const { state } = useAppState();
    const openWish = useOpenWish();

    const { wishes, openedWishIds, filter } = state;

    const filtered = filter === 'all'
        ? wishes
        : wishes.filter(w => w.tag === filter);

    if (wishes.length === 0) {
        return (
            <div className="envelope-grid-empty">
                <span className="empty-icon">💌</span>
                <p>Wishes are on their way!</p>
                <p className="empty-hint">Check back soon 🎉</p>
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className="envelope-grid-empty">
                <span className="empty-icon">🔍</span>
                <p>No wishes with that mood yet!</p>
            </div>
        );
    }

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: -40, scale: 0.92 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 220, damping: 20 } },
        exit: { opacity: 0, scale: 0.88, transition: { duration: 0.2 } },
    };

    return (
        <div className="envelope-grid-wrapper">
            <AnimatePresence mode="wait">
                <motion.div
                    key={filter}
                    className="envelope-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                    {filtered.map(wish => (
                        <motion.div key={wish._id || wish.id} variants={cardVariants} layout>
                            <EnvelopeCard
                                wish={wish}
                                isOpened={openedWishIds.includes(wish._id || wish.id)}
                                onOpen={openWish}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
