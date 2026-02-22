import { useEffect, useRef } from 'react';
import { useAppState } from '../context/AppContext';

/**
 * Invisible overlay — fires canvas confetti bursts triggered by state events.
 * Uses canvas-confetti (lightweight, no DOM canvas needed).
 */
export default function ConfettiOverlay() {
    const { state } = useAppState();
    const prevOpened = useRef(state.openedWishIds.length);
    const prevAll = useRef(state.allOpened);

    useEffect(() => {
        const loadAndFire = async () => {
            const confetti = (await import('canvas-confetti')).default;

            // First wish opened
            if (state.openedWishIds.length === 1 && prevOpened.current === 0) {
                confetti({ particleCount: 60, spread: 70, origin: { y: 0.65 } });
            }

            // All wishes opened → big fireworks
            if (state.allOpened && !prevAll.current) {
                const end = Date.now() + 3000;
                const interval = setInterval(() => {
                    if (Date.now() > end) { clearInterval(interval); return; }
                    confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
                    confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
                }, 250);
            }

            // Update refs after comparisons
            prevOpened.current = state.openedWishIds.length;
            prevAll.current = state.allOpened;
        };

        loadAndFire();
    }, [state.openedWishIds.length, state.allOpened]);

    return null; // purely behavioral
}
