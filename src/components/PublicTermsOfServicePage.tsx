
import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PublicTermsOfServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Terms of Service</h1>
              <p className="text-slate-600">Last updated: July 2025</p>
            </div>
          </div>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Acceptance of Terms</h2>
              <p className="text-slate-600">
                By using Advance Washing services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Service Description</h2>
              <p className="mb-3">Advance Washing provides:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Laundry and dry cleaning services</li>
                <li>Pickup and delivery services</li>
                <li>Garment care and maintenance</li>
                <li>Special fabric treatments</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">3. User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Provide accurate contact and address information</li>
                <li>Ensure items are suitable for our cleaning processes</li>
                <li>Report any special care instructions</li>
                <li>Be available during scheduled pickup/delivery times</li>
                <li>Pay for services in a timely manner</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Pricing and Payment</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Prices are subject to change with notice</li>
                <li>Payment is made directly to our delivery agent during pickup or delivery</li>
                <li>We accept cash and digital payment methods through our agents</li>
                <li>No payment processing occurs through this mobile application</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Prohibited Items</h2>
              <p className="mb-3">We do not accept:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Items contaminated with hazardous materials</li>
                <li>Leather goods (unless specified)</li>
                <li>Wedding dresses (requires special service)</li>
                <li>Items with non-permanent stains</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Cancellation Policy</h2>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Orders can be cancelled before pickup</li>
                <li>Cancellation fees may apply for scheduled pickups</li>
                <li>Refunds processed within 3-5 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Contact Information</h2>
              <p className="text-slate-600">
                For questions about these Terms of Service:
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

export default PublicTermsOfServicePage;
