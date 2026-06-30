import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 py-32">
        <div className="container mx-auto px-4 max-w-4xl bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-border">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900">Terms of Service</h1>
          <div className="text-slate-600 leading-relaxed">
            <p className="text-sm text-slate-400 mb-8 font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-slate-800">1. Agreement to Terms</h2>
            <p className="mb-4">By accessing or using Sabka Solution, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you disagree with any part of these terms, you may not access the service.</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-slate-800">2. User Accounts</h2>
            <p className="mb-4">When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
            <p className="mb-4">You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-slate-800">3. Acceptable Use</h2>
            <p className="mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Submit false, inaccurate, or misleading information about community issues.</li>
              <li>Harass, abuse, or harm another person or group.</li>
              <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
              <li>Attempt to gain unauthorized access to any portion of the Service.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-slate-800">4. Content Ownership</h2>
            <p className="mb-4">Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You retain all of your ownership rights in your content, but you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, adapt, publish, and distribute it in connection with the Service.</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-slate-800">5. Termination</h2>
            <p className="mb-4">We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-slate-800">6. Limitation of Liability</h2>
            <p className="mb-4">In no event shall Sabka Solution, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
