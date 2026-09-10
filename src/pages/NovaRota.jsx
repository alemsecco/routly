import { useState } from 'react'
import { dbRotas, dbVeiculos, listaOrigens, listaDestinos, listaCargas } from '../data/db'
import { calcularRota } from '../utils/calculo'
import MapaSVG from '../components/MapaSVG'
import Metricas from '../components/Metricas'

function NovaRota() {
  // estado do formulário
  const [origem, setOrigem] = useState('Curitiba')
  const [destino, setDestino] = useState('')
  const [veiculo, setVeiculo] = useState('')
  const [carga, setCarga] = useState('')
  const [peso, setPeso] = useState('')
  const [precoDiesel, setPrecoDiesel] = useState('')
  const [prioridade, setPrioridade] = useState('Equilibrado')

  // resultado
  const [resultado, setResultado] = useState(null)

  // texto do botão salvar (muda depois de clicar)
  const [statusSalvar, setStatusSalvar] = useState('padrao') // padrao | falta | salvo

  function handleCalcular(e) {
    e.preventDefault()

    const pesoNum = parseFloat(String(peso).replace(',', '.')) || 0
    const precoNum = parseFloat(String(precoDiesel).replace(',', '.')) || 0
    const chaveRota = `${origem}-${destino}`

    // validações
    if (!origem || !destino) {
      alert('Por favor, selecione uma origem e um destino.')
      return
    }
    if (!dbRotas[chaveRota]) {
      alert(`A rota ${origem} até ${destino} ainda não está disponível no sistema.`)
      return
    }
    if (!dbVeiculos[veiculo]) {
      alert('Por favor, selecione um veículo.')
      return
    }
    if (!carga) {
      alert('Por favor, selecione uma carga.')
      return
    }
    if (pesoNum <= 0 || precoNum <= 0) {
      alert('Preencha peso e preço do diesel com valores válidos (ex: 25 e 5.90).')
      return
    }

    const dadosVeiculo = dbVeiculos[veiculo]
    if (pesoNum > dadosVeiculo.capMaxToneladas) {
      alert(`O peso (${pesoNum}t) ultrapassa o limite do veículo ${veiculo} (${dadosVeiculo.capMaxToneladas}t).`)
      return
    }

    const dadosRota = dbRotas[chaveRota][prioridade]
    const r = calcularRota({ dadosRota, dadosVeiculo, peso: pesoNum, precoDiesel: precoNum })
    // guarda também qual rota foi calculada — pra imagem sumir se o usuário mudar destino
    setResultado({ ...r, rotaOrigem: origem, rotaDestino: destino })
  }

  function handleWhatsapp() {
    if (!resultado) {
      alert('Calcule a rota primeiro antes de gerar o link.')
      return
    }
    const mensagem =
      `*Rota Routly*%0A` +
      `${origem} ➔ ${destino}%0A%0A` +
      `Veículo: ${veiculo}%0A` +
      `Carga: ${carga}%0A` +
      `Prioridade: ${prioridade}%0A%0A` +
      `Custo: ${resultado.custoTotal}%0A` +
      `Tempo: ${resultado.tempo}%0A` +
      `CO₂: ${resultado.co2}%0A` +
      `Combustível: ${resultado.combustivel}`
    window.open(`https://wa.me/?text=${mensagem}`, '_blank')
  }

  function handleSalvar() {
    if (!resultado) {
      setStatusSalvar('falta')
      setTimeout(() => setStatusSalvar('padrao'), 2500)
      return
    }

    const relatorio = {
      data: new Date().toLocaleDateString('pt-BR'),
      origem, destino, veiculo, prioridade,
      resultados: {
        custo: resultado.custoTotal,
        tempo: resultado.tempo,
        co2: resultado.co2,
        combustivel: resultado.combustivel
      }
    }

    const historico = JSON.parse(localStorage.getItem('historico_routly')) || []
    historico.push(relatorio)
    localStorage.setItem('historico_routly', JSON.stringify(historico))

    setStatusSalvar('salvo')
    setTimeout(() => setStatusSalvar('padrao'), 3000)
  }

  const textoBotaoSalvar = {
    padrao: 'SALVAR RELATÓRIO',
    falta: 'CALCULE A ROTA PRIMEIRO',
    salvo: '✔ SALVO EM RELATÓRIOS'
  }[statusSalvar]

  return (
    <>
      <h1>Nova rota</h1>
      <p className="subtitle">Insira as variáveis e calcule a melhor rota</p>

      <div className="columns">
        {/* FORMULÁRIO */}
        <form className="form" onSubmit={handleCalcular}>
          <div className="field">
            <label htmlFor="origem">Origem</label>
            <select id="origem" value={origem} onChange={(e) => setOrigem(e.target.value)}>
              {listaOrigens.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="field">
            <label htmlFor="destino">Destino</label>
            <select id="destino" value={destino} onChange={(e) => setDestino(e.target.value)}>
              <option value="">Selecione um destino</option>
              {listaDestinos.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="field">
            <label htmlFor="veiculo">Veículo</label>
            <select id="veiculo" value={veiculo} onChange={(e) => setVeiculo(e.target.value)}>
              <option value="">Selecione um veículo</option>
              {Object.keys(dbVeiculos).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="field">
            <label htmlFor="carga">Carga</label>
            <select id="carga" value={carga} onChange={(e) => setCarga(e.target.value)}>
              <option value="">Selecione uma carga</option>
              {listaCargas.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="peso">Peso (em toneladas)</label>
              <input
                type="text"
                id="peso"
                placeholder="Adicione o peso da carga"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="preco">Preço diesel</label>
              <input
                type="text"
                id="preco"
                placeholder="Adicione o preço do diesel"
                value={precoDiesel}
                onChange={(e) => setPrecoDiesel(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Prioridade</label>
            <div className="priority">
              {['Equilibrado', 'Custo', 'CO2'].map(p => (
                <button
                  key={p}
                  type="button"
                  className={`btn-prioridade ${prioridade === p ? 'ativo' : ''}`}
                  onClick={() => setPrioridade(p)}
                >
                  {p === 'CO2' ? 'CO₂' : p}
                </button>
              ))}
            </div>
          </div>

        </form>

        {/* RESULTADO */}
        <section className="result">
          <div className="result-header">
            <span className="label">Rota recomendada:</span>
            <span className="badge">MELHOR</span>
          </div>

          <MapaSVG
            prioridadeAtiva={prioridade}
            origem={origem}
            destino={destino}
            calculado={
              !!resultado &&
              resultado.rotaOrigem === origem &&
              resultado.rotaDestino === destino
            }
          />

          <Metricas resultado={resultado} />
        </section>
      </div>

      {/* AÇÕES — largura total, embaixo das duas colunas */}
      <div className="acoes">
        <button
          type="button"
          className="btn-acao btn-calcular"
          onClick={handleCalcular}
        >
          CALCULAR ROTA
        </button>
        <button
          type="button"
          className="btn-acao btn-salvar"
          onClick={handleSalvar}
          style={
            statusSalvar === 'falta'
              ? { color: '#e11d48', borderColor: '#e11d48' }
              : statusSalvar === 'salvo'
              ? { backgroundColor: '#4a9d6e', color: '#ebe6d6' }
              : {}
          }
        >
          {textoBotaoSalvar}
        </button>
        <button
          type="button"
          className="btn-acao btn-whatsapp"
          onClick={handleWhatsapp}
        >
          ENVIAR NO WHATSAPP
        </button>
      </div>
    </>
  )
}

export default NovaRota
