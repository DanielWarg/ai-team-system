# Agent Team System - Simile Replication

**Mål:** Replikera Simile-koncept med OpenClaw + Opus 4.6  
**Status:** 🔴 Not Started  
**Started:** 2026-02-15  
**Target:** 2026-02-15 (samma dag, 2h)

---

## Architecture Overview

```
TEAM MISSION (shared goal)
    ↓
Scout → Analyst → Skeptiker
  ↓       ↓         ↓
    Team Debrief
  (learns together)
    ↓
Update all LEARNINGS.md
```

---

## Build Plan (5 steps)

| Step | Task | Status | Time | Notes |
|------|------|--------|------|-------|
| 1 | Agent SOULs | ⬜ Todo | 30m | Scout/Analyst/Skeptiker identity |
| 2 | LEARNINGS structure | ⬜ Todo | 15m | Analyst/Skeptiker learnings |
| 3 | Team Debrief Agent | ⬜ Todo | 1h | Conversation simulator |
| 4 | Update crons | ⬜ Todo | 15m | Read SOUL + LEARNINGS |
| 5 | Test & Verify | ⬜ Todo | - | Tomorrow 06:00 |

**Total estimated:** 2h

---

## Success Criteria

✅ Scout stops proposing Equipment Maintenance  
✅ Analyst references Scout's past mistakes  
✅ Skeptiker references Analyst's optimism  
✅ Team debrief contains CONVERSATION, not just summary

---

## File Structure

```
agents/
├── team-system/
│   ├── README.md (this file)
│   ├── CHANGELOG.md (progress tracker)
│   ├── ARCHITECTURE.md (detailed design)
│   └── MISSION.md (shared goal)
├── scout/
│   ├── SOUL.md (new)
│   ├── LEARNINGS.md (exists)
│   └── BRIEF-v2.md (exists)
├── analyst/
│   ├── SOUL.md (new)
│   ├── LEARNINGS.md (new)
│   └── BRIEF.md (exists)
└── skeptic/
    ├── SOUL.md (new)
    ├── LEARNINGS.md (new)
    └── BRIEF.md (exists)
```

---

See [CHANGELOG.md](./CHANGELOG.md) for detailed progress.
