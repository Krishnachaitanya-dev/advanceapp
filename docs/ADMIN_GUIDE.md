
# Admin Guide - Advance Washing App

## Overview

This guide provides comprehensive documentation for administrators using the Advance Washing application. It covers all administrative functions, user management, order processing, and system maintenance procedures.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Admin Dashboard Overview](#admin-dashboard-overview)
3. [Order Management](#order-management)
4. [Service Management](#service-management)
5. [User Management](#user-management)
6. [Analytics & Reporting](#analytics--reporting)
7. [System Administration](#system-administration)
8. [Security & Access Control](#security--access-control)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

## Getting Started

### Admin Account Setup

1. **Admin Account Creation**
   - Admin accounts are created with special privileges
   - Default admin email: `admin@gmail.com`
   - Admin role is assigned in the database profile

2. **First-Time Login**
   - Navigate to the application login page
   - Enter admin credentials
   - System automatically redirects to admin dashboard
   - Admin interface is loaded with full privileges

3. **Admin Dashboard Access**
   - Admins have access to all user features plus administrative tools
   - Additional navigation options appear for admin users
   - Admin-specific UI components are enabled

### Admin Privileges

Administrators have the following system-wide privileges:

- **View All Data**: Access to all user orders, profiles, and addresses
- **Modify Orders**: Update order status, pricing, and details
- **Manage Services**: Create, edit, and delete service offerings
- **User Management**: View and manage user accounts
- **System Configuration**: Manage application settings
- **Audit Access**: View admin activity logs

## Admin Dashboard Overview

### Main Dashboard Components

1. **Order Statistics Widget**
   - Total orders today/week/month
   - Order status distribution
   - Revenue metrics
   - Average order value

2. **Recent Orders Panel**
   - Latest orders requiring attention
   - Quick status update options
   - Direct access to order details

3. **Service Performance Metrics**
   - Most popular services
   - Service utilization rates
   - Pricing optimization suggestions

4. **User Activity Summary**
   - New user registrations
   - Active users metrics
   - Customer retention data

### Navigation Structure

```
Admin Dashboard
├── Order Management
│   ├── All Orders
│   ├── Order Processing
│   └── Order Analytics
├── Service Management
│   ├── Service Catalog
│   ├── Pricing Management
│   └── Service Analytics
├── User Management
│   ├── Customer Accounts
│   ├── Admin Accounts
│   └── User Analytics
└── System Settings
    ├── Application Configuration
    ├── Security Settings
    └── Audit Logs
```

## Order Management

### Order Processing Workflow

#### 1. Order Overview

**Accessing Orders:**
- Navigate to "Orders" section in admin interface
- View all orders across all customers
- Filter by status, date range, customer, or service type
- Search by order number or customer name

**Order List Features:**
- Sortable columns (date, status, customer, value)
- Bulk actions for multiple orders
- Quick status update buttons
- Export functionality

#### 2. Order Status Management

**Order Lifecycle:**
```
Confirmed → Picked Up → In Process → Ready for Delivery → Delivered
```

**Status Update Process:**

1. **Confirmed to Picked Up**
   - Verify pickup completion
   - Update actual weight if different from estimate
   - Add pickup notes or issues
   - Update estimated delivery date

2. **Picked Up to In Process**
   - Begin processing the order
   - Update processing timeline
   - Add any special handling notes

3. **In Process to Ready for Delivery**
   - Complete service processing
   - Finalize weight and pricing
   - Quality check completion
   - Schedule delivery

4. **Ready for Delivery to Delivered**
   - Confirm delivery completion
   - Customer confirmation
   - Payment processing (if COD)
   - Generate invoice

#### 3. Order Details Management

**Order Information Access:**
- Click on any order to view complete details
- Modal displays comprehensive order information
- Edit capabilities for admin users

**Editable Order Fields:**
- Order status
- Final weight
- Final pricing
- Delivery timeline
- Special handling notes
- Internal comments

**Price Calculation:**
```javascript
Final Price = (Final Weight × Service Price per KG) × Quantity
```

#### 4. Order Actions

**Available Actions per Status:**

| Status | Available Actions |
|--------|------------------|
| Confirmed | Update to Picked Up, Cancel Order, Edit Details |
| Picked Up | Update to In Process, Add Weight, Edit Timeline |
| In Process | Update to Ready for Delivery, Update Pricing |
| Ready for Delivery | Update to Delivered, Schedule Delivery |
| Delivered | Generate Invoice, Process Payment, Archive |

**Bulk Operations:**
- Update multiple orders to same status
- Export order data
- Generate reports
- Send notifications

### Order Analytics

#### Key Metrics Dashboard

1. **Volume Metrics**
   - Orders per day/week/month
   - Order growth trends
   - Seasonal patterns
   - Peak time analysis

2. **Financial Metrics**
   - Revenue by time period
   - Average order value
   - Service profitability
   - Payment method distribution

3. **Operational Metrics**
   - Processing time by status
   - Delivery performance
   - Customer satisfaction scores
   - Return/complaint rates

## Service Management

### Service Catalog Administration

#### 1. Service Creation

**Adding New Services:**
- Navigate to Service Management section
- Click "Add New Service"
- Fill service details form:
  - Service name (required)
  - Description
  - Base price per kg
  - Icon selection
  - Category assignment
  - Availability status

**Service Configuration:**
```javascript
Service Object:
{
  name: "Premium Wash & Fold",
  description: "High-quality washing with premium detergent",
  base_price_per_kg: 45.00,
  icon_name: "Shirt",
  status: "active",
  category: "washing"
}
```

#### 2. Service Editing

**Modifying Existing Services:**
- Select service from catalog
- Edit any field except historical pricing
- Update availability status
- Manage seasonal pricing

**Pricing Management:**
- Base pricing per kilogram
- Bulk discount configuration
- Seasonal pricing adjustments
- Premium service surcharges

#### 3. Service Status Management

**Service Availability:**
- **Active**: Available for customer selection
- **Inactive**: Hidden from customer interface
- **Maintenance**: Temporarily unavailable
- **Discontinued**: No longer offered

**Bulk Service Operations:**
- Enable/disable multiple services
- Update pricing across categories
- Import/export service data
- Duplicate service configurations

### Service Analytics

#### Performance Metrics

1. **Usage Statistics**
   - Service selection frequency
   - Revenue by service
   - Customer preference trends
   - Geographic service popularity

2. **Pricing Analysis**
   - Price sensitivity analysis
   - Competitive pricing comparison
   - Profit margin by service
   - Optimization recommendations

## User Management

### Customer Account Management

#### 1. User Overview

**Customer Database Access:**
- View all registered customers
- Search by name, email, or phone
- Filter by registration date, activity, or order history
- Sort by various criteria

**Customer Information Display:**
- Personal details (name, email, phone)
- Registration date and verification status
- Order history and statistics
- Address information
- Account status and activity

#### 2. Customer Support Functions

**Account Assistance:**
- Password reset for customers
- Account verification assistance
- Profile information updates
- Address management support

**Order Support:**
- Order status inquiries
- Delivery issue resolution
- Billing question assistance
- Refund/credit processing

#### 3. User Analytics

**Customer Metrics:**
- New user acquisition rates
- Customer retention analysis
- Lifetime value calculations
- Churn rate monitoring

**Behavioral Analysis:**
- Service usage patterns
- Ordering frequency
- Geographic distribution
- Device/platform usage

### Admin Account Management

#### 1. Admin User Administration

**Admin Account Creation:**
- Create new admin accounts
- Assign specific privileges
- Set access restrictions
- Configure notification preferences

**Role Management:**
- Super Admin: Full system access
- Order Manager: Order processing focus
- Service Manager: Service catalog management
- Support Agent: Customer service functions

#### 2. Access Control

**Permission Matrix:**

| Role | Orders | Services | Users | Settings | Analytics |
|------|--------|----------|-------|----------|-----------|
| Super Admin | Full | Full | Full | Full | Full |
| Order Manager | Full | Read | Read | None | Orders |
| Service Manager | Read | Full | Read | None | Services |
| Support Agent | Limited | Read | Limited | None | Basic |

## Analytics & Reporting

### Business Intelligence Dashboard

#### 1. Financial Reports

**Revenue Analytics:**
- Daily/weekly/monthly revenue
- Year-over-year growth
- Revenue by service category
- Payment method analysis

**Cost Analysis:**
- Service delivery costs
- Customer acquisition costs
- Operational efficiency metrics
- Profit margin analysis

#### 2. Operational Reports

**Performance Metrics:**
- Order processing times
- Delivery performance
- Customer satisfaction scores
- Service quality metrics

**Capacity Planning:**
- Order volume forecasting
- Resource utilization
- Staffing requirements
- Equipment needs

#### 3. Customer Analytics

**Customer Insights:**
- Customer segmentation
- Lifetime value analysis
- Retention and churn metrics
- Satisfaction surveys

**Market Analysis:**
- Geographic service demand
- Seasonal trends
- Competitive positioning
- Growth opportunities

### Report Generation

#### 1. Standard Reports

**Available Report Types:**
- Daily operations summary
- Weekly financial report
- Monthly business review
- Quarterly performance analysis
- Annual business report

**Export Options:**
- PDF format for presentations
- Excel format for analysis
- CSV format for data processing
- JSON format for system integration

#### 2. Custom Reports

**Report Builder Features:**
- Drag-and-drop interface
- Custom date ranges
- Multiple data sources
- Automated scheduling
- Email delivery options

## System Administration

### Application Configuration

#### 1. System Settings

**General Configuration:**
- Application name and branding
- Default timezone settings
- Currency and localization
- Contact information
- Terms of service updates

**Operational Settings:**
- Service availability hours
- Pickup time slots
- Delivery zones
- Minimum order requirements
- Maximum weight limits

#### 2. Notification Management

**Customer Notifications:**
- Order status updates
- Pickup reminders
- Delivery notifications
- Promotional messages
- Account security alerts

**Admin Notifications:**
- New order alerts
- System error notifications
- Performance warnings
- Security notifications
- Maintenance reminders

### Data Management

#### 1. Database Administration

**Data Backup:**
- Automated daily backups
- Manual backup triggers
- Backup verification
- Disaster recovery procedures
- Data retention policies

**Data Maintenance:**
- Regular data cleanup
- Performance optimization
- Index maintenance
- Archive old records
- Data integrity checks

#### 2. Security Management

**Access Security:**
- User authentication monitoring
- Failed login attempt tracking
- Session management
- Password policy enforcement
- Two-factor authentication setup

**Data Security:**
- Encryption verification
- Privacy compliance monitoring
- Audit trail maintenance
- Security incident response
- Vulnerability assessment

## Security & Access Control

### Row Level Security (RLS) Policies

#### 1. Database Security Implementation

**Policy Overview:**
- User data isolation
- Admin privilege escalation
- Role-based access control
- Operation-specific permissions

**Policy Verification:**
```sql
-- Check current user's role
SELECT role FROM profiles WHERE id = auth.uid();

-- Verify admin access
SELECT is_admin();

-- Test user data isolation
SELECT * FROM orders WHERE user_id = auth.uid();
```

#### 2. Admin Security Best Practices

**Account Security:**
- Strong password requirements
- Regular password changes
- Session timeout configuration
- Multi-device login monitoring

**Activity Monitoring:**
- Admin action logging
- Unusual activity detection
- Access pattern analysis
- Security alert configuration

### Audit Trail

#### 1. Admin Activity Logging

**Logged Actions:**
- Order status changes
- Service modifications
- User account changes
- System configuration updates
- Data export activities

**Log Entry Format:**
```javascript
{
  admin_id: "uuid",
  action: "order_status_updated",
  target_type: "order",
  target_id: "order_uuid",
  details: {
    old_status: "confirmed",
    new_status: "picked_up",
    timestamp: "2023-12-06T10:30:00Z"
  }
}
```

#### 2. Compliance Reporting

**Audit Reports:**
- Admin activity summaries
- Data access logs
- Security incident reports
- Compliance verification
- Performance reviews

## Troubleshooting

### Common Issues and Solutions

#### 1. Order Processing Issues

**Problem: Order status not updating**
- Check database connection
- Verify RLS policies
- Confirm admin permissions
- Review error logs

**Problem: Pricing calculations incorrect**
- Verify service pricing data
- Check weight input validation
- Review calculation logic
- Validate tax/discount application

#### 2. User Access Issues

**Problem: Customer cannot place orders**
- Verify user authentication
- Check service availability
- Confirm address validation
- Review order form validation

**Problem: Admin interface not loading**
- Confirm admin role assignment
- Check browser compatibility
- Verify network connectivity
- Review JavaScript errors

#### 3. Data Synchronization Issues

**Problem: Real-time updates not working**
- Check Supabase connection
- Verify subscription setup
- Review network connectivity
- Test database triggers

### Error Handling Procedures

#### 1. System Error Response

**Error Classification:**
- User errors (input validation)
- System errors (server issues)
- Network errors (connectivity)
- Security errors (unauthorized access)

**Resolution Steps:**
1. Identify error type and severity
2. Check system logs for details
3. Apply appropriate fix or workaround
4. Monitor for recurrence
5. Update documentation if needed

#### 2. Customer Support Escalation

**Escalation Triggers:**
- Payment processing failures
- Data loss incidents
- Security breaches
- Service outages
- Customer complaints

**Response Procedures:**
- Immediate customer notification
- Problem isolation and containment
- Technical resolution implementation
- Customer compensation if needed
- Post-incident review and improvement

## Best Practices

### Daily Operations

#### 1. Morning Routine
- Review overnight orders
- Check system health status
- Process urgent customer requests
- Update delivery schedules
- Monitor service availability

#### 2. Throughout the Day
- Regular order status updates
- Customer inquiry responses
- System performance monitoring
- Quality control checks
- Team coordination

#### 3. End of Day
- Daily report generation
- Outstanding issue review
- Next day preparation
- Data backup verification
- Security check completion

### Quality Assurance

#### 1. Order Quality Control
- Weight verification procedures
- Service quality standards
- Customer satisfaction monitoring
- Delivery time optimization
- Issue resolution tracking

#### 2. System Quality Maintenance
- Regular testing procedures
- Performance optimization
- Security assessment
- User experience evaluation
- Continuous improvement implementation

### Customer Service Excellence

#### 1. Communication Standards
- Prompt response times
- Clear and helpful information
- Professional demeanor
- Proactive issue resolution
- Follow-up procedures

#### 2. Problem Resolution
- Root cause analysis
- Preventive measures
- Customer satisfaction verification
- Process improvement
- Documentation updates

This comprehensive admin guide ensures efficient operation of the Advance Washing application while maintaining high standards of customer service and system reliability.
