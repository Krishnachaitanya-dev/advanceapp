# Google Play Data Safety Declaration

This document contains the required information for completing the Google Play Console Data Safety section.

## Data Collection Summary

### Personal Information
- **Name**: Collected for account creation and order management
- **Email**: Required for account authentication and order communications
- **Phone Number**: Used for delivery coordination and order updates
- **Address**: Required for pickup and delivery services

### Location Data
- **Precise Location**: Only when user actively requests location-based address detection
- **Usage**: Address detection, delivery time estimation, service area verification
- **Background Access**: NO - only foreground access when app is active

### App Activity
- **App Interactions**: Basic usage analytics for service improvement
- **Crash Logs**: Anonymous crash reporting for app stability

## Data Usage Purposes

### Account Management
- User registration and authentication
- Profile management
- Service personalization

### App Functionality
- Order processing and management
- Address detection and verification
- Delivery scheduling and tracking

### Analytics
- Service improvement
- Performance monitoring
- Crash reporting (anonymous)

## Data Sharing

### Third-Party Services
- **Supabase**: Secure data storage and authentication (Data Processor)
- **OpenStreetMap/Nominatim**: Address geocoding (No personal data shared)

### Data Transfer
- All data transfers use encrypted HTTPS connections
- No data sold to third parties
- No data shared for advertising purposes

## Data Security

### Encryption
- Data encrypted in transit using HTTPS/TLS
- Authentication tokens securely managed
- Local data storage uses secure browser storage APIs

### Data Retention
- Account data: Retained while account is active
- Order history: 2 years for service support
- Location data: Not permanently stored
- Analytics: Aggregated, anonymous data only

## User Controls

### Data Access
- Users can view their account information
- Order history accessible through app
- Profile settings can be updated

### Data Deletion
- Account deletion available through app settings
- Order data deleted after retention period
- Location data not permanently stored

## Declaration Answers for Google Play Console

### Does your app collect or share any of the required user data types?
**YES**

### Data Types Collected:

#### Personal Info
- **Name**: YES
  - Collection: Required
  - Sharing: NO
  - Purpose: Account management, App functionality

- **Email**: YES
  - Collection: Required
  - Sharing: NO
  - Purpose: Account management, App functionality

- **Phone Number**: YES
  - Collection: Required
  - Sharing: NO
  - Purpose: App functionality

- **Address**: YES
  - Collection: Required
  - Sharing: NO
  - Purpose: App functionality

#### Location
- **Precise Location**: YES
  - Collection: Optional (user can choose manual entry)
  - Sharing: NO
  - Purpose: App functionality
  - Background: NO

#### App Activity
- **App Interactions**: YES
  - Collection: Optional
  - Sharing: NO
  - Purpose: Analytics, App functionality

### Data Security
- **Is all user data encrypted in transit?**: YES
- **Do you provide a way for users to request data deletion?**: YES

### Data Collection Context
- All personal data collection is clearly disclosed to users
- Users provide explicit consent for location access
- Purpose of data collection is clearly explained
- Users can opt out of optional data collection

## Privacy Policy URL
Include this in your Play Store listing:
`https://yourapp.com/privacy-policy` (or wherever your privacy policy is hosted)

## Target Audience
- Primary: Adults (18+)
- Secondary: Teens (13-17) with parental supervision
- Not designed for children under 13