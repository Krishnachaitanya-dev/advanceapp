
# Database Documentation - Advance Washing App

## Overview

The Advance Washing application uses PostgreSQL through Supabase with Row Level Security (RLS) policies for data protection. The database consists of 7 main tables that handle user management, service offerings, booking system, and order processing.

## Database Schema

### 1. profiles
**Purpose**: Stores user account information and role assignments

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields**:
- `id` (UUID, PK): References Supabase auth.users ID
- `name` (TEXT): Full name of the user
- `email` (TEXT): Unique email address
- `phone` (TEXT): Contact phone number
- `role` (TEXT): User role - 'user' or 'admin'
- `created_at` (TIMESTAMP): Account creation timestamp
- `updated_at` (TIMESTAMP): Last profile update timestamp

**Indexes**:
- Primary key on `id`
- Unique index on `email`
- Index on `role` for admin queries

**RLS Policies**:
- Users can view/update their own profile
- Admins can view/update any profile
- Only admins can delete profiles
- Regular users cannot change their role

### 2. addresses
**Purpose**: Manages customer delivery addresses

```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  door_no TEXT NOT NULL,
  street TEXT NOT NULL,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Karnataka',
  pincode TEXT NOT NULL,
  phone TEXT NOT NULL,
  name TEXT,
  label TEXT DEFAULT 'home' CHECK (label IN ('home', 'work', 'other')),
  coordinates JSONB,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields**:
- `id` (UUID, PK): Unique address identifier
- `user_id` (UUID, FK): References profiles(id)
- `door_no` (TEXT): House/apartment number
- `street` (TEXT): Street address
- `landmark` (TEXT): Optional landmark reference
- `city` (TEXT): City name
- `state` (TEXT): State name (default: Karnataka)
- `pincode` (TEXT): Postal code
- `phone` (TEXT): Contact number for this address
- `name` (TEXT): Optional name for this address
- `label` (TEXT): Address type - 'home', 'work', or 'other'
- `coordinates` (JSONB): GPS coordinates {lat, lng}
- `is_default` (BOOLEAN): Default address flag
- `created_at` (TIMESTAMP): Address creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Indexes**:
- Primary key on `id`
- Index on `user_id` for user queries
- Index on `is_default` for default address lookup

**RLS Policies**:
- Users can only access their own addresses
- Admins can access all addresses
- Users can create/update/delete their own addresses

### 3. services
**Purpose**: Defines available laundry services and pricing

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price_per_kg DECIMAL(10,2) NOT NULL,
  icon_name TEXT DEFAULT 'Shirt',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields**:
- `id` (UUID, PK): Unique service identifier
- `name` (TEXT): Service name (e.g., "Wash & Fold")
- `description` (TEXT): Detailed service description
- `base_price_per_kg` (DECIMAL): Price per kilogram
- `icon_name` (TEXT): Icon identifier for UI display
- `status` (TEXT): Service availability - 'active' or 'inactive'
- `created_at` (TIMESTAMP): Service creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Indexes**:
- Primary key on `id`
- Index on `status` for active service queries
- Index on `name` for search functionality

**RLS Policies**:
- All authenticated users can view active services
- Only admins can create/update/delete services
- Admins can view inactive services

### 4. bookings
**Purpose**: Manages pickup scheduling and booking information

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  address_id UUID NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,
  pickup_time TIMESTAMP WITH TIME ZONE NOT NULL,
  special_note TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields**:
- `id` (UUID, PK): Unique booking identifier
- `user_id` (UUID, FK): References profiles(id)
- `address_id` (UUID, FK): References addresses(id)
- `pickup_time` (TIMESTAMP): Scheduled pickup date and time
- `special_note` (TEXT): Optional customer instructions
- `status` (TEXT): Booking status - 'scheduled', 'confirmed', 'completed', 'cancelled'
- `created_at` (TIMESTAMP): Booking creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Indexes**:
- Primary key on `id`
- Index on `user_id` for user queries
- Index on `pickup_time` for scheduling queries
- Index on `status` for status-based filtering

**RLS Policies**:
- Users can only access their own bookings
- Admins can access all bookings
- Users can create/update their own bookings

### 5. orders
**Purpose**: Manages order lifecycle and pricing information

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'picked_up', 'in_process', 'ready_for_delivery', 'delivered', 'cancelled')),
  estimated_weight DECIMAL(5,2),
  final_weight DECIMAL(5,2),
  estimated_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields**:
- `id` (UUID, PK): Unique order identifier
- `user_id` (UUID, FK): References profiles(id)
- `booking_id` (UUID, FK): References bookings(id)
- `order_number` (TEXT): Human-readable order number (AW0001, AW0002, etc.)
- `status` (TEXT): Order status through lifecycle
- `estimated_weight` (DECIMAL): Initial weight estimate
- `final_weight` (DECIMAL): Actual weight after pickup
- `estimated_price` (DECIMAL): Initial price estimate
- `final_price` (DECIMAL): Final calculated price
- `created_at` (TIMESTAMP): Order creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Status Flow**:
```
pending → confirmed → picked_up → in_process → ready_for_delivery → delivered
                ↓
           cancelled (from any status before delivery)
```

**Indexes**:
- Primary key on `id`
- Unique index on `order_number`
- Index on `user_id` for user queries
- Index on `status` for admin filtering
- Index on `created_at` for chronological ordering

**RLS Policies**:
- Users can only access their own orders
- Admins can access all orders
- Users can update pending/confirmed orders only
- Only admins can delete orders

### 6. order_items
**Purpose**: Stores individual items within each order

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  item_name TEXT,
  quantity INTEGER DEFAULT 1,
  estimated_weight DECIMAL(5,2),
  final_weight DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields**:
- `id` (UUID, PK): Unique item identifier
- `order_id` (UUID, FK): References orders(id)
- `service_id` (UUID, FK): References services(id)
- `item_name` (TEXT): Custom item description
- `quantity` (INTEGER): Number of items
- `estimated_weight` (DECIMAL): Initial weight estimate for this item
- `final_weight` (DECIMAL): Actual weight after processing
- `created_at` (TIMESTAMP): Item creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Indexes**:
- Primary key on `id`
- Index on `order_id` for order queries
- Index on `service_id` for service analytics

**RLS Policies**:
- Access tied to parent order ownership
- Users can only access items from their own orders
- Admins can access all order items

### 7. admin_logs
**Purpose**: Tracks admin actions for audit purposes

```sql
CREATE TABLE admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Fields**:
- `id` (UUID, PK): Unique log entry identifier
- `admin_id` (UUID, FK): References profiles(id) of admin who performed action
- `action` (TEXT): Action performed (e.g., "order_status_updated", "service_created")
- `target_type` (TEXT): Type of entity affected (e.g., "order", "service", "user")
- `target_id` (UUID): ID of the affected entity
- `details` (JSONB): Additional action details in JSON format
- `created_at` (TIMESTAMP): Action timestamp

**Indexes**:
- Primary key on `id`
- Index on `admin_id` for admin activity queries
- Index on `created_at` for chronological ordering
- Index on `action` for action-based filtering

**RLS Policies**:
- Only admins can create/read/update/delete log entries
- Regular users have no access to admin logs

## Relationships

### Entity Relationship Diagram

```
profiles (1) ──→ (∞) addresses
profiles (1) ──→ (∞) bookings
profiles (1) ──→ (∞) orders
profiles (1) ──→ (∞) admin_logs

addresses (1) ──→ (∞) bookings
bookings (1) ──→ (∞) orders
orders (1) ──→ (∞) order_items
services (1) ──→ (∞) order_items
```

### Key Relationships

1. **User to Data**: Each user can have multiple addresses, bookings, and orders
2. **Booking to Order**: Each booking can generate one order
3. **Order to Items**: Each order contains multiple service items
4. **Service to Items**: Each service can be used in multiple order items
5. **Admin to Logs**: Admin actions are tracked in audit logs

## Security Implementation

### Row Level Security (RLS)

All tables have RLS enabled with policies that enforce:

1. **Data Isolation**: Users can only access their own data
2. **Role-Based Access**: Admins have elevated permissions
3. **Operation Restrictions**: Certain operations restricted by user role
4. **Status-Based Logic**: Some operations depend on order/booking status

### Admin Role Detection

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

## Performance Considerations

### Indexing Strategy

1. **Primary Keys**: UUID primary keys on all tables
2. **Foreign Keys**: Indexed for join performance
3. **Query Patterns**: Indexes on commonly filtered columns
4. **Chronological Data**: Timestamp indexes for ordering

### Query Optimization

1. **User Queries**: Filtered by user_id for data isolation
2. **Admin Queries**: Optimized for bulk operations
3. **Status Filtering**: Efficient status-based lookups
4. **Date Ranges**: Optimized for time-based queries

## Backup and Maintenance

### Automated Backups
- Daily automated backups via Supabase
- Point-in-time recovery available
- Cross-region backup replication

### Data Retention
- Orders retained indefinitely for business records
- Admin logs retained for 2 years
- Deleted user data purged after 30 days

### Monitoring
- Database performance metrics
- Query performance tracking
- Storage usage monitoring
- RLS policy effectiveness

## Migration History

### Version 1.0 - Initial Schema
- Created basic user and service tables
- Implemented core booking system

### Version 1.1 - Order Management
- Added order lifecycle management
- Implemented order item tracking

### Version 1.2 - Security Enhancement
- Implemented comprehensive RLS policies
- Added admin audit logging

### Version 1.3 - Performance Optimization
- Added database indexes
- Optimized query patterns

## Data Privacy Compliance

### GDPR Compliance
- User data deletion procedures
- Data export functionality
- Privacy-by-design implementation

### Data Minimization
- Only necessary data collected
- Regular data cleanup procedures
- Retention policy enforcement
