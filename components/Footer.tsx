import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-12 pb-6 border-t-3 border-black">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div>
          <Link href="/" className="inline-block text-xl font-bold tracking-tighter bg-yellow text-black px-4 py-1.5 rounded-full mb-4 hover:-translate-y-0.5 transition-all">
            kyabeclau.de
          </Link>
          <p className="text-sm text-gray-400 font-bold max-w-xs leading-relaxed">realtime status monitoring site for anthropic claude.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/history" className="hover:text-yellow">history</Link></li>
            <li><Link href="/unsubscribe" className="hover:text-yellow">unsubscribe</Link></li>
            <li><a href="https://github.com/Rhythmdoshi31/isclaudedownagain" target="_blank" rel="noreferrer" className="hover:text-yellow">github repo</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">built by</h4>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <span className="text-white font-bold text-base">rhythm doshi</span>
            <a href="https://rhythmdoshi.site" target="_blank" rel="noreferrer" className="hover:text-yellow transition-colors" title="portfolio">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </a>
            <a href="https://github.com/Rhythmdoshi31" target="_blank" rel="noreferrer" className="hover:text-yellow transition-colors" title="github">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 border-t border-gray-800 pt-6 flex justify-between items-center text-xs">
        <p className="text-gray-500">© {new Date().getFullYear()} isclaudedownagain</p>
        <div className="flex items-center gap-2 text-green font-bold bg-black border border-gray-800 px-3 py-1 rounded-full text-xs">
          <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span> operational badge
        </div>
      </div>
    </footer>
  );
}
