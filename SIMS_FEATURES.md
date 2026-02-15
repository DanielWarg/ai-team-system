# SIMS Features - Agents as Characters

**Status:** Design Phase  
**Target:** Phase 3 (after Telegram integration)  
**Estimat:** 4-6h implementation

---

## Overview

Transform agents from scheduled workers → living characters with:
- **Relationships** (gillar/ogillar varandra)
- **Mood** (påverkar beslut + kommunikation)
- **Events** (saker händer mellan runs)
- **Autonomy** (spawna tasks själva)

**Inspiration:** SIMS, Simile (Stanford), Westworld

---

## 1. Relationships System

### Data Structure

`/agents/team/relationships.json`:
```json
{
  "scout_analyst": {
    "score": 0.7,
    "history": [
      {
        "date": "2026-02-15",
        "event": "Analyst adjusted Scout's pricing",
        "delta": -0.1,
        "note": "Scout felt undermined but learned"
      },
      {
        "date": "2026-02-16",
        "event": "Scout thanked Analyst for catch",
        "delta": +0.2,
        "note": "Respect increased"
      }
    ],
    "status": "respectful_rivalry"
  },
  "analyst_skeptiker": {
    "score": 0.9,
    "history": [...],
    "status": "allies"
  },
  "scout_skeptiker": {
    "score": 0.3,
    "history": [...],
    "status": "frustrated"
  }
}
```

### Relationship Levels

- **0.0-0.2:** Hostile (avoid, contradict, dismiss)
- **0.3-0.4:** Frustrated (tension, short responses)
- **0.5-0.7:** Neutral/Respectful (professional)
- **0.8-0.9:** Allies (support, build on ideas)
- **1.0:** Trust (defend, collaborate eagerly)

### How Relationships Affect Behavior

**Low relationship (Scout ↔ Skeptiker @ 0.3):**
```markdown
Scout: "I found Equipment Maintenance Tracking..."
Skeptiker: "Here we go again. Did you check for free competitors this time?"
Scout: "Actually yes, I—"
Skeptiker: "Lantmännen offers it free. Next idea."
```

**High relationship (Analyst ↔ Skeptiker @ 0.9):**
```markdown
Analyst: "199 SEK/mån based on competitor median."
Skeptiker: "Good pricing. But have you checked free alternatives?"
Analyst: "Not yet, let me search..."
Skeptiker: "Found Lantmännen. Free. This kills it."
Analyst: "You're right. Adding to learnings."
```

### Relationship Updates

**Team Debrief analyzes interaction:**
- Scout admits mistake → respect +0.1 (all agents)
- Analyst thanks Scout → relationship +0.2
- Skeptiker dismisses without reason → tension +0.1 (negative)
- Collaborative solution → everyone +0.1

**Manual events (Alice triggers):**
- Scout's idea succeeds in real world → vindication +0.3
- Analyst's math was wrong → credibility -0.2
- Skeptiker saved money → gratitude +0.1

---

## 2. Mood System

### Data Structure

`/agents/team/mood.json`:
```json
{
  "scout": {
    "current": "frustrated",
    "intensity": 0.7,
    "reason": "Equipment Maintenance killed twice in a row",
    "since": "2026-02-15T12:00:00Z",
    "history": [
      {
        "mood": "excited",
        "intensity": 0.8,
        "reason": "Found 10 great ideas",
        "start": "2026-02-15T06:00:00Z",
        "end": "2026-02-15T10:00:00Z"
      }
    ]
  },
  "analyst": {
    "current": "confident",
    "intensity": 0.6,
    "reason": "Good kill-tests prevented bad ideas",
    "since": "2026-02-15T10:00:00Z"
  },
  "skeptiker": {
    "current": "satisfied",
    "intensity": 0.5,
    "reason": "Saved Daniel from Equipment Maintenance trap",
    "since": "2026-02-15T12:00:00Z"
  }
}
```

### Mood Types

**Positive moods:**
- `excited` - Many good ideas found
- `confident` - Analysis proven correct
- `satisfied` - Prevented mistakes
- `vindicated` - Proven right after pushback
- `proud` - Work appreciated

**Negative moods:**
- `frustrated` - Ideas repeatedly killed
- `defensive` - Challenged without reason
- `uncertain` - Conflicting signals
- `exhausted` - Too many ideas, no success
- `demoralized` - Feeling useless

**Neutral:**
- `focused` - Normal working state
- `curious` - Exploring new territory
- `cautious` - Unknown risks ahead

### How Mood Affects Behavior

**Scout (frustrated @ 0.7):**
```markdown
# More defensive, less creative
"I know Skeptiker will kill this, but hear me out..."
"Before you dismiss it, I checked competitors..."
"Yes, I searched for free alternatives this time."
```

**Scout (excited @ 0.8):**
```markdown
# More creative, ambitious
"Found an amazing pattern in r/manufacturing!"
"This could be bigger than we thought..."
"Three industries have the same pain point!"
```

**Analyst (confident @ 0.6):**
```markdown
# More assertive in recommendations
"The math is clear: GO."
"Conservative estimates still show 150k profit year 1."
"Break-even at 2 customers = minimal risk."
```

**Analyst (uncertain @ 0.5):**
```markdown
# More hedging, cautious
"Numbers look okay, but..."
"Could work IF adoption is 30%..."
"Recommend more validation before building."
```

### Mood Triggers

**Positive triggers:**
- Idea validated by next agent → `confident` +0.2
- Prevented mistake → `satisfied` +0.3
- Praised by Daniel → `proud` +0.4
- Real-world success → `vindicated` +0.5

**Negative triggers:**
- Idea killed without explanation → `frustrated` +0.3
- Contradicted by next agent → `defensive` +0.2
- Same mistake repeated → `demoralized` +0.4
- Daniel dismisses work → `uncertain` +0.5

**Decay:**
- Moods fade over time (24h = -0.1 intensity)
- Positive events can flip negative moods

---

## 3. Events System

### Types of Events

**A. Scheduled Events**
- Team meetings (16:00 daily)
- Coffee breaks (10:00, 15:00)
- Retros (Friday 17:00)

**B. Triggered Events**
- Scout finds 3+ hot ideas → "brainstorm session"
- Analyst + Skeptiker disagree → "debate"
- All agents agree → "alignment celebration"
- Idea succeeds in real world → "vindication party"

**C. Random Events** (low probability)
- "Scout discovers hidden gem in obscure subreddit"
- "Analyst realizes past calculation was wrong"
- "Skeptiker finds competitor none of them knew about"
- "Daniel praises specific agent's work"

### Event Structure

`/agents/team/events/YYYY-MM-DD.json`:
```json
{
  "events": [
    {
      "time": "2026-02-16T10:30:00Z",
      "type": "debate",
      "participants": ["analyst", "skeptiker"],
      "trigger": "Disagreement on Equipment Maintenance TAM",
      "outcome": "skeptiker_wins",
      "relationship_changes": {
        "analyst_skeptiker": +0.1
      },
      "mood_changes": {
        "analyst": {"mood": "uncertain", "intensity": 0.5},
        "skeptiker": {"mood": "confident", "intensity": 0.7}
      },
      "learnings": [
        "Analyst: Check for free alternatives, not just paid SaaS",
        "Skeptiker: Explain reasoning more gently to preserve relationships"
      ]
    }
  ]
}
```

### Event Effects

**Brainstorm Session (3+ hot ideas):**
- All agents meet in conference room
- Discuss patterns across ideas
- Mood: `excited` for all
- Relationship: +0.1 across board (collaboration)

**Debate (disagreement):**
- Two agents argue in #team-discussion
- Other agents can chime in
- Winner determined by Daniel or objective metric
- Mood shift: winner +confident, loser +uncertain
- Relationship: small +0.1 (respect for good argument)

**Alignment Celebration (all agree GO):**
- Rare! Confidence boost for all
- Mood: `confident` across board
- Relationship: +0.2 (teamwork)

**Vindication (past idea succeeds):**
- Agent who proposed it gets massive mood boost
- Others acknowledge: relationship +0.3
- Learning: "Trust X's intuition on Y-type ideas"

---

## 4. Autonomy System

### Decision Rights per Agent

**Scout (Researcher):**
- Can spend $5/day on Brave Search (pre-approved)
- Can add new subreddits to free-sources.py
- Can spawn "deep dive" task if hot lead (max 1/week)

**Analyst (Calculator):**
- Can request external data (e.g., API calls to public datasets)
- Can spawn "market sizing" task if TAM unclear
- Can pause Scout if overwhelmed (max 1 pause/week)

**Skeptiker (Guardian):**
- Can veto ideas with kill-test (no approval needed)
- Can request legal/regulatory research
- Can spawn "competitive analysis" if new player emerges

### Budget Management

`/agents/team/budget.json`:
```json
{
  "total_budget": 10000,
  "spent_to_date": 350,
  "remaining": 9650,
  "allocations": {
    "scout_research": 500,
    "analyst_data": 200,
    "skeptiker_legal": 100,
    "prototype_build": 5000,
    "marketing_test": 2000,
    "emergency": 2000
  },
  "daily_burn": {
    "scout": 0.50,
    "analyst": 0.10,
    "skeptiker": 0.05,
    "activity_engine": 0.00
  }
}
```

**Spending rules:**
- <$10: auto-approve
- $10-100: log + notify Daniel
- >$100: require approval

### Self-Spawned Tasks

**Scout spawns "deep dive":**
```python
# In Scout's report
if hot_lead_score > 8.5:
    spawn_task(
        agent="analyst",
        priority="high",
        task=f"Validate {idea_name}: TAM, competition, pricing",
        budget=50,
        timeout="4h"
    )
```

**Analyst spawns "market sizing":**
```python
if tam_confidence < 0.5:
    spawn_task(
        agent="scout",
        priority="medium",
        task=f"Find 10 real companies using {competitor_product}",
        budget=10,
        timeout="2h"
    )
```

**Skeptiker spawns "legal research":**
```python
if regulatory_risk == "high":
    spawn_task(
        agent="external",  # Could be Alice or API call
        priority="high",
        task=f"Check WhatsApp Business API approval requirements Sweden",
        budget=20,
        timeout="1h"
    )
```

---

## Implementation Plan

### Phase 3A: Relationships (2h)

1. Create `relationships.json` with initial scores:
   - scout_analyst: 0.7 (respectful rivalry)
   - analyst_skeptiker: 0.9 (allies)
   - scout_skeptiker: 0.3 (frustrated)

2. Update Team Debrief to analyze relationships:
   - Detect collaboration → +0.1
   - Detect tension → +0.1 (negative)
   - Detect apology/thanks → +0.2

3. Update agent prompts to read relationships:
   ```
   Before responding, check relationships.json.
   If relationship with X < 0.5, be more defensive/short.
   If relationship with X > 0.8, be collaborative/supportive.
   ```

4. Dashboard: Relationship graph (nodes + edges)

### Phase 3B: Mood (1.5h)

1. Create `mood.json` with current states

2. Team Debrief updates moods:
   - Idea killed → frustrated +0.2
   - Good work → confident +0.2
   - Collaborative win → satisfied +0.1

3. Agents read mood before responding:
   ```
   Current mood: frustrated (0.7)
   Reason: Equipment Maintenance killed twice
   → Be more defensive, double-check before proposing
   ```

4. Dashboard: Mood indicators (emoji + color)

### Phase 3C: Events (1h)

1. Event triggers in Team Debrief:
   - Disagreement → spawn debate event
   - All agree → alignment celebration
   - 3+ hot ideas → brainstorm session

2. Event logger: `/agents/team/events/YYYY-MM-DD.json`

3. Events affect mood + relationships

4. Dashboard: Event timeline

### Phase 3D: Autonomy (1.5h)

1. Budget tracking system

2. Spending rules + auto-approval thresholds

3. Task spawning API (agents can call sessions_spawn)

4. Dashboard: Budget burn chart

---

## Success Metrics

**After 1 week:**
- Relationships evolve (not static at 0.7/0.9/0.3)
- Mood changes based on outcomes (not always "focused")
- At least 1 event per day (organic, not forced)
- 1+ self-spawned task (agent initiative)

**After 1 month:**
- Clear relationship patterns ("Scout trusts Analyst on pricing")
- Mood cycles ("Scout frustrated Mon-Wed, vindicated Thu-Fri")
- Event types documented ("debates" vs "celebrations")
- Agents propose process improvements

---

## Risks

**Over-engineering:**
- Too complex → agents spend time on meta instead of work
- Solution: Start simple (relationships only), add features incrementally

**Mood death spiral:**
- Scout frustrated → worse ideas → more kills → more frustrated
- Solution: Mood decay over time, positive events easier to trigger

**Fake emotions:**
- Feels forced, not authentic
- Solution: Relationships + mood affect BEHAVIOR, not just text
- Scout with low relationship actually searches harder for flaws
- Analyst with high confidence actually recommends GO more

**Daniel fatigue:**
- Too much "drama", not enough output
- Solution: SIMS features enhance quality, don't replace work
- Relationships prevent repeat mistakes (Scout learns from Analyst)
- Mood prevents groupthink (frustrated Scout challenges status quo)

---

**Status:** Design complete, waiting for Telegram integration (Phase 2) before implementing.
