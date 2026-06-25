import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function formatDate(ts) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('chat_timer_names')
    if (!stored) { navigate('/'); return }
    fetchAll()
  }, [navigate])

  async function fetchAll() {
    setLoading(true)
    setErrorMsg('')
    const { data, error } = await supabase
      .from('response_times')
      .select('id, person, minutes, created_at')
      .order('created_at', { ascending: false })
    if (error) {
      setErrorMsg(error.message)
    } else {
      setRows(data)
    }
    setLoading(false)
  }

  async function handleDelete(row) {
    if (!window.confirm(`Delete ${row.person}'s ${row.minutes}-min entry?`)) return

    // Remove immediately from UI
    setRows(prev => prev.filter(r => r.id !== row.id))

    const { error } = await supabase.from('response_times').delete().eq('id', row.id)
    if (error) {
      setErrorMsg(error.message)
      // Restore the row if delete failed
      setRows(prev => [row, ...prev].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      ))
    }
  }

  return (
    <div className="min-h-screen p-6" style={{ background: '#FFF0F5' }}>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="text-4xl">📜</div>
          <h1 className="text-2xl font-800 text-pink-500 mt-1">history</h1>
          <p className="text-xs text-pink-300 font-600 mt-0.5">all logged reply times, newest first</p>
        </div>

        {errorMsg && (
          <p className="text-red-400 text-xs font-600 bg-red-50 rounded-xl px-4 py-2 mb-4">
            {errorMsg}
          </p>
        )}

        {loading ? (
          <div className="text-center py-16 text-pink-300 font-600">loading... 🌸</div>
        ) : rows.length === 0 ? (
          <div className="text-center py-16 text-pink-300 font-600">no entries yet 🌸</div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_80px_1fr_40px] gap-x-4 px-5 py-3 border-b border-pink-100 bg-pink-50">
              <span className="text-xs font-700 uppercase tracking-wider text-pink-400">person</span>
              <span className="text-xs font-700 uppercase tracking-wider text-pink-400">min</span>
              <span className="text-xs font-700 uppercase tracking-wider text-pink-400">date &amp; time</span>
              <span />
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <div
                key={row.id}
                className={[
                  'grid grid-cols-[1fr_80px_1fr_40px] gap-x-4 items-center px-5 py-3',
                  i !== rows.length - 1 ? 'border-b border-pink-50' : '',
                ].join(' ')}
              >
                <span className="text-sm font-700 text-pink-600 truncate">{row.person}</span>
                <span className="text-sm font-600 text-pink-400">{row.minutes} min</span>
                <span className="text-xs font-600 text-pink-300">{formatDate(row.created_at)}</span>
                <button
                  onClick={() => handleDelete(row)}
                  aria-label="Delete entry"
                  className="flex items-center justify-center w-8 h-8 rounded-full text-pink-300 hover:text-white hover:bg-pink-400 transition active:scale-90"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {rows.length > 0 && (
          <p className="text-center text-xs text-pink-200 font-600 mt-4">
            {rows.length} {rows.length === 1 ? 'entry' : 'entries'} total
          </p>
        )}
      </div>
    </div>
  )
}
