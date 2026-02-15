# Team System Architecture

**Replicating:** Simile AI society concept (Jun Park, Stanford)  
**Using:** OpenClaw + Opus 4.6  
**Goal:** Agents that learn, discuss, evolve together

---

## Core Concept

**Problem:** Current agents are isolated. No memory, no learning, no teamwork.

**Solution:** Agents with:
1. **Identity** (SOUL.md) - who they are
2. **Memory** (LEARNINGS.md) - what they've learned
3. **Mission** (MISSION.md) - shared goal
4. **Conversation** (Team Debrief) - discussion & reflection

---

## System Architecture

```
┌─────────────────────────────────────────────┐
│  TEAM MISSION                               │
│  "Find ONE idea worth 10k SEK in 30 days"  │
│  - Shared goal across all agents           │
│  - Updated daily with progress             │
└─────────────────────────────────────────────┘
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Scout   │    │ Analyst │    │Skeptiker│
├─────────┤    ├─────────┤    ├─────────┤
│ SOUL    │    │ SOUL    │    │ SOUL    │
│ LEARN   │→   │ LEARN   │→   │ LEARN   │
│ BRIEF   │    │ BRIEF   │    │ BRIEF   │
└─────────┘    └─────────┘    └─────────┘
     ↓              ↓              ↓
     └──────────────┼──────────────┘
                    ↓
        ┌───────────────────────┐
        │   TEAM DEBRIEF        │
        │   (12:30 daily)       │
        ├───────────────────────┤
        │ 1. Read all reports   │
        │ 2. Simulate convo     │
        │ 3. Extract learnings  │
        │ 4. Update LEARNINGS   │
        └───────────────────────┘
                    ↓
            (Loop next day)
```

---

## Component Details

### 1. SOUL.md (Agent Identity)

**Purpose:** Define who each agent IS, not just what they DO.

**Structure:**
```markdown
# [Agent Name] - Who I Am

## Expertis
What I'm good at

## Perspektiv
My worldview

## Hur jag tänker
My decision-making process

## Vad jag lärt mig
Past mistakes (references LEARNINGS.md)

## Min röst
How I communicate

## Mitt mål
What I'm trying to achieve
```

**Example (Scout):**
- Expertis: Explorer, pattern finder
- Perspektiv: "There's always an opportunity"
- Röst: Enthusiastic but not naive
- Mål: Find ONE great idea, not 100 mediocre ones

---

### 2. LEARNINGS.md (Agent Memory)

**Purpose:** Persistent memory across sessions.

**Structure:**
```markdown
# [Agent Name] Learnings

## [Topic] (Date)

**TESTAT:** What was tried
**RESULTAT:** What happened
**FEEDBACK:** What others said
**REGEL:** Rule for future

---

**Updated:** YYYY-MM-DD
**Next update:** After team debrief
```

**Key difference from reports:**
- Reports = what happened
- Learnings = what to REMEMBER

---

### 3. MISSION.md (Shared Goal)

**Purpose:** Align all agents toward one objective.

**Structure:**
```markdown
# Team Mission

**Goal:** Find ONE idea worth 10k SEK in 30 days

**Success Criteria:**
- MVP buildable in 3-7 days
- Launch cost <5k SEK
- ROI >50% in 90 days
- Passive operation (<30 min/day)

**Current Status:** (updated daily)
- Ideas tested: X
- Ideas killed: Y
- Ideas "maybe": Z
- Days remaining: N

**Focus this week:**
[What the team is exploring]
```

---

### 4. Team Debrief (Learning Loop)

**When:** Daily, 12:30 (after Scout/Analyst/Skeptiker done)

**What it does:**

1. **Reads all reports**
   - Scout report (YYYY-MM-DD.md)
   - Analyst report (YYYY-MM-DD.md)
   - Skeptiker report (YYYY-MM-DD.md)

2. **Simulates conversation**
   - Not just summary
   - Actual dialogue between agents
   - "Scout: I thought X because..."
   - "Analyst: But you missed Y..."
   - "Skeptiker: You both ignore Z..."

3. **Extracts learnings**
   - What did Scout learn? → Update Scout LEARNINGS.md
   - What did Analyst learn? → Update Analyst LEARNINGS.md
   - What did Skeptiker learn? → Update Skeptiker LEARNINGS.md

4. **Saves debrief**
   - `/agents/team/debriefs/YYYY-MM-DD.md`
   - Contains conversation + learnings extracted

**Example conversation:**
```markdown
## Team Debrief - 2026-02-15

### Participants
Scout, Analyst, Skeptiker, Team Debrief Facilitator

### Discussion

**Facilitator:** Scout, you proposed Equipment Maintenance at 299 SEK/mån. Why?

**Scout:** I saw strong Reddit discussions and thought pricing at competitor-level made sense.

**Analyst:** I adjusted to 199 SEK because competitors charge $35-75/user (350-750 SEK). We need to be 50% cheaper to compete.

**Scout:** I didn't research competitors deeply enough. Next time I'll Google "{idea} + pricing" before suggesting.

**Skeptiker:** Both of you missed that Lantmännen Maskin offers free service tracking. Even 199 SEK can't compete with free.

**Analyst:** You're right. I focused on paid competitors, not free alternatives.

**Facilitator:** What should each of you remember?

**Scout:** Research competitors BEFORE proposing pricing. Don't assume.

**Analyst:** Check for free alternatives, not just paid competitors.

**Skeptiker:** Good catch. Keep pushing on "what are we missing?"

### Learnings Extracted

**Scout LEARNINGS.md updated:**
- REGEL: Google "{idea} + pricing" before suggesting price
- REGEL: Google "{idea} + free" to find free competitors

**Analyst LEARNINGS.md updated:**
- REGEL: Check free alternatives, not just paid SaaS
- REGEL: Lantmännen/industry players often have free tools

**Skeptiker LEARNINGS.md updated:**
- STYRKA: Good at finding free competitors others miss
- FOKUS: Keep searching "{idea} + free" and "{industry} + gratis"
```

---

## Implementation Details

### Cron Updates

**Scout (06:00):**
```
1. Read SOUL.md (who am I?)
2. Read LEARNINGS.md (what have I learned?)
3. Read MISSION.md (what's our goal?)
4. Read BRIEF-v2.md (what should I do today?)
5. Execute research
6. Save report
```

**Analyst (10:00):**
```
1. Read SOUL.md
2. Read LEARNINGS.md
3. Read MISSION.md
4. Read Scout's report
5. Analyze with skepticism
6. Save report
```

**Skeptiker (12:00):**
```
1. Read SOUL.md
2. Read LEARNINGS.md
3. Read MISSION.md
4. Read Analyst's report
5. Challenge assumptions
6. Save report
```

**Team Debrief (12:30):**
```
1. Read Scout/Analyst/Skeptiker reports
2. Simulate conversation
3. Extract learnings
4. Update all LEARNINGS.md
5. Save debrief
```

---

## Success Metrics

**Day 1 (2026-02-16):**
- ✅ Scout reads LEARNINGS → does NOT propose Equipment Maintenance
- ✅ Team Debrief runs → conversation saved

**Day 3 (2026-02-18):**
- ✅ Analyst references Scout's past mistakes in report
- ✅ Skeptiker references Analyst's optimism patterns

**Day 7 (2026-02-22):**
- ✅ Scout proposes 10-15 ideas with quick kill-tests done
- ✅ Agents reference each other's learnings naturally
- ✅ Team finds ONE idea worth pursuing

---

## File Locations

```
/Users/evil/projekt-kompass/agents/
├── team-system/
│   ├── README.md
│   ├── CHANGELOG.md
│   ├── ARCHITECTURE.md (this file)
│   └── MISSION.md
├── team/
│   └── debriefs/
│       ├── 2026-02-15.md
│       ├── 2026-02-16.md
│       └── ...
├── scout/
│   ├── SOUL.md
│   ├── LEARNINGS.md
│   ├── BRIEF-v2.md
│   └── reports/
├── analyst/
│   ├── SOUL.md
│   ├── LEARNINGS.md
│   ├── BRIEF.md
│   └── reports/
└── skeptic/
    ├── SOUL.md
    ├── LEARNINGS.md
    ├── BRIEF.md
    └── reports/
```

---

## Tech Stack

- **OpenClaw cron** - scheduling
- **Opus 4.6** - agent reasoning (via session_spawn or cron isolated)
- **Markdown** - all docs (human + AI readable)
- **Git** - version control (optional, file-based already tracked)

---

## Future Enhancements (v2)

- [ ] Visual dashboard (2nd brain integration)
- [ ] Real-time conversation (not just debrief after)
- [ ] Shared working memory (not just learnings)
- [ ] Agent voting on decisions
- [ ] Simulation mode (test ideas before building)

**v1 Focus:** Make agents LEARN and DISCUSS. Nothing else.

---

**Last updated:** 2026-02-15 13:25
