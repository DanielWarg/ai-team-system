'use client'

interface SimsAvatarProps {
  agent: 'scout' | 'analyst' | 'skeptiker' | 'alice'
  mood?: string
  activity?: string
  size?: number
}

const AGENT_COLORS = {
  scout: {
    skin: '#FFD4A3',
    hair: '#8B4513',
    clothes: '#00d4ff',
  },
  analyst: {
    skin: '#F4C2A5',
    hair: '#2C1810',
    clothes: '#10b981',
  },
  skeptiker: {
    skin: '#E8B89A',
    hair: '#4A4A4A',
    clothes: '#ef4444',
  },
  alice: {
    skin: '#FFE4D1',
    hair: '#FF6B35',
    clothes: '#ff6b35',
  },
}

const MOOD_FACE = {
  frustrated: { mouth: 'M15,22 Q20,26 25,22', eyes: 'squint' },
  confident: { mouth: 'M15,20 Q20,18 25,20', eyes: 'normal' },
  satisfied: { mouth: 'M15,21 Q20,19 25,21', eyes: 'normal' },
  focused: { mouth: 'M15,22 L25,22', eyes: 'normal' },
  excited: { mouth: 'M15,19 Q20,16 25,19', eyes: 'wide' },
  defensive: { mouth: 'M15,23 Q20,25 25,23', eyes: 'narrow' },
  curious: { mouth: 'M15,21 Q20,20 25,21', eyes: 'normal' },
}

export default function SimsAvatar({ agent, mood = 'focused', activity, size = 100 }: SimsAvatarProps) {
  // Fallback to scout if agent not found
  const colors = AGENT_COLORS[agent] || AGENT_COLORS.scout
  const face = MOOD_FACE[mood as keyof typeof MOOD_FACE] || MOOD_FACE.focused
  
  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 50" className="w-full h-full">
        {/* Head */}
        <ellipse cx="20" cy="15" rx="10" ry="12" fill={colors.skin} stroke="#333" strokeWidth="0.5" />
        
        {/* Hair */}
        <ellipse cx="20" cy="10" rx="11" ry="7" fill={colors.hair} />
        
        {/* Eyes */}
        {face.eyes === 'normal' && (
          <>
            <circle cx="16" cy="14" r="1.5" fill="#000" />
            <circle cx="24" cy="14" r="1.5" fill="#000" />
          </>
        )}
        {face.eyes === 'wide' && (
          <>
            <circle cx="16" cy="14" r="2" fill="#000" />
            <circle cx="24" cy="14" r="2" fill="#000" />
          </>
        )}
        {face.eyes === 'squint' && (
          <>
            <line x1="15" y1="14" x2="17" y2="14" stroke="#000" strokeWidth="1.5" />
            <line x1="23" y1="14" x2="25" y2="14" stroke="#000" strokeWidth="1.5" />
          </>
        )}
        {face.eyes === 'narrow' && (
          <>
            <line x1="15" y1="13" x2="17" y2="14" stroke="#000" strokeWidth="1" />
            <line x1="23" y1="13" x2="25" y2="14" stroke="#000" strokeWidth="1" />
          </>
        )}
        
        {/* Mouth */}
        <path d={face.mouth} fill="none" stroke="#000" strokeWidth="1" strokeLinecap="round" />
        
        {/* Body */}
        <rect x="12" y="25" width="16" height="20" rx="2" fill={colors.clothes} stroke="#333" strokeWidth="0.5" />
        
        {/* Arms */}
        <rect x="8" y="27" width="4" height="12" rx="2" fill={colors.skin} stroke="#333" strokeWidth="0.5" />
        <rect x="28" y="27" width="4" height="12" rx="2" fill={colors.skin} stroke="#333" strokeWidth="0.5" />
        
        {/* Activity indicator (laptop if working) */}
        {(activity?.includes('work') || activity?.includes('research') || activity?.includes('analyz')) && (
          <g transform="translate(15, 38)">
            <rect x="0" y="0" width="10" height="6" rx="0.5" fill="#333" stroke="#666" strokeWidth="0.3" />
            <rect x="1" y="1" width="8" height="4" fill="#0ea5e9" opacity="0.8" />
          </g>
        )}
        
        {/* Coffee if break */}
        {activity?.includes('coffee') && (
          <g transform="translate(26, 34)">
            <rect x="0" y="2" width="4" height="5" rx="0.5" fill="#8B4513" stroke="#333" strokeWidth="0.3" />
            <ellipse cx="2" cy="2" rx="2" ry="0.8" fill="#6B3410" />
            <path d="M 4,3 Q 5,3 5,4" fill="none" stroke="#333" strokeWidth="0.3" />
          </g>
        )}
      </svg>
      
      {/* Mood bubble */}
      <div className="absolute -top-2 -right-2 text-xl bg-black border border-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
        {mood === 'frustrated' && '😤'}
        {mood === 'confident' && '😎'}
        {mood === 'satisfied' && '😌'}
        {mood === 'focused' && '🎯'}
        {mood === 'excited' && '🤩'}
        {mood === 'defensive' && '😠'}
        {mood === 'curious' && '🤔'}
      </div>
      
      {/* Name tag */}
      <div className="text-center mt-1">
        <div className="text-xs font-semibold capitalize" style={{ color: colors.clothes }}>
          {agent}
        </div>
      </div>
    </div>
  )
}
