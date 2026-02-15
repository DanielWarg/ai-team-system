import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const changelogPath = join(process.cwd(), '../CHANGELOG.md')
    const changelog = readFileSync(changelogPath, 'utf-8')
    
    // Parse progress from changelog
    const steps = [
      {
        id: 1,
        title: "Agent SOULs",
        description: "Scout/Analyst/Skeptiker identity",
        status: changelog.includes('Step 1: Agent SOULs (✅ Done)') ? 'done' : 'todo',
        time: "30m",
        timestamp: "2026-02-15 13:45",
        changelog: extractChangelog(changelog, 'Step 1')
      },
      {
        id: 2,
        title: "LEARNINGS Structure",
        description: "Analyst/Skeptiker learnings",
        status: changelog.includes('Step 2: LEARNINGS Structure (✅ Done)') ? 'done' : 'todo',
        time: "15m",
        timestamp: "2026-02-15 13:50",
        changelog: extractChangelog(changelog, 'Step 2')
      },
      {
        id: 3,
        title: "Team Debrief Agent",
        description: "Conversation simulator",
        status: changelog.includes('Step 3: Team Debrief Agent (✅ Done)') ? 'done' : 'todo',
        time: "1h",
        timestamp: "2026-02-15 13:55",
        changelog: extractChangelog(changelog, 'Step 3')
      },
      {
        id: 4,
        title: "Update Crons",
        description: "Read SOUL + LEARNINGS",
        status: changelog.includes('Step 4: Update Crons (✅ Done)') ? 'done' : 'todo',
        time: "15m",
        timestamp: "2026-02-15 14:00",
        changelog: extractChangelog(changelog, 'Step 4')
      },
      {
        id: 5,
        title: "Test & Verify",
        description: "Tomorrow 06:00",
        status: changelog.includes('Step 5: Test & Verify (✅ Done)') ? 'done' : 'todo',
        time: "-",
        timestamp: "2026-02-16 06:00",
        changelog: extractChangelog(changelog, 'Step 5')
      },
    ]
    
    return NextResponse.json({ steps, lastUpdate: Date.now() })
  } catch (error) {
    console.error('Error reading changelog:', error)
    return NextResponse.json({ error: 'Failed to read progress' }, { status: 500 })
  }
}

function extractChangelog(markdown: string, stepName: string): string {
  const regex = new RegExp(`### ${stepName}[^#]*`, 's')
  const match = markdown.match(regex)
  if (!match) return 'No changelog available'
  
  // Extract first few lines for summary
  const lines = match[0].split('\n').slice(0, 5)
  return lines.join(' ').replace(/[*#_-]/g, '').trim().substring(0, 200)
}
