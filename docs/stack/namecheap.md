# Namecheap

**What:** Domain registrar.

**Why chosen:** Cheap (~$8–12/year for `.com`), free WHOIS privacy, simple DNS handoff to Cloudflare.

**Cost:** ~$12/year per domain.

**Alternatives considered:** Cloudflare Registrar (at-cost pricing, but limited TLD coverage), Porkbun (great alternative; pick whichever has the price you want for the TLD), Google Domains (sunset).

**Used in template by:** Nothing at runtime. The domain points DNS at Cloudflare, which fronts Vercel.

**Env vars / secrets:** None.

**Setup:**
1. Buy `<your-domain>.com`.
2. In the domain settings, change nameservers to Cloudflare's (Cloudflare gives you the exact two NS hostnames after you add the domain there).
3. Wait for propagation (usually <1h).
