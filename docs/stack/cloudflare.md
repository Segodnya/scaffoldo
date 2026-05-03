# Cloudflare

**What:** DNS, CDN, and DDoS protection in front of Vercel.

**Why chosen:** Free DNS with the best UX in the industry. Free SSL. Optional WAF rules. Even if Vercel handles DNS itself, Cloudflare gives you rate-limiting, page rules, and analytics independent of Vercel.

**Free tier:** Unlimited DNS records, free SSL, 100k requests/day on Workers (we don't use Workers in the template — listed as future option).

**Alternatives considered:** Route 53 (paid, more capable for AWS-heavy stacks), Vercel DNS (simpler for one project, but no extra protection layer).

**Used in template by:** Nothing at runtime. Apex `A` record + `CNAME` for `www` point at Vercel's anycast IPs.

**Env vars / secrets:** None.

**Setup:**
1. Add your domain to Cloudflare (free plan).
2. In the Vercel project → Domains → add `<your-domain>.com`. Vercel will tell you the records to create in Cloudflare.
3. Set Cloudflare SSL/TLS mode to **Full (strict)** — Vercel terminates TLS itself.
4. Disable Cloudflare's "Auto Minify" and "Rocket Loader" — Next.js handles its own bundling.
