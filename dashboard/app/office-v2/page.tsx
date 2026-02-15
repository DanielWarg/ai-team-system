'use client'

import { useState, useEffect } from 'react'
import SimsAvatar from '../components/SimsAvatar'

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

interface SimsData {
  relationships: any
  moods: any
}

const DESK_POSITIONS = {
  scout: { x: 100, y: 150 },
  analyst: { x: 300, y: 150 },
  skeptiker: { x: 500, y: 150 },
  alice: { x: 640, y: 330 }, // Boss office
}

const LOCATION_POSITIONS = {
  desk: (agentName: string) => DESK_POSITIONS[agentName as keyof typeof DESK_POSITIONS] || { x: 100, y: 150 },
  'break-room': (index: number) => ({ x: 600 + (index * 30), y: 220 }),
  'conference-room': (index: number) => ({ x: 280 + (index * 50), y: 90 }),
  'phone-booth': () => ({ x: 650, y: 250 }),
  'office': (index: number) => ({ 
    // Alice's office - agents can visit
    x: index === 0 ? 650 : 620 + (index * 30),
    y: index === 0 ? 320 : 340
  }),
}

const LOCATIONS = {
  desk: { name: 'At Desk', color: '#10b981' },
  'break-room': { name: 'Break Room', color: '#f59e0b' },
  'conference-room': { name: 'Meeting', color: '#8b5cf6' },
  'phone-booth': { name: 'On Call', color: '#3b82f6' },
  office: { name: "Alice's Office 🐇", color: '#ff6b35' },
}

export default function OfficeV2() {
  const [state, setState] = useState<TeamState | null>(null)
  const [simsData, setSimsData] = useState<SimsData | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityRes, relationshipsRes, moodsRes] = await Promise.all([
          fetch('/api/activity'),
          fetch('/api/sims/relationships'),
          fetch('/api/sims/moods'),
        ])
        
        const activity = await activityRes.json()
        setState(activity)
        
        try {
          const relationships = await relationshipsRes.json()
          const moods = await moodsRes.json()
          setSimsData({ relationships, moods })
        } catch (err) {
          console.log('SIMS data not available yet')
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Loading SIMS office...</p>
        </div>
      </div>
    )
  }

  // Show all agents
  const agents = Object.entries(state.agents)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan to-orange bg-clip-text text-transparent mb-2">
              The Office (SIMS Edition) 🏢
            </h1>
            <p className="text-gray-400">Live Agent Simulation • 24/7 Activity</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600 font-mono mb-1">
              {new Date(state.lastUpdate).toLocaleTimeString()}
            </div>
            <div className={`text-sm font-semibold ${
              state.teamStatus === 'active' ? 'text-green-400' : 'text-gray-500'
            }`}>
              {state.teamStatus === 'active' ? '🟢 All Systems Active' : '⚫ Offline'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Office View */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 relative overflow-hidden">
            {/* Office Background */}
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-cyan/20 to-orange/20"></div>
            
            {/* Floor */}
            <svg viewBox="0 0 700 400" className="w-full">
              {/* Floor tiles */}
              <defs>
                <pattern id="floor-tile" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect width="40" height="40" fill="#1f2937" stroke="#374151" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect x="0" y="250" width="700" height="150" fill="url(#floor-tile)" />
              
              {/* Walls */}
              <rect x="0" y="0" width="700" height="250" fill="#111827" opacity="0.5" />
              
              {/* Team Desks */}
              {[
                { x: 50, y: 200, label: 'Scout Desk' },
                { x: 250, y: 200, label: 'Analyst Desk' },
                { x: 450, y: 200, label: 'Skeptiker Desk' },
              ].map((desk, i) => (
                <g key={i}>
                  {/* Desk */}
                  <rect x={desk.x} y={desk.y} width="120" height="60" rx="4" fill="#374151" stroke="#4b5563" strokeWidth="2" />
                  <rect x={desk.x + 5} y={desk.y + 5} width="110" height="50" fill="#1f2937" />
                  
                  {/* Monitor */}
                  <rect x={desk.x + 40} y={desk.y + 15} width="40" height="30" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                  <rect x={desk.x + 42} y={desk.y + 17} width="36" height="26" fill="#0ea5e9" opacity="0.6" />
                  
                  {/* Keyboard */}
                  <rect x={desk.x + 30} y={desk.y + 48} width="60" height="8" rx="1" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
                  
                  {/* Desk label */}
                  <text x={desk.x + 60} y={desk.y - 5} textAnchor="middle" fontSize="10" fill="#9ca3af" fontWeight="600">
                    {desk.label}
                  </text>
                </g>
              ))}
              
              {/* Meeting table */}
              <ellipse cx="350" cy="100" rx="80" ry="40" fill="#374151" stroke="#4b5563" strokeWidth="2" />
              <text x="350" y="50" textAnchor="middle" fontSize="10" fill="#9ca3af" fontWeight="600">
                Conference Table
              </text>
              
              {/* Break room */}
              <rect x="600" y="200" width="80" height="80" rx="4" fill="#422006" stroke="#78350f" strokeWidth="2" />
              <text x="640" y="195" textAnchor="middle" fontSize="10" fill="#fbbf24">Coffee Break</text>
              <text x="640" y="245" textAnchor="middle" fontSize="24">☕</text>
              
              {/* Alice's Office (Boss Room) */}
              <rect x="590" y="290" width="100" height="90" rx="4" fill="#1e1b4b" stroke="#ff6b35" strokeWidth="2" />
              <text x="640" y="285" textAnchor="middle" fontSize="10" fill="#ff6b35" fontWeight="600">Alice's Office 🐇</text>
              
              {/* Alice's Desk (bigger, fancier) */}
              <rect x="610" y="310" width="60" height="40" rx="2" fill="#4b5563" stroke="#ff6b35" strokeWidth="1.5" />
              <rect x="613" y="313" width="54" height="34" fill="#1f2937" />
              
              {/* Multiple monitors (boss setup) */}
              <rect x="625" y="318" width="26" height="20" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
              <rect x="627" y="320" width="22" height="16" fill="#0ea5e9" opacity="0.7" />
              
              {/* Lamp */}
              <circle cx="660" cy="320" r="3" fill="#fbbf24" opacity="0.8" />
              <line x1="660" y1="323" x2="660" y2="335" stroke="#78350f" strokeWidth="1" />
              
              {/* Door */}
              <rect x="685" y="320" width="3" height="30" rx="1.5" fill="#78350f" stroke="#ff6b35" strokeWidth="0.5" />
              
              {/* Agents */}
              {agents.map(([name, agent], i) => {
                // Group agents by location to spread them out
                const agentsAtLocation = agents.filter(([_, a]) => a.location === agent.location)
                const indexAtLocation = agentsAtLocation.findIndex(([n]) => n === name)
                
                let pos = { x: 100, y: 150 }
                
                if (agent.location === 'desk') {
                  pos = LOCATION_POSITIONS.desk(name)
                } else if (agent.location === 'break-room') {
                  pos = LOCATION_POSITIONS['break-room'](indexAtLocation)
                } else if (agent.location === 'conference-room') {
                  pos = LOCATION_POSITIONS['conference-room'](indexAtLocation)
                } else if (agent.location === 'phone-booth') {
                  pos = LOCATION_POSITIONS['phone-booth']()
                } else if (agent.location === 'office') {
                  pos = LOCATION_POSITIONS.office(indexAtLocation)
                }
                
                const agentName = name as 'scout' | 'analyst' | 'skeptiker' | 'alice'
                const moodFromSims = simsData?.moods?.[name]?.current || agent.mood
                
                return (
                  <g 
                    key={name} 
                    transform={`translate(${pos.x - 40}, ${pos.y - 80})`}
                    className="cursor-pointer hover:opacity-90 transition-all duration-500"
                    onClick={() => setSelectedAgent(name)}
                  >
                    <foreignObject width="80" height="100">
                      <div className="flex justify-center">
                        <SimsAvatar 
                          agent={agentName}
                          mood={moodFromSims}
                          activity={agent.activity}
                          size={80}
                        />
                      </div>
                    </foreignObject>
                    
                    {/* Activity bubble */}
                    <g transform="translate(40, -10)">
                      <rect x="-30" y="0" width="60" height="16" rx="8" fill="#000" opacity="0.8" />
                      <text x="0" y="11" textAnchor="middle" fontSize="8" fill="#fff">
                        {agent.activity.split('-').join(' ')}
                      </text>
                    </g>
                  </g>
                )
              })}
              
              {/* Relationship lines (if SIMS data available) */}
              {simsData?.relationships && agents.length > 1 && (
                <g opacity="0.3">
                  {Object.entries(simsData.relationships).filter(([key]) => key !== 'meta').map(([key, rel]: [string, any]) => {
                    const [agent1, agent2] = key.split('_')
                    const pos1 = DESK_POSITIONS[agent1 as keyof typeof DESK_POSITIONS]
                    const pos2 = DESK_POSITIONS[agent2 as keyof typeof DESK_POSITIONS]
                    
                    if (!pos1 || !pos2) return null
                    
                    const color = rel.score > 0.7 ? '#10b981' : rel.score > 0.4 ? '#f59e0b' : '#ef4444'
                    
                    return (
                      <line
                        key={key}
                        x1={pos1.x}
                        y1={pos1.y}
                        x2={pos2.x}
                        y2={pos2.y}
                        stroke={color}
                        strokeWidth={rel.score * 3}
                        strokeDasharray="5,5"
                      />
                    )
                  })}
                </g>
              )}
            </svg>
          </div>
          
          {/* Metrics Bar */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-gray-500 text-xs mb-1">Ideas Tested</div>
              <div className="text-2xl font-bold text-cyan">{state.metrics?.ideasTested || 0}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-gray-500 text-xs mb-1">Ideas Killed</div>
              <div className="text-2xl font-bold text-red-400">{state.metrics?.ideasKilled || 0}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-gray-500 text-xs mb-1">Team Meetings</div>
              <div className="text-2xl font-bold text-purple-400">{state.metrics?.meetings || 0}</div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <div className="text-gray-500 text-xs mb-1">Coffee Breaks</div>
              <div className="text-2xl font-bold text-orange">{state.metrics?.coffeeBreaks || 0}</div>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Agent Details */}
          {selectedAgent && state.agents[selectedAgent] && (
            <div className="bg-gray-900 border border-cyan rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-cyan capitalize">{selectedAgent}</h3>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <SimsAvatar 
                  agent={selectedAgent as 'scout' | 'analyst' | 'skeptiker' | 'alice'}
                  mood={simsData?.moods?.[selectedAgent]?.current || state.agents[selectedAgent].mood}
                  activity={state.agents[selectedAgent].activity}
                  size={120}
                />
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-500 text-xs mb-1">Current Activity</div>
                  <div className="text-gray-200">{state.agents[selectedAgent].activity}</div>
                </div>
                
                <div>
                  <div className="text-gray-500 text-xs mb-1">Location</div>
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: LOCATIONS[state.agents[selectedAgent].location as keyof typeof LOCATIONS]?.color || '#888' }}
                    ></span>
                    {LOCATIONS[state.agents[selectedAgent].location as keyof typeof LOCATIONS]?.name || state.agents[selectedAgent].location}
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-500 text-xs mb-1">Working On</div>
                  <div className="text-gray-200 text-xs">{state.agents[selectedAgent].task}</div>
                </div>
                
                {simsData?.moods?.[selectedAgent] && (
                  <div>
                    <div className="text-gray-500 text-xs mb-1">Mood</div>
                    <div className="text-gray-200">
                      {simsData.moods[selectedAgent].current} ({simsData.moods[selectedAgent].intensity.toFixed(1)})
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {simsData.moods[selectedAgent].reason}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="text-gray-500 text-xs mb-1">Next Activity</div>
                  <div className="text-gray-400 text-xs">
                    {state.agents[selectedAgent].nextActivity} at {new Date(state.agents[selectedAgent].nextActivityAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Upcoming Events */}
          {state.upcomingEvents?.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">📅 Upcoming</h3>
              <div className="space-y-3">
                {state.upcomingEvents.map((event: any, i: number) => (
                  <div key={i} className="text-xs border-l-2 border-cyan/30 pl-3 py-1">
                    <div className="text-cyan font-medium mb-1">
                      {event.type === 'team-meeting' && '👥 Team Meeting'}
                      {event.type === 'coffee-break' && '☕ Coffee Break'}
                      {!event.type && (event.name || 'Event')}
                    </div>
                    <div className="text-gray-400">{new Date(event.time).toLocaleTimeString()} • {event.location || event.agenda}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Legend */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Legend</h3>
            <div className="space-y-2 text-xs">
              {Object.entries(LOCATIONS).map(([key, loc]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: loc.color }}></span>
                  <span className="text-gray-400">{loc.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
