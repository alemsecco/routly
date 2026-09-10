// mapa da rota — mostra imagem específica quando a rota foi calculada,
// ou o SVG simbólico enquanto o usuário ainda não clicou em CALCULAR

// normaliza texto pra bater com o nome do arquivo:
// remove acentos, tira espaços, minúsculo
// ex: "Ponta Grossa" -> "pontagrossa", "Paranaguá" -> "paranagua"
function normalizar(texto) {
  return texto
    .normalize('NFD')                    // separa letras dos acentos
    .replace(/[̀-ͯ]/g, '')     // remove os acentos
    .toLowerCase()
    .replace(/\s+/g, '')                 // remove espaços
}

function MapaSVG({ prioridadeAtiva, origem, destino, calculado }) {
  // se a rota foi calculada, monta o caminho da imagem: /curitiba-pontagrossa.jpeg
  const imagem = calculado && origem && destino
    ? `/${normalizar(origem)}-${normalizar(destino)}.jpeg`
    : null

  if (imagem) {
    return (
      <div className="map-placeholder map-imagem">
        <img
          src={imagem}
          alt={`Rota de ${origem} para ${destino}`}
          onError={(e) => {
            // se não achou a imagem, esconde e cai no fallback SVG
            e.target.style.display = 'none'
          }}
        />
      </div>
    )
  }

  // fallback: SVG genérico
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
