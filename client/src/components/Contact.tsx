import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { CreateContactInquiryInput, ServiceType } from '../../../server/src/schema';

interface ContactProps {
  onSubmit: (data: CreateContactInquiryInput) => Promise<boolean>;
}

export function Contact({ onSubmit }: ContactProps) {
  const [formData, setFormData] = useState<CreateContactInquiryInput>({
    name: '',
    email: '',
    phone_number: '',
    company: null,
    service_of_interest: 'customs_clearance',
    message: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const serviceOptions: Array<{ value: ServiceType; label: string }> = [
    { value: 'customs_clearance', label: 'Customs Clearance' },
    { value: 'shipping_agency', label: 'Shipping Agency' },
    { value: 'port_to_door_delivery', label: 'Port-to-Door Delivery' },
    { value: 'truck_fleet_management', label: 'Fleet Management' },
    { value: 'warehousing', label: 'Warehousing Solutions' },
    { value: 'inventory_solutions', label: 'Inventory Management' },
    { value: 'ecommerce_delivery', label: 'E-commerce Delivery' },
    { value: 'logistics_consulting', label: 'Logistics Consulting' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const success = await onSubmit(formData);
      if (success) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone_number: '',
          company: null,
          service_of_interest: 'customs_clearance',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Your Quote Today
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Ready to streamline your logistics? Contact our experts for a customized solution 
            that meets your business needs and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 h-fit">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
                <CardDescription className="text-slate-300">
                  Get in touch with our logistics experts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📍</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Address</h4>
                    <p className="text-slate-300 text-sm">
                      123 Logistics Boulevard<br />
                      Victoria Island, Lagos<br />
                      Nigeria
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📞</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Phone</h4>
                    <p className="text-slate-300 text-sm">
                      +234 123 456 7890<br />
                      +234 098 765 4321
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-lg">📧</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Email</h4>
                    <p className="text-slate-300 text-sm">
                      info@logiflow.ng<br />
                      quotes@logiflow.ng
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-lg">⏰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Business Hours</h4>
                    <p className="text-slate-300 text-sm">
                      Mon - Fri: 8:00 AM - 6:00 PM<br />
                      Sat: 9:00 AM - 2:00 PM<br />
                      Emergency: 24/7
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white text-slate-900 border-slate-200">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Success/Error Messages */}
                  {submitStatus === 'success' && (
                    <Alert className="border-green-200 bg-green-50">
                      <AlertDescription className="text-green-800">
                        ✅ Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {submitStatus === 'error' && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">
                        ❌ Something went wrong. Please try again or contact us directly.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: CreateContactInquiryInput) => ({ ...prev, name: e.target.value }))
                        }
                        required
                        placeholder="Enter your full name"
                        className="border-slate-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: CreateContactInquiryInput) => ({ ...prev, email: e.target.value }))
                        }
                        required
                        placeholder="your.email@company.com"
                        className="border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: CreateContactInquiryInput) => ({ ...prev, phone_number: e.target.value }))
                        }
                        required
                        placeholder="+234 123 456 7890"
                        className="border-slate-300"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData((prev: CreateContactInquiryInput) => ({ 
                            ...prev, 
                            company: e.target.value || null 
                          }))
                        }
                        placeholder="Your company name (optional)"
                        className="border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">Service of Interest *</Label>
                    <Select
                      value={formData.service_of_interest}
                      onValueChange={(value: ServiceType) =>
                        setFormData((prev: CreateContactInquiryInput) => ({ ...prev, service_of_interest: value }))
                      }
                    >
                      <SelectTrigger className="border-slate-300">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setFormData((prev: CreateContactInquiryInput) => ({ ...prev, message: e.target.value }))
                      }
                      required
                      placeholder="Tell us about your logistics needs, timeline, and any specific requirements..."
                      className="border-slate-300 min-h-[120px]"
                    />
                    <p className="text-xs text-slate-500">
                      Minimum 10 characters required
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      'Send Message & Get Quote'
                    )}
                  </Button>
                  
                  <p className="text-xs text-slate-500 text-center">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}