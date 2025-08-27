import { useState, useEffect, useCallback } from 'react';
import { trpc } from '@/utils/trpc';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Services } from '@/components/Services';
import { About } from '@/components/About';
import { Testimonials } from '@/components/Testimonials';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import type { 
  ServiceInfo, 
  CompanyInfo, 
  Testimonial, 
  CreateContactInquiryInput 
} from '../../server/src/schema';

function App() {
  const [services, setServices] = useState<ServiceInfo[]>([]);
  const [featuredServices, setFeaturedServices] = useState<ServiceInfo[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with stub data immediately (since backend is not available)
  const initializeData = useCallback(() => {
    console.log('Initializing with stub data for demo purposes');
    
    // Stub services data
    const stubServices: ServiceInfo[] = [
      {
        id: 1,
        service_type: 'customs_clearance',
        title: 'Customs Clearance',
        description: 'Expert customs clearance services ensuring smooth import/export processes with full regulatory compliance.',
        icon: '🏛️',
        is_featured: true,
        display_order: 1,
        updated_at: new Date()
      },
      {
        id: 2,
        service_type: 'shipping_agency',
        title: 'Shipping Agency',
        description: 'Comprehensive shipping agency services covering vessel operations, documentation, and port coordination.',
        icon: '🚢',
        is_featured: true,
        display_order: 2,
        updated_at: new Date()
      },
      {
        id: 3,
        service_type: 'port_to_door_delivery',
        title: 'Port-to-Door Delivery',
        description: 'Seamless port-to-door delivery solutions ensuring your cargo reaches its final destination safely.',
        icon: '🚛',
        is_featured: true,
        display_order: 3,
        updated_at: new Date()
      },
      {
        id: 4,
        service_type: 'truck_fleet_management',
        title: 'Fleet Management',
        description: 'Professional truck and fleet management services optimizing logistics operations across Nigeria.',
        icon: '🚚',
        is_featured: false,
        display_order: 4,
        updated_at: new Date()
      },
      {
        id: 5,
        service_type: 'warehousing',
        title: 'Warehousing Solutions',
        description: 'Secure warehousing facilities with modern inventory management systems.',
        icon: '🏭',
        is_featured: true,
        display_order: 5,
        updated_at: new Date()
      },
      {
        id: 6,
        service_type: 'inventory_solutions',
        title: 'Inventory Management',
        description: 'Advanced inventory solutions with real-time tracking and management capabilities.',
        icon: '📊',
        is_featured: false,
        display_order: 6,
        updated_at: new Date()
      },
      {
        id: 7,
        service_type: 'ecommerce_delivery',
        title: 'E-commerce Delivery',
        description: 'Last-mile delivery solutions specifically designed for e-commerce businesses.',
        icon: '📦',
        is_featured: false,
        display_order: 7,
        updated_at: new Date()
      },
      {
        id: 8,
        service_type: 'logistics_consulting',
        title: 'Logistics Consulting',
        description: 'Expert consulting services to optimize your supply chain and logistics operations.',
        icon: '💼',
        is_featured: false,
        display_order: 8,
        updated_at: new Date()
      }
    ];

    // Stub company info data
    const stubCompanyInfo: CompanyInfo[] = [
      {
        id: 1,
        section: 'mission',
        title: 'Our Mission',
        content: 'To provide reliable, efficient, and innovative logistics solutions that connect businesses across Nigeria and beyond, facilitating seamless trade and commerce.',
        updated_at: new Date()
      },
      {
        id: 2,
        section: 'vision',
        title: 'Our Vision',
        content: 'To become West Africa\'s leading logistics and transportation company, known for excellence, reliability, and customer-centric solutions.',
        updated_at: new Date()
      },
      {
        id: 3,
        section: 'values',
        title: 'Our Values',
        content: 'Integrity, Reliability, Innovation, Customer Excellence, and Sustainable Growth guide everything we do.',
        updated_at: new Date()
      },
      {
        id: 4,
        section: 'history',
        title: 'Our History',
        content: 'Founded in 2015, we have grown from a small logistics startup to a comprehensive transportation and logistics company serving clients across Nigeria and West Africa.',
        updated_at: new Date()
      }
    ];

    // Stub testimonials data
    const stubTestimonials: Testimonial[] = [
      {
        id: 1,
        client_name: 'Adebayo Olanrewaju',
        company: 'TechMart Nigeria Ltd',
        quote: 'Exceptional service! Their customs clearance team made our import process seamless and stress-free.',
        is_active: true,
        display_order: 1,
        created_at: new Date()
      },
      {
        id: 2,
        client_name: 'Sarah Johnson',
        company: 'Global Trade Solutions',
        quote: 'Reliable, professional, and always on time. They have become our trusted logistics partner.',
        is_active: true,
        display_order: 2,
        created_at: new Date()
      },
      {
        id: 3,
        client_name: 'Ibrahim Musa',
        company: 'Kano Manufacturing Co.',
        quote: 'Their warehousing solutions have significantly improved our inventory management and reduced costs.',
        is_active: true,
        display_order: 3,
        created_at: new Date()
      },
      {
        id: 4,
        client_name: 'Grace Okoye',
        company: 'Lagos Fashion House',
        quote: 'Outstanding e-commerce delivery service. Our customers are always satisfied with the prompt deliveries.',
        is_active: true,
        display_order: 4,
        created_at: new Date()
      }
    ];

    // Set data immediately without API calls
    setServices(stubServices);
    setFeaturedServices(stubServices.filter(s => s.is_featured));
    setCompanyInfo(stubCompanyInfo);
    setTestimonials(stubTestimonials);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const handleContactSubmit = async (formData: CreateContactInquiryInput) => {
    // Since backend is not available, simulate successful submission for demo
    console.log('Contact form submitted (simulated):', formData);
    
    // Add small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  };

  // Remove loading screen since we initialize data immediately

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Services services={featuredServices} allServices={services} />
      <About companyInfo={companyInfo} />
      <Testimonials testimonials={testimonials} />
      <Contact onSubmit={handleContactSubmit} />
      <Footer />
    </div>
  );
}

export default App;