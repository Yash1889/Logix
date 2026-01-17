// Utility functions for analyzing scores and generating profiles

export const calculatePercentile = (score, gameId, lowerIsBetter = false) => {
    // Mock percentiles for now. In a real app, this would query global stats.
    // We'll use a standard normal distribution approximation or static tiers.

    // Quick hack: Generate a believable percentile based on the score value range expected for each game.
    // This is just for MVP feel.

    // Example baselines (avg, stdDev)
    const baselines = {
        'reaction': { avg: 300, std: 50, lowerBetter: true },
        'sequence': { avg: 8, std: 2, lowerBetter: false },
        'aim': { avg: 500, std: 100, lowerBetter: true },
        'number-memory': { avg: 7, std: 2, lowerBetter: false },
        'verbal-memory': { avg: 30, std: 10, lowerBetter: false },
        'visual-memory': { avg: 9, std: 2, lowerBetter: false },
        'typing': { avg: 40, std: 15, lowerBetter: false },
        // New games defaults
        'stroop': { avg: 200, std: 50, lowerBetter: true }, // ms delay
        'chimpanzee': { avg: 9, std: 3, lowerBetter: false },
        'sustained-attention': { avg: 90, std: 10, lowerBetter: false }, // %
        'go-no-go': { avg: 500, std: 50, lowerBetter: true }, // ms
        'n-back': { avg: 2, std: 1, lowerBetter: false }, // n-level
        'mental-math': { avg: 20, std: 5, lowerBetter: false }, // ops/min
        'pattern-recognition': { avg: 5, std: 2, lowerBetter: false },
        'logic': { avg: 5, std: 2, lowerBetter: false },
        'delay-gratification': { avg: 30, std: 15, lowerBetter: false }, // seconds waited
        'emotion-recognition': { avg: 80, std: 10, lowerBetter: false }, // %
    };

    const base = baselines[gameId];
    if (!base) return 50;

    const z = (score - base.avg) / base.std;

    // Convert Z-score to percentile
    // This is an approximation
    let p = 0.5 * (1 + Math.erf(z / Math.sqrt(2)));

    if (base.lowerBetter) {
        p = 1 - p; // Invert for lower-is-better
    }

    return Math.round(p * 100);
};

// Error function approximation
Math.erf = Math.erf || function (x) {
    var m = 1.00;
    var s = 1.00;
    var sum = x * 1.0;
    for (var i = 1; i < 50; i++) {
        m *= i;
        s *= -1;
        sum += (s * Math.pow(x, 2 * i + 1)) / (m * (2 * i + 1));
    }
    return 2 / Math.sqrt(Math.PI) * sum;
};

export const getPsychologicalProfile = (scores) => {
    // scores is an object: { reaction: 250, memory: 10 ... }
    // Returns simple traits string

    const traits = [];

    // Example logic
    if (scores.reaction && scores.reaction < 200) traits.push("Lightning Fast Reflexes");
    if (scores['verbal-memory'] && scores['verbal-memory'] > 50) traits.push("Walking Encyclopedia");
    if (scores['go-no-go'] && scores['go-no-go'] < 400) traits.push("Highly Disciplined Impulse Control");

    return traits;
};
