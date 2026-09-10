import { useState, useEffect, useMemo } from 'react'

function Historico() {
  const [historico, setHistorico] = useState([])
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [busca, setBusca] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [expandido, setExpandido] = useState(null)

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('historico_routly')) || []
    setHistorico(dados.reverse())
  }, [])

  function parseData(str) {
    if (!str) return null
    const [d, m, a] = str.split('/')
    return new Date(`${a}-${m}-${d}`)
  }

  const historicoFiltrado = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    const inicio = dataInicio ? new Date(dataInicio): null
    const fim = dataFim ? new Date(dataFim): null

    return historico.filter((r) => {
      if (termo) {
        const texto = `${r.origem} ${r.destino} ${r.veiculo} ${r.prioridade}`.toLowerCase()
        if (!texto.includes(termo)) return false
      }
      const dataItem = parseData(r.data)
      if (inicio && dataItem && dataItem < inicio) return false
      if (fim && dataItem && dataItem > fim) return false
      return true
    })
  }, [historico, busca, dataInicio, dataFim])

  function limparFiltros() {
    setBusca('')
    setDataInicio('')
    setDataFim('')
  }

  const filtrosAtivos = busca || dataInicio || dataFim

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
      <h1>Histórico de Rotas</h1>
      <p className="subtitle">
        Visualize os relatórios de rotas já calculadas e salvas.
      </p>

      {/* botão discreto que abre os filtros */}
      <div className="filtros-header">
        <button
          type="button"
          className="btn-filtros-toggle"
          onClick={() => setFiltrosAbertos(!filtrosAbertos)}
        >
          {filtrosAbertos ? '▲ Ocultar filtros' : '▼ Filtrar e pesquisar'}
          {filtrosAtivos && !filtrosAbertos && (
            <span className="filtros-badge">ativos</span>
          )}
        </button>
      </div>

      {/* filtros expandidos */}
      {filtrosAbertos && (
        <div className="filtros">
          <div className="field">
            <label htmlFor="busca">Buscar</label>
            <input
              type="text"
              id="busca"
              placeholder="Origem, destino, veículo..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="data-inicio">De</label>
            <input
              type="date"
              id="data-inicio"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="data-fim">Até</label>
            <input
              type="date"
              id="data-fim"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
          <button type="button" className="btn-limpar" onClick={limparFiltros}>
            Limpar
          </button>
        </div>
      )}

      {/* lista */}
      <div id="reports-container">
        {historicoFiltrado.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum relatório encontrado</h2>
            <p>
              {historico.length === 0
                ? 'Vá até a página "Nova Rota", calcule uma viagem e clique em "Salvar Relatório".'
                : 'Nenhum resultado para os filtros aplicados.'}
            </p>
          </div>
        ) : (
          historicoFiltrado.map((r, i) => {
            const aberto = expandido === i
            return (
              <div className={`report-card ${aberto ? 'aberto' : ''}`} key={i}>
                <div className="report-header">
                  <div className="report-info">
                    <h3>{r.origem} ➔ {r.destino}</h3>
                    <span className="report-data">{r.data} · Foco: {r.prioridade}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-saiba-mais"
                    onClick={() => setExpandido(aberto ? null : i)}
                  >
                    {aberto ? 'Ocultar detalhes' : 'Saiba mais'}
                  </button>
                </div>

                {aberto && (
                  <div className="report-body">
                    <div className="report-details">
                      <span><strong>Data:</strong> {r.data}</span>
                      <span><strong>Veículo:</strong> {r.veiculo}</span>
                      <span><strong>Foco:</strong> {r.prioridade}</span>
                    </div>
                    <div className="report-metrics">
                      <div className="report-metric"><span className="lbl">Custo Total</span>    <span className="val">{r.resultados.custo}</span></div>
                      <div className="report-metric"><span className="lbl">Tempo Estimado</span> <span className="val">{r.resultados.tempo}</span></div>
                      <div className="report-metric"><span className="lbl">Emissão CO₂</span>    <span className="val">{r.resultados.co2}</span></div>
                      <div className="report-metric"><span className="lbl">Combustível</span>    <span className="val">{r.resultados.combustivel}</span></div>
                    </div>
                    <button
                      className="btn-download"
                      id={`btn-download-${i}`}
                      onClick={() => simularDownload(i)}
                    >
                      ⬇ BAIXAR PDF
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </>
  )
}

export default Historico
