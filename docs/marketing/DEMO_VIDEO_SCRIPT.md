# 🎥 SportIntel MCP - Demo Video Script

**Target Length**: 2-3 minutes
**Recording Tool**: OBS Studio, Loom, or Screen Studio
**Resolution**: 1080p (1920x1080)
**Voice**: Natural, conversational tone

---

## 📝 Full Script

### Opening (0:00-0:15)
```
[SCREEN: Apify Actor page - https://console.apify.com/actors/OdaJN92JUkidz02uv]
[Cursor highlights title]

NARRATION:
"Hi! I'm excited to show you SportIntel MCP - the first AI-powered
sports analytics Actor with explainable projections.

If you play Daily Fantasy Sports, bet on games, or just love sports data,
this is going to change how you make decisions.

Let's jump in."

[Transition: Click "Try for free" button]
```

**Visual Notes**:
- Open with clean browser window (close extra tabs)
- Title clearly visible: "SportIntel MCP - AI Sports Analytics"
- Cursor should be visible and easy to follow
- Smooth transitions

---

### Scene 1: Player Projections Setup (0:15-0:35)
```
[SCREEN: Input form with empty fields]
[Cursor moves through form]

NARRATION:
"First, let's get AI-powered player projections for tonight's NBA games.

I'll select the 'get_player_projections' tool..."

[Click tool dropdown, select get_player_projections]

"...set sport to NBA..."

[Type/select "NBA" in sport field]

"...and limit to 10 players for a quick demo."

[Type "10" in maxPlayers field]

"I'll also enable explanations so we can see WHY the AI recommends
each player."

[Check/toggle includeExplanations]

"Now let's run it!"

[Click "Start" button]
```

**Visual Checklist**:
- [ ] Tool dropdown clearly shows all 4 tools
- [ ] Form fields are large and readable
- [ ] Values being entered are visible
- [ ] "Start" button click is obvious

---

### Scene 2: Projections Loading & Results (0:35-1:15)
```
[SCREEN: Run status page showing "Running..."]
[Status updates visible]

NARRATION:
"The Actor is now analyzing real-time stats from the BallDontLie API...

[Wait 2-3 seconds for drama]

...and we're done in under 50 seconds!"

[SCREEN: Results page with player projections]
[Scroll slowly to show multiple players]

"Amazing - we got 14 NBA players with complete projections.

Let's look at Giannis Antetokounmpo..."

[Click to expand Giannis entry]
[Highlight key fields as you mention them]

"...projected for 63.4 fantasy points at a $5,500 salary.

That's 11.53 points per thousand dollars - incredible value!

But here's where it gets interesting - check out the AI explanation."

[Scroll to explanation section]
[Highlight topFactors array]

"The AI breaks down exactly WHY:

- Recent performance adds 63.4 fantasy points
- He's been averaging 63.4 points over his last 8 games

This is SHAP AI explainability in action. You're not just getting
numbers - you're understanding the story behind them."
```

**Visual Checklist**:
- [ ] Loading indicator visible
- [ ] Timestamp shows <60s execution
- [ ] Player data is expanded and readable
- [ ] SHAP explanation is highlighted
- [ ] Zoom in slightly on explanation section (120%)

---

### Scene 3: Live Odds Tool (1:15-1:50)
```
[SCREEN: Back to input form]
[Cursor clicks "New run" or similar]

NARRATION:
"Next, let's compare live betting odds across multiple sportsbooks.

I'll select the 'get_live_odds' tool..."

[Select get_live_odds from dropdown]

"...choose NBA..."

[Select NBA]

"...and request spreads and totals."

[Type/select ["spreads", "totals"] in markets field]

"Let's see what we get!"

[Click "Start"]

[SCREEN: Loading briefly, then results]

"Perfect - we just pulled odds from 7 different sportsbooks in real-time."

[Scroll to show multiple bookmakers]

"Look at the 76ers-Heat game..."

[Expand game entry]
[Highlight different spreads]

"FanDuel has the Heat at -11.5...

but MyBookie has them at -7.5.

That's a 4-point difference!

If you're betting, you want the best line - and this finds it instantly
across 10+ sportsbooks."
```

**Visual Checklist**:
- [ ] Input form transition is smooth
- [ ] Markets field clearly shows array input
- [ ] Multiple bookmakers visible in results
- [ ] Spread differences are highlighted
- [ ] Timestamps show fresh data (<5 min)

---

### Scene 4: AI Explanations Deep Dive (1:50-2:25)
```
[SCREEN: New run, explain_recommendation tool]

NARRATION:
"Now let's dig even deeper into WHY the AI recommends a specific player.

I'll use the 'explain_recommendation' tool..."

[Select explain_recommendation]

"...and ask about Giannis."

[Type "giannis-antetokounmpo" in playerId field]

"This gives us a detailed SHAP breakdown."

[Click "Start"]
[SCREEN: Results with full SHAP explanation]

"Here's where SportIntel MCP really shines."

[Scroll through topFactors]

"The AI shows exactly what's driving the projection:

[Highlight each factor as you read it]

- Recent PPG adds 4.2 fantasy points
- High Vegas total adds 2.1 points
- Weak opponent defense adds 1.8 points
- Playing at home adds 0.7 points
- But only 1 day of rest subtracts 0.3 points

[Highlight confidence score]

And it's 85% confident in this prediction.

You're not guessing anymore - you're making data-driven decisions
with full transparency."
```

**Visual Checklist**:
- [ ] Explanation factors are clearly visible
- [ ] Impact scores (+/-) are highlighted
- [ ] Confidence score is prominent
- [ ] Text is readable at normal zoom

---

### Scene 5: Use Cases & Features (2:25-2:45)
```
[SCREEN: Actor overview page showing README]
[Scroll slowly through features]

NARRATION:
"So who is SportIntel MCP for?

[Scroll to use cases section]

DFS players can optimize lineups with confidence...

Sports bettors can find the best odds and make informed picks...

Data scientists get structured sports data via API...

And since this uses the Model Context Protocol, Claude Desktop
can now answer sports questions with real data!

[Scroll to show all 4 tools]

All 4 tools are production-ready and thoroughly tested."
```

**Visual Checklist**:
- [ ] README features are visible
- [ ] Use cases section is clear
- [ ] All 4 tools are mentioned
- [ ] MCP protocol is highlighted

---

### Closing (2:45-3:00)
```
[SCREEN: Actor page with "Try for free" button visible]
[Cursor hovers over button]

NARRATION:
"SportIntel MCP is available now on Apify - try it for free!

Whether you're crushing DFS tournaments, shopping for the best lines,
or just want AI-powered insights you can actually understand...

this tool has you covered.

[Show GitHub/docs links briefly]

Check out the full documentation and let me know what you think!

Thanks for watching - and may your picks always hit!"

[FADE TO BLACK]
[END SCREEN: Show title, links, QR code for 3 seconds]
```

**Visual Checklist**:
- [ ] "Try for free" button is prominent
- [ ] Links are shown clearly (can be read)
- [ ] End screen has:
  - Title: "SportIntel MCP"
  - Apify link
  - GitHub link
  - Optional: QR code for easy access

---

## 🎬 Production Notes

### Before Recording

**Clean Your Browser**:
- [ ] Close all extra tabs
- [ ] Clear bookmarks bar (or use clean profile)
- [ ] Disable browser extensions that show icons
- [ ] Set zoom to 100% (or 110% for better readability)

**Prepare Apify Console**:
- [ ] Log in to your Apify account
- [ ] Have Actor page bookmarked
- [ ] Test run once to ensure everything works
- [ ] Have sample inputs ready to copy/paste

**Audio Setup**:
- [ ] Use decent microphone (not laptop mic)
- [ ] Test audio levels (not too loud/quiet)
- [ ] Record in quiet room (no background noise)
- [ ] Have water ready (dry mouth = bad audio)

### Recording Tips

**Screen Recording**:
- [ ] Record at 1920x1080 (1080p)
- [ ] 30fps is fine, 60fps is better
- [ ] Use OBS Studio (free) or Loom (easy)
- [ ] Show cursor at all times
- [ ] Highlight clicks with cursor animation (optional)

**Narration**:
- [ ] Speak clearly and at moderate pace
- [ ] Pause briefly between sections
- [ ] Sound enthusiastic but natural
- [ ] Smile while talking (yes, it affects voice!)
- [ ] Re-record any sections with mistakes

**Pacing**:
- [ ] Let visuals breathe (2-3 sec per screen)
- [ ] Don't rush through results
- [ ] Pause after clicking "Start" buttons
- [ ] Give viewers time to read key numbers

### After Recording

**Editing Checklist**:
- [ ] Cut out long pauses and mistakes
- [ ] Add subtle background music (low volume, ~15%)
- [ ] Add text overlays for key numbers:
  - "63.4 fantasy points"
  - "11.53 pts/$1K"
  - "7 bookmakers"
  - "4-point spread difference"
  - "85% confidence"
- [ ] Add zoom effects for important moments (optional)
- [ ] Add arrows/circles to highlight (optional)
- [ ] Fade in/out at beginning/end

**Export Settings**:
- [ ] 1920x1080 resolution
- [ ] H.264 codec (MP4 format)
- [ ] High quality (not maximum - file size matters)
- [ ] Target: Under 100MB for 3-minute video

---

## 📤 Publishing Checklist

### YouTube Upload

**Title**: "SportIntel MCP: AI Sports Analytics with Explainable Projections (Demo)"

**Description**:
```
SportIntel MCP is the first AI-powered sports analytics Actor with explainable projections built on the Model Context Protocol.

🏀 What it does:
- Player projections with SHAP AI explanations
- Live odds from 10+ sportsbooks
- Lineup optimization for DFS
- Deep explainability for every prediction

🎯 Who it's for:
- Daily Fantasy Sports players
- Sports bettors
- Data scientists
- Anyone using Claude Desktop

⚡ Key Features:
- Real-time NBA data
- SHAP-powered explanations showing WHY each player is recommended
- Multi-bookmaker odds comparison
- Production-ready with 93% performance optimizations

🔗 Links:
Apify Store: https://console.apify.com/actors/OdaJN92JUkidz02uv
GitHub: https://github.com/roizenlabs/sportintel-mcp
Blog Post: [your blog link]

Try it free on Apify!

#SportsBetting #DailyFantasy #AI #SportsAnalytics #SHAP #Apify #ModelContextProtocol
```

**Tags**:
- sports analytics
- daily fantasy sports
- sports betting
- nba
- ai
- machine learning
- shap
- explainable ai
- apify
- typescript

**Thumbnail Ideas**:
- Screenshot of SHAP explanation with "WHY?" text
- Split screen: Traditional tool vs SportIntel
- "First MCP Sports Analytics Tool" badge
- Numbers: "10+ Bookmakers, 93% Faster"

---

### Loom Upload (Easier Option)

**Title**: "SportIntel MCP Demo - AI Sports Analytics"

**Description**:
```
Demo of SportIntel MCP - AI-powered sports analytics with explainable projections.

Features:
✅ Player projections with SHAP explanations
✅ Live odds from 10+ sportsbooks
✅ Lineup optimization
✅ AI explainability

Try free: https://console.apify.com/actors/OdaJN92JUkidz02uv
```

---

## 🎨 Alternative: Quick Demo (60 seconds)

If you want a shorter, punchier demo:

### Quick Script (0:00-1:00)

```
[0:00-0:10]
"SportIntel MCP: AI sports analytics with explainable projections.
Let's see it in action."

[0:10-0:30]
[Show player projections running and results]
"Get NBA projections with SHAP explanations - see exactly WHY
each player is recommended. Giannis: 63.4 FP, 11.53 value."

[0:30-0:45]
[Show odds comparison]
"Compare live odds from 10+ sportsbooks. Find 4-point line
shopping opportunities instantly."

[0:45-1:00]
[Show explanation detail]
"Understand every projection with AI breakdowns. Recent performance,
matchup, pace - all explained.

Try it free on Apify!"
```

**Benefits**:
- Easier to record (less narration)
- Better for social media (short attention span)
- Can be posted to Twitter/LinkedIn natively
- Great as a teaser for longer video

---

## 🚀 Ready to Record!

**Recommended Approach**:
1. **Start with short version** (60s) - easier, builds confidence
2. **Then do full version** (3min) - more comprehensive
3. **Post both** - short on social, long on YouTube/Apify

**Tools You'll Need**:
- **Recording**: OBS Studio (free) or Loom ($12/mo)
- **Editing**: DaVinci Resolve (free) or iMovie (Mac)
- **Audio**: Audacity (free) for noise reduction
- **Thumbnail**: Canva (free) or Photoshop

**Time Investment**:
- Short version: 1-2 hours total (record + edit)
- Long version: 3-4 hours total (record + edit)

Good luck with your demo! 🎬

Remember: The video doesn't have to be perfect - it just needs to clearly show the value. Enthusiasm and clear narration matter more than fancy effects.
