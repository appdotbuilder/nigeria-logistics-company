import { Button } from '@/components/ui/button';

export function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with sea port theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-800 to-blue-800">
        {/* Overlay pattern to simulate port/maritime theme */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Animated icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-4xl">🚢</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Your Trusted
            <span className="block text-blue-400">Logistics Partner</span>
            in Nigeria
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            From customs clearance to last-mile delivery, we provide comprehensive logistics solutions 
            that connect businesses across Nigeria and beyond with reliability, efficiency, and innovation.
          </p>

          {/* Key highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-white font-semibold">Fast & Reliable</p>
              <p className="text-slate-300 text-sm">Quick turnaround times</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-2xl mb-2">🛡️</div>
              <p className="text-white font-semibold">Secure & Safe</p>
              <p className="text-slate-300 text-sm">Full cargo protection</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
              <div className="text-2xl mb-2">🌍</div>
              <p className="text-white font-semibold">Global Reach</p>
              <p className="text-slate-300 text-sm">International connections</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('services')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Explore Services
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection('contact')}
              className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-3 text-lg"
            >
              Get Quote
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-white border-opacity-20">
            <p className="text-slate-400 text-sm mb-4">Trusted by 500+ businesses across Nigeria</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="text-white text-sm font-medium bg-white bg-opacity-10 px-4 py-2 rounded-full">
                📊 Supply Chain Excellence
              </div>
              <div className="text-white text-sm font-medium bg-white bg-opacity-10 px-4 py-2 rounded-full">
                🏆 ISO Certified
              </div>
              <div className="text-white text-sm font-medium bg-white bg-opacity-10 px-4 py-2 rounded-full">
                ⏱️ 24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}