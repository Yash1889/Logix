import { useState, useEffect } from 'react';
import GameWrapper from '../components/GameWrapper';
import { useGameScore } from '../hooks/useGameScore';
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
    "School", "Teacher", "Student", "Book", "Pen", "Class", "Lesson", "Test",
    "Exam", "Grade", "Mark", "Score", "Result", "Pass", "Fail", "Win", "Lose",
    "Draw", "Tie", "Break"
];

export default function VerbalMemory() {
    const { bestScore, sessionBest, saveScore } = useGameScore('verbal-memory');
    const [gameState, setGameState] = useState('waiting'); // waiting, playing, result
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [currentWord, setCurrentWord] = useState('');
    const [seenWords, setSeenWords] = useState(new Set());

    // Game logic state
    const [roundWords, setRoundWords] = useState([]); // Words shown so far in order? Not needed really.
    // We need to decide whether to show a NEW word or a SEEN word.
    // Probability changes? Start 50/50?

    const nextWord = () => {
        // Decision: Show a SEEN word or a NEW word?
        // If seenWords is empty, must show NEW.
        // If we have seen words, we can pick one.

        const showSeen = seenWords.size > 0 && Math.random() < 0.4; // 40% chance of seen word

        if (showSeen) {
            // Pick a random word from seenWords
            const seenArray = Array.from(seenWords);
            const randomSeen = seenArray[Math.floor(Math.random() * seenArray.length)];
            setCurrentWord(randomSeen);
        } else {
            // Pick a new word that isn't in seenWords
            let newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
            while (seenWords.has(newWord)) {
                // Simple collision resolution, better implementation would have a pool of unused words
                newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
                // If we run out of words (unlikely with this list size vs typical human memory), we'd need more logic
                if (seenWords.size >= WORDS.length) break; // Fallback
            }
            setCurrentWord(newWord);
        }
    };

    const handleChoice = (choice) => {
        // choice: 'seen' | 'new'
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
                saveScore(score);
                setGameState('result');
            } else {
                // If wrong on "NEW" (i.e. it was SEEN but user said NEW), we don't add.
                // If wrong on "SEEN" (i.e. it was NEW but user said SEEN), we add it effectively? 
                // Logic: regardless of user error, the word has now been "shown" to the user.
                setSeenWords(prev => new Set(prev).add(currentWord));
                nextWord();
            }
        }
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
            description="You will be shown words, one at a time. If you've seen a word during the test, click SEEN. If it's a new word, click NEW."
            onRestart={startGame}
            score={`Score: ${score}`}
            bestScore={bestScore ? `${bestScore}` : null}
            sessionBest={sessionBest ? `${sessionBest}` : null}
        >
            <div className="verbal-memory-container">
                {gameState === 'waiting' && (
                    <div className="vm-start-screen">
                        <button className="vm-btn primary large" onClick={startGame}>Start Game</button>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="vm-play-area">
                        <div className="vm-stats">Lives: {'❤️'.repeat(lives)}</div>
                        <h1 className="vm-word">{currentWord}</h1>
                        <div className="vm-actions">
                            <button className="vm-btn answer seen" onClick={() => handleChoice('seen')}>SEEN</button>
                            <button className="vm-btn answer new" onClick={() => handleChoice('new')}>NEW</button>
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="vm-result-screen">
                        <h1>{score} words</h1>
                        <p>Verbal Memory Score</p>
                        <button className="vm-btn primary large" onClick={startGame}>Try Again</button>
                    </div>
                )}
            </div>
        </GameWrapper>
    );
}
