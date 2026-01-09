# Logix Auth - Supabase Authentication System

A production-grade Login & Signup system using Supabase with React frontend.

## Features

- ✅ Email + Password Authentication
- ✅ Signup with profile creation
- ✅ Login/Logout functionality
- ✅ Session persistence (user stays logged in on refresh)
- ✅ Protected routes
- ✅ Dashboard showing user information
- ✅ Row Level Security (RLS) policies
- ✅ Clean, extensible architecture for future OAuth integration

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-setup.sql` into the editor
4. Click **Run** to execute the SQL script

This will create:
- `profiles` table with proper schema
- Row Level Security (RLS) policies
- Indexes for performance
- Triggers for automatic timestamp updates

### 3. Configure Supabase Auth Settings

In your Supabase Dashboard:

1. Go to **Authentication** → **URL Configuration**
2. Add your site URL (for development: `http://localhost:5173`)
3. Add redirect URLs if needed (for development: `http://localhost:5173/**`)

**Note:** The Supabase credentials are already configured in `src/lib/supabase.js`. If you need to change them, update that file.

### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
logix/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login page component
│   │   ├── Signup.jsx         # Signup page component
│   │   ├── Dashboard.jsx      # Dashboard page component
│   │   ├── ProtectedRoute.jsx # Route protection wrapper
│   │   ├── Auth.css           # Styles for auth pages
│   │   └── Dashboard.css      # Styles for dashboard
│   ├── contexts/
│   │   └── AuthContext.jsx    # Authentication context & hooks
│   ├── lib/
│   │   └── supabase.js        # Supabase client configuration
│   ├── App.jsx                # Main app component with routing
│   ├── App.css                # Global styles
│   └── main.jsx               # Entry point
├── supabase-setup.sql         # SQL script for database setup
├── package.json
├── vite.config.js
└── README.md
```

## Usage

### Sign Up
1. Navigate to `/signup`
2. Enter email and password (minimum 6 characters)
3. Confirm password
4. Click "Sign Up"
5. Profile will be automatically created in the `profiles` table

### Login
1. Navigate to `/login`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the dashboard

### Dashboard
The dashboard displays:
- User email
- Supabase UID
- Login status
- Profile creation date
- Session details

### Logout
Click the "Logout" button in the dashboard header.

## Security Features

- **Row Level Security (RLS)**: Enabled on the `profiles` table
- **Policies**: Users can only read/write their own profiles
- **Public Anon Key**: Only the public anon key is used (no service_role key)
- **Session Management**: Automatic session handling with persistence

## Future Enhancements

The architecture is designed to easily add:
- Google OAuth authentication
- Password reset functionality
- Email verification
- Additional profile fields
- Multi-factor authentication

## Troubleshooting

### Profile not created after signup
- Check Supabase logs in the Dashboard → Logs
- Verify RLS policies are correctly set up
- Ensure the `profiles` table exists and has the correct schema

### Session not persisting
- Check browser console for errors
- Verify Supabase URL and keys are correct
- Check Supabase Dashboard → Authentication → Settings

### RLS errors
- Ensure RLS is enabled on the `profiles` table
- Verify policies are created correctly
- Check that `auth.uid()` is available in your policies

## Technologies Used

- React 18
- React Router DOM 6
- Supabase JS Client 2
- Vite 5
- CSS3 (no external UI libraries)

