const features = [
  { icon: '🚀', title: 'Fast Delivery', desc: 'Same-day delivery in Ahmedabad' },
  { icon: '💰', title: 'Wholesale Prices', desc: 'Best prices guaranteed' },
  { icon: '✅', title: 'Quality Assured', desc: 'Fresh and verified products' },
  { icon: '🔒', title: 'Secure Payments', desc: 'Razorpay + COD available' },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Why Choose Umiya?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="text-center p-6 rounded-xl bg-gray-50">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
