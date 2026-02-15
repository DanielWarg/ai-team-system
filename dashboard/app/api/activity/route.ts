import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const statePath = join(process.cwd(), '../../team/state.json')
    const state = JSON.parse(readFileSync(statePath, 'utf-8'))
    
    return NextResponse.json(state)
  } catch (error) {
    console.error('Error reading state:', error)
    return NextResponse.json({ 
      error: 'Failed to read activity state',
      agents: {},
      lastUpdate: new Date().toISOString()
    }, { status: 500 })
  }
}
