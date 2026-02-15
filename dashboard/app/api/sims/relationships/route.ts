import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'

const RELATIONSHIPS_PATH = '/Users/evil/projekt-kompass/agents/team/relationships.json'

export async function GET() {
  try {
    const content = await readFile(RELATIONSHIPS_PATH, 'utf-8')
    const data = JSON.parse(content)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to read relationships:', error)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
