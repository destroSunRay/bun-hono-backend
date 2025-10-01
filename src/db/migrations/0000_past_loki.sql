CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"timezone" text DEFAULT 'EST',
	"locale" text DEFAULT 'en-US',
	"currency" text DEFAULT 'USD',
	"subscription_tier" text DEFAULT 'free',
	"preferences" jsonb DEFAULT '{"theme":"system","notifications":{"email":true,"push":true,"budgetAlerts":true,"goalReminders":true},"privacy":{"profileVisibility":"private","transactionVisibility":"private"}}'::jsonb,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
