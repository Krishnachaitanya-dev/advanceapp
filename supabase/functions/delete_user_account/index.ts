import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate request method
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const { user_id } = await req.json()

    // Validate user_id
    if (!user_id || typeof user_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing user_id' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(user_id)) {
      return new Response(
        JSON.stringify({ error: 'Invalid user_id format' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log(`Starting account deletion for user: ${user_id}`)

    // Step 1: Delete order items (foreign key to orders)
    console.log('Step 1: Deleting order items...')
    const { data: orders, error: ordersSelectError } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', user_id)

    if (ordersSelectError) {
      console.error('Error fetching orders:', ordersSelectError)
    } else if (orders && orders.length > 0) {
      const orderIds = orders.map(order => order.id)
      console.log(`Deleting order items for ${orderIds.length} orders`)
      
      const { error: orderItemsError } = await supabase
        .from('order_items')
        .delete()
        .in('order_id', orderIds)
      
      if (orderItemsError) {
        console.error('Error deleting order items:', orderItemsError)
        throw new Error(`Failed to delete order items: ${orderItemsError.message}`)
      }
      console.log('Order items deleted successfully')
    }

    // Step 2: Delete orders
    console.log('Step 2: Deleting orders...')
    const { error: ordersError } = await supabase
      .from('orders')
      .delete()
      .eq('user_id', user_id)
    
    if (ordersError) {
      console.error('Error deleting orders:', ordersError)
      throw new Error(`Failed to delete orders: ${ordersError.message}`)
    }
    console.log('Orders deleted successfully')

    // Step 3: Delete bookings
    console.log('Step 3: Deleting bookings...')
    const { error: bookingsError } = await supabase
      .from('bookings')
      .delete()
      .eq('user_id', user_id)
    
    if (bookingsError) {
      console.error('Error deleting bookings:', bookingsError)
      throw new Error(`Failed to delete bookings: ${bookingsError.message}`)
    }
    console.log('Bookings deleted successfully')

    // Step 4: Delete addresses
    console.log('Step 4: Deleting addresses...')
    const { error: addressesError } = await supabase
      .from('addresses')
      .delete()
      .eq('user_id', user_id)
    
    if (addressesError) {
      console.error('Error deleting addresses:', addressesError)
      throw new Error(`Failed to delete addresses: ${addressesError.message}`)
    }
    console.log('Addresses deleted successfully')

    // Step 5: Delete admin logs (if user was an admin)
    console.log('Step 5: Deleting admin logs...')
    const { error: adminLogsError } = await supabase
      .from('admin_logs')
      .delete()
      .eq('admin_id', user_id)
    
    if (adminLogsError) {
      console.error('Error deleting admin logs:', adminLogsError)
      throw new Error(`Failed to delete admin logs: ${adminLogsError.message}`)
    }
    console.log('Admin logs deleted successfully')

    // Step 6: Delete profile
    console.log('Step 6: Deleting profile...')
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user_id)
    
    if (profileError) {
      console.error('Error deleting profile:', profileError)
      throw new Error(`Failed to delete profile: ${profileError.message}`)
    }
    console.log('Profile deleted successfully')

    // Step 7: Delete the Supabase Auth user
    console.log('Step 7: Deleting auth user...')
    const { error: authError } = await supabase.auth.admin.deleteUser(user_id)
    
    if (authError) {
      console.error('Error deleting auth user:', authError)
      throw new Error(`Failed to delete auth user: ${authError.message}`)
    }
    console.log('Auth user deleted successfully')

    console.log(`Account deletion completed successfully for user: ${user_id}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User account and all associated data have been permanently deleted',
        user_id: user_id
      }), 
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Account deletion error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to delete user account', 
        details: error.message 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})