import { useAppState } from '../context/AppContext';
import './FilterBar.css';

const FILTERS = [
    { value: 'all', label: 'All', emoji: '💌' },
    { value: 'heartfelt', label: 'Heartfelt', emoji: '❤️' },
    { value: 'funny', label: 'Funny', emoji: '😂' },
    { value: 'inspirational', label: 'Inspirational', emoji: '✨' },
    { value: 'sweet', label: 'Sweet', emoji: '🍬' },
];

export default function FilterBar() {
    const { state, dispatch } = useAppState();
    const active = state.filter;

    return (
        <nav className="filter-bar" aria-label="Filter wishes by mood">
            <div className="filter-scroll">
                {FILTERS.map(f => (
                    <button
                        key={f.value}
                        id={`filter-${f.value}`}
                        className={`filter-pill ${f.value} ${active === f.value ? 'active' : ''}`}
                        onClick={() => dispatch({ type: 'SET_FILTER', payload: f.value })}
                        aria-pressed={active === f.value}
                    >
                        <span className="filter-emoji" aria-hidden="true">{f.emoji}</span>
                        {f.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}
