# Human Benchmark V3 - Elite Cognitive System

A professional-grade cognitive assessment platform capable of generating a "Cognitive Personality Map" through advanced psychological testing.

![UI Preview](public/preview.png)

## 🚀 Key Features

### 🧠 Core Assessment Domains
Includes 15+ Tests across 6 cognitive pillars:
- **Executive Function**: Task Switching, Risk Decision, Tower Planning.
- **Memory**: Visual, Number, Sequence, Verbal, Chimp Test.
- **Reaction & Speed**: Reaction Time, Aim Trainer, Stroop Test, Typing.
- **Intelligence**: Pattern Recognition, Logic, Mental Math.
- **Attention**: Sustained Attention, Go/No-Go, N-Back.
- **Social & EQ**: Theory of Mind, Emotion Recognition, Bias Benchmarks.

### 💎 "Ops Center" Design System
- **High-Visibility**: Deep Black background with Pure White typography.
- **Neon Accents**: Cyan/Violet indicators for rapid signal processing.
- **Wide-Screen Dashboard**: Full-width data visualization.

### 🧬 The Profile Engine
- **Cognitive Map**: A dynamic Radar Chart visualizes your strengths across Memory, Speed, Flexibility, Reasoning, and EQ.
- **Archetype Generation**: The system analyzes your trait balance to assign a personality archetype (e.g., "Analytic Strategist").
- **Hybrid Sync**: Scores save locally instantly, then sync to Supabase Cloud when online.

## 🛠️ Tech Stack
- **Frontend**: React 18 + Vite
- **Profiling**: Recharts (Radar/Spider Graphs)
- **State**: React Hooks + Supabase Auth
- **Style**: Variable-based High Contrast CSS System

## 🚀 Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create `.env` with:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Distribution**:
    Build for production:
    ```bash
    npm run build
    ```

## 🛡️ License
MIT
