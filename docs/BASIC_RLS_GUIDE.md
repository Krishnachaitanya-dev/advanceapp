

# Basic RLS Setup Guide

This is a minimal Row Level Security setup that provides essential user data isolation.

## What This Setup Does

1. **Enables RLS** on all core tables (profiles, addresses, bookings, orders, order_items)
2. **User Data Isolation** - Users can only access their own data
3. **Simple Policies** - Direct auth.uid() matching without custom functions

## How to Apply

1. Go to your Supabase SQL Editor
2. Copy and paste the contents of `supabase/basic-rls-setup.sql`
3. Run the query

## Testing the Setup

After applying, test by:

1. **Login as a regular user**
   - Should only see your own orders, addresses, bookings
   - Should be able to create new orders/bookings for yourself
   - Should NOT see other users' data

2. **Check in Supabase Dashboard**
   - Go to Table Editor
   - Verify you only see data for the logged-in user

## What's NOT Included Yet

- Admin access policies (to be added later)
- Complex conditional logic (to be added later)  
- Service table policies (services are public for now)
- Admin logs policies (to be added later)

## Next Steps

Once this basic setup is working:
1. Test thoroughly with different user accounts
2. Add admin-specific policies
3. Add service table policies if needed
4. Add more granular permissions

## Troubleshooting

If you can't see any data after applying:
1. Check you're logged in to the app
2. Verify your user ID exists in the profiles table
3. Check Supabase logs for RLS policy violations

**Common Issues:**
- Permission denied errors: Make sure you're running the SQL as a database owner
- No data visible: Ensure your user profile exists in the profiles table
- Policy conflicts: Drop existing policies first if recreating

