# Apify Store Submission Guide

## 📋 Submission Checklist

This guide will help you submit SportIntel-MCP to the Apify Store for public discovery and monetization.

---

## ✅ Pre-Submission Checklist

### 1. Testing
- [ ] Test Actor via Apify Console (manual test)
- [ ] Run automated tests (use `./test-actor.sh`)
- [ ] Verify all 4 tools work correctly
- [ ] Check that real data is being returned
- [ ] Confirm no errors in logs

### 2. Documentation
- [x] Actor README completed (`.actor/README.md`)
- [x] Input schema defined (`.actor/input_schema.json`)
- [x] Example inputs provided
- [x] Output format documented
- [ ] Add usage examples
- [ ] Include troubleshooting section

### 3. Visual Assets
- [ ] Create actor icon (256x256 PNG)
- [ ] Take screenshots (5 recommended)
- [ ] Record demo video (optional but recommended)
- [ ] Design banner image (1200x630 PNG)

### 4. Metadata
- [x] Actor title (compelling)
- [x] Short description (160 chars max)
- [x] Full description (markdown)
- [x] Categories (SPORTS, AI, ENTERTAINMENT)
- [ ] Keywords/tags
- [ ] Pricing tiers

---

## 🎨 Visual Assets to Create

### 1. Actor Icon (Required)

**Specs:**
- Size: 256x256 pixels
- Format: PNG with transparency
- Style: Clean, professional
- Content: Sports + AI themed

**Suggestions:**
- Basketball + Brain icon
- DFS abbreviation with AI chip
- Sports analytics graph
- Use brand colors (blues, greens)

**Tools:**
- Canva: https://canva.com
- Figma: https://figma.com
- DALL-E: https://chat.openai.com (ask for icon design)

### 2. Screenshots (Highly Recommended)

Take 5 screenshots showing:

**Screenshot 1: Input Configuration**
- Show the input form with example arguments
- Highlight the 4 available tools
- Caption: "Easy configuration - choose your tool and set parameters"

**Screenshot 2: Player Projections Output**
- Show dataset with 200+ players
- Highlight key fields (salary, projection, value)
- Caption: "Get AI-powered projections for 200+ NBA players"

**Screenshot 3: Explainability View**
- Show SHAP explanation for a player
- Highlight reasoning and factors
- Caption: "Understand WHY the AI recommends each player"

**Screenshot 4: Lineup Optimization**
- Show generated optimized lineups
- Highlight constraints and strategies
- Caption: "Generate optimal DFS lineups automatically"

**Screenshot 5: Live Odds Comparison**
- Show odds from multiple sportsbooks
- Highlight best odds finder
- Caption: "Compare odds across 10+ sportsbooks in real-time"

**How to Capture:**
1. Run Actor with example inputs
2. Open Dataset view
3. Take screenshot (CMD+SHIFT+4 on Mac, Windows+SHIFT+S on Windows)
4. Crop to show relevant data
5. Add subtle borders/shadows in Canva

### 3. Demo Video (Optional but Powerful)

**Length:** 30-90 seconds
**Content:**
1. Show Actor input form (5 sec)
2. Click "Start" (2 sec)
3. Show it running (3 sec)
4. Show results dataset (10 sec)
5. Highlight key features (10 sec)
6. Show export options (5 sec)

**Tools:**
- Loom: https://loom.com (free screen recording)
- OBS Studio: https://obsproject.com (advanced)
- QuickTime (Mac built-in)

**Script:**
> "Welcome to SportIntel MCP - the first AI-powered sports analytics actor for Apify. Simply choose your tool, configure parameters, and get explainable DFS projections in seconds. With real salary data from DraftKings, AI-powered projections, and lineup optimization, you'll have everything you need to dominate Daily Fantasy Sports. Try it free today."

---

## 📝 Store Listing Content

### Title (60 chars max)
```
SportIntel MCP - AI-Powered Sports Analytics
```

### Short Description (160 chars max)
```
Get AI-powered DFS player projections, lineup optimization, and live betting odds with SHAP explainability. Real data from DraftKings, RotoGrinders & more.
```

### Full Description

Use the content from `.actor/README.md` - it's already comprehensive!

**Key sections to highlight:**
- Features (4 tools)
- Use cases (DFS, betting, content creation)
- Data sources (credibility)
- Unique value prop (explainable AI)
- Example outputs

### Categories
- [x] Sports
- [x] AI
- [x] Entertainment

### Keywords/Tags
```
dfs, daily fantasy sports, sports betting, nba, nfl, mlb, ai, machine learning,
sports analytics, draftkings, fanduel, player projections, lineup optimizer,
shap, explainable ai, betting odds, mcp, model context protocol
```

---

## 💰 Pricing Strategy

### Recommended Tiers

**Free Tier (Discovery)**
- 100 runs/month
- All features enabled
- Community support
- Purpose: Let users try it out

**Starter Plan - $15/month**
- 1,000 runs/month
- All features
- Email support
- Purpose: Casual DFS players

**Pro Plan - $49/month** (⭐ POPULAR)
- 10,000 runs/month
- All features
- Priority support
- API access docs
- Purpose: Serious DFS players

**Enterprise - $199/month**
- Unlimited runs
- All features
- Dedicated support
- Custom integrations
- SLA guarantee
- Purpose: B2B customers

### Pay-Per-Run Option
- $0.01 per run
- No subscription
- Pay as you go
- Purpose: Occasional users

---

## 🚀 Submission Process

### Step 1: Finalize Documentation

1. Review `.actor/README.md`
2. Add any missing examples
3. Fix typos/formatting
4. Ensure all links work

### Step 2: Create Visual Assets

1. Design actor icon (256x256)
2. Take 5 screenshots
3. (Optional) Record demo video
4. Upload to Apify Console

### Step 3: Configure Settings

1. Go to: https://console.apify.com/actors/OdaJN92JUkidz02uv/settings
2. Upload icon
3. Add screenshots
4. Configure categories
5. Set visibility to "Public"

### Step 4: Set Up Pricing

1. Go to "Pricing" tab
2. Create pricing tiers (see above)
3. Set free tier limits
4. Configure payment options
5. Set up Stripe (if not already)

### Step 5: Submit for Review

1. Go to "Publish" tab
2. Review all information
3. Check "I agree to terms"
4. Click "Submit to Apify Store"
5. Wait for approval (usually 2-5 days)

---

## 📊 What Happens After Submission

### Apify Review Process

**Timeline:** 2-5 business days

**They Check:**
- Actor works correctly
- Documentation is complete
- No policy violations
- Pricing is reasonable
- Code quality (basic check)

**Common Rejection Reasons:**
- Incomplete documentation
- Missing visual assets
- Actor doesn't run
- Policy violations
- Misleading description

### Upon Approval

1. **Listed in Store** - Actor appears in Apify Store
2. **Discoverable** - Shows up in search results
3. **Monetization Enabled** - Can earn from usage
4. **Analytics Available** - Track runs, revenue, users
5. **Featured Opportunity** - May be featured by Apify

---

## 📈 Post-Launch Strategy

### Week 1: Soft Launch

1. **Test Everything**
   - Run comprehensive tests
   - Monitor for errors
   - Check analytics daily

2. **Get Initial Users**
   - Share on Reddit (r/dfsports, r/apify)
   - Post on Twitter
   - Email friends/beta testers

3. **Gather Feedback**
   - Monitor comments
   - Respond quickly
   - Fix bugs immediately

### Week 2-4: Growth

1. **Content Marketing**
   - Write blog post: "How I Built an AI Sports Analytics Actor"
   - Create tutorial video
   - Submit to Product Hunt

2. **SEO Optimization**
   - Update keywords
   - Improve description
   - Add more examples

3. **Feature Development**
   - Add NFL support (high demand)
   - Improve projections
   - Add more data sources

### Month 2+: Scale

1. **Partnerships**
   - Reach out to DFS sites
   - Contact sports podcasts
   - B2B outreach

2. **Pricing Optimization**
   - Analyze conversion rates
   - A/B test pricing
   - Add enterprise tier

3. **Platform Expansion**
   - Build standalone SaaS
   - Create mobile app
   - Offer white-label

---

## 🎯 Success Metrics to Track

### Usage Metrics
- Total runs
- Unique users
- Run success rate
- Average run duration

### Revenue Metrics
- MRR (Monthly Recurring Revenue)
- Conversion rate (free → paid)
- Customer acquisition cost
- Lifetime value

### Growth Metrics
- New signups/day
- Churn rate
- Net Promoter Score (NPS)
- Feature usage breakdown

### Quality Metrics
- Error rate
- Customer support tickets
- Average rating
- Review sentiment

---

## 📞 Support & Resources

### Apify Documentation
- Actor Store Guide: https://docs.apify.com/platform/actors/publishing
- Pricing Docs: https://docs.apify.com/platform/actors/running/usage-and-resources
- Best Practices: https://docs.apify.com/academy/deploying-your-code

### Community
- Apify Discord: https://discord.com/invite/jyEM2PRvMU
- Apify Forum: https://community.apify.com

### Contact
- Email: support@apify.com
- In-app chat: Available in Console

---

## ✅ Quick Start Commands

### Test Your Actor Locally
```bash
npm run dev
```

### Test on Apify
```bash
./test-actor.sh
```

### View Actor Console
```bash
open https://console.apify.com/actors/OdaJN92JUkidz02uv
```

### Check Build Status
```bash
apify info
```

### Push Updates
```bash
apify push
```

---

## 🎉 Ready to Submit?

Once you've completed the checklist:

1. ✅ Created visual assets (icon, screenshots)
2. ✅ Tested thoroughly
3. ✅ Configured pricing
4. ✅ Reviewed documentation

**Go to**: https://console.apify.com/actors/OdaJN92JUkidz02uv/publish

**Click**: "Submit to Apify Store"

**Then**: Wait 2-5 days for approval

Good luck! 🚀

---

**Need Help?**

If you get stuck:
1. Check Apify docs
2. Ask in Apify Discord
3. Email support@apify.com
4. Refer back to this guide

**Questions about your Actor?**
- Review `APIFY_DEPLOYED.md` for deployment details
- Check `PHASE2_COMPLETED.md` for technical details
- See `QUICKSTART.md` for usage guide
