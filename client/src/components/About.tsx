import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CompanyInfo } from '../../../server/src/schema';

interface AboutProps {
  companyInfo: CompanyInfo[];
}

export function About({ companyInfo }: AboutProps) {
  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'mission':
        return '🎯';
      case 'vision':
        return '👁️';
      case 'values':
        return '⭐';
      case 'history':
        return '📅';
      default:
        return '📋';
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'mission':
        return 'bg-blue-100 text-blue-800';
      case 'vision':
        return 'bg-green-100 text-green-800';
      case 'values':
        return 'bg-purple-100 text-purple-800';
      case 'history':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  // Sort company info by section order
  const sortedInfo = [...companyInfo].sort((a, b) => {
    const order = ['mission', 'vision', 'values', 'history'];
    return order.indexOf(a.section) - order.indexOf(b.section);
  });

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            About LogiFlow
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Leading logistics and transportation company in Nigeria, committed to excellence, 
            innovation, and building lasting partnerships with our clients.
          </p>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">8+</div>
            <p className="text-slate-600 text-sm">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">500+</div>
            <p className="text-slate-600 text-sm">Happy Clients</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">10K+</div>
            <p className="text-slate-600 text-sm">Shipments Delivered</p>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <p className="text-slate-600 text-sm">Customer Support</p>
          </div>
        </div>

        {/* Company Information Tabs */}
        <Tabs defaultValue="mission" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
            {sortedInfo.map((info: CompanyInfo) => (
              <TabsTrigger 
                key={info.id} 
                value={info.section}
                className="text-xs md:text-sm capitalize"
              >
                <span className="mr-1">{getSectionIcon(info.section)}</span>
                {info.section}
              </TabsTrigger>
            ))}
          </TabsList>

          {sortedInfo.map((info: CompanyInfo) => (
            <TabsContent key={info.id} value={info.section}>
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getSectionColor(info.section)}`}>
                      <span className="text-xl">{getSectionIcon(info.section)}</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      {info.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-700 text-base leading-relaxed">
                    {info.content}
                  </CardDescription>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Why Choose Us Section */}
        <div className="mt-20 bg-slate-50 rounded-2xl p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-12">
            Why Choose LogiFlow?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Comprehensive Services</h4>
              <p className="text-slate-600 text-sm">
                From customs clearance to last-mile delivery, we offer end-to-end logistics solutions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Technology-Driven</h4>
              <p className="text-slate-600 text-sm">
                Advanced tracking systems and digital solutions for transparent operations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Proven Track Record</h4>
              <p className="text-slate-600 text-sm">
                Years of experience serving businesses across Nigeria and West Africa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}