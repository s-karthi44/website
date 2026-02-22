import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBirthdayPage } from '../hooks/useBirthdayPage';
import HeroSection from '../components/HeroSection';
import ProgressBar from '../components/ProgressBar';
import FilterBar from '../components/FilterBar';
import EnvelopeGrid from '../components/EnvelopeGrid';
import SenderEnvelope from '../components/SenderEnvelope';
import TaskPanel from '../components/TaskPanel';
import ConfettiOverlay from '../components/ConfettiOverlay';
import './BirthdayPage.css';

export default function BirthdayPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { state } = useBirthdayPage(slug);

    // Redirect if page not found
    useEffect(() => {
        if (state.error === 'not_found') navigate('/not-found', { replace: true });
    }, [state.error, navigate]);

    if (state.loading) {
        return (
            <div className="bd-loading" aria-live="polite">
                <div className="bd-loading-spinner" aria-hidden="true" />
                <p>Loading your birthday surprise… 🎂</p>
            </div>
        );
    }

    if (state.error && state.error !== 'not_found') {
        return (
            <div className="bd-error">
                <p>😔 Something went wrong. Please try refreshing!</p>
                <p className="bd-error-detail">{state.error}</p>
            </div>
        );
    }

    const page = state.page;

    return (
        <main className="bd-page" id="birthday-page">
            <HeroSection
                receiverName={page?.receiver_name}
                senderName={page?.sender_name}
            />

            <ProgressBar senderName={page?.sender_name} />
            <FilterBar />
            <EnvelopeGrid />

            <div className="bd-divider" aria-hidden="true">
                <span>⭐ The Special One ⭐</span>
            </div>

            <SenderEnvelope senderName={page?.sender_name} />

            <TaskPanel />
            <ConfettiOverlay />

            <footer className="bd-footer">
                <p>Made with 💛 · <span>BirthdayDrop</span> v1.0</p>
            </footer>
        </main>
    );
}
