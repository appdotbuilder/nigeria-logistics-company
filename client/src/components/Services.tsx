import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ServiceInfo } from '../../../server/src/schema';

interface ServicesProps {
  services: ServiceInfo[];
  allServices: ServiceInfo[];
}

export function Services({ services, allServices }: ServicesProps) {
  const [selectedCategory, setSelectedCategory] = useState<'featured' | 'all'>('featured');

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const displayServices = selectedCategory === 'featured' ? services : allServices;

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our Logistics Services
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive logistics solutions tailored for importers, exporters, and businesses 
            across Nigeria. From port operations to last-mile delivery, we've got you covered.
          </p>
        </div>

        {/* Service Category Tabs */}
        <Tabs defaultValue="featured" className="mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger 
              value="featured" 
              onClick={() => setSelectedCategory('featured')}
              className="text-sm"
            >
              Featured Services
            </TabsTrigger>
            <TabsTrigger 
              value="all"
              onClick={() => setSelectedCategory('all')}
              className="text-sm"
            >
              All Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service: ServiceInfo) => (
                <ServiceCard key={service.id} service={service} onGetQuote={scrollToContact} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allServices.map((service: ServiceInfo) => (
                <ServiceCard key={service.id} service={service} onGetQuote={scrollToContact} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-16 bg-blue-600 rounded-2xl p-12 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Need a Custom Logistics Solution?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our logistics experts are ready to design a tailored solution that meets your specific needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline" 
              onClick={scrollToContact}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Get Custom Quote
            </Button>
            <Button 
              size="lg" 
              onClick={() => window.open('tel:+2341234567890', '_self')}
              className="bg-white text-blue-600 hover:bg-slate-100"
            >
              📞 Call Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: ServiceInfo;
  onGetQuote: () => void;
}

function ServiceCard({ service, onGetQuote }: ServiceCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white border-slate-200">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl" role="img" aria-label={service.title}>
            {service.icon || '📦'}
          </span>
        </div>
        <CardTitle className="text-xl font-bold text-slate-900 mb-2">
          {service.title}
        </CardTitle>
        {service.is_featured && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
            ⭐ Featured
          </div>
        )}
      </CardHeader>
      <CardContent>
        <CardDescription className="text-slate-600 text-sm leading-relaxed mb-6">
          {service.description}
        </CardDescription>
        <div className="space-y-3">
          <Button 
            onClick={onGetQuote}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            Get Quote
          </Button>
          <div className="flex items-center justify-center text-xs text-slate-500">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Available 24/7
          </div>
        </div>
      </CardContent>
    </Card>
  );
}