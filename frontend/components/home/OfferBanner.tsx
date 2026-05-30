export function OfferBanner() {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div>
          <p className="text-sm font-semibold text-white/80 mb-1">LIMITED TIME OFFER</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold">Get 10% OFF on Bulk Orders</h3>
          <p className="text-white/80 mt-1 text-sm">Use code <span className="font-bold bg-white/20 px-2 py-0.5 rounded">UMIYA10</span> on orders above ₹2000</p>
        </div>
        <div className="text-5xl sm:text-6xl">🛒</div>
      </div>
    </div>
  );
}
