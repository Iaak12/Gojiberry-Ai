# Gojiberry AI: Production-Readiness Plan

Yeh document outline karta hai un sabhi features aur backend systems ko jo Gojiberry AI MVP ko ek fully functional, production-ready SaaS mein convert karne ke liye zaroori hain. 

## Phase 1: Authentication & Security 🔐
**Goal**: User login ko secure banana aur fake sessions ko block karna.
* **Current state**: LocalStorage mein plain email save ho raha hai.
* **Implementation Plan**:
  1. **NextAuth.js (Auth.js) / Clerk** integrate karna.
  2. Google OAuth aur Magic Link login setup karna.
  3. API routes ko protect karna taaki sirf authenticated users hi `POST` ya `GET` request bhej sakein (middleware setup).
  4. Database mein `User` model ko update karke proper user ID mapping karna.

## Phase 2: Background Jobs & Cron Infrastructure ⏱️
**Goal**: Agent 24/7 run ho sake bina Vercel/serverless timeouts ke.
* **Current state**: Normal API routes use ho rahe hain jo 10-60 seconds mein fail ho jate hain lamba task hone par.
* **Implementation Plan**:
  1. **Inngest**, **Trigger.dev**, ya **Upstash QStash** setup karna.
  2. `Autopilot Agent` ke liye daily/hourly cron jobs create karna.
  3. Campaigns (e.g., "Wait 1 day then send message") ke liye delayed queues setup karna.

## Phase 3: Real LinkedIn Scraping & Automation Engine 🤖
**Goal**: UI ke mock data ko hata kar asli LinkedIn signals/leads nikalna.
* **Current state**: Sirf MongoDB mein configuration save ho rahi hai, actual scraping nahi hoti.
* **Implementation Plan**:
  1. **Proxycurl**, **PhantomBuster** ya **Apify** APIs ko integrate karna LinkedIn data (events, groups, companies) nikalne ke liye.
  2. Ek data pipeline banana jo raw data ko Gemini LLM ko bheje ICP matching aur scoring ke liye.
  3. Matched leads ko user ke `Lead` inbox mein save karna.

## Phase 4: Email & Messaging Infrastructure 📧
**Goal**: User ke behalf par emails aur messages bhejna.
* **Current state**: Sirf "mailto" links aur UI buttons hain.
* **Implementation Plan**:
  1. **Resend** ya **SendGrid** API connect karna automated emails ke liye.
  2. Users ko apna Google Workspace / Outlook connect karne ka option dena (SMTP/OAuth) taaki unke email address se emails jayein (cold emailing ke liye zaroori).
  3. LinkedIn messages automate karne ke liye ek **Chrome Extension** build karna (jo local browser session use kare account ban se bachne ke liye).

## Phase 5: CRM & Integrations 🔌
**Goal**: Leads ko directly HubSpot, Folk, wagaira mein bhejna.
* **Current state**: "Send to CRM" button sirf UI mein hai.
* **Implementation Plan**:
  1. HubSpot API aur Folk API ke endpoints setup karna.
  2. User settings mein "Connect HubSpot" OAuth flow banana.
  3. CSV Export feature ko fully functional banana (JSON to CSV parser).

## Phase 6: Rate Limiting, Billing & Production DB 💰
**Goal**: App ko abuse se bachana aur paise kamane ke liye ready karna.
* **Current state**: API khuli hui hai, Gemini bills skyrocket ho sakte hain.
* **Implementation Plan**:
  1. **Upstash Redis** se API rate limits lagana (e.g., max 100 lead generations per day for free users).
  2. **Stripe** integration subscriptions (Pro, Enterprise tiers) ke liye.
  3. Local MongoDB ko **MongoDB Atlas** (cloud cluster) pe migrate karna production variables ke sath.

---

## 🚀 Execution Strategy (Kahan se shuru karein?)
Agar aap is plan ko execute karna chahte ho, toh humein exactly is order mein chalna chahiye:
1. **Phase 1 (Auth)**: Sabse pehle security zaroori hai.
2. **Phase 3 (Scraping)**: Phir real data laana taaki core product work kare.
3. **Phase 2 (Background Jobs)**: Phir us data pipeline ko automate/schedule karna. 

*Plan saved on: August 2026*
