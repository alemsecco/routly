// mapa simbólico — destaca a rota selecionada (Custo, CO2 ou Equilibrado)

function MapaSVG({ prioridadeAtiva, origem, destino }) {
  const classeRota = (nome) =>
    'rota-linha' + (prioridadeAtiva === nome ? ' rota-ativa' : '')

  return (
    <div className="map-placeholder">
      <svg id="svg-mapa" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M 60 100 L 150 80 L 250 120 L 340 100" className={classeRota('Custo')} />
        <path d="M 60 100 Q 200 20 340 100"              className={classeRota('CO2')} />
        <path d="M 60 100 Q 200 180 340 100"             className={classeRota('Equilibrado')} />

        <circle cx="60"  cy="100" r="7" className="cidade-ponto" />
        <circle cx="340" cy="100" r="7" className="cidade-ponto" />

        <text x="60"  y="130" className="cidade-texto">{origem  || 'Origem'}</text>
        <text x="340" y="130" className="cidade-texto">{destino || 'Destino'}</text>
      </svg>
    </div>
  )
}

export default MapaSVG
