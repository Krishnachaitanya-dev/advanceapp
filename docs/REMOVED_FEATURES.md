# Removed Features Log

## Settings & Notifications Removal - January 2025

### Removed Components
- `src/pages/Settings.tsx`
- `src/pages/NotificationSettings.tsx` 
- `src/components/SettingsPage.tsx`
- `src/components/NotificationSettingsPage.tsx`

### Removed Routes
- `/settings`
- `/notification-settings`

### Reason for Removal
- App will not send push notifications or promotional messages
- Simplifies Google Play Store compliance
- Reduces app complexity and user confusion
- Focuses app on core laundry service functionality

### Impact
- Users no longer have notification preference settings
- No marketing communication toggles
- Cleaner profile page without settings navigation
- Reduced data collection requirements for Play Store

### Alternative Solutions
- Order status updates handled through in-app views
- Customer communication via direct contact methods
- Important alerts shown as in-app messages when relevant

This removal aligns with the app's focus on providing simple, effective laundry services without unnecessary notification overhead.