# Environment Variables Setup Guide

Here is a step-by-step guide on how and where to obtain each of the required API keys and environment variables for your `.env` file.

## Phase 1: Authentication & Database

### `NEXTAUTH_SECRET`
- **What it is:** A random string used by NextAuth.js to encrypt tokens and email verification hashes.
- **How to get it:** You can generate one quickly by running the following command in your terminal:
  ```bash
  openssl rand -base64 32
  ```
- **Where to find it:** Just paste the generated string into your `.env` file.

### `NEXTAUTH_URL`
- **What it is:** The base URL of your application.
- **How to get it:** For local development, this is `http://localhost:3000`. In production, it will be your domain (e.g., `https://yourdomain.com`).

### `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- **What it is:** Credentials for Google OAuth login.
- **Where to find it:** 
  1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
  2. Create a new project or select an existing one.
  3. Navigate to **APIs & Services > Credentials**.
  4. Click **Create Credentials** and select **OAuth client ID**.
  5. Choose **Web application**. Add your Authorized JavaScript origins (e.g., `http://localhost:3000`) and Authorized redirect URIs (e.g., `http://localhost:3000/api/auth/callback/google`).
  6. Copy the **Client ID** and **Client Secret**.

### `EMAIL_SERVER` & `EMAIL_FROM`
- **What it is:** The SMTP server configuration used by NextAuth to send "Magic Link" login emails.
- **Where to find it:** If you are using **Resend** (which is also used in Phase 4), you can use their SMTP interface.
  - `EMAIL_SERVER` format: `smtp://resend:re_123456789@smtp.resend.com:465` (replace `re_123456789` with your Resend API key).
  - `EMAIL_FROM`: Any verified email domain on your Resend account (e.g., `noreply@yourdomain.com`).

### `MONGODB_URI`
- **What it is:** The connection string for your MongoDB database.
- **Where to find it:**
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
  2. Create a free cluster.
  3. Under **Database**, click **Connect**.
  4. Choose **Drivers** and copy the connection string.
  5. Replace `<password>` with your database user password and `myFirstDatabase` with the database name (e.g., `gojiberry`).
  6. *For local dev:* You can use `mongodb://localhost:27017/gojiberry`.

---

## Phase 2: Background Jobs

### `INNGEST_EVENT_KEY` & `INNGEST_SIGNING_KEY`
- **What it is:** Keys for Inngest, a reliable background jobs and workflows engine.
- **Where to find it:**
  1. Go to the [Inngest Dashboard](https://app.inngest.com/).
  2. Create an account and a new project.
  3. Navigate to **Manage > Environments** or the **Keys** section.
  4. Copy both the Event Key (for sending events) and the Signing Key (for verifying webhooks).

---

## Phase 3: Scraping

### `PROXYCURL_API_KEY`
- **What it is:** API key for Proxycurl, used to scrape LinkedIn profiles and company data.
- **Where to find it:**
  1. Go to the [Proxycurl Dashboard](https://nubela.co/proxycurl/).
  2. Sign up and log in.
  3. Navigate to the dashboard homepage.
  4. Copy your API Key from the main view.

---

## Phase 4: Email

### `RESEND_API_KEY`
- **What it is:** API key for Resend, used to send transactional and marketing emails.
- **Where to find it:**
  1. Go to the [Resend Dashboard](https://resend.com/).
  2. Sign up and navigate to **API Keys** in the sidebar.
  3. Click **Create API Key**.
  4. Copy the key (it starts with `re_...`).

---

## Phase 5 & 6: Rate Limiting & CRM

### `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`
- **What it is:** Credentials for an Upstash Redis database, often used for rate limiting and caching.
- **Where to find it:**
  1. Go to the [Upstash Console](https://console.upstash.com/).
  2. Create a new Redis database.
  3. Scroll down to the **REST API** section on the database details page.
  4. Copy the **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN**.

---

## Integrations

### `HUBSPOT_CLIENT_ID` & `HUBSPOT_CLIENT_SECRET`
- **What it is:** OAuth credentials for integrating with HubSpot CRM.
- **Where to find it:**
  1. Go to the [HubSpot Developer Portal](https://developers.hubspot.com/).
  2. Create a developer account and a new app.
  3. Go to your app's **Auth** settings.
  4. Copy the **Client ID** and **Client Secret**.
  5. *(Alternative)* If you are building a Private App just for one account, go to HubSpot Settings > Integrations > Private Apps, create an app, and copy the Access Token.

### `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET`
- **What it is:** Keys for integrating Stripe payments.
- **Where to find it:**
  1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/).
  2. Turn on **Test Mode** (top right) for development.
  3. Navigate to **Developers > API keys**.
  4. Copy the **Secret key** (starts with `sk_test_...`) for `STRIPE_SECRET_KEY`.
  5. Go to **Developers > Webhooks**, create an endpoint (e.g., `http://localhost:3000/api/webhooks/stripe`).
  6. Click **Reveal** under the webhook signing secret to get the `STRIPE_WEBHOOK_SECRET` (starts with `whsec_...`).
