'use client'

import { useState, useEffect } from 'react'
import ConversationViewer from './components/ConversationViewer'

interface BuildStep {
  id: number
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  time: string
  timestamp: string
  changelog: string
}

export default function Dashboard() {
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([])
  const [selectedStep, setSelectedStep] = useState<number | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number>(0)
  const [selectedDebrief, setSelectedDebrief] = useState<string | null>(null)
  const [debriefDates, setDebriefDates] = useState<string[]>([])
  const [showDebriefList, setShowDebriefList] = useState(false)

  // Poll API every 5 seconds
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/progress')
        const data = await res.json()
        if (data.steps) {
          setBuildSteps(data.steps)
          setLastUpdate(data.lastUpdate)
        }
      } catch (err) {
        console.error('Failed to fetch progress:', err)
      }
    }

    fetchProgress()
    const interval = setInterval(fetchProgress, 5000)
    return () => clearInterval(interval)
  }, [])

  // Fetch debrief dates
  useEffect(() => {
    const fetchDebriefs = async () => {
      try {
        const res = await fetch('/api/debriefs')
        const data = await res.json()
        if (data.dates) {
          setDebriefDates(data.dates)
        }
      } catch (err) {
        console.error('Failed to fetch debriefs:', err)
      }
    }

    fetchDebriefs()
    const interval = setInterval(fetchDebriefs, 10000) // Poll every 10s
    return () => clearInterval(interval)
  }, [])

  const currentStepIndex = buildSteps.findIndex(s => s.status === 'in-progress') || 
                          buildSteps.filter(s => s.status === 'done').length

  const todoSteps = buildSteps.filter(s => s.status === 'todo')
  const inProgressSteps = buildSteps.filter(s => s.status === 'in-progress')
  const doneSteps = buildSteps.filter(s => s.status === 'done')

  const progress = buildSteps.length > 0 ? (doneSteps.length / buildSteps.length) * 100 : 0

  if (buildSteps.length === 0) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Loading progress...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-cyan">Team System Build</h1>
            <p className="text-gray-400 mt-1">Simile Replication • OpenClaw + Opus 4.6</p>
          </div>
          <div className="flex items-center gap-4">
            {debriefDates.length > 0 && (
              <button
                onClick={() => setShowDebriefList(!showDebriefList)}
                className="bg-cyan/20 text-cyan px-4 py-2 rounded border border-cyan hover:bg-cyan/30 transition-all text-sm font-medium flex items-center gap-2"
              >
                💬 Team Debriefs ({debriefDates.length})
              </button>
            )}
            <div className="text-xs text-gray-600 font-mono">
              Last update: {new Date(lastUpdate).toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 bg-gray-900 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan to-orange transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {doneSteps.length}/{buildSteps.length} steps complete • {Math.round(progress)}%
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kanban Board */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-4">
          {/* Todo Column */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">
              Todo <span className="text-gray-600">({todoSteps.length})</span>
            </h2>
            <div className="space-y-3">
              {todoSteps.map(step => (
                <div
                  key={step.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-cyan transition-all"
                  onClick={() => setSelectedStep(step.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm">{step.title}</h3>
                    <span className="text-xs text-gray-500">{step.time}</span>
                  </div>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-gray-900 rounded-lg p-4 border border-orange">
            <h2 className="text-lg font-semibold mb-4 text-orange">
              In Progress <span className="text-gray-600">({inProgressSteps.length})</span>
            </h2>
            <div className="space-y-3">
              {inProgressSteps.map(step => (
                <div
                  key={step.id}
                  className="bg-gray-800 border-2 border-orange rounded-lg p-3 cursor-pointer animate-pulse"
                  onClick={() => setSelectedStep(step.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm text-orange">{step.title}</h3>
                    <span className="text-xs text-gray-500">{step.time}</span>
                  </div>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
              ))}
              {inProgressSteps.length === 0 && (
                <p className="text-gray-600 text-sm text-center py-8">No active work</p>
              )}
            </div>
          </div>

          {/* Done Column */}
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4 text-cyan">
              Done <span className="text-gray-600">({doneSteps.length})</span>
            </h2>
            <div className="space-y-3">
              {doneSteps.map(step => (
                <div
                  key={step.id}
                  className="bg-gray-800 border border-cyan/30 rounded-lg p-3 cursor-pointer hover:border-cyan transition-all opacity-70"
                  onClick={() => setSelectedStep(step.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm line-through text-gray-500">{step.title}</h3>
                    <svg className="w-4 h-4 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              ))}
              {doneSteps.length === 0 && (
                <p className="text-gray-600 text-sm text-center py-8">Nothing completed yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-6 text-gray-300">Timeline</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800"></div>
            
            {buildSteps.map((step, index) => {
              const isCurrent = index === currentStepIndex
              const isPast = step.status === 'done'
              const isFuture = !isPast && !isCurrent

              return (
                <div
                  key={step.id}
                  className={`relative pl-12 pb-8 cursor-pointer group`}
                  onClick={() => setSelectedStep(step.id)}
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 
                    ${isCurrent ? 'bg-orange border-orange ring-4 ring-orange/20' : ''}
                    ${isPast ? 'bg-cyan border-cyan' : ''}
                    ${isFuture ? 'bg-gray-800 border-gray-700' : ''}
                    transition-all group-hover:scale-125
                  `}></div>

                  {/* Step content */}
                  <div className={`${selectedStep === step.id ? 'ring-2 ring-cyan' : ''} 
                    bg-gray-800 rounded-lg p-3 border ${isCurrent ? 'border-orange' : 'border-gray-700'}
                    hover:border-cyan transition-all`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-mono ${isCurrent ? 'text-orange' : 'text-gray-500'}`}>
                        {step.timestamp}
                      </span>
                      <span className="text-xs text-gray-600">{step.time}</span>
                    </div>
                    <h3 className={`text-sm font-medium ${isCurrent ? 'text-orange' : isPast ? 'text-cyan' : 'text-gray-400'}`}>
                      {step.title}
                    </h3>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Changelog Modal */}
      {selectedStep !== null && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50"
          onClick={() => setSelectedStep(null)}
        >
          <div 
            className="bg-gray-900 border border-cyan rounded-lg p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {buildSteps.filter(s => s.id === selectedStep).map(step => (
              <div key={step.id}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-cyan mb-1">{step.title}</h2>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedStep(null)}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Timestamp:</span>
                        <span className="font-mono text-gray-300">{step.timestamp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Estimated time:</span>
                        <span className="text-gray-300">{step.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`font-medium capitalize
                          ${step.status === 'done' ? 'text-cyan' : ''}
                          ${step.status === 'in-progress' ? 'text-orange' : ''}
                          ${step.status === 'todo' ? 'text-gray-400' : ''}
                        `}>
                          {step.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Changelog</h3>
                    <p className="text-sm text-gray-400">{step.changelog}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debrief List Modal */}
      {showDebriefList && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50"
          onClick={() => setShowDebriefList(false)}
        >
          <div 
            className="bg-gray-900 border border-cyan rounded-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyan">💬 Team Debriefs</h2>
              <button
                onClick={() => setShowDebriefList(false)}
                className="text-gray-500 hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              {debriefDates.map(date => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDebrief(date)
                    setShowDebriefList(false)
                  }}
                  className="w-full bg-gray-800 border border-gray-700 hover:border-cyan rounded-lg p-4 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-300 group-hover:text-cyan transition-all">
                        {date}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Scout, Analyst, Skeptiker
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-600 group-hover:text-cyan transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}

              {debriefDates.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No debriefs yet</p>
                  <p className="text-gray-600 text-xs mt-2">First debrief runs at 12:30</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conversation Viewer */}
      {selectedDebrief && (
        <ConversationViewer 
          date={selectedDebrief} 
          onClose={() => setSelectedDebrief(null)} 
        />
      )}
    </div>
  )
}
