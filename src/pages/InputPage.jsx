import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function InputPage() {
  const navigate = useNavigate()
  const [names, setNames] = useState(null)
  const [person, setPerson] = useState('')
  const [minutes, setMinutes] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('chat_timer_names')
    if (!stored) {
      navigate('/')
      return
    }
    const parsed = JSON.parse(stored)
    setNames(parsed)
    setPerson(parsed.person1)
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    const mins = parseInt(minutes, 10)
    if (!person || isNaN(mins) || mins < 1) return

    setStatus('loading')
    setErrorMsg('')

    const { error } = await supabase.from('response_times').insert({ person, minutes: mins })
    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
    } else {
      setStatus('success')
      setMinutes('')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  if (!names) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#FFF0F5' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-4xl">⏰</div>
            <h1 className="text-2xl font-800 text-pink-500 mt-1">log a slow reply</h1>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="text-xs font-700 text-pink-300 hover:text-pink-500 transition px-3 py-1 rounded-full border border-pink-200 hover:border-pink-400"
            >
              settings
            </Link>
            <Link
              to="/dashboard"
              className="text-xs font-700 text-white px-3 py-1 rounded-full transition active:scale-95"
              style={{ background: '#FF9EC4' }}
            >
              dashboard →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-700 uppercase tracking-wider text-pink-400 mb-2">
                who was slow? 🙈
              </label>
              <select
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm font-600 text-pink-700 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition appearance-none bg-white cursor-pointer"
              >
                <option value={names.person1}>{names.person1}</option>
                <option value={names.person2}>{names.person2}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-700 uppercase tracking-wider text-pink-400 mb-2">
                minutes late
              </label>
              <input
                type="number"
                min="1"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="e.g. 45"
                required
                className="w-full rounded-xl border border-pink-200 px-4 py-3 text-sm font-600 text-pink-700 placeholder-pink-200 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
              />
            </div>

            {errorMsg && (
              <p className="text-red-400 text-xs font-600 bg-red-50 rounded-xl px-4 py-2">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-1 rounded-xl py-3 font-700 text-white text-sm transition active:scale-95 disabled:opacity-60"
              style={{ background: status === 'success' ? '#FF9EC4' : '#FF6B9D' }}
            >
              {status === 'loading' ? 'saving...' : status === 'success' ? 'logged! 💌' : 'log reply time'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
