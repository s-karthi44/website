import { createContext, useContext, useReducer, useEffect } from 'react';

// ── Initial State ─────────────────────────────────────────────
const initialState = {
    page: null,           // birthday_pages row
    wishes: [],           // friend wishes (is_sender=false)
    senderWish: null,     // sender wish (is_sender=true), fetched on unlock
    sessionKey: null,
    openedWishIds: [],
    allOpened: false,
    filter: 'all',
    tasksCompleted: {
        openedFirst: false,
        foundFunny: false,
        foundMystery: false,
        openedAll: false,
    },
    unlockPhase: 'locked', // 'locked' | 'animating' | 'unlocked'
    senderModalOpen: false,
    loading: true,
    error: null,
};

// ── Reducer ───────────────────────────────────────────────────
function reducer(state, action) {
    switch (action.type) {
        case 'SET_PAGE':
            return { ...state, page: action.payload, loading: false };
        case 'SET_WISHES':
            return { ...state, wishes: action.payload };
        case 'SET_SESSION':
            return { ...state, ...action.payload };
        case 'OPEN_WISH': {
            const id = action.payload;
            if (state.openedWishIds.includes(id)) return state;
            const openedWishIds = [...state.openedWishIds, id];

            // Check tasks (MongoDB uses _id)
            const tasksCompleted = { ...state.tasksCompleted };
            if (openedWishIds.length === 1) tasksCompleted.openedFirst = true;
            const openedWish = state.wishes.find(w => (w._id || w.id) === id);
            if (openedWish?.tag === 'funny') tasksCompleted.foundFunny = true;
            if (openedWish?.is_mystery) tasksCompleted.foundMystery = true;

            const allOpened = state.wishes.length > 0 &&
                state.wishes.every(w => openedWishIds.includes(w._id || w.id));

            if (allOpened) {
                tasksCompleted.openedFirst = true;
                tasksCompleted.openedAll = true;
            }

            return {
                ...state,
                openedWishIds,
                allOpened,
                tasksCompleted,
                unlockPhase: state.unlockPhase === 'locked' && allOpened
                    ? 'animating'
                    : state.unlockPhase,
            };
        }
        case 'SET_UNLOCK_PHASE':
            return { ...state, unlockPhase: action.payload };
        case 'SET_SENDER_WISH':
            return { ...state, senderWish: action.payload };
        case 'OPEN_SENDER_MODAL':
            return { ...state, senderModalOpen: true };
        case 'CLOSE_SENDER_MODAL':
            return { ...state, senderModalOpen: false };
        case 'SET_FILTER':
            return { ...state, filter: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
}

// ── Context ───────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppState() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useAppState must be used inside AppProvider');
    return ctx;
}
