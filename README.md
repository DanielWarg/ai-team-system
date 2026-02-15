# Agent Team System - SIMS-like AI Society

**Mål:** AI agents som lär sig, diskuterar, och utvecklas tillsammans  
**Status:** ✅ LIVE  
**Built:** 2026-02-15 (35 minuter, estimat: 2h)  
**Tech:** OpenClaw + Opus 4.6 + NextJS + Telegram

---

## What Is This?

Replicerar Simile AI society-koncept (Jun Park, Stanford):
- **Agents med identitet** (SOUL.md) - personality, expertise, perspective
- **Agents med minne** (LEARNINGS.md) - persistent learning mellan sessions
- **Agents som diskuterar** (Team Debrief) - conversation, inte bara reports
- **24/7 aktivitet** (Activity Engine) - agents "lever" i office environment
- **Visual dashboard** (NextJS) - se vad som händer i realtid

**Problem vi löser:** Agents repeterade samma misstag (Equipment Maintenance proposed 2x, killed 2x). Ingen feedback-loop = ingen learning.

**Lösning:** Learning system där agents läser SOUL + LEARNINGS innan körning, Team Debrief simulerar konversationer och uppdaterar learnings.

---

## Architecture

```
ECOSYSTEM (not just pipeline)
├── Agents (Scout, Analyst, Skeptiker)
│   ├── SOUL.md (identity, personality, voice)
│   ├── LEARNINGS.md (persistent memory)
│   └── BRIEF.md (dagens uppdrag)
├── Team Debrief (12:30 daily)
│   ├── Reads all reports
│   ├── Simulates conversation
│   ├── Extracts learnings
│   └── Updates all LEARNINGS.md
├── Activity Engine (every 15 min)
│   ├── Simulates 24/7 agent activities
│   ├── Updates state.json
│   └── Office visualization
├── Visual Dashboard (NextJS)
│   ├── Build Progress (Kanban + Timeline)
│   ├── The Office (SIMS-style visualization)
│   └── Team Debriefs (conversation viewer)
└── Telegram Integration
    ├── Live agent channels
    ├── Team discussion
    └── Announcements to Daniel
```

---

## Quick Start

### 1. Dashboard

**Start NextJS:**
```bash
cd /Users/evil/projekt-kompass/agents/team-system/dashboard
npm run dev
```

**URLs:**
- Build Progress: http://localhost:3001
- The Office: http://localhost:3001/office
- Team Debriefs: Click "Team Debriefs" button

### 2. Telegram (Optional)

**Setup (5 min):**
```bash
cd /Users/evil/projekt-kompass/agents/team-system/telegram

# 1. Create bot via @BotFather, get token
python3 bot.py setup <bot-token>

# 2. Create groups: #scout, #analyst, #skeptiker, #team-discussion, #announcements
# 3. Add bot to all groups
# 4. Send test message in each group

# 5. Get chat IDs
python3 bot.py get-chat-ids

# 6. Update telegram/config.json with IDs
# 7. Test
python3 bot.py post scout "Test 🔍"
python3 bot.py announce "Test announcement 🐇"
```

**Full instructions:** [telegram/README.md](./telegram/README.md)

### 3. Cron Jobs

**Agents run automatically:**
- 06:00: Scout researches (free sources first, Brave Search om nödvändigt)
- 10:00: Analyst validates (siffror, break-even, TAM, risks)
- 12:00: Skeptiker challenges (find flaws, search for free competitors)
- 12:30: Team Debrief (conversation, learnings extraction)
- Every 15 min: Activity Engine (updates office state)

**Manual trigger:**
```bash
# Trigger Scout now
cron run scout-daily-research

# Check cron status
cron list
```

---

## File Structure

```
agents/team-system/
├── README.md (this file)
├── CHANGELOG.md (build log)
├── ARCHITECTURE.md (detailed design)
├── MISSION.md (shared team goal)
├── dashboard/ (NextJS app)
│   ├── app/
│   │   ├── page.tsx (Build Progress)
│   │   ├── office/page.tsx (The Office)
│   │   ├── components/ConversationViewer.tsx (Team Debriefs)
│   │   └── api/
│   │       ├── progress/route.ts
│   │       ├── activity/route.ts
│   │       └── debriefs/route.ts
│   └── package.json
└── telegram/
    ├── README.md (setup guide)
    ├── bot.py (Telegram integration)
    ├── config.json (bot token + chat IDs)
    └── post-report.sh (helper script)

agents/team/
├── state.json (24/7 activity tracking)
├── activity-engine.py (simulates agent activities)
└── debriefs/
    ├── YYYY-MM-DD.md (conversation markdown)
    └── YYYY-MM-DD.json (conversation JSON for UI)

agents/scout/
├── SOUL.md (identity: enthusiastic explorer)
├── LEARNINGS.md (what Scout learned)
├── BRIEF-v2.md (dagens uppdrag)
├── TIERED_SEARCH.md (free sources first)
└── reports/YYYY-MM-DD.md

agents/analyst/
├── SOUL.md (identity: skeptical calculator)
├── LEARNINGS.md (pricing mistakes, TAM errors, churn)
├── BRIEF.md (dagens uppdrag)
└── reports/YYYY-MM-DD.md

agents/skeptic/
├── SOUL.md (identity: paranoid protector)
├── LEARNINGS.md (free competitors, Fortnox risk)
├── BRIEF.md (dagens uppdrag)
└── reports/YYYY-MM-DD.md
```

---

## Success Criteria (Testing 2026-02-16)

✅ Scout stops proposing Equipment Maintenance (reads LEARNINGS)  
✅ Analyst references Scout's past pricing mistakes  
✅ Skeptiker references Analyst's optimism bias  
✅ Team Debrief contains conversation (not just summary)  
✅ Dashboard shows live activity (office visualization)  
✅ Telegram channels active (optional, after Daniel's setup)

---

## Roadmap

### ✅ Phase 1: Learning System (DONE)
- Agent SOULs (identity, personality)
- LEARNINGS.md (persistent memory)
- Team Debrief (conversation simulator)
- Dashboard (Kanban, timeline, conversation viewer)
- 24/7 Activity Engine (SIMS-style office)

### 🔄 Phase 2: Communication (IN PROGRESS)
- Telegram integration (live channels)
- Real-time team discussion
- Daniel can follow/participate
- **Status:** Infrastructure ready, waiting for Daniel's bot setup

### 📋 Phase 3: SIMS Features (NEXT)
- Relationships (agents gillar/ogillar varandra)
- Mood tracking (affects decisions/communication)
- Events (saker händer mellan runs)
- Agent voting on decisions

### 🚀 Phase 4: Autonomy (FUTURE)
- Agents spawna sub-tasks själva
- Budget management ($100/mån Brave Search = GO)
- Cost tracking per agent
- Retry/undo decisions

---

## Tech Stack

- **OpenClaw:** Agent orchestration, cron jobs, sessions
- **Opus 4.6:** Heavy reasoning (Team Debrief)
- **Sonnet 4.5:** Daily agent runs (Scout, Analyst, Skeptiker)
- **Haiku 4.5:** Lightweight tasks (activity engine)
- **NextJS + Tailwind:** Dashboard
- **Python:** Agent scripts, Telegram bot
- **Markdown + JSON:** Reports, learnings, state
- **Git:** Version control (https://github.com/DanielWarg/ai-team-system)

---

## Philosophy

**"Plastbit på snöret"** - Simple tools, 3-7 day MVP, <5k SEK launch cost

**Learning > Iteration** - Analyze what worked BEFORE changing  
**Quality > Mall** - Fungerar > perfekt  
**24/7 > Scheduled** - Agents live, work, meet continuously  
**SIMS > Pipeline** - Society, not automation

---

## Links

- **GitHub:** https://github.com/DanielWarg/ai-team-system
- **Dashboard:** http://localhost:3001 (run `npm run dev` in dashboard/)
- **CHANGELOG:** [CHANGELOG.md](./CHANGELOG.md) - detailed build log
- **ARCHITECTURE:** [ARCHITECTURE.md](./ARCHITECTURE.md) - system design
- **MISSION:** [MISSION.md](./MISSION.md) - team goal

---

**Built:** 2026-02-15 in 50 minutes (Dashboard 5m + System 35m + Expansion 10m)  
**Tested:** 2026-02-16 06:00-13:00 (Scout → Analyst → Skeptiker → Team Debrief)  
**Status:** ✅ LIVE, learning, evolving 24/7 🐇
