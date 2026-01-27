# Email Setup for Password Reset

This guide explains how to configure email functionality for the forgot password feature.

## Prerequisites

- Gmail account (or any SMTP-compatible email service)
- App Password for Gmail (required for 2FA-enabled accounts)

## Gmail Setup

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Other (Custom name)"
3. Enter "Budget Manager" as the name
4. Click "Generate"
5. Copy the 16-character password (you'll use this in `.env`)

## Environment Variables

Add these to your `backend/.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:3001
```

### For Production

Update `FRONTEND_URL` to your production domain:
```env
FRONTEND_URL=https://yourdomain.com
```

## Testing

1. Start the backend server:
   ```bash
   cd backend
   npm run start:dev
   ```

2. Go to the forgot password page on your frontend
3. Enter your email address
4. Check your email inbox (and spam folder) for the reset link

## Troubleshooting

### Email not sending?

1. **Check SMTP credentials**: Verify your email and app password are correct
2. **Check spam folder**: Emails might be filtered
3. **Verify app password**: Make sure you're using an app password, not your regular password
4. **Check logs**: Look for error messages in the backend console

### Gmail "Less secure app" error?

- Gmail no longer supports "less secure apps"
- You MUST use an App Password (not your regular password)
- Enable 2FA first, then generate an app password

### Other Email Providers

The email service supports any SMTP provider. Update these variables:

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**Custom SMTP Server:**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=465
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables in production (Railway, Vercel, etc.)
- App passwords are safer than regular passwords
- Reset tokens expire after 1 hour
