
# Admin User Setup Guide

## How to manually assign admin role to a user

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** → **profiles**
3. Find the user you want to make admin (search by email)
4. Click on the user's row to edit
5. Change the `role` field from `customer` to `admin`
6. Click **Save**

### Method 2: Using SQL Editor

```sql
-- Replace 'user@example.com' with the actual email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

### Method 3: Using Supabase JavaScript Client (Programmatic)

```javascript
// This should be run by an existing admin user
const { data, error } = await supabase
  .from('profiles')
  .update({ role: 'admin' })
  .eq('email', 'user@example.com');
```

## Verification

After assigning admin role:

1. The user should log out and log back in
2. They should be automatically redirected to `/admin` route
3. You can verify the role using the `useUserRole()` hook:

```javascript
const { isAdmin, role } = useUserRole();
console.log('Is Admin:', isAdmin); // Should be true
console.log('Role:', role); // Should be 'admin'
```

## Security Notes

- For now, RLS (Row Level Security) is disabled as requested
- When you're ready to enable RLS, you'll need to create policies that:
  - Allow users to read their own profile
  - Allow admins to read/update any profile
  - Prevent regular users from changing their own role
