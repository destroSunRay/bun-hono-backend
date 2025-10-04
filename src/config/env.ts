import { z } from 'zod';
import dotenv from 'dotenv';

if (!process.env.NODE_ENV) {
  console.warn("NODE_ENV is not set, defaulting to 'development'");
  dotenv.config({
    path: '.env',
  });
}

const envSchema = z
  .object({
    NODE_ENV: z.string().default('development'),
    PORT: z.coerce.number().min(1).default(8000),
    LOG_LEVEL: z
      .enum(['debug', 'info', 'warn', 'error', 'fatal', 'trace', 'http'])
      .optional(),
    // CORS allowed origin
    CORS_ORIGIN: z.string(),
    // Application URL for email links
    APPLICATION_URL: z.url(),
    // PostgreSQL connection string
    DATABASE_URL: z.url(),
    // Secret key for signing and verifying JWTs
    BETTER_AUTH_SECRET: z.string().min(32).max(1024),
    // Google and GitHub OAuth credentials
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    // Resend email service API key and sender email
    RESEND_API_KEY: z.string(),
    FROM_EMAIL: z.email(),
  })
  .transform((env) => ({
    ...env,
    LOG_LEVEL:
      env.LOG_LEVEL || (env.NODE_ENV === 'production' ? 'info' : 'debug'),
    CORS_ORIGIN: env.CORS_ORIGIN.split(',').map((s) => s.trim()),
  }))
  .refine((env) => env.CORS_ORIGIN.length > 0, {
    message: 'CORS_ORIGIN must contain at least one origin',
  });

let env: z.infer<typeof envSchema>;

try {
  env = envSchema.parse(process.env);
  console.log('✅ Environment variables loaded and validated');
} catch (error) {
  const e = error as z.ZodError;
  console.error('❌ Invalid environment variables:', error);
  console.error(
    'Configuration validation error:',
    e.issues?.map((i) => i.path.join('.') + ': ' + i.message).join(', ')
  );
  process.exit(1);
}

export default env;
