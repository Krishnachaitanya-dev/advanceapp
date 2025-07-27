import React from 'react';
import { Shield } from 'lucide-react';

const PublicPrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="glass-card p-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Privacy Policy - Advance Washing</h1>
              <p className="text-slate-600">Last updated: July 2025</p>
            </div>
          </div>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Information We Collect</h2>
              <p className="mb-3">
                We collect information you provide directly to us, such as when you create an account, 
                place an order, or contact us for support.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Personal information (name, email, phone number)</li>
                <li>Address information for pickup and delivery</li>
                <li>Order history and preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>To provide and improve our laundry services</li>
                <li>To process and manage your orders</li>
                <li>To communicate with you about your orders</li>
                <li>To send promotional offers (with your consent)</li>
                <li>To ensure the security of our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Information Sharing</h2>
              <p className="mb-3">
                We do not sell, trade, or rent your personal information to third parties. 
                We may share information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist us in operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Data Security</h2>
              <p className="text-slate-600">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. All data 
                is transmitted through secure, encrypted channels.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Third-Party Services</h2>
              <p className="mb-3">We use the following third-party services to provide our app functionality:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li><strong>Supabase:</strong> Database and authentication services (data stored in secure cloud)</li>
                <li><strong>OpenStreetMap/Leaflet:</strong> Map services for address selection (no personal data shared)</li>
                <li><strong>Nominatim:</strong> Address geocoding service (only coordinates shared for address lookup)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Location Data Usage</h2>
              <p className="mb-3">We collect and use location data specifically for:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Automatic address detection during pickup scheduling</li>
                <li>Accurate delivery time estimation</li>
                <li>Service area verification</li>
                <li>Route optimization for our delivery team</li>
              </ul>
              <p className="text-slate-600 mt-3">
                Location access is only requested when you're actively using the app and is never tracked in the background. 
                You can always choose to enter your address manually instead.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Data Retention</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Account information: Retained while your account is active</li>
                <li>Order history: Retained for 2 years for service and support purposes</li>
                <li>Location data: Not stored permanently, only used for immediate address detection</li>
              </ul>
              <p className="text-slate-600 mt-3">
                <strong>Note:</strong> Payments are made directly to our delivery agents during pickup or delivery. 
                We do not process or store any payment information through this application.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Children's Privacy</h2>
              <p className="text-slate-600">
                Our service is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child 
                has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">International Data Transfers</h2>
              <p className="text-slate-600 mb-3">
                <strong>Primary Data Storage:</strong> All your personal data is stored securely in India (Mumbai) through our database provider Supabase.
              </p>
              <p className="text-slate-600 mb-3">
                <strong>Limited International Transfers:</strong> Some data may be transferred internationally only for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 ml-4">
                <li>Address lookup services (to improve location accuracy)</li>
                <li>Email delivery (for account verification and notifications)</li>
                <li>Performance optimization through content delivery networks</li>
              </ul>
              <p className="text-slate-600 mt-3">
                All international transfers are secured and comply with applicable data protection standards.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Policy Updates</h2>
              <p className="text-slate-600">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">Contact Us</h2>
              <p className="text-slate-600">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
                <br />
                <strong>Email:</strong> info@advancewashing.com
                <br />
                <strong>Phone:</strong> +91 8928478081
                <br />
                <strong>Address:</strong> Second floor Nirman Ind Estate, Chincholi Link Road, Near Fire Brigade, Malad West Mumbai - 400064
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicPrivacyPolicyPage;
