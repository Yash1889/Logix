import { useState } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
import { BookOpen } from 'lucide-react';
import './VerbalMemory.css';

const WORDS = [
    "House", "Tree", "Car", "Apple", "Book", "Computer", "Phone", "Key", "Mouse",
    "Bottle", "Chair", "Table", "Dog", "Cat", "Bird", "Sun", "Moon", "Star",
    "Cloud", "Rain", "Snow", "Wind", "Fire", "Water", "Earth", "Sand", "Rock",
    "Paper", "Pen", "Pencil", "Bag", "Shoe", "Shirt", "Pants", "Hat", "Clock",
    "Watch", "Glass", "Plate", "Fork", "Spoon", "Knife", "Food", "Drink", "Music",
    "Song", "Movie", "Picture", "Camera", "Light", "Door", "Window", "Wall",
    "Floor", "Roof", "Road", "Street", "City", "Town", "Village", "Country",
    "World", "Space", "Planet", "Game", "Toy", "Ball", "Bat", "Team", "Player",
    "School", "Teacher", "Student", "Class", "Lesson", "Test",
    "Exam", "Grade", "Mark", "Score", "Result", "Pass", "Fail", "Win", "Lose",
    "Draw", "Tie", "Break", "Logic", "System", "Data", "Code", "Link", "Node"
];

export default function VerbalMemory() {
    const { bestScore, sessionBest, saveScore } = useGameScore('verbal-memory');
    const [gameState, setGameState] = useState('waiting');
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [currentWord, setCurrentWord] = useState('');
    const [seenWords, setSeenWords] = useState(new Set());

    const nextWord = () => {
        // Decision: Show a SEEN word or a NEW word?
        // Probability: Start low for SEEN, increase as pool grows?
        // Standard: ~40% chance of seen word if available.

        const showSeen = seenWords.size > 0 && Math.random() < 0.4;

        if (showSeen) {
            const seenArray = Array.from(seenWords);
            const randomSeen = seenArray[Math.floor(Math.random() * seenArray.length)];
            setCurrentWord(randomSeen);
        } else {
            let newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
            // Collision avoidance (infinite loop protection irrelevant for small set unless fully exhausted)
            let safety = 0;
            while (seenWords.has(newWord) && safety < 100) {
                newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
                safety++;
            }
            setCurrentWord(newWord);
        }
    };

    const handleChoice = (choice) => {
        const isSeen = seenWords.has(currentWord);
        let correct = false;

        if (choice === 'seen' && isSeen) correct = true;
        if (choice === 'new' && !isSeen) correct = true;

        if (correct) {
            setScore(s => s + 1);
            if (!isSeen) {
                setSeenWords(prev => new Set(prev).add(currentWord));
            }
            nextWord();
        } else {
            const newLives = lives - 1;
            setLives(newLives);
            if (newLives <= 0) {
                endGame();
            } else {
                // If wrong, we treat it as "shown". 
                if (!isSeen) setSeenWords(prev => new Set(prev).add(currentWord));
                nextWord();
            }
        }
    };

    const endGame = () => {
        saveScore(score);
        setGameState('result');
    };

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setLives(3);
        setSeenWords(new Set());
        nextWord();
    };

    return (
        <GameWrapper
            title="Verbal Memory"
            description="Identify recurring terms in the data stream."
            onRestart={startGame}
            score={`Score: ${score} | Lives: ${lives}`}
            bestScore={bestScore ? `${bestScore}` : null}
            sessionBest={sessionBest ? `${sessionBest}` : null}
        >
            <div className="vm-container">
                {gameState === 'waiting' && (
                    <div className="vm-overlay">
                        <BookOpen size={64} className="vm-icon" />
                        <h2>LINGUISTIC RETENTION</h2>
                        <p>Classify incoming string tokens.</p>
                        <button className="vm-btn-start" onClick={startGame}>INITIALIZE STREAM</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="vm-play-area">
                        <div className="vm-word-display">
                            <h1>{currentWord}</h1>
                        </div>
                        <div className="vm-controls">
                            <button className="vm-control-btn seen" onClick={() => handleChoice('seen')}>
                                SEEN
                            </button>
                            <button className="vm-control-btn new" onClick={() => handleChoice('new')}>
                                NEW
                            </button>
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="vm-result-panel">
                        <div className="result-display">
                            <span className="result-val">{score}</span>
                            <span className="result-unit">WORDS</span>
                        </div>
                        <div className="vm-stats-grid">
                            <div className="vm-stat">
                                <span className="label">VOCABULARY SIZE</span>
                                <span className="value">{seenWords.size}</span>
                            </div>
                        </div>
                        <button className="vm-retry-btn" onClick={startGame}>RE-INITIALIZE</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
