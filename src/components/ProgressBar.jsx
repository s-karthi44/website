import { motion } from 'framer-motion';
import { useAppState } from '../context/AppContext';
import './ProgressBar.css';

export default function ProgressBar({ senderName }) {
    const { state } = useAppState();
    const total = state.wishes.length;
    const opened = state.openedWishIds.length;
    const pct = total > 0 ? Math.round((opened / total) * 100) : 0;
    const allDone = state.allOpened;

    return (
        <div className={`progress-bar-wrapper ${allDone ? 'all-done' : ''}`} role="status" aria-live="polite">
            <div className="progress-bar-inner">
                <p className="progress-label">
                    {allDone
                        ? `🎉 Unlock ${senderName || 'the Sender'}'s message now!`
                        : `💌 You've opened ${opened} of ${total} wishes — ${senderName || 'the Sender'}'s message is waiting!`
                    }
                </p>
                <div className="progress-track" aria-hidden="true">
                    <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                    {allDone && (
                        <motion.div
                            className="progress-sparkles"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {['✨', '⭐', '✨'].map((s, i) => (
                                <span key={i} style={{ animationDelay: `${i * 0.3}s` }}>{s}</span>
                            ))}
                        </motion.div>
                    )}
                </div>
                <p className="progress-count">{pct}%</p>
            </div>
        </div>
    );
}
