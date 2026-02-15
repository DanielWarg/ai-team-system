'use client'

import { useState, useEffect } from 'react'

interface Message {
  speaker: string
  message: string
}

interface Debrief {
  date: string
  timestamp: string
  participants: string[]
  conversation: Message[]
  learnings: {
    scout?: string[]
    analyst?: string[]
    skeptiker?: string[]
  }
  summary: string
}

interface ConversationViewerProps {
  date: string
  onClose: () => void
}

export default function ConversationViewer({ date, onClose }: ConversationViewerProps) {
  const [debrief, setDebrief] = useState<Debrief | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDebrief = async () => {
      try {
        const res = await fetch(`/api/debriefs?date=${date}`)
        if (res.ok) {
          const data = await res.json()
          setDebrief(data)
        }
      } catch (err) {
        console.error('Failed to fetch debrief:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDebrief()
  }, [date])

  const getSpeakerColor = (speaker: string) => {
    if (speaker === 'Scout') return 'bg-cyan/20 border-cyan text-cyan'
    if (speaker === 'Analyst') return 'bg-orange/20 border-orange text-orange'
    if (speaker === 'Skeptiker') return 'bg-red-500/20 border-red-500 text-red-400'
    return 'bg-gray-800 border-gray-600 text-gray-300'
  }

  const getSpeakerAvatar = (speaker: string) => {
    if (speaker === 'Scout') return '🔍'
    if (speaker === 'Analyst') return '📊'
    if (speaker === 'Skeptiker') return '⚠️'
    return '🤖'
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (!debrief) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-900 border border-red-500 rounded-lg p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-4">❌ No Debrief Found</h2>
          <p className="text-gray-400 mb-6">No conversation log exists for {date}</p>
          <button
            onClick={onClose}
            className="bg-gray-800 text-gray-300 px-4 py-2 rounded hover:bg-gray-700 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 border border-cyan rounded-lg max-w-4xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-cyan mb-1">💬 Team Debrief</h2>
              <p className="text-gray-400">{date}</p>
              <div className="flex gap-2 mt-2">
                {debrief.participants.map(p => (
                  <span key={p} className="text-xs bg-gray-800 px-2 py-1 rounded border border-gray-700">
                    {getSpeakerAvatar(p)} {p}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Summary */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">📋 Summary</h3>
            <p className="text-sm text-gray-400">{debrief.summary}</p>
          </div>

          {/* Conversation */}
          <div className="space-y-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">💭 Conversation</h3>
            {debrief.conversation.map((msg, index) => (
              <div key={index} className="flex items-start gap-3">
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 ${getSpeakerColor(msg.speaker).split(' ')[1]}`}>
                  {getSpeakerAvatar(msg.speaker)}
                </div>

                {/* Message Bubble */}
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-sm font-semibold ${getSpeakerColor(msg.speaker).split(' ')[2]}`}>
                      {msg.speaker}
                    </span>
                  </div>
                  <div className={`rounded-lg p-3 border ${getSpeakerColor(msg.speaker)}`}>
                    <p className="text-sm text-gray-200">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Learnings */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">🧠 Learnings Extracted</h3>
            <div className="space-y-4">
              {debrief.learnings.scout && debrief.learnings.scout.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-cyan mb-2">🔍 Scout</h4>
                  <ul className="space-y-1">
                    {debrief.learnings.scout.map((learning, i) => (
                      <li key={i} className="text-sm text-gray-400 pl-4 border-l-2 border-cyan/30">
                        {learning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {debrief.learnings.analyst && debrief.learnings.analyst.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-orange mb-2">📊 Analyst</h4>
                  <ul className="space-y-1">
                    {debrief.learnings.analyst.map((learning, i) => (
                      <li key={i} className="text-sm text-gray-400 pl-4 border-l-2 border-orange/30">
                        {learning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {debrief.learnings.skeptiker && debrief.learnings.skeptiker.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-red-400 mb-2">⚠️ Skeptiker</h4>
                  <ul className="space-y-1">
                    {debrief.learnings.skeptiker.map((learning, i) => (
                      <li key={i} className="text-sm text-gray-400 pl-4 border-l-2 border-red-500/30">
                        {learning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
