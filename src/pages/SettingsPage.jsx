import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [person1, setPerson1] = useState('')
  const [person2, setPerson2] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('chat_timer_names')
    if (stored) {
      const { person1: p1, person2: p2 } = JSON.parse(stored)
      setPerson1(p1 || '')
      setPerson2(p2 || '')
    }
  }, [])

  function handleSave(e) {
    e.preventDefault()
    if (!person1.trim() || !person2.trim()) return
    localStorage.setItem('chat_timer_names', JSON.stringify({ person1: person1.trim(), person2: person2.trim() }))
    setSaved(true)
    setTimeout(() => navigate('/input'), 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FFF0F5' }}>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-pink-100 p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💌</div>
          <h1 className="text-3xl font-800 text-pink-500 mb-1">chat timer</h1>
          <p className="text-pink-300 text-sm font-600">who kept who waiting? let's track it 🕐</p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-700 uppercase tracking-wider text-pink-400 mb-2">
              Person 1
            </label>
            <input
              value={person1}
              onChange={(e) => setPerson1(e.target.value)}
              placeholder="your name"
              required
              className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm font-600 text-pink-700 placeholder-pink-200 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-700 uppercase tracking-wider text-pink-400 mb-2">
              Person 2
            </label>
            <input
              value={person2}
              onChange={(e) => setPerson2(e.target.value)}
              placeholder="their name"
              required
              className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm font-600 text-pink-700 placeholder-pink-200 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-xl py-3 font-700 text-white text-sm transition active:scale-95"
            style={{ background: saved ? '#FF9EC4' : '#FF6B9D' }}
          >
            {saved ? 'saved! ✨' : 'save & continue →'}
          </button>
        </form>
      </div>
    </div>
  )
}
