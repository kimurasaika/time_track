import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import StatCard from '../components/StatCard'
import CombinedChart from '../components/CombinedChart'

function computeStats(data) {
  if (!data.length) return { count: 0, mean: 0, std: 0, max: 0, min: 0 }
  const count = data.length
  const mean = data.reduce((s, v) => s + v, 0) / count
  const variance = data.reduce((s, v) => s + (v - mean) ** 2, 0) / count
  const std = Math.sqrt(variance)
  const max = Math.max(...data)
  const min = Math.min(...data)
  return {
    count,
    mean: Math.round(mean * 10) / 10,
    std: Math.round(std * 10) / 10,
    max,
    min,
  }
}

function fmt(n) {
  return isNaN(n) || n === null ? '—' : String(n)
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [names, setNames] = useState(null)
  const [activeTab, setActiveTab] = useState(0) // 0 = person1, 1 = person2
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('chat_timer_names')
    if (!stored) { navigate('/'); return }
    setNames(JSON.parse(stored))
  }, [navigate])

  useEffect(() => {
    if (!names) return
    async function fetchData() {
      setLoading(true)
      const { data, error } = await supabase
        .from('response_times')
        .select('person, minutes')
        .order('created_at', { ascending: false })
      if (!error) setRows(data ?? [])
      setLoading(false)
    }
    fetchData()
  }, [names])

  if (!names) return null

  const people = [names.person1, names.person2]
  const activePerson = people[activeTab]
  const personData = rows
    .filter((r) => r.person === activePerson)
    .map((r) => r.minutes)
  const stats = computeStats(personData)

  return (
    <div className="min-h-screen p-6" style={{ background: '#FFF0F5' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-4xl">📊</div>
            <h1 className="text-2xl font-800 text-pink-500 mt-1">dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Link
              to="/input"
              className="text-xs font-700 text-white px-4 py-2 rounded-full transition active:scale-95"
              style={{ background: '#FF6B9D' }}
            >
              + log reply
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-pink-100">
          {people.map((name, i) => (
            <button
              key={name}
              onClick={() => setActiveTab(i)}
              className="flex-1 rounded-xl py-2.5 text-sm font-700 transition"
              style={{
                background: activeTab === i ? '#FF6B9D' : 'transparent',
                color: activeTab === i ? '#fff' : '#FF9EC4',
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-pink-300 font-600">loading data... 🌸</div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              <StatCard label="replies" value={fmt(stats.count)} emoji="💌" />
              <StatCard label="mean" value={stats.count ? `${fmt(stats.mean)}m` : '—'} emoji="📏" />
              <StatCard label="std dev" value={stats.count ? `${fmt(stats.std)}m` : '—'} emoji="📐" />
              <StatCard label="max" value={stats.count ? `${fmt(stats.max)}m` : '—'} emoji="🔺" />
              <StatCard label="min" value={stats.count ? `${fmt(stats.min)}m` : '—'} emoji="🔻" />
            </div>

            {/* Combined chart */}
            <div className="bg-white rounded-3xl shadow-sm border border-pink-100 p-6">
              <h2 className="text-sm font-700 text-pink-400 mb-1 uppercase tracking-wider">
                response times ⏰📈
              </h2>
              <p className="text-xs text-pink-300 mb-4">
                μ = {stats.count ? stats.mean : '—'} min &nbsp;|&nbsp;
                σ = {stats.count ? stats.std : '—'} min &nbsp;|&nbsp;
                shaded = μ±σ
              </p>
              <CombinedChart data={personData} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
