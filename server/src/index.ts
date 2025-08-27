import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schema types
import { 
  createContactInquiryInputSchema,
  createTestimonialInputSchema,
  updateTestimonialInputSchema,
  updateCompanyInfoInputSchema,
  updateServiceInfoInputSchema
} from './schema';

// Import handlers
import { createContactInquiry } from './handlers/create_contact_inquiry';
import { getContactInquiries } from './handlers/get_contact_inquiries';
import { getTestimonials } from './handlers/get_testimonials';
import { createTestimonial } from './handlers/create_testimonial';
import { updateTestimonial } from './handlers/update_testimonial';
import { getCompanyInfo } from './handlers/get_company_info';
import { updateCompanyInfo } from './handlers/update_company_info';
import { getServices } from './handlers/get_services';
import { getFeaturedServices } from './handlers/get_featured_services';
import { updateServiceInfo } from './handlers/update_service_info';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Contact inquiry endpoints
  createContactInquiry: publicProcedure
    .input(createContactInquiryInputSchema)
    .mutation(({ input }) => createContactInquiry(input)),
  
  getContactInquiries: publicProcedure
    .query(() => getContactInquiries()),

  // Testimonial endpoints
  getTestimonials: publicProcedure
    .query(() => getTestimonials()),
  
  createTestimonial: publicProcedure
    .input(createTestimonialInputSchema)
    .mutation(({ input }) => createTestimonial(input)),
  
  updateTestimonial: publicProcedure
    .input(updateTestimonialInputSchema)
    .mutation(({ input }) => updateTestimonial(input)),

  // Company information endpoints
  getCompanyInfo: publicProcedure
    .query(() => getCompanyInfo()),
  
  updateCompanyInfo: publicProcedure
    .input(updateCompanyInfoInputSchema)
    .mutation(({ input }) => updateCompanyInfo(input)),

  // Service information endpoints
  getServices: publicProcedure
    .query(() => getServices()),
  
  getFeaturedServices: publicProcedure
    .query(() => getFeaturedServices()),
  
  updateServiceInfo: publicProcedure
    .input(updateServiceInfoInputSchema)
    .mutation(({ input }) => updateServiceInfo(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();