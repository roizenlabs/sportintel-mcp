# 💰 Apify Monetization Guide - SportIntel MCP

**Actor**: SportIntel MCP - AI Sports Analytics with Injury Risk Detection
**Version**: 1.2
**Actor ID**: OdaJN92JUkidz02uv

---

## 📋 Quick Start

**Access Monetization Settings**:
1. Go to: https://console.apify.com/actors/OdaJN92JUkidz02uv/settings
2. Scroll to **"Publication & Monetization"** section
3. Configure your pricing model

---

## 💵 Pricing Models Available

### 1. **Free Tier with Paid Upgrades** (Recommended)

**Best for**: Building user base while monetizing power users

**Configuration**:
- **Free tier**: 10-50 projections/day
- **Paid tier**: Unlimited projections
- **Price**: $9.99-29.99/month

**Pros**:
- Low barrier to entry
- Users can test before buying
- Good for building initial traction

**Cons**:
- Free users consume resources
- Need to manage rate limits

---

### 2. **Pay-Per-Use**

**Best for**: Occasional users who don't need daily access

**Configuration**:
- **Per run**: $0.50-2.00 per run
- **Per projection**: $0.01-0.05 per player projection
- **Per lineup**: $0.25-1.00 per optimized lineup

**Pros**:
- Fair pricing for occasional users
- No commitment required
- Easy to understand

**Cons**:
- May discourage daily users
- Revenue less predictable

---

### 3. **Subscription-Based** (Recommended for Sports Analytics)

**Best for**: Daily fantasy sports players who need regular access

**Configuration**:
- **Starter**: $9.99/month - 100 projections/day
- **Pro**: $19.99/month - 500 projections/day + injury analysis
- **Elite**: $49.99/month - Unlimited + priority support

**Pros**:
- Predictable recurring revenue
- Matches DFS user behavior (daily usage)
- Higher lifetime value

**Cons**:
- Requires commitment from users
- Need to prove ongoing value

---

### 4. **Hybrid Model** (Best Option)

**Best for**: Maximizing revenue across user segments

**Configuration**:
```
Free Tier (Trial):
  - 5 projections/day
  - Basic SHAP explanations
  - No injury risk analysis

Starter ($9.99/month):
  - 100 projections/day
  - Full SHAP explanations
  - AI injury risk detection
  - Email support

Pro ($19.99/month):
  - 500 projections/day
  - All features
  - Live odds comparison
  - Priority support
  - Export to CSV

Elite ($49.99/month):
  - Unlimited projections
  - All features
  - API access
  - White-label option
  - 1-on-1 onboarding
```

**Pros**:
- Captures all user segments
- Clear upgrade path
- Maximizes revenue potential

**Cons**:
- More complex to manage
- Need clear tier differentiation

---

## 🎯 Recommended Pricing Strategy

### For SportIntel MCP v1.2:

**Tier 1: Free Trial (7 days)**
- 50 total projections during trial
- All features unlocked
- No credit card required
- **Goal**: Let users experience full value

**Tier 2: Hobby ($9.99/month)**
- 100 projections/day (3,000/month)
- AI injury risk detection
- SHAP explanations
- Live odds (100 checks/day)
- **Target**: Casual DFS players

**Tier 3: Pro ($24.99/month)** ⭐ Most Popular
- 1,000 projections/day (30,000/month)
- All Hobby features
- Lineup optimizer (20 lineups/day)
- Priority injury updates
- CSV export
- **Target**: Serious DFS players

**Tier 4: Elite ($49.99/month)**
- Unlimited projections
- Unlimited lineups
- API access (5,000 req/day)
- Real-time odds updates
- Email support
- **Target**: Professional bettors & data scientists

**Tier 5: Enterprise (Custom)**
- Unlimited everything
- White-label option
- Dedicated support
- Custom integrations
- **Target**: DFS platforms, sportsbooks, content creators

---

## 💡 Why This Pricing Works

### Market Research

**Competitor Pricing** (DFS Projection Tools):
- **RotoGrinders Premium**: $19.99/month
- **FantasyLabs**: $39/month (daily), $99/month (all sports)
- **NumberFire Premium**: $9.99/month
- **DFS Army**: $19.99/month
- **Awesemo**: $39/month

**Our Competitive Advantage**:
- ✅ **Only MCP-based** tool (works with Claude Desktop)
- ✅ **Only tool with HuggingFace** injury sentiment
- ✅ **SHAP explanations** (competitors are black boxes)
- ✅ **Evidence-based** injury adjustments
- ✅ **Multi-bookmaker** odds comparison

**Value Proposition**:
- **$9.99**: Cheaper than RotoGrinders + more features
- **$24.99**: Same as DFS Army but with AI injury detection
- **$49.99**: Cheaper than FantasyLabs + SHAP explainability

---

## 📊 Revenue Projections

### Conservative Estimate (Month 3):

```
Free Trial Users: 100 (conversion rate: 10%)
  → 10 paid users

Tier Breakdown:
  Hobby ($9.99):      6 users × $9.99  = $59.94
  Pro ($24.99):       3 users × $24.99 = $74.97
  Elite ($49.99):     1 user  × $49.99 = $49.99

Total MRR (Month 3): $184.90
Annual Run Rate:     $2,218.80
```

### Optimistic Estimate (Month 6):

```
Free Trial Users: 500 (conversion rate: 15%)
  → 75 paid users

Tier Breakdown:
  Hobby ($9.99):     30 users × $9.99  = $299.70
  Pro ($24.99):      35 users × $24.99 = $874.65
  Elite ($49.99):    10 users × $49.99 = $499.90

Total MRR (Month 6): $1,674.25
Annual Run Rate:     $20,091.00
```

### Aggressive Estimate (Month 12):

```
Free Trial Users: 2,000 (conversion rate: 20%)
  → 400 paid users

Tier Breakdown:
  Hobby ($9.99):    150 users × $9.99  = $1,498.50
  Pro ($24.99):     200 users × $24.99 = $4,998.00
  Elite ($49.99):    50 users × $49.99 = $2,499.50

Total MRR (Month 12): $8,996.00
Annual Run Rate:      $107,952.00
```

---

## 🔧 Implementation Steps

### Step 1: Configure Apify Settings

1. **Go to Actor Settings**:
   - https://console.apify.com/actors/OdaJN92JUkidz02uv/settings

2. **Enable Monetization**:
   ```
   Publication & Monetization
   ✅ Make Actor public
   ✅ List in Apify Store
   ✅ Enable paid access
   ```

3. **Set Up Pricing Tiers**:
   ```
   Free Tier:
     Name: "Trial"
     Duration: 7 days
     Limits: 50 total runs

   Paid Tier 1:
     Name: "Hobby"
     Price: $9.99/month
     Limits: 100 runs/day

   Paid Tier 2:
     Name: "Pro"
     Price: $24.99/month
     Limits: 1000 runs/day

   Paid Tier 3:
     Name: "Elite"
     Price: $49.99/month
     Limits: Unlimited
   ```

4. **Payment Settings**:
   ```
   ✅ Enable Apify billing
   ✅ Set up Stripe account
   ✅ Configure payout schedule (monthly)
   ```

### Step 2: Add Usage Limits to Code

Create a new file for usage tracking:

```typescript
// src/services/usage-tracker.ts
export class UsageTracker {
  async checkLimit(userId: string, tier: string): Promise<boolean> {
    const limits = {
      trial: 50,      // Total runs
      hobby: 100,     // Per day
      pro: 1000,      // Per day
      elite: 999999   // Unlimited
    };

    const usage = await this.getUsage(userId);
    return usage < limits[tier];
  }

  async incrementUsage(userId: string): Promise<void> {
    // Increment usage counter
  }
}
```

### Step 3: Update Input Schema

Add tier detection to input:

```typescript
// src/types/tools.ts
export interface PlayerProjectionsInput {
  sport: string;
  // ... existing fields

  // Optional: Auto-detected from Apify
  userTier?: 'trial' | 'hobby' | 'pro' | 'elite';
  userId?: string;
}
```

### Step 4: Implement Rate Limiting

```typescript
// In player-projections.ts
async execute(args: any): Promise<PlayerProjectionsOutput> {
  const input = PlayerProjectionsInputSchema.parse(args);

  // Check usage limits
  const usageTracker = new UsageTracker();
  const canProceed = await usageTracker.checkLimit(
    input.userId || 'anonymous',
    input.userTier || 'trial'
  );

  if (!canProceed) {
    throw new Error('Usage limit reached. Please upgrade your plan.');
  }

  // ... rest of execute logic

  // Increment usage
  await usageTracker.incrementUsage(input.userId || 'anonymous');
}
```

---

## 📈 Growth Strategy

### Month 1-2: Free Trial Focus
- Goal: 100 trial users
- Tactics:
  - Post on Reddit (r/dfsports, r/sportsbook)
  - Twitter threads with example projections
  - Product Hunt launch
  - Free tier with clear value

### Month 3-4: Conversion Optimization
- Goal: 15% trial → paid conversion
- Tactics:
  - Email sequence for trial users
  - Limited-time 20% off offer
  - Case studies showing ROI
  - Testimonials from beta users

### Month 5-6: Paid User Growth
- Goal: 75 paid users
- Tactics:
  - Content marketing (blog posts)
  - YouTube tutorials
  - Partnership with DFS creators
  - Referral program (10% recurring)

### Month 7-12: Scale & Retention
- Goal: 400 paid users
- Tactics:
  - Feature releases (NFL, MLB)
  - Community building (Discord)
  - Advanced features for Elite tier
  - Annual plans (2 months free)

---

## 🎁 Promotional Strategies

### Launch Promotion (Month 1)
```
🚀 Launch Special: 50% OFF First Month

  Hobby:  $4.99 → $9.99/month after
  Pro:    $12.49 → $24.99/month after
  Elite:  $24.99 → $49.99/month after

  Code: LAUNCH50
  Expires: 30 days after public launch
```

### Seasonal Promotions
```
March Madness: 25% OFF (March)
NFL Draft:     30% OFF (April)
NBA Playoffs:  FREE Trial Extended to 14 days (May)
Fantasy Draft: 40% OFF Annual Plans (August)
```

### Referral Program
```
Refer a Friend:
  You get: 10% recurring commission
  They get: 20% off first 3 months

Example: Refer 10 Pro users
  → Earn $24.99 × 10 × 10% = $24.99/month passive income
```

---

## 🔐 Feature Gating Strategy

### Free Trial (7 days)
- ✅ All features unlocked
- ✅ Full SHAP explanations
- ✅ AI injury detection
- ❌ Limited to 50 projections total
- ❌ No CSV export
- ❌ No API access

### Hobby ($9.99/month)
- ✅ 100 projections/day
- ✅ SHAP explanations
- ✅ AI injury detection
- ✅ Live odds (100/day)
- ❌ No CSV export
- ❌ No API access
- ❌ Standard support only

### Pro ($24.99/month)
- ✅ 1,000 projections/day
- ✅ All Hobby features
- ✅ Lineup optimizer (20/day)
- ✅ CSV export
- ✅ Priority injury updates
- ✅ Email support
- ❌ No API access

### Elite ($49.99/month)
- ✅ Unlimited projections
- ✅ All Pro features
- ✅ API access (5,000 req/day)
- ✅ Real-time updates
- ✅ Priority support
- ✅ Early access to new features

---

## 📊 Metrics to Track

### User Acquisition
- Trial signups/week
- Traffic sources
- Conversion rate by source
- Cost per acquisition

### Engagement
- Daily active users
- Average runs per user
- Feature usage breakdown
- Session duration

### Revenue
- MRR (Monthly Recurring Revenue)
- ARPU (Average Revenue Per User)
- LTV (Lifetime Value)
- Churn rate

### Conversion
- Trial → Paid conversion %
- Tier upgrade rate
- Time to first conversion
- Cancellation reasons

---

## 🎯 Success Metrics (Month 6 Goals)

- **Users**: 500 trial signups
- **Conversion**: 15% trial → paid
- **MRR**: $1,500+
- **Churn**: <10% monthly
- **NPS**: >50 (highly satisfied)
- **Support**: <24hr response time

---

## 💳 Payment Integration

### Apify Built-In Billing
Apify handles:
- ✅ Payment processing
- ✅ Subscription management
- ✅ Usage tracking
- ✅ Invoicing
- ✅ Tax compliance
- ✅ Payouts to you

**You Get**:
- 80% of revenue (Apify takes 20%)
- Monthly payouts via Stripe
- Dashboard for analytics
- No payment infrastructure needed

### Alternative: Stripe Direct
If you want more control:
- ✅ Keep 97% (Stripe takes 3%)
- ✅ Direct customer relationship
- ✅ Custom billing logic
- ❌ More implementation work
- ❌ Handle tax compliance yourself

**Recommendation**: Start with Apify billing, switch to Stripe if you hit $5K+ MRR

---

## 📞 Next Steps

1. **Enable Monetization** (5 minutes)
   - Go to Actor settings
   - Enable "Paid Access"
   - Set pricing tiers

2. **Add Usage Tracking** (2 hours)
   - Implement UsageTracker service
   - Add tier detection
   - Test rate limiting

3. **Create Marketing Materials** (1 day)
   - Landing page highlighting unique features
   - Demo video showing AI injury detection
   - Case study with ROI calculation

4. **Launch Campaign** (Ongoing)
   - Reddit post in r/dfsports
   - Twitter announcement
   - Product Hunt submission
   - Email existing beta users

5. **Monitor & Iterate** (Weekly)
   - Track conversion metrics
   - Gather user feedback
   - Optimize pricing if needed
   - Add requested features

---

## 🏆 Competitive Positioning

**Tagline**: "The First AI Sports Analytics Tool with SHAP Explainability + HuggingFace Injury Detection"

**Value Props**:
1. **Transparency**: Only tool showing WHY projections change
2. **AI-Powered**: HuggingFace injury sentiment analysis
3. **Evidence-Based**: See actual news causing adjustments
4. **MCP Native**: Works seamlessly with Claude Desktop
5. **Multi-Sport Ready**: Architecture supports NBA, NFL, MLB, NHL

**Why Users Should Pay**:
- ✅ Save 10+ hours/week on research
- ✅ More accurate projections → Higher DFS winnings
- ✅ Understand injury impact → Better decisions
- ✅ Compare odds → Find best lines
- ✅ SHAP explanations → Learn what drives value

**ROI Calculation**:
```
DFS Player earning $100/week:
  With SportIntel: +20% accuracy = $120/week
  Cost: $24.99/month (~$6/week)
  Net Gain: $14/week = $728/year

ROI: 2,900% annually
```

---

**Ready to monetize? Start here**: https://console.apify.com/actors/OdaJN92JUkidz02uv/settings

**Questions?** Check Apify docs: https://docs.apify.com/platform/actors/publishing/monetizing

---

**Built with ❤️ by RoizenLabs**

**Powered by**: Claude AI, TypeScript, Apify, HuggingFace
