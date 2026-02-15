import { NextResponse } from 'next/server'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

const DEBRIEFS_DIR = '/Users/evil/projekt-kompass/agents/team/debriefs'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      // List all available debrief dates
      const files = await readdir(DEBRIEFS_DIR)
      const jsonFiles = files.filter(f => f.endsWith('.json')).sort().reverse()
      const dates = jsonFiles.map(f => f.replace('.json', ''))
      return NextResponse.json({ dates })
    }

    // Get specific debrief
    const filePath = join(DEBRIEFS_DIR, `${date}.json`)
    const content = await readFile(filePath, 'utf-8')
    const debrief = JSON.parse(content)
    
    return NextResponse.json(debrief)
  } catch (error) {
    console.error('Failed to fetch debriefs:', error)
    return NextResponse.json({ error: 'Failed to fetch debriefs' }, { status: 500 })
  }
}
