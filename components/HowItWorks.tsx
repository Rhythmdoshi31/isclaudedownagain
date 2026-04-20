export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 border-b-3 border-black">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-2">
          <span className="text-yellow text-4xl">★</span> how it works <span className="text-yellow text-4xl">★</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="y2k-card p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-yellow rounded-full y2k-border flex items-center justify-center font-bold text-xl mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">1</div>
            <h3 className="font-bold text-xl mb-2">subscribe</h3>
            <p className="text-sm">enter your email and verify it via a fast otp process.</p>
          </div>
          <div className="y2k-card p-6 flex flex-col items-center text-center bg-green text-black">
            <div className="w-12 h-12 bg-white rounded-full y2k-border flex items-center justify-center font-bold text-xl mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">2</div>
            <h3 className="font-bold text-xl mb-2">we watch</h3>
            <p className="text-sm">our system polls the official anthropic api every 60 seconds.</p>
          </div>
          <div className="y2k-card p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-yellow rounded-full y2k-border flex items-center justify-center font-bold text-xl mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">3</div>
            <h3 className="font-bold text-xl mb-2">you get alerted</h3>
            <p className="text-sm">the moment the status changes, you get an email alert.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
