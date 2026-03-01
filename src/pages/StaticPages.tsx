import { Link } from 'react-router-dom';
import { PageTransition } from '../components/animations/PageTransition';

// About Us Page
export function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">About Shoply</h1>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-600 mb-6">
                Shoply is your one-stop destination for quality products at unbeatable prices. 
                Founded with the mission to make online shopping seamless, secure, and enjoyable 
                for everyone.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                We believe everyone deserves access to quality products without breaking the bank. 
                Our team works tirelessly to curate the best products from trusted brands and 
                deliver them right to your doorstep.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why Choose Shoply?</h2>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Quality Assured:</strong> Every product is vetted for quality before listing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Fast Shipping:</strong> Free delivery on orders over $35.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Secure Checkout:</strong> Your data is protected with industry-standard encryption.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Easy Returns:</strong> 30-day hassle-free return policy.</span>
                </li>
              </ul>

              <div className="bg-orange-50 rounded-xl p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Join Our Community</h3>
                <p className="text-gray-600 mb-4">
                  Over 1 million customers trust Shoply for their everyday shopping needs.
                </p>
                <Link 
                  to="/register" 
                  className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// Contact Us Page
export function ContactPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
            
            <p className="text-gray-600 mb-8">
              Have a question, concern, or feedback? We'd love to hear from you. 
              Our customer support team is available 24/7 to assist you.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">support@shoply.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">1-800-SHOPLY (746-759)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">
                        123 Commerce Street<br />
                        San Francisco, CA 94102<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Send a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                  </div>
                  <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition-colors">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// Careers Page
export function CareersPage() {
  const openings = [
    { title: 'Senior Frontend Engineer', location: 'Remote', type: 'Full-time' },
    { title: 'Product Manager', location: 'San Francisco, CA', type: 'Full-time' },
    { title: 'Customer Success Specialist', location: 'Remote', type: 'Full-time' },
    { title: 'UX Designer', location: 'New York, NY', type: 'Full-time' },
    { title: 'Data Analyst', location: 'Remote', type: 'Full-time' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Careers at Shoply</h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Join our team and help shape the future of e-commerce. We're always looking for 
              passionate individuals who want to make a difference.
            </p>

            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white mb-8">
              <h2 className="text-2xl font-bold mb-2">Why Work With Us?</h2>
              <p>Competitive salary, great benefits, flexible work arrangements, and unlimited growth potential.</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Open Positions</h2>
            <div className="space-y-3">
              {openings.map((job, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.location} · {job.type}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center text-gray-600">
              <p>Don't see a role that fits? Send your resume to <strong>careers@shoply.com</strong></p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// Terms & Conditions Page
export function TermsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
            <p className="text-gray-500 mb-8">Last updated: January 1, 2024</p>
            
            <div className="prose prose-gray max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using Shoply, you agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our service.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Use of Service</h2>
              <p className="text-gray-600 mb-4">
                You may use our service for lawful purposes only. You agree not to use the service 
                for any illegal or unauthorized purpose.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. User Accounts</h2>
              <p className="text-gray-600 mb-4">
                You are responsible for maintaining the confidentiality of your account and password. 
                You agree to accept responsibility for all activities that occur under your account.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Purchases</h2>
              <p className="text-gray-600 mb-4">
                All purchases made through Shoply are subject to product availability. We reserve 
                the right to refuse or cancel any order for any reason.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Pricing</h2>
              <p className="text-gray-600 mb-4">
                Prices for products are subject to change without notice. We reserve the right to 
                modify or discontinue any product at any time.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                Shoply shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of the service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// Privacy Policy Page
export function PrivacyPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Last updated: January 1, 2024</p>
            
            <div className="prose prose-gray max-w-none">
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact us for support.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>To process and fulfill your orders</li>
                <li>To communicate with you about your orders</li>
                <li>To send you promotional offers (with your consent)</li>
                <li>To improve our services and user experience</li>
              </ul>

              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell your personal information. We may share your information with 
                service providers who assist us in operating our business.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement industry-standard security measures to protect your personal information 
                from unauthorized access, alteration, or destruction.
              </p>

              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to access, correct, or delete your personal information. 
                Contact us at privacy@shoply.com to exercise these rights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// Shipping Policy Page
export function ShippingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipping Policy</h1>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
              <p className="text-green-800 font-medium">
                🚚 FREE shipping on all orders over $35!
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Options</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900">Method</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900">Delivery Time</th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-gray-600">Standard Shipping</td>
                    <td className="px-4 py-3 text-gray-600">5-7 business days</td>
                    <td className="px-4 py-3 text-gray-600">$5.99 (Free over $35)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-600">Express Shipping</td>
                    <td className="px-4 py-3 text-gray-600">2-3 business days</td>
                    <td className="px-4 py-3 text-gray-600">$12.99</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-600">Next Day Delivery</td>
                    <td className="px-4 py-3 text-gray-600">1 business day</td>
                    <td className="px-4 py-3 text-gray-600">$24.99</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">Order Processing</h2>
            <p className="text-gray-600 mb-6">
              Orders placed before 2 PM EST are typically processed the same day. 
              You'll receive a tracking number via email once your order ships.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">International Shipping</h2>
            <p className="text-gray-600">
              We currently ship to the United States and Canada. International shipping 
              rates and delivery times vary by location.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// Returns & Refunds Page
export function ReturnsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Returns & Refund Policy</h1>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <p className="text-blue-800 font-medium">
                🔄 30-day hassle-free returns on all items!
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">Return Eligibility</h2>
            <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
              <li>Items must be returned within 30 days of delivery</li>
              <li>Products must be unused and in original packaging</li>
              <li>Include all accessories and documentation</li>
              <li>Some items like personal care products may not be returnable</li>
            </ul>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">How to Return</h2>
            <ol className="list-decimal list-inside text-gray-600 mb-6 space-y-2">
              <li>Go to Your Orders and select the item you want to return</li>
              <li>Choose your return reason and print the prepaid shipping label</li>
              <li>Pack the item securely and drop it off at any UPS location</li>
              <li>Refund will be processed within 5-7 business days of receipt</li>
            </ol>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">Refund Options</h2>
            <p className="text-gray-600 mb-4">
              Refunds will be issued to your original payment method. You may also choose 
              to receive Shoply store credit for faster processing.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">Damaged or Defective Items</h2>
            <p className="text-gray-600">
              If you received a damaged or defective item, please contact us immediately. 
              We'll send a replacement at no additional cost.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// Help / FAQ Page
export function HelpPage() {
  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'Go to Your Orders and click on the order you want to track. You\'ll see real-time tracking information and estimated delivery date.'
    },
    {
      question: 'How do I change or cancel my order?',
      answer: 'Orders can be modified or cancelled within 1 hour of placement. Go to Your Orders and select the Cancel or Modify option.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Shoply Gift Cards.'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your full card details.'
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach us via email at support@shoply.com, call 1-800-SHOPLY, or use the live chat feature available 24/7.'
    },
    {
      question: 'Do you offer gift wrapping?',
      answer: 'Yes! During checkout, select the "Add gift wrap" option. Gift wrapping is available for $4.99 per item.'
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Help Center</h1>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/orders" className="text-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <svg className="w-8 h-8 mx-auto text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-sm text-gray-700">Your Orders</span>
                </Link>
                <Link to="/returns" className="text-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <svg className="w-8 h-8 mx-auto text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm text-gray-700">Returns</span>
                </Link>
                <Link to="/shipping" className="text-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <svg className="w-8 h-8 mx-auto text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span className="text-sm text-gray-700">Shipping</span>
                </Link>
                <Link to="/contact" className="text-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
                  <svg className="w-8 h-8 mx-auto text-orange-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm text-gray-700">Contact Us</span>
                </Link>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group border border-gray-200 rounded-lg">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                    {faq.question}
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="px-4 pb-4 text-gray-600">{faq.answer}</p>
                </details>
              ))}
            </div>

            <div className="mt-8 bg-orange-50 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
              <p className="text-gray-600 mb-4">Our customer support team is available 24/7</p>
              <Link to="/contact" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-lg transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
