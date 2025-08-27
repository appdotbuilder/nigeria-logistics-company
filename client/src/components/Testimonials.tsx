import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Testimonial } from '../../../server/src/schema';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeTestimonials = testimonials.filter((t: Testimonial) => t.is_active);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (activeTestimonials.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activeTestimonials.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [activeTestimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % activeTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
  };

  if (activeTestimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say about our logistics services.
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-white shadow-lg border-slate-200">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <svg className="w-12 h-12 text-blue-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.719c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              
              <blockquote className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed mb-8">
                "{activeTestimonials[currentIndex].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {activeTestimonials[currentIndex].client_name.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900 text-lg">
                    {activeTestimonials[currentIndex].client_name}
                  </h4>
                  <p className="text-slate-600">
                    {activeTestimonials[currentIndex].company}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prevTestimonial}
            className="rounded-full border-slate-300 hover:bg-slate-100"
            disabled={activeTestimonials.length <= 1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          
          <div className="flex space-x-2">
            {activeTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex 
                    ? 'bg-blue-600' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={nextTestimonial}
            className="rounded-full border-slate-300 hover:bg-slate-100"
            disabled={activeTestimonials.length <= 1}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>

        {/* Testimonial Grid for Smaller Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {activeTestimonials.map((testimonial: Testimonial, index) => (
            <button
              key={testimonial.id}
              onClick={() => goToTestimonial(index)}
              className={`text-left p-4 rounded-lg border transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-blue-100 border-blue-300 shadow-md'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.client_name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">
                    {testimonial.client_name}
                  </p>
                  <p className="text-slate-600 text-xs">
                    {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-slate-700 text-sm line-clamp-3">
                "{testimonial.quote}"
              </p>
            </button>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-6">Trusted by leading businesses across Nigeria</p>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-slate-700">
              💼 SMEs & Enterprises
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-slate-700">
              🏭 Manufacturers
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-slate-700">
              🛒 E-commerce
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-slate-700">
              🌍 Importers & Exporters
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}