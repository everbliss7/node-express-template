export const config = () => {
  const environment = process.env.ENVIRONMENT || 'development';
  return {
    port: process.env.PORT || 3000,
    redis: {
    url: process.env.REDIS_URL,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  api: {
    secret: process.env.API_SECRET,
  },
  knock: {
    apiKey: process.env.KNOCK_API_KEY
  },
  email: {
    host: process.env.EMAIL_HOST as string,
    port: parseInt(process.env.EMAIL_PORT as string) || 587,
    secure: process.env.EMAIL_SECURE as unknown as boolean || false,
    auth: {
      user: process.env.EMAIL_AUTH_USER as string,
      pass: process.env.EMAIL_AUTH_PASS as string,
    },
    from: process.env.EMAIL_FROM as string,
  },
  microsoft: {
    sharePoint: {
      siteUrl: process.env.SHAREPOINT_SITE_URL,
      clientId: process.env.SHAREPOINT_CLIENT_ID,
      clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
      tenantId: process.env.SHAREPOINT_TENANT_ID,
    },
  },
  system_email: process.env.SYSTEM_EMAIL || 'noreply@system.com',
  base_url: process.env.BASE_URL || 'http://localhost:3000',
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000'
  };
};
