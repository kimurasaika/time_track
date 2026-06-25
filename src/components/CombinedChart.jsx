import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ReferenceArea, ResponsiveContainer,
} from 'recharts'

const BIN_COUNT = 10
const CURVE_SAMPLES = 80

function normalPdf(x, mean, std) {
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mean) / std) ** 2)
}

function buildChartData(rawData) {
  const n = rawData.length
  const mean = rawData.reduce((s, v) => s + v, 0) / n
  const variance = rawData.reduce((s, v) => s + (v - mean) ** 2, 0) / n
  const std = Math.sqrt(variance)

  const min = Math.min(...rawData)
  const max = Math.max(...rawData)
  const binWidth = min === max ? 1 : (max - min) / BIN_COUNT

  // Build bins with bin-center x values
  const bins = Array.from({ length: BIN_COUNT }, (_, i) => ({
    x: min + (i + 0.5) * binWidth,
    count: 0,
  }))
  for (const v of rawData) {
    bins[Math.min(Math.floor((v - min) / binWidth), BIN_COUNT - 1)].count++
  }

  const maxCount = Math.max(...bins.map(b => b.count))

  // Scale PDF peak to match tallest bar: scaleFactor = maxCount / pdf(mean)
  const scaleFactor = maxCount / normalPdf(mean, mean, std)
  const scaled = (x) => scaleFactor * normalPdf(x, mean, std)

  // Curve range: mean ± 3.5σ
  const lo = mean - 3.5 * std
  const hi = mean + 3.5 * std
  const step = (hi - lo) / CURVE_SAMPLES

  // Dense curve-only points — skip any that land within 35% of a bin center
  // to avoid duplicate x positions in the merged array
  const curveOnly = Array.from({ length: CURVE_SAMPLES + 1 }, (_, i) => {
    const x = lo + i * step
    return { x, curve: scaled(x) }
  }).filter(cp => !bins.some(b => Math.abs(b.x - cp.x) < binWidth * 0.35))

  // Attach curve value to each bin center so the line passes through bin tops
  const binsWithCurve = bins.map(b => ({ ...b, curve: scaled(b.x) }))

  const chartData = [...binsWithCurve, ...curveOnly].sort((a, b) => a.x - b.x)

  // barSize in pixels: bin occupies binWidth / (hi-lo) fraction of the chart (~480px usable)
  const barSize = Math.max(4, Math.round((binWidth / (hi - lo)) * 480 * 0.75))

  return { chartData, mean, std, barSize, xDomain: [lo, hi] }
}

export default function CombinedChart({ data }) {
  if (!data || data.length < 2) {
    return <p className="text-pink-300 text-sm text-center py-8">Need at least 2 entries 🌸</p>
  }

  const { chartData, mean, std, barSize, xDomain } = buildChartData(data)

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 20, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#FFD6E7" vertical={false} />
        <XAxis
          dataKey="x"
          type="number"
          domain={xDomain}
          tickCount={8}
          tickFormatter={(v) => Math.round(v)}
          tick={{ fontSize: 11, fill: '#c084a0' }}
          label={{ value: 'minutes', position: 'insideBottom', offset: -8, fontSize: 11, fill: '#c084a0' }}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#c084a0' }}
          width={32}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: '1px solid #FFB3CE',
            background: '#fff',
            fontFamily: 'Nunito, sans-serif',
            fontSize: 12,
          }}
          formatter={(value, name) =>
            name === 'count'
              ? [value, 'replies']
              : [typeof value === 'number' ? value.toFixed(2) : value, 'curve']
          }
          labelFormatter={(v) => `~${Math.round(v)} min`}
        />

        {/* μ ± 1σ shaded band */}
        <ReferenceArea
          x1={mean - std}
          x2={mean + std}
          fill="#FF6B9D"
          fillOpacity={0.3}
          stroke="none"
          label={{ value: 'μ±σ', position: 'insideTop', fontSize: 10, fill: '#FF6B9D' }}
        />

        {/* Histogram bars */}
        <Bar dataKey="count" fill="#FF9EC4" radius={[4, 4, 0, 0]} barSize={barSize} />

        {/* Normal distribution curve — count is undefined on curve-only points so Line
            stays smooth across the full range without connectNulls issues */}
        <Line dataKey="curve" stroke="#FF6B9D" strokeWidth={2.5} dot={false} type="monotone" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
