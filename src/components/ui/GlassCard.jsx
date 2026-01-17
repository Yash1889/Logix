import { motion } from 'framer-motion';


import './GlassCard.css';

export default function GlassCard({ children, className = '', hoverEffect = false, ...props }) {
    return (
        <motion.div
            className={`glass-card ${hoverEffect ? 'hover-effect' : ''} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
