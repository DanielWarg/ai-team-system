# Team System Dashboard

**Visual progress tracker for Simile replication**

## 🎨 Design
- **Colors:** Black (#0a0a0a), Gray (#1e1e1e, #2a2a2a), Cyan (#00d4ff), Orange (#ff6b35)
- **Font:** Inter (system fallback: San Francisco)
- **Style:** Clean, minimal, no AI icons

## Features

### Kanban Board
- **Todo** - Upcoming tasks
- **In Progress** - Current work (orange highlight)
- **Done** - Completed steps

### Timeline
- Vertical timeline with timestamps
- Orange marker for current step
- Click any timestamp → view changelog

### Changelog Modal
- Click any step card → detailed view
- Timestamp, estimated time, status
- Full changelog for that step

## 🚀 Usage

**Start dashboard:**
```bash
cd /Users/evil/projekt-kompass/agents/team-system/dashboard
npm run dev
```

**Open:** http://localhost:3001

**Stop:**
```bash
pkill -f "next dev"
```

## 📁 Structure

```
dashboard/
├── app/
│   ├── page.tsx       # Main dashboard
│   ├── layout.tsx     # Root layout
│   └── globals.css    # Tailwind + custom styles
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Progress Tracking

Steps are defined in `app/page.tsx` (buildSteps array).

To update progress:
1. Edit step status: `"todo"` | `"in-progress"` | `"done"`
2. Add changelog text
3. Dashboard updates automatically (hot reload)

## Color Palette

```
Black:   #000000
Gray-900: #1e1e1e
Gray-800: #2a2a2a
Gray-700: #3a3a3a
Cyan:    #00d4ff
Orange:  #ff6b35
```

---

**Built with:** Next.js 15 + React 19 + Tailwind CSS  
**Port:** 3001 (to avoid conflict with 2nd-brain on 3000)
