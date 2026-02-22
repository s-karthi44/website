import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../context/AppContext';
import './TaskPanel.css';

const TASKS = [
    {
        id: 'openedFirst',
        emoji: '🎁',
        label: 'Open your first wish',
        hint: 'Click any envelope above',
    },
    {
        id: 'foundFunny',
        emoji: '😂',
        label: 'Find a funny wish',
        hint: 'Look for the 😂 Funny tag',
    },
    {
        id: 'foundMystery',
        emoji: '🔍',
        label: 'Solve the mystery',
        hint: 'Find the ??? envelope',
    },
    {
        id: 'openedAll',
        emoji: '🎉',
        label: 'Open ALL wishes',
        hint: 'Unlocks the special message!',
    },
];

export default function TaskPanel() {
    const { state } = useAppState();
    const { tasksCompleted } = state;
    // Collapse by default on mobile so it doesn't cover the envelope grid
    const [collapsed, setCollapsed] = useState(() => window.innerWidth < 640);

    const completedCount = Object.values(tasksCompleted).filter(Boolean).length;
    const allDone = completedCount === 4;

    return (
        <aside className={`task-panel ${collapsed ? 'collapsed' : ''} ${allDone ? 'all-done' : ''}`} aria-label="Birthday tasks">
            {/* Toggle button */}
            <button
                id="task-panel-toggle"
                className="task-toggle"
                onClick={() => setCollapsed(v => !v)}
                aria-expanded={!collapsed}
                aria-controls="task-panel-list"
            >
                <span className="task-toggle-icon">{allDone ? '🎊' : '📋'}</span>
                <span className="task-toggle-label">
                    Tasks {completedCount}/{TASKS.length}
                </span>
                <span className="task-toggle-chevron" aria-hidden="true">
                    {collapsed ? '▲' : '▼'}
                </span>
            </button>

            {/* Task list */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.ul
                        id="task-panel-list"
                        className="task-list"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        {TASKS.map(task => {
                            const done = tasksCompleted[task.id];
                            return (
                                <motion.li
                                    key={task.id}
                                    className={`task-item ${done ? 'done' : ''}`}
                                    layout
                                >
                                    <span className="task-emoji" aria-hidden="true">{task.emoji}</span>
                                    <div className="task-text">
                                        <span className="task-label">{task.label}</span>
                                        {!done && <span className="task-hint">{task.hint}</span>}
                                    </div>
                                    <AnimatePresence>
                                        {done && (
                                            <motion.span
                                                className="task-check"
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                                                aria-label="Completed"
                                            >
                                                ✅
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </aside>
    );
}
