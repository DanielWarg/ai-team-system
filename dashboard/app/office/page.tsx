'use client'

import { useState, useEffect } from 'react'

interface Agent {
  activity: string
  location: string
  task: string
  mood: string
  since: string
  nextActivity: string
  nextActivityAt: string
}

interface TeamState {
  lastUpdate: string
  teamStatus: string
  agents: Record<string, Agent>
  upcomingEvents: any[]
  metrics: any
}

const LOCATIONS = {
  desk: { x: 20, y: 30, label: 'Desk' },
  'break-room': { x: 60, y: 30, label: 'Break Room' },
  'conference-room': { x: 40, y: 60, label: 'Conference Room' },
  office: { x: 20, y: 60, label: 'Office' },
  'phone-booth': { x: 70, y: 60, label: 'Phone' },
}

const AGENT_COLORS = {
  scout: '#00d4ff', // cyan
  analyst: '#10b981', // emerald
  skeptiker: '#ef4444', // red
  alice: '#ff6b35', // orange
}

const MOOD_EMOJI = {
  focused: '🎯',
  curious: '🔍',
  skeptical: '🤨',
  paranoid: '😰',
  critical: '⚠️',
  determined: '💪',
  engaged: '🤝',
  energized: '⚡',
  professional: '💼',
  analytical: '📊',
  enthusiastic: '🚀',
  worried: '😟',
  cautious: '⚠️',
  supportive: '🤗',
}

export default function OfficePage() {
  const [state, setState] = useState<TeamState | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch('/api/activity')
        const data = await res.json()
        setState(data)
      } catch (err) {
        console.error('Failed to fetch activity:', err)
      }
    }

    fetchState()
    const interval = setInterval(fetchState, 3000) // Poll every 3s
    return () => clearInterval(interval)
  }, [])

  if (!state) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Loading office...</p>
        </div>
      </div>
    )
  }

  const agents = Object.entries(state.agents)

  return (
    <div className="min-h-screen bg-black text-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyan mb-2">The Office 🏢</h1>
            <p className="text-gray-400">Team Activity • Live Simulation</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600 font-mono mb-1">
              Last update: {new Date(state.lastUpdate).toLocaleTimeString()}
            </div>
            <div className={`text-sm font-semibold ${
              state.teamStatus === 'active' ? 'text-green-500' : 'text-gray-500'
            }`}>
              {state.teamStatus === 'active' ? '🟢 Team Active' : '⚫ Team Offline'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Office Floor Plan */}
        <div className="lg:col-span-2 bg-gray-900 rounded-lg p-8 border border-gray-800">
          <h2 className="text-lg font-semibold mb-6 text-gray-300">Office Floor Plan</h2>
          
          {/* SVG Office Layout */}
          <svg viewBox="0 0 100 80" className="w-full border border-gray-700 rounded-lg bg-gray-800">
            {/* Room Outlines */}
            <rect x="5" y="5" width="40" height="35" fill="none" stroke="#374151" strokeWidth="0.5" rx="2" />
            <text x="25" y="15" textAnchor="middle" fontSize="3" fill="#9ca3af">Desks</text>
            
            <rect x="50" y="5" width="40" height="35" fill="none" stroke="#374151" strokeWidth="0.5" rx="2" />
            <text x="70" y="15" textAnchor="middle" fontSize="3" fill="#9ca3af">Break Room</text>
            
            <rect x="20" y="45" width="60" height="30" fill="none" stroke="#374151" strokeWidth="0.5" rx="2" />
            <text x="50" y="55" textAnchor="middle" fontSize="3" fill="#9ca3af">Conference Room</text>

            {/* Agents */}
            {agents.map(([name, agent]) => {
              const loc = LOCATIONS[agent.location as keyof typeof LOCATIONS] || LOCATIONS.desk
              const color = AGENT_COLORS[name as keyof typeof AGENT_COLORS] || '#888'
              
              return (
                <g 
                  key={name}
                  onClick={() => setSelectedAgent(name)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <circle
                    cx={loc.x}
                    cy={loc.y}
                    r="4"
                    fill={color}
                    className="transition-all duration-1000"
                  />
                  <text
                    x={loc.x}
                    y={loc.y - 6}
                    textAnchor="middle"
                    fontSize="3"
                    fill={color}
                    fontWeight="bold"
                  >
                    {name.charAt(0).toUpperCase()}
                  </text>
                  <text
                    x={loc.x}
                    y={loc.y + 9}
                    textAnchor="middle"
                    fontSize="4"
                  >
                    {MOOD_EMOJI[agent.mood as keyof typeof MOOD_EMOJI] || '🤖'}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {agents.map(([name, agent]) => {
              const color = AGENT_COLORS[name as keyof typeof AGENT_COLORS]
              return (
                <div 
                  key={name}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedAgent === name 
                      ? 'border-cyan ring-2 ring-cyan/30' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  style={{ borderColor: selectedAgent === name ? color : undefined }}
                  onClick={() => setSelectedAgent(name)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="font-semibold text-sm capitalize">{name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {agent.activity}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Agent Details */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">
            {selectedAgent ? (
              <span className="capitalize">{selectedAgent}</span>
            ) : (
              'Select an agent'
            )}
          </h2>

          {selectedAgent && state.agents[selectedAgent] ? (
            <div className="space-y-4">
              {/* Current Activity */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">
                    {MOOD_EMOJI[state.agents[selectedAgent].mood as keyof typeof MOOD_EMOJI]}
                  </span>
                  <span className="text-sm font-semibold text-cyan capitalize">
                    {state.agents[selectedAgent].activity}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {state.agents[selectedAgent].task}
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="text-gray-300 capitalize">
                      {state.agents[selectedAgent].location.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Mood:</span>
                    <span className="text-gray-300 capitalize">
                      {state.agents[selectedAgent].mood}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Since:</span>
                    <span className="text-gray-300 font-mono">
                      {new Date(state.agents[selectedAgent].since).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Activity */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Up Next</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Activity:</span>
                    <span className="text-gray-300 capitalize">
                      {state.agents[selectedAgent].nextActivity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">At:</span>
                    <span className="text-gray-300 font-mono">
                      {new Date(state.agents[selectedAgent].nextActivityAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <p className="text-4xl mb-3">👆</p>
              <p className="text-sm">Click an agent on the floor plan to see what they're up to</p>
            </div>
          )}

          {/* Team Metrics */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Team Stats</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-800 rounded p-2">
                <div className="text-gray-500">Ideas Tested</div>
                <div className="text-xl font-bold text-cyan">{state.metrics?.ideasTested || 0}</div>
              </div>
              <div className="bg-gray-800 rounded p-2">
                <div className="text-gray-500">Ideas Killed</div>
                <div className="text-xl font-bold text-red-500">{state.metrics?.ideasKilled || 0}</div>
              </div>
              <div className="bg-gray-800 rounded p-2">
                <div className="text-gray-500">Meetings</div>
                <div className="text-xl font-bold text-orange">{state.metrics?.meetingsHeld || 0}</div>
              </div>
              <div className="bg-gray-800 rounded p-2">
                <div className="text-gray-500">Coffee Breaks</div>
                <div className="text-xl font-bold text-yellow-600">☕ {state.metrics?.coffeeBreaks || 0}</div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          {state.upcomingEvents && state.upcomingEvents.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Upcoming</h3>
              <div className="space-y-2">
                {state.upcomingEvents.slice(0, 3).map((event, i) => (
                  <div key={i} className="bg-gray-800 rounded p-2 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold capitalize text-cyan">
                        {event.type.replace('-', ' ')}
                      </span>
                      <span className="text-gray-500 font-mono">
                        {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      {event.agenda}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
