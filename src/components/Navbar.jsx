import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',          label: 'settings',   emoji: '⚙️'  },
  { to: '/input',     label: 'log',        emoji: '⏰'  },
  { to: '/dashboard', label: 'dashboard',  emoji: '📊'  },
  { to: '/history',   label: 'history',    emoji: '📜'  },
]

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 border-b border-pink-100"
      style={{ background: 'rgba(255,240,245,0.95)', backdropFilter: 'blur(8px)' }}
    >
      <span className="text-base font-800 text-pink-400 tracking-tight select-none">
        💌 chat timer
      </span>

      <div className="flex gap-1">
        {links.map(({ to, label, emoji }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-700 transition',
                isActive
                  ? 'text-white'
                  : 'text-pink-300 hover:text-pink-500',
              ].join(' ')
            }
            style={({ isActive }) =>
              isActive ? { background: '#FF6B9D' } : {}
            }
          >
            <span>{emoji}</span>
            <span className="hidden sm:inline">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
