import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderData {
  id: string;
  order_number: string;
  status: string;
  final_weight?: number;
  final_price?: number;
  estimated_price?: number;
  cancelled_at?: string;
  cancelled_by?: string;
  cancellation_reason?: string;
  user_id: string;
  bookings?: {
    pickup_time: string;
    addresses?: {
      door_no: string;
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  profiles?: {
    name: string;
    email: string;
    phone?: string;
  };
}

const statusConfig = {
  pending: {
    subject: "🎉 Order Placed Successfully - {{orderNumber}}",
    title: "Order Placed Successfully! 🎯",
    message: "Thank you for choosing Advance Washing! Your order has been received and we're excited to take care of your laundry with love and precision.",
    color: "#3B82F6",
    emoji: "🎉"
  },
  confirmed: {
    subject: "✅ Order Confirmed - {{orderNumber}}",
    title: "Order Confirmed! 🌟",
    message: "Great news! Your order has been confirmed and our team is preparing to give your clothes the premium care they deserve.",
    color: "#10B981",
    emoji: "✅"
  },
  picked_up: {
    subject: "🚛 Your Laundry Has Been Picked Up - {{orderNumber}}",
    title: "Your Laundry Has Been Picked Up! 👕",
    message: "We've successfully picked up your laundry and it's now on its journey to our state-of-the-art facility where magic happens!",
    color: "#8B5CF6",
    emoji: "🚛"
  },
  in_process: {
    subject: "🧼 We're Washing Your Clothes - {{orderNumber}}",
    title: "We're Washing Your Clothes! 🫧",
    message: "Your laundry is currently being processed with utmost care at our facility. Every piece is getting the attention it deserves!",
    color: "#F59E0B",
    emoji: "🧼"
  },
  ready_for_delivery: {
    subject: "🎁 Ready for Delivery - {{orderNumber}}",
    title: "Ready for Delivery! 📦",
    message: "Your freshly cleaned and beautifully folded laundry is ready and will be delivered to your doorstep soon!",
    color: "#10B981",
    emoji: "🎁"
  },
  delivered: {
    subject: "🏠 Order Delivered - {{orderNumber}}",
    title: "Order Delivered Successfully! 🎊",
    message: "Your order has been delivered! We hope you love the fresh, clean feeling. Thank you for trusting Advance Washing with your precious clothes.",
    color: "#059669",
    emoji: "🏠"
  },
  cancelled_by_user: {
    subject: "😔 Order Cancelled - {{orderNumber}}",
    title: "Order Cancelled 💙",
    message: "Your order has been cancelled as requested. We're always here when you need us again!",
    color: "#EF4444",
    emoji: "😔"
  },
  cancelled_by_admin: {
    subject: "😟 Order Cancelled - {{orderNumber}}",
    title: "Order Cancelled 💔",
    message: "We regret to inform you that your order has been cancelled due to unforeseen circumstances. Our team will contact you shortly to assist you further.",
    color: "#EF4444",
    emoji: "😟"
  }
};

function generateEmailHTML(orderData: OrderData): string {
  const config = statusConfig[orderData.status as keyof typeof statusConfig];
  if (!config) return '';

  const subject = config.subject.replace('{{orderNumber}}', orderData.order_number);

  const address = orderData.bookings?.addresses 
    ? `${orderData.bookings.addresses.door_no}, ${orderData.bookings.addresses.street}, ${orderData.bookings.addresses.city}, ${orderData.bookings.addresses.state} - ${orderData.bookings.addresses.pincode}`
    : '';

  const price = orderData.final_price || orderData.estimated_price;
  const firstName = orderData.profiles?.name ? orderData.profiles.name.split(' ')[0] : 'Dear Customer';

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject}</title>
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background-color: #f7f9fc;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background-color: #ffffff;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
      }
      .header {
        text-align: center;
        background-color: #007bff;
        padding: 20px;
        color: white;
        border-radius: 12px 12px 0 0;
      }
      .header img {
        max-width: 60px;
        margin-bottom: 10px;
        border-radius: 50%;
      }
      h1 {
        margin-top: 5px;
        font-size: 20px;
      }
      .order-info {
        margin: 20px 0;
      }
      .order-info p {
        margin: 6px 0;
        font-size: 16px;
        color: #333;
      }
      .badges {
        text-align: center;
        margin: 20px 0;
      }
      .badge {
        display: inline-block;
        background-color: #f0f0f0;
        padding: 8px 12px;
        margin: 6px;
        border-radius: 20px;
        font-size: 14px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888;
        margin-top: 30px;
      }
      .support-box {
        background-color: #fef3f3;
        color: #a33;
        padding: 14px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: center;
      }
      .contact {
        margin-top: 20px;
        font-size: 14px;
        text-align: center;
        color: #444;
      }
      a {
        color: #007bff;
        text-decoration: none;
      }
      .cancellation-info {
        background-color: #fef3c7;
        border: 2px solid #f59e0b;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        text-align: center;
      }
      .cancellation-title {
        font-weight: bold;
        color: #92400e;
        margin-bottom: 10px;
        font-size: 16px;
      }
      .cancellation-reason {
        color: #92400e;
        font-style: italic;
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://advancewashing.com/lovable-uploads/600eae54-4845-410b-93a1-7296f3d3ab9a.png" alt="Advance Washing Logo" />
        <h1>Advance Washing</h1>
        <p>Mumbai's Most Trusted Laundry Family</p>
      </div>

      <h2 style="text-align:center; margin-top: 30px;">${config.emoji} ${config.title}</h2>
      <p style="text-align:center;">Hello <strong>${firstName}!</strong> 👋<br />
        ${config.message}</p>

      ${orderData.status.includes('cancelled') && orderData.cancellation_reason ? `
      <div class="cancellation-info">
        <div class="cancellation-title">🔔 Cancellation Details</div>
        <div class="cancellation-reason">"${orderData.cancellation_reason}"</div>
        ${orderData.cancelled_at ? `<div style="margin-top: 10px; font-size: 14px; color: #92400e;">Cancelled on: ${new Date(orderData.cancelled_at).toLocaleDateString('en-IN')}</div>` : ''}
      </div>
      ` : ''}

      <div class="order-info">
        <p><strong>Order Number:</strong> ${orderData.order_number}</p>
        <p><strong>Status:</strong> ${orderData.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
        ${orderData.final_weight ? `<p><strong>Weight:</strong> ${orderData.final_weight} kg</p>` : ''}
        ${price ? `<p><strong>Total Amount:</strong> ₹${price}</p>` : ''}
        ${address ? `<p><strong>Address:</strong> ${address}</p>` : ''}
      </div>

      ${!orderData.status.includes('cancelled') ? `
      <div class="badges">
        <div class="badge">✨ Premium Quality</div>
        <div class="badge">🔒 Trusted Service</div>
        <div class="badge">👨‍👩‍👧‍👦 Family Care</div>
      </div>

      <div class="support-box">
        💬 We'll keep you updated on your order. Have questions? Just give us a call!
      </div>
      ` : `
      <div class="support-box">
        💬 We're always here when you need us again. Thank you for being part of the Advance Washing family!
      </div>
      `}

      <div class="contact">
        📞 +91 8928478081<br />
        📧 <a href="mailto:info@advancewashing.com">info@advancewashing.com</a><br />
        🌐 <a href="https://advancewashing.com">www.advancewashing.com</a><br /><br />
        <a href="https://www.facebook.com/advancewashing">Facebook</a> • <a href="https://www.instagram.com/advancewashing">Instagram</a>
      </div>

      <div class="footer">
        <p>© 2025 Advance Washing Mumbai. All rights reserved.</p>
        <p>Made with ❤️ for Mumbai</p>
      </div>
    </div>
  </body>
</html>`;
}

async function sendBrevoEmail(orderData: OrderData, htmlContent: string) {
  const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY not found in environment variables');
  }

  const config = statusConfig[orderData.status as keyof typeof statusConfig];
  const subject = config.subject.replace('{{orderNumber}}', orderData.order_number);

  const emailPayload = {
    sender: {
      name: "Advance Washing Mumbai 🧺",
      email: "info@advancewashing.com"
    },
    to: [{
      email: orderData.profiles?.email,
      name: orderData.profiles?.name || 'Valued Customer'
    }],
    subject: subject,
    htmlContent: htmlContent
  };

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Brevo API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

async function logEmailStatus(supabase: any, orderId: string, status: string, emailResult: any, error?: string) {
  try {
    await supabase
      .from('email_logs')
      .insert({
        order_id: orderId,
        email_status: status,
        brevo_response: emailResult,
        error_message: error,
        sent_at: new Date().toISOString()
      });
  } catch (logError) {
    console.error('Failed to log email status:', logError);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let requestBody: any;
  
  try {
    // Read the request body once and store it
    const bodyText = await req.text();
    requestBody = JSON.parse(bodyText);
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { orderId } = requestBody;

    if (!orderId) {
      throw new Error('Order ID is required');
    }

    console.log(`Processing email for order: ${orderId}`);

    // Fix the relationship ambiguity by being explicit about which profile relationship to use
    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .select(`
        *,
        profiles!orders_user_id_fkey(name, email, phone),
        bookings!inner(
          pickup_time,
          addresses!inner(
            door_no,
            street,
            city,
            state,
            pincode
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      throw new Error(`Failed to fetch order data: ${orderError?.message}`);
    }

    console.log(`Order found: ${orderData.order_number}, Status: ${orderData.status}`);

    // Generate HTML content
    const htmlContent = generateEmailHTML(orderData);
    if (!htmlContent) {
      throw new Error(`No email template found for status: ${orderData.status}`);
    }

    // Send email via Brevo
    const emailResult = await sendBrevoEmail(orderData, htmlContent);
    console.log('Email sent successfully:', emailResult);

    // Log success
    await logEmailStatus(supabaseClient, orderId, 'sent', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        messageId: emailResult.messageId 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error sending email:', error);

    // Try to log the error if we have the order ID and request body
    try {
      if (requestBody && requestBody.orderId) {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        );
        await logEmailStatus(supabaseClient, requestBody.orderId, 'failed', null, error.message);
      }
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
