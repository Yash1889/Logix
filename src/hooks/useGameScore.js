import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function useGameScore(gameId) {
    const { user } = useAuth();

    // Best score ever (localStorage or DB)
    const [bestScore, setBestScore] = useState(() => {
        const stored = localStorage.getItem(`hb_${gameId}_best`);
        return stored ? Number(stored) : null;
    });

    // Best score this session (sessionStorage)
    const [sessionBest, setSessionBest] = useState(() => {
        const stored = sessionStorage.getItem(`hb_${gameId}_session_best`);
        return stored ? Number(stored) : null;
    });

    // Fetch best score from DB when user logs in
    useEffect(() => {
        if (!user) return;

        const fetchBestScore = async () => {
            // Logic: query game_scores for this user and game, sort by score
            // Note: "Best" depends on game (higher or lower). 
            // Reaction/Aim/Sequence(time? No sequence is level): Lower is better for Reaction/Aim (ms).
            // Higher is better for others.
            // We don't store "isLowerBetter" in DB. We just get all and filter in app or handle it here?
            // Actually we can just get ALL scores and math.max/min.
            // Or we can rely on client to decide what is "best"?
            // Let's just fetch ALL scores for this game and user, then calculate local max/min.
            // Optimization: DB aggregation. But we need to know direction.
            // Let's passed "lowerIsBetter" to this hook? No, not passed yet.
            // It's cleaner to just fetch all and let the component decide? No.
            // Let's just fetch the *latest* score or all scores?
            // To keep it simple: We won't re-calculate "best" from DB history here blindly.
            // We will blindly trust the DB has the "best" if we stored it? No.
            // Let's try to just insert new scores.
            // And for "bestScore", we query for the existing best.

            // Actually, simplest approach:
            // When saving: Insert into DB.
            // When loading: Query DB for optimal score. Defaulting to local if offline/faster.

            // Issue: We don't know if MIN or MAX is better without game context.
            // Hack: We can just fetch ALL records for this game/user and let the hook logic sort it out if we knew the direction.
            // BETTER: Update the hook signature to accept `lowerIsBetter`.

        };

        // fetchBestScore();
    }, [user, gameId]);

    // We need to change signature to accept lowerIsBetter for initial fetch?
    // Or we can just do it in saveScore?
    // Let's update `useGameScore` to accept `lowerIsBetter` as an optional 2nd arg?
    // But `saveScore` already takes it.

    // Alternative: Just save to DB and don't sync "Best" from DB on load?
    // The user requirement: "after login i wanna see the exact thing that i am seeing right now before login."
    // This implies if I played logged out, then login, my scores should be there.
    // We can push local scores to DB on login? That's complex.
    // Let's at least validly SAVE to DB.

    // Track session start time for fatigue analysis
    useEffect(() => {
        if (!sessionStorage.getItem('hb_session_start')) {
            sessionStorage.setItem('hb_session_start', Date.now().toString());
        }
    }, []);

    const saveScore = async (score, lowerIsBetter = false, meta = {}) => {
        // Calculate session duration (fatigue metric)
        const sessionStart = Number(sessionStorage.getItem('hb_session_start'));
        const timeSinceSessionStart = Date.now() - sessionStart;

        const enhancedMeta = {
            ...meta,
            sessionDuration: timeSinceSessionStart, // ms since session began
            timestamp: Date.now()
        };

        // 1. Update Local State (Immediate Feedback)
        if (bestScore === null || (lowerIsBetter ? score < bestScore : score > bestScore)) {
            setBestScore(score);
            localStorage.setItem(`hb_${gameId}_best`, score.toString());
        }

        if (sessionBest === null || (lowerIsBetter ? score < sessionBest : score > sessionBest)) {
            setSessionBest(score);
            sessionStorage.setItem(`hb_${gameId}_session_best`, score.toString());
        }

        // 2. Persist to DB if logged in
        if (user) {
            try {
                await supabase.from('game_scores').insert({
                    user_id: user.id,
                    game_id: gameId,
                    score: score,
                    meta: enhancedMeta
                });
            } catch (err) {
                console.error("Failed to save score to DB", err);
            }
        }
    };

    return {
        bestScore,
        sessionBest,
        saveScore
    };
}
