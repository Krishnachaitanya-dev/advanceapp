
# Supabase Configuration for app.advancewashing.com

## Issue
When users click "Forgot Password" or complete signup, they receive emails with localhost links instead of the correct production domain links.

## Solution
You need to configure your Supabase project to recognize `https://app.advancewashing.com` as a valid domain.

## Steps to Configure Supabase

### 1. Access Supabase Dashboard
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Advancewashing project

### 2. Update Authentication Settings
1. Go to **Authentication** → **Settings** in the left sidebar
2. Find the **URL Configuration** section

### 3. Configure Site URL
- Set **Site URL** to: `https://app.advancewashing.com`

### 4. Configure Redirect URLs
Add the following URLs to **Redirect URLs** (one per line):
```
https://app.advancewashing.com
https://app.advancewashing.com/home
https://app.advancewashing.com/reset-password
https://app.advancewashing.com/login
```

### 5. Save Configuration
- Click **Save** to apply the changes
- The changes take effect immediately

## What This Fixes

### Forgot Password
- Email links will now redirect to `https://app.advancewashing.com/reset-password`
- Users can successfully reset their passwords on your production domain

### Signup Confirmation
- Email confirmation links will redirect to `https://app.advancewashing.com/home`
- New users can complete their registration process properly

### Authentication Flow
- All authentication redirects will use your production domain
- No more localhost links in production emails

## Testing
After configuring Supabase:

1. **Test Forgot Password:**
   - Go to login page
   - Click "Forgot password?"
   - Enter an email address
   - Check that the reset email contains links to `app.advancewashing.com`

2. **Test Signup:**
   - Create a new account
   - Check that the confirmation email contains links to `app.advancewashing.com`

## Additional Notes

- The code now dynamically detects the current domain (`window.location.origin`)
- In production, it falls back to `https://app.advancewashing.com`
- Console logs are added to help debug any remaining issues
- The toast messages now show which domain is being used for redirects

## If You Still Have Issues

1. **Clear browser cache** and try again
2. **Check browser developer console** for any error messages
3. **Verify Supabase URL configuration** matches exactly
4. **Check spam folder** for authentication emails
5. **Try in incognito/private browsing mode**

## Contact Support
If issues persist after following these steps, the problem might be in:
- Supabase project configuration
- DNS settings
- Email delivery settings in Supabase
