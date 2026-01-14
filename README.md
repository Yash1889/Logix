# Human Benchmark Platform

A premium, production-grade cognitive testing platform built with React and Supabase. This application allows users to test their reaction time, memory, and aiming skills, featuring a seamless hybrid score synchronization system.

## 🎮 Features

### 🧠 Cognitive Tests
Includes 7 fully implemented games:
- **Reaction Time**: Measure your visual reflexes down to the millisecond.
- **Visual Memory**: Memorize increasingly complex patterns of tiles.
- **Number Memory**: Remember long strings of digits.
- **Verbal Memory**: Distinguish between seen and new words.
- **Aim Trainer**: Test your mouse speed and accuracy.
- **Typing Test**: Calculate words per minute (WPM) and accuracy.
- **Sequence Memory**: Memorize a flashing sequence of buttons.

### 💎 Premium Experience
- **Modern UI**: Sleek dark theme with `framer-motion` animations.
- **Zero Friction**: Start playing immediately without logging in.
- **Responsive**: Fully optimized for desktop and mobile play.

### 🔐 Advanced Architecture & Auth
- **Hybrid Score Sync**: Scores are instantly saved to `localStorage` for offline/guest access. When you log in, your scores are **automatically synchronized to the Supabase Cloud Database**.
- **Supabase Authentication**: Secure Email & Google OAuth integration.
- **Row Level Security (RLS)**: Database policies ensure users can strictly own and manage their data.

## 🛠️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Modern Vanilla CSS Variables (Dark Theme)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Backend/DB**: Supabase (Auth + PostgreSQL)

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS)
- A Supabase Project

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Yash1889/Logix.git
    cd Logix
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env` file and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```

4.  **Database Setup (Important!)**:
    Run the SQL scripts in your Supabase SQL Editor to set up the schema and RLS policies:
    - Run `supabase-setup.sql` (Profiles & Triggers)
    - Run `supabase-setup-scores.sql` (Game Scores & Policies)

5.  Start the development server:
    ```bash
    npm run dev
    ```

## 🛡️ Security

This project uses Supabase Row Level Security (RLS) to ensure data integrity.
- **Profiles**: Users can only read/update their own profile.
- **Scores**: Users can only insert scores linked to their own UUID and view their own history.
