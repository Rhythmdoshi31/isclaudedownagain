"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import { cn } from "@/lib/utils";

export default function UnsubscribeClient() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [statusObj, setStatusObj] = useState<{status: string, components: {name: string, status: string}[], lastChecked: string}>({ 
    status: "checking...", 
    components: [],
    lastChecked: new Date().toISOString() 
  });
  const [progress, setProgress] = useState(100);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (statusObj?.lastChecked) {
      setTime(new Date(statusObj.lastChecked).toLocaleTimeString());
    }
  }, [statusObj?.lastChecked]);

  const lastFetchTimeRef = useRef(Date.now());

  // Status fetcher
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status?t=" + Date.now(), { cache: "no-store" });
        const data = await res.json();
        setStatusObj({
          status: data.status || "unknown",
          components: data.components || [],
          lastChecked: data.lastChecked || new Date().toISOString()
        });
      } catch {
        setStatusObj(prev => ({ ...prev, status: "unknown" }));
      } finally {
        lastFetchTimeRef.current = Date.now();
        setProgress(100);
      }
    };

    fetchStatus();
    
    // Auto fetch every 60s
    const fetchInterval = setInterval(fetchStatus, 60000);
    
    // Progress bar ticker
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - lastFetchTimeRef.current;
      const remaining = Math.max(0, 100 - (elapsed / 60000) * 100);
      setProgress(remaining);
    }, 100);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "failed to send otp");
      
      setStep("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/unsubscribe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "invalid otp");
      
      setStep("success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const heroHeading = (
    <div className="max-w-md w-full mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 flex flex-wrap gap-2 items-center">
        <span className="text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">stop</span>
        <span className="text-black bg-yellow px-2 y2k-border -rotate-2">alerts</span>
      </h1>
      <p className="mb-8 font-bold text-lg">enter your email below to instantly unsubscribe from claude status alerts.</p>
    </div>
  );

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 flex-1">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-green p-8 pb-4 border-b-3 border-black order-1">
        {heroHeading}
      </div>

      {/* Left Column (Green) - Form */}
      <div className="bg-green p-8 md:p-16 flex flex-col justify-center border-b-3 md:border-b-0 md:border-r-3 border-black order-3 md:order-1">
        <div className="hidden md:block">
          {heroHeading}
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="y2k-card p-6 bg-white relative">
            {/* Decorative Star */}
            <div className="absolute -top-4 -right-4 text-3xl text-yellow drop-shadow-[2px_2px_0_rgba(0,0,0,1)] rotate-12">★</div>

            {step === "email" && (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="unsub-email" className="block font-bold mb-2">your email address</label>
                  <input
                    id="unsub-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hi@example.com"
                    className="w-full p-3 y2k-border bg-gray-50 focus:bg-white outline-none"
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-red font-bold text-sm bg-red/10 p-2 y2k-border">{error}</p>}
                <button type="submit" disabled={loading} className="y2k-button w-full mt-2 bg-yellow hover:bg-yellow">
                  {loading ? "sending..." : "send otp ➔"}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerify} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="unsub-otp" className="block font-bold mb-2">enter 6-digit otp</label>
                  <p className="text-xs mb-3 text-gray-500">sent to {email}</p>
                  <input
                    id="unsub-otp"
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="000000"
                    className="w-full p-3 y2k-border bg-gray-50 focus:bg-white outline-none text-center text-2xl tracking-widest"
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-red font-bold text-sm bg-red/10 p-2 y2k-border">{error}</p>}
                <button type="submit" disabled={loading} className="y2k-button w-full mt-2 bg-yellow hover:bg-yellow">
                  {loading ? "verifying..." : "verify & unsubscribe ✗"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep("email")} 
                  className="text-sm underline text-center mt-2"
                >
                  change email
                </button>
              </form>
            )}

            {step === "success" && (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">👋</div>
                <h2 className="font-bold text-2xl mb-2 text-green">unsubscribed.</h2>
                <p className="text-sm">you have been successfully unsubscribed from all status alerts.</p>
                <div className="mt-6 y2k-pill bg-gray-200 text-black font-bold py-2 px-4 inline-block shadow-none border-2">
                  monitoring disabled
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column (Yellow) - Status */}
      <div className="bg-yellow p-8 md:p-16 flex flex-col justify-center relative overflow-hidden order-2 border-b-3 md:border-b-0 border-black md:order-2">
        {/* Background stars */}
        <div className="absolute top-10 right-10 text-4xl text-black/10">★</div>
        <div className="absolute bottom-20 left-10 text-6xl text-black/10 rotate-45">★</div>
        <div className="absolute top-1/2 right-1/4 text-2xl text-black/10">★</div>

        <div className="max-w-md w-full mx-auto relative z-10">
          <div className="mb-12">
            <h2 className="font-bold mb-4">live status</h2>
            <div className="y2k-pill bg-white flex items-center justify-between p-4 px-6 mb-6">
              <span className="font-bold text-xl uppercase tracking-wider">{statusObj.status}</span>
              <span className={cn(
                "w-6 h-6 rounded-full y2k-border animate-pulse shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                statusObj.status === "operational" && "bg-green",
                statusObj.status === "degraded" && "bg-orange",
                statusObj.status === "outage" && "bg-red",
                statusObj.status === "checking..." && "bg-gray-400",
                statusObj.status === "unknown" && "bg-gray-400"
              )}></span>
            </div>

            {/* Dynamic Components List */}
            {(() => {
              const order: Record<string, number> = { outage: 0, degraded: 1, operational: 2, unknown: 3 };
              const ALLOWED_COMPONENTS = ['claude.ai', 'claude api (api.anthropic.com)', 'claude code', 'claude cowork'];
              
              const sortedComponents = [...(statusObj.components || [])]
                .filter((c) => ALLOWED_COMPONENTS.includes(c.name))
                .sort((a, b) => {
                  return (order[a.status] ?? 3) - (order[b.status] ?? 3);
                });

              return sortedComponents.length > 0 ? (
                <div className="mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {sortedComponents.map((component) => (
                    <div key={component.name} className="y2k-card p-3 bg-white mb-3 flex justify-between items-center y2k-shadow hover:y2k-shadow">
                      <span className="font-bold flex items-center gap-2">
                        <span className={cn(
                          "w-3 h-3 rounded-full y2k-border shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex-shrink-0",
                          component.status === "operational" && "bg-green",
                          component.status === "degraded" && "bg-orange",
                          component.status === "outage" && "bg-red",
                          component.status === "unknown" && "bg-gray-400"
                        )}></span>
                        {component.name}
                      </span>
                      <span className={cn(
                        "text-sm text-black px-2 py-1 rounded y2k-border border-2 shadow-none whitespace-nowrap font-bold",
                        component.status === "operational" && "bg-green",
                        component.status === "degraded" && "bg-orange",
                        component.status === "outage" && "bg-red",
                        component.status === "unknown" && "bg-gray-400"
                      )}>{component.status}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="y2k-card p-4 bg-white mb-6 text-center text-sm">
                  no components found
                </div>
              );
            })()}

            <div className="text-xs font-bold text-center mb-2 flex justify-between">
              <span>next check in 60s</span>
              <span className="text-gray-500">
                last: {time ?? "--"}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-4 bg-white y2k-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
