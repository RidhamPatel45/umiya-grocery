import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold mb-4">Umiya Hub</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Your trusted wholesale and retail grocery partner in Ahmedabad.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {['Products', 'Categories', 'Offers', 'Track Order'].map(l => (
              <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Support</h4>
          <ul className="space-y-2 text-sm">
            {['Help Center', 'Returns Policy', 'Privacy Policy', 'Terms of Service'].map(l => (
              <li key={l}><Link href="#" className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📍 Ahmedabad, Gujarat</li>
            <li>📞 +91 98765 43210</li>
            <li>✉️ info@umiyahub.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Umiya Wholesale & Retail Hub. All rights reserved.
      </div>
    </footer>
  );
}
