import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'

const MOODS_PATH = '/Users/evil/projekt-kompass/agents/team/mood.json'

export async function GET() {
  try {
    const content = await readFile(MOODS_PATH, 'utf-8')
    const data = JSON.parse(content)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to read moods:', error)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
