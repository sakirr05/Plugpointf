# Firebase Authentication Setup Guide

This application now uses Firebase Authentication for user sign-up, login, and Google authentication.

## Setup Instructions

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

### 2. Enable Authentication Methods

1. In the Firebase Console, go to **Build** → **Authentication**
2. Click on the **Sign-in method** tab
3. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and add your project support email

### 3. Register Your Web App

1. In the Firebase Console, go to **Project settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "PlugPoint Web")
5. Copy the Firebase configuration object

### 4. Configure Environment Variables

1. Copy the `.env.example` file to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace the placeholder values with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

### 5. Configure Authorized Domains (for production)

1. In Firebase Console, go to **Authentication** → **Settings** → **Authorized domains**
2. Add your production domain (e.g., `yourdomain.com`)
3. `localhost` is already authorized by default for development

### 6. Run the Application

```bash
pnpm install
pnpm run build
```

## Features

- ✅ Email/Password sign-up and login
- ✅ Google OAuth sign-in
- ✅ User session persistence
- ✅ Secure authentication with Firebase
- ✅ Error handling with user-friendly messages
- ⚠️ Apple sign-in (UI present but not functional - requires additional setup)

## Testing

### Test Email/Password Authentication
1. Navigate to `/auth`
2. Click "Create Account"
3. Enter your name, email, and password (minimum 6 characters)
4. Click "Create Account"

### Test Google Authentication
1. Navigate to `/auth`
2. Click "Continue with Google"
3. Select your Google account
4. Authorize the application

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Keep your Firebase API keys secure
- Firebase API keys are safe to use in client-side code as they're protected by Firebase Security Rules and authorized domains

## Troubleshooting

### "Firebase: Error (auth/popup-closed-by-user)"
- This happens when the user closes the Google sign-in popup before completing authentication
- Simply try again

### "Firebase: Error (auth/unauthorized-domain)"
- Make sure your domain is added to Firebase Console → Authentication → Settings → Authorized domains

### "Firebase: Error (auth/invalid-api-key)"
- Check that your API key in `.env` is correct
- Restart your development server after changing `.env` variables

## Need Help?

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firebase JavaScript SDK Reference](https://firebase.google.com/docs/reference/js/auth)
