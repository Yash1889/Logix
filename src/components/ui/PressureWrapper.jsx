import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Timer } from 'lucide-react';
import './PressureWrapper.css';

export default function PressureWrapper({
    isActive,
    duration = 60,
    onTimeout,
    children
}) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (!isActive) return;

        if (timeLeft <= 0) {
            onTimeout?.();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, timeLeft, onTimeout]);

    return (
        <div className={`pressure-wrapper ${isActive ? 'active' : ''}`}>
            {isActive && (
                <div className="pressure-hud">
                    <motion.div
                        className={`pressure-timer ${timeLeft <= 10 ? 'critical' : ''}`}
                        animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                    >
                        <Timer size={20} />
                        <span>{timeLeft}s</span>
                    </motion.div>

                    <div className="pressure-status">
                        <AlertTriangle size={20} className="blink" />
                        <span>HIGH PRESSURE MODE</span>
                    </div>
                </div>
            )}

            <div className="pressure-content">
                {children}
            </div>

            {isActive && <div className="pressure-vignette" />}
        </div>
    );
}
