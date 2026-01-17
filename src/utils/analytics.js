// Utility to process raw scores into cognitive traits.

export const processProfile = (scores) => {
    // scores is array of { game_id, score, meta }

    const traitScores = {
        memory: 0,
        attention: 0,
        speed: 0,
        flexibility: 0,
        reasoning: 0,
        eq: 0
    };

    // Helper to get max score for a game
    const getBest = (gid) => {
        const gameScores = scores.filter(s => s.game_id === gid);
        if (gameScores.length === 0) return 0;
        // Logic depends on game.
        // Usually 'score' is the value.
        return Math.max(...gameScores.map(s => s.score));
    };

    const getAvg = (gid) => {
        const gameScores = scores.filter(s => s.game_id === gid);
        if (!gameScores.length) return 0;
        return gameScores.reduce((a, b) => a + b.score, 0) / gameScores.length;
    };

    // 1. MEMORY
    // Visual (Levels), Number (Digits), Sequence (Steps), Chimp (Levels)
    // Normalize: Level 10 is good. Level 20 is godlike.
    const vis = getBest('visual-memory'); // typ max ~15
    const num = getBest('number-memory'); // typ max ~12
    const seq = getBest('sequence-memory'); // typ max ~15
    const chimp = getBest('chimpanzee'); // typ max ~12

    traitScores.memory = ((vis / 15 + num / 12 + seq / 15 + chimp / 12) / 4) * 100;

    // 2. ATTENTION / IMPULSE
    // Sustained (Hits), Go/No-Go (RT?), Time Est (Error - lower better)
    // Needed: Go/No-Go accuracy? 
    // Let's use simple normalized sums for MVP.
    const sus = getBest('sustained-attention'); // Max is usually duration based, so score varies.
    // Let's rely on stored meta if available, but for now use raw score assuming it correlates.
    traitScores.attention = Math.min(100, (sus / 50) * 100);

    // 3. SPEED
    // Reaction (ms, lower better), Aim (ms/target, lower better), Stroop (ms)?
    // Problem: Reaction Time score stored is ms? Yes.
    // Invert: 200ms = 100, 500ms = 0.
    const rtx = getBest('reaction-time'); // Actually stored as ms?
    // Wait, ReactionTime.jsx saves 'avg'. 
    // If user hasn't played, rtx is 0.
    let speedScore = 0;
    if (rtx > 0) {
        // 150ms = 100pts, 500ms = 0pts
        speedScore = Math.max(0, 100 - ((rtx - 150) / 3.5));
    }
    traitScores.speed = speedScore;

    // 4. FLEXIBILITY / EXEC FUNCTION
    // Task Switching (Cost), Tower (Score?), Risk (Score)
    const tower = getBest('tower-planning'); // ?
    const risk = getBest('risk-decision'); // ?
    traitScores.flexibility = Math.min(100, ((tower + risk / 2000) / 2) * 50); // Rough scaling

    // 5. REASONING
    // Logic, Math, Pattern
    const logic = getBest('logic-test');
    const math = getBest('mental-math');
    traitScores.reasoning = Math.min(100, (logic + math) * 2);

    // 6. EQ / SOCIAL
    // Emotion Rec, Theory of Mind, Bias (lower bias -> higher score?)
    const emotion = getBest('emotion-recognition');
    const tom = getBest('theory-of-mind');
    // Bias saved as % susceptibility. So resistance = 100 - bias.
    const bias = getBest('bias-benchmarks');

    traitScores.eq = ((emotion / 20 + tom / 2 + (100 - bias) / 100) / 3) * 100;

    // Sanitize
    Object.keys(traitScores).forEach(k => {
        if (isNaN(traitScores[k])) traitScores[k] = 0;
        traitScores[k] = Math.max(0, Math.min(100, Math.round(traitScores[k])));
    });

    return traitScores;
};

export const generateInsights = (stats) => {
    if (!stats) return "Complete more tests to generate an insight profile.";

    // Find highest trait
    const entries = Object.entries(stats);
    entries.sort((a, b) => b[1] - a[1]);

    const topTrait = entries[0];
    const secondTrait = entries[1];

    // Archetypes
    if (topTrait[0] === 'reasoning' && secondTrait[0] === 'speed') return "Archetype: rapid_processor. You excel at quick logical deductions.";
    if (topTrait[0] === 'eq' && secondTrait[0] === 'flexibility') return "Archetype: social_strategist. High emotional awareness combined with adaptability.";
    if (topTrait[0] === 'memory' && secondTrait[0] === 'attention') return "Archetype: deep_focus. Exceptional capacity for retaining information and sustained concentration.";
    if (topTrait[0] === 'flexibility' && secondTrait[0] === 'reasoning') return "Archetype: grandmaster. Strong planning and adaptability skills.";
    if (topTrait[0] === 'speed' && secondTrait[0] === 'attention') return "Archetype: sharpshooter. Fast reflexes with high precision.";

    // Fallback
    return `Your strongest domain is ${topTrait[0].toUpperCase()} (${topTrait[1]}%), indicating a natural aptitude for this area.`;
};
