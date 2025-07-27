
# User Flow Documentation - Advance Washing App

## Overview

This document outlines the complete user journeys for both customers and administrators in the Advance Washing application. Each flow is designed to provide an intuitive, efficient, and satisfying user experience.

## Customer User Flows

### 1. New User Registration & Onboarding

#### Flow: First-Time User Registration
```
Landing Page → Login Page → Sign Up Tab → Registration Form → Email Verification → Profile Setup → Home Dashboard
```

**Detailed Steps:**

1. **Landing Page Access**
   - User visits the application URL
   - System checks authentication status
   - Redirects to login if not authenticated

2. **Registration Process**
   - Click "Sign Up" tab on login page
   - Fill registration form:
     - Full name
     - Email address
     - Phone number (optional)
     - Password (with strength validation)
     - Confirm password
   - Submit form with validation

3. **Email Verification**
   - System sends verification email
   - User clicks verification link
   - Account activated and auto-login

4. **Profile Setup**
   - User profile created automatically
   - Default role assigned as 'user'
   - Redirected to home dashboard

**Success Criteria:**
- User successfully registered
- Profile created in database
- Email verified
- User logged in to home dashboard

**Error Handling:**
- Invalid email format → Show validation error
- Password too weak → Show strength requirements
- Email already exists → Show appropriate message
- Network issues → Show retry option

### 2. User Authentication Flow

#### Flow: Returning User Login
```
Login Page → Credentials Entry → Authentication → Home Dashboard
```

**Detailed Steps:**

1. **Login Page**
   - Enter email address
   - Enter password
   - Optional: Remember me checkbox
   - Click "Sign In" button

2. **Authentication Process**
   - Supabase Auth validation
   - JWT token generation
   - User profile retrieval
   - Role determination

3. **Post-Login Redirect**
   - Redirect to home dashboard
   - Load user-specific data
   - Display welcome message

**Success Criteria:**
- Successful authentication
- User role identified
- Appropriate dashboard loaded

### 3. Service Selection & Booking Flow

#### Flow: Complete Service Booking Process
```
Home → Services Page → Service Selection → Address Management → Pickup Scheduling → Order Confirmation → Order Tracking
```

**Detailed Steps:**

1. **Service Discovery**
   - Navigate to Services page from bottom navigation
   - View available services in grid layout
   - Each service shows:
     - Service name
     - Icon representation
     - Price per kg
     - Current availability status

2. **Service Selection**
   - Click on desired services (multi-select)
   - Selected services highlighted with color coding
   - Visual feedback with scale animation
   - Real-time selection counter

3. **Proceed to Booking**
   - Click "Schedule Pickup" button (disabled if no services selected)
   - Minimum one service required validation

4. **Address Management**
   - **If no addresses exist:**
     - Redirect to address creation
     - Fill address form with location services
     - Set as default address
   - **If addresses exist:**
     - Select from existing addresses
     - Option to add new address
     - Set/change default address

5. **Pickup Scheduling**
   - Select pickup date (today + 1 day minimum)
   - Choose time slot from available options:
     - Morning: 9:00 AM - 12:00 PM
     - Afternoon: 12:00 PM - 5:00 PM
     - Evening: 5:00 PM - 8:00 PM
   - Add special instructions (optional)

6. **Order Review & Confirmation**
   - Review selected services
   - Confirm pickup address
   - Confirm pickup date/time
   - Review estimated pricing
   - Add final special instructions
   - Confirm order placement

7. **Order Creation**
   - Generate unique order number (AW0001, AW0002, etc.)
   - Create booking record
   - Create order record
   - Create order items
   - Send confirmation notification

**Success Criteria:**
- Order successfully created
- Unique order number generated
- User receives confirmation
- Order appears in order history

### 4. Order Tracking & Management Flow

#### Flow: Order Status Monitoring
```
Orders Page → Order Selection → Order Details → Status Updates → Completion
```

**Detailed Steps:**

1. **Orders Overview**
   - Navigate to Orders page
   - View all user orders in chronological order
   - Each order card shows:
     - Order number
     - Order date
     - Current status with icon
     - Item count
     - Price (if finalized)

2. **Order Details View**
   - Click on order card to view details
   - Modal displays comprehensive information:
     - Order timeline with status progression
     - Service details and quantities
     - Pickup address and time
     - Weight progression (estimated → final)
     - Price progression (estimated → final)
     - Special instructions

3. **Status Tracking**
   - Real-time status updates through app
   - Status progression:
     ```
     Confirmed → Picked Up → In Process → Ready for Delivery → Delivered
     ```
   - Visual progress indicator
   - Estimated completion times

4. **Order Actions**
   - **Pending Orders**: Cancel option available
   - **Confirmed Orders**: Contact support option
   - **Delivered Orders**: Rate service option
   - **All Orders**: Download invoice option

**Success Criteria:**
- Real-time status visibility
- Clear order progression
- Appropriate actions available
- User satisfaction with transparency

### 5. Profile & Address Management Flow

#### Flow: Account Management
```
Profile Page → Personal Information → Address Management → Settings → Updates
```

**Detailed Steps:**

1. **Profile Overview**
   - Access via bottom navigation
   - Display current user information:
     - Name and email
     - Phone number
     - Member since date
     - Order statistics

2. **Personal Information Management**
   - Edit name and phone number
   - Password change functionality
   - Account security settings

3. **Address Management**
   - View all saved addresses
   - Add new address with:
     - Manual entry
     - GPS location detection
     - Address validation
   - Edit existing addresses
   - Set default address
   - Delete unused addresses

4. **App Settings**
   - Notification preferences
   - Language settings (future)
   - Theme preferences (future)
   - Privacy settings

**Success Criteria:**
- Profile information updated
- Addresses managed effectively
- Settings saved properly
- User control over personal data

## Admin User Flows

### 1. Admin Authentication & Dashboard Access

#### Flow: Admin Login and Dashboard
```
Login Page → Admin Credentials → Role Verification → Admin Dashboard
```

**Detailed Steps:**

1. **Admin Login**
   - Use admin credentials (admin@gmail.com)
   - System validates admin role
   - Redirect to admin dashboard

2. **Admin Dashboard Overview**
   - Order management interface
   - Service management tools
   - User management capabilities
   - Analytics and reporting

**Success Criteria:**
- Admin role verified
- Full admin interface accessible
- All admin functions available

### 2. Order Management Flow

#### Flow: Order Processing and Status Updates
```
Admin Dashboard → Order List → Order Details → Status Update → Notification
```

**Detailed Steps:**

1. **Order Management Interface**
   - View all orders across all users
   - Filter by status, date, customer
   - Sort by various criteria
   - Search functionality

2. **Order Processing**
   - Select order for processing
   - View complete order details
   - Update order status through workflow:
     ```
     Confirmed → Picked Up → In Process → Ready for Delivery → Delivered
     ```

3. **Weight and Pricing Updates**
   - Update final weight after pickup
   - Calculate final pricing
   - Add processing notes
   - Update estimated delivery time

4. **Customer Communication**
   - Automated status notifications
   - Custom message capability
   - SMS/email integration (future)

**Success Criteria:**
- Efficient order processing
- Accurate status updates
- Customer informed automatically
- Order workflow completed

### 3. Service Management Flow

#### Flow: Service Catalog Management
```
Admin Dashboard → Service Management → Add/Edit Services → Status Management → Updates
```

**Detailed Steps:**

1. **Service Catalog View**
   - List all services (active/inactive)
   - Service details and pricing
   - Usage statistics
   - Performance metrics

2. **Service Creation/Editing**
   - Add new service with:
     - Service name and description
     - Pricing per kg
     - Icon selection
     - Availability settings
   - Edit existing services
   - Bulk operations capability

3. **Service Status Management**
   - Activate/deactivate services
   - Temporary unavailability
   - Seasonal service management
   - Pricing updates

**Success Criteria:**
- Service catalog maintained
- Accurate pricing information
- Service availability managed
- Customer experience optimized

### 4. User Management Flow

#### Flow: Customer Account Management
```
Admin Dashboard → User Management → User Search → Account Details → Actions
```

**Detailed Steps:**

1. **User Overview**
   - List all registered users
   - User statistics and activity
   - Search and filter capabilities
   - User role management

2. **User Account Details**
   - View user profile information
   - Order history and statistics
   - Address and contact information
   - Account status and activity

3. **User Management Actions**
   - Reset user passwords
   - Update user roles
   - Deactivate/reactivate accounts
   - Merge duplicate accounts
   - Handle customer support issues

**Success Criteria:**
- Comprehensive user oversight
- Efficient customer support
- Account issues resolved
- User data maintained

## Error Handling & Edge Cases

### Common Error Scenarios

1. **Network Connectivity Issues**
   - Offline mode activation
   - Data synchronization on reconnection
   - User-friendly error messages
   - Retry mechanisms

2. **Authentication Failures**
   - Clear error messaging
   - Password reset options
   - Account lockout protection
   - Support contact information

3. **Payment Processing Issues**
   - Transaction failure handling
   - Alternative payment methods
   - Order status preservation
   - Customer notification

4. **Service Unavailability**
   - Dynamic service filtering
   - Alternative service suggestions
   - Waitlist functionality
   - Estimated availability

### Validation & Data Integrity

1. **Form Validation**
   - Real-time validation feedback
   - Clear error messaging
   - Prevention of invalid submissions
   - Data format enforcement

2. **Order Validation**
   - Service availability checking
   - Address validation
   - Time slot availability
   - Weight/quantity limits

3. **Database Integrity**
   - Constraint enforcement
   - Referential integrity
   - Data consistency checks
   - Backup and recovery

## Performance Considerations

### Load Time Optimization

1. **Initial Page Load**
   - Critical CSS inlining
   - Image optimization
   - Resource preloading
   - Progressive loading

2. **Navigation Performance**
   - Route-based code splitting
   - Prefetching critical resources
   - Smooth transitions
   - Loading state management

### Mobile Performance

1. **Touch Interactions**
   - Touch-friendly interface design
   - Appropriate touch targets
   - Gesture support
   - Haptic feedback

2. **Battery Optimization**
   - Efficient polling strategies
   - Background sync optimization
   - Resource management
   - Power-aware features

## Accessibility Considerations

### Universal Design

1. **Keyboard Navigation**
   - Full keyboard accessibility
   - Logical tab order
   - Focus indicators
   - Keyboard shortcuts

2. **Screen Reader Support**
   - Semantic HTML structure
   - ARIA labels and roles
   - Content hierarchy
   - Alternative text

3. **Visual Accessibility**
   - High contrast modes
   - Font size adjustment
   - Color-blind friendly design
   - Motion preferences

## Future Enhancements

### Planned User Experience Improvements

1. **Personalization**
   - Service recommendations
   - Preferred timing suggestions
   - Address autocomplete
   - Order history insights

2. **Communication Features**
   - In-app messaging
   - Real-time chat support
   - Customer service integration
   - SMS integration (for order confirmations)

3. **Loyalty Program**
   - Points accumulation
   - Reward redemption
   - Tier-based benefits
   - Referral system

This comprehensive user flow documentation ensures that all stakeholders understand the complete user journey and can identify areas for optimization and enhancement.
