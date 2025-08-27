import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🚢</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">LogiFlow</h3>
                <p className="text-xs text-slate-400">Logistics Solutions</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Your trusted logistics partner in Nigeria, providing comprehensive transportation 
              and logistics solutions that connect businesses across Africa and beyond.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => window.open('https://linkedin.com/company/logiflow', '_blank')}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => window.open('https://twitter.com/logiflow', '_blank')}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => window.open('mailto:info@logiflow.ng')}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </Button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Our Services</h4>
            <ul className="space-y-3">
              {[
                'Customs Clearance',
                'Shipping Agency',
                'Port-to-Door Delivery',
                'Fleet Management',
                'Warehousing Solutions',
                'E-commerce Delivery'
              ].map((service) => (
                <li key={service}>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="text-slate-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', section: 'home' },
                { label: 'About Us', section: 'about' },
                { label: 'Services', section: 'services' },
                { label: 'Testimonials', section: 'testimonials' },
                { label: 'Contact', section: 'contact' }
              ].map((link) => (
                <li key={link.section}>
                  <button
                    onClick={() => scrollToSection(link.section)}
                    className="text-slate-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-blue-400 text-sm">📍</span>
                <div>
                  <p className="text-slate-300 text-sm">
                    123 Logistics Boulevard<br />
                    Victoria Island, Lagos<br />
                    Nigeria
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-400 text-sm">📞</span>
                <a 
                  href="tel:+2341234567890"
                  className="text-slate-300 hover:text-white text-sm transition-colors duration-200"
                >
                  +234 123 456 7890
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-400 text-sm">📧</span>
                <a 
                  href="mailto:info@logiflow.ng"
                  className="text-slate-300 hover:text-white text-sm transition-colors duration-200"
                >
                  info@logiflow.ng
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-slate-400 mb-4 md:mb-0">
            © {currentYear} LogiFlow Logistics Solutions. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => window.open('/privacy', '_blank')}
              className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => window.open('/terms', '_blank')}
              className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
            >
              Terms of Service
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 text-slate-400 hover:text-white text-sm transition-colors duration-200"
            >
              <span>Back to Top</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Contact Banner */}
      <div className="bg-blue-600 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0 sm:mr-6">
              <span className="text-lg">🚨</span>
              <span className="text-white font-medium">Emergency Logistics Support:</span>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="tel:+2341234567890"
                className="text-white hover:text-blue-100 font-medium transition-colors duration-200"
              >
                📞 +234 123 456 7890
              </a>
              <span className="text-blue-200">•</span>
              <span className="text-blue-100 text-sm">Available 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}