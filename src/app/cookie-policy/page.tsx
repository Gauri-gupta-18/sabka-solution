import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function CookiePolicy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 py-32">
        <div className="container mx-auto px-4 max-w-4xl bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-border">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900">Cookie Policy</h1>
          <div className="text-slate-600 leading-relaxed">
            <p className="text-sm text-slate-400 mb-8 font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-slate-800">1. What Are Cookies</h2>
            <p className="mb-4">Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-slate-800">2. How Sabka Solution Uses Cookies</h2>
            <p className="mb-4">When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li><strong className="text-slate-800">Essential Cookies:</strong> We use essential cookies to authenticate users and prevent fraudulent use of user accounts.</li>
              <li><strong className="text-slate-800">Preferences Cookies:</strong> We use preferences cookies to remember information that changes the way the Service behaves or looks, such as your preferred language or the region that you are in.</li>
              <li><strong className="text-slate-800">Analytics Cookies:</strong> We use analytics cookies to track information how the Service is used so that we can make improvements. We may also use analytics cookies to test new advertisements, pages, features or new functionality of the Service to see how our users react to them.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-slate-800">3. Third-Party Cookies</h2>
            <p className="mb-4">In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on.</p>

            <h2 className="text-xl md:text-2xl font-semibold mt-8 mb-4 text-slate-800">4. What Are Your Choices Regarding Cookies</h2>
            <p className="mb-4">If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.</p>
            <p className="mb-4">Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
