import { motion } from 'framer-motion';
import './GlassButton.css';

export default function GlassButton({ children, variant = 'primary', size = 'medium', className = '', ...props }) {
    return (
        <motion.button
            className={`glass-btn ${variant} ${size} ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            {...props}
        >
            {children}
            {variant === 'primary' && <div className="btn-glow" />}
        </motion.button>
    );
}
