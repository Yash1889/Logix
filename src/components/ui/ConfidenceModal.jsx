import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';
import './ConfidenceModal.css';

export default function ConfidenceModal({ isOpen, onConfirm }) {
    const [value, setValue] = useState(50);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="conf-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <GlassCard className="conf-modal">
                    <h2>Confidence Check</h2>
                    <p>How confident are you in your answer?</p>

                    <div className="conf-slider-container">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={value}
                            onChange={(e) => setValue(parseInt(e.target.value))}
                            className="conf-slider"
                        />
                        <div className="conf-value">{value}%</div>
                        <div className="conf-labels">
                            <span>Guessing</span>
                            <span>Certain</span>
                        </div>
                    </div>

                    <GlassButton onClick={() => onConfirm(value)} size="large" className="conf-btn">
                        Confirm
                    </GlassButton>
                </GlassCard>
            </motion.div>
        </AnimatePresence>
    );
}
