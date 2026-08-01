import { useState, useEffect } from 'react'

function Relatorios() {
  const [historico, setHistorico] = useState([])

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('historico_routly')) || []
    // mais recentes primeiro
    setHistorico(dados.reverse())
  }, [])

  function simularDownload(id) {
    const btn = document.getElementById(`btn-download-${id}`)
    if (!btn) return
    const textoOriginal = btn.innerHTML

    btn.innerHTML = 'GERANDO PDF...'
    btn.style.backgroundColor = '#ebe6d6'
    btn.style.color = '#1a2e44'
    btn.style.borderColor = '#ebe6d6'

    setTimeout(() => {
      btn.innerHTML = '✔ CONCLUÍDO'
      btn.style.backgroundColor = '#4a9d6e'
      btn.style.color = '#1a2e44'
      btn.style.borderColor = '#4a9d6e'

      setTimeout(() => {
        btn.innerHTML = textoOriginal
        btn.style.backgroundColor = 'transparent'
        btn.style.color = '#4a9d6e'
        btn.style.borderColor = '#4a9d6e'
      }, 2500)
    }, 1500)
  }

  return (
    <>
      <h1>Relatórios Salvos</h1>
      <p className="subtitle">Acesse o histórico de rotas calculadas e faça o download em PDF.</p>

      <div id="reports-container">
        {historico.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum relatório salvo</h2>
            <p>Vá até a página "Nova Rota", calcule uma viagem e clique em "Salvar Relatório".</p>
          </div>
        ) : (
          historico.map((r, i) => (
            <div className="report-card" key={i}>
              <div className="report-left">
                <div className="report-info">
                  <h3>{r.origem} ➔ {r.destino}</h3>
                </div>
                <div className="report-details">
                  <span><strong>Data da simulação:</strong> {r.data}</span>
                  <span><strong>Veículo:</strong> {r.veiculo}</span>
                  <span><strong>Foco:</strong> {r.prioridade}</span>
                </div>
                <div className="report-metrics">
                  <div className="report-metric"><span className="lbl">Custo Total</span>    <span className="val">{r.resultados.custo}</span></div>
                  <div className="report-metric"><span className="lbl">Tempo Estimado</span> <span className="val">{r.resultados.tempo}</span></div>
                  <div className="report-metric"><span className="lbl">Emissão CO₂</span>    <span className="val">{r.resultados.co2}</span></div>
                  <div className="report-metric"><span className="lbl">Combustível</span>    <span className="val">{r.resultados.combustivel}</span></div>
                </div>
              </div>
              <div className="report-right">
                <button
                  className="btn-download"
                  id={`btn-download-${i}`}
                  onClick={() => simularDownload(i)}
                >
                  ⬇ BAIXAR PDF
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default Relatorios
