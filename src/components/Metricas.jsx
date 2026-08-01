function Metricas({ resultado }) {
  const custo = resultado?.custoTotal || '—'
  const tempo = resultado?.tempo || '—'
  const co2 = resultado?.co2 || '—'
  const combustivel = resultado?.combustivel || '—'

  return (
    <div className="metrics">
      <div className="metric dark">
        <span className="metric-label">Custo total</span>
        <span className="metric-value">{custo}</span>
        <span className="metric-sub"></span>
      </div>
      <div className="metric">
        <span className="metric-label">Tempo estimado</span>
        <span className="metric-value">{tempo}</span>
        <span className="metric-sub"></span>
      </div>
      <div className="metric">
        <span className="metric-label">Emissão CO₂</span>
        <span className="metric-value">{co2}</span>
        <span className="metric-sub"></span>
      </div>
      <div className="metric dark">
        <span className="metric-label">Combustível</span>
        <span className="metric-value">{combustivel}</span>
        <span className="metric-sub"></span>
      </div>
    </div>
  )
}

export default Metricas
