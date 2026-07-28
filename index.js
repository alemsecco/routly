// dados simulados

const dbRotas = {
    "Curitiba-Paranaguá": {
        "Custo":       { distanciaKm: 85, tempoHoras: 1.5 },
        "CO2":         { distanciaKm: 95, tempoHoras: 1.7 },
        "Equilibrado": { distanciaKm: 90, tempoHoras: 1.3 } 
    },
    "Curitiba-Ponta Grossa": {
        "Custo":       { distanciaKm: 110, tempoHoras: 1.8 },
        "CO2":         { distanciaKm: 125, tempoHoras: 2.0 },
        "Equilibrado": { distanciaKm: 115, tempoHoras: 1.5 } 
    },
    "Curitiba-Londrina": {
        "Custo":       { distanciaKm: 380, tempoHoras: 5.8 },
        "CO2":         { distanciaKm: 410, tempoHoras: 6.2 },
        "Equilibrado": { distanciaKm: 385, tempoHoras: 5.5 } 
    },
    "Curitiba-Maringá": {
        "Custo":       { distanciaKm: 415, tempoHoras: 6.2 },
        "CO2":         { distanciaKm: 450, tempoHoras: 6.8 },
        "Equilibrado": { distanciaKm: 425, tempoHoras: 6.0 } 
    }
};

const dbVeiculos = {
    "VUC (Urbano)": { consumoKmLBase: 6.5, capMaxToneladas: 3 },
    "Caminhão Truck (6x2)": { consumoKmLBase: 4.0, capMaxToneladas: 14 },
    "Carreta LS (3 Eixos)": { consumoKmLBase: 2.6, capMaxToneladas: 32 },
    "Bi-trem (7 Eixos)": { consumoKmLBase: 2.0, capMaxToneladas: 40 },
    "Rodo-trem (9 Eixos)": { consumoKmLBase: 1.5, capMaxToneladas: 52 }
};

// botões de prioridade
let prioridadeSelecionada = "Equilibrado";

function selecionarPrioridade(botaoClicado, tipoPrioridade) {
    const botoes = document.querySelectorAll('.priority button');
    botoes.forEach(btn => btn.classList.remove('ativo'));

    botaoClicado.classList.add('ativo');

    prioridadeSelecionada = tipoPrioridade;

    //atualizarMapa(tipoPrioridade);
}

function atualizarMapa(prioridade) {
    const rotas = document.querySelectorAll('.rota-linha');
    rotas.forEach(rota => rota.classList.remove('rota-ativa'));

    const rotaSelecionada = document.getElementById(`rota-${prioridade}`);
    if (rotaSelecionada) {
        rotaSelecionada.classList.add('rota-ativa');
    }
}

// atualizar nomes das cidades no mapa em tempo real ao selecionar nos inputs
const inputOrigem = document.getElementById('origem');
if (inputOrigem) {
    inputOrigem.addEventListener('change', function() {
        const mapaOrigem = document.getElementById('mapa-texto-origem');
        if(mapaOrigem) mapaOrigem.textContent = this.value || 'Origem';
    });
}

const inputDestino = document.getElementById('destino');
if (inputDestino) {
    inputDestino.addEventListener('change', function() {
        const mapaDestino = document.getElementById('mapa-texto-destino');
        if(mapaDestino) mapaDestino.textContent = this.value || 'Destino';
    });
}

// cálculo

function calcularEmissaoCO2(litrosConsumidos) {
    const FATOR_EMISSAO_DIESEL = 2.68; 
    return litrosConsumidos * FATOR_EMISSAO_DIESEL;
}

function ajustarConsumoPeloPeso(consumoBase, pesoSugerido, capMax) {
    if (pesoSugerido > capMax) pesoSugerido = capMax; 
    const taxaOcupacao = pesoSugerido / capMax;
    const perdaMaxEficiencia = 0.35; 
    return consumoBase * (1 - (taxaOcupacao * perdaMaxEficiencia));
}

// botão calcular
const btnCalcular = document.querySelector('.btn-calcular');
if (btnCalcular) {
    document.querySelector('.btn-calcular').addEventListener('click', function(e) {
        e.preventDefault(); 


        const origem = document.getElementById('origem').value.trim();
        const destino = document.getElementById('destino').value.trim();
        const carga = document.getElementById('carga').value.trim();
        const peso = parseFloat(document.getElementById('peso').value.replace(',', '.')) || 0;
        const precoDiesel = parseFloat(document.getElementById('preco').value.replace(',', '.')) || 0;
        const veiculo = document.getElementById('veiculo').value; 
        const prioridade = prioridadeSelecionada; 

        const chaveRota = `${origem}-${destino}`;

        // validações
        if (!origem || !destino) {
            alert("Por favor, selecione uma origem e um destino.");
            return;
        }

        if (!dbRotas[chaveRota]) {
            alert(`A rota ${origem} até ${destino} ainda não está disponível no sistema.`);
            return;
        }

        if (!dbVeiculos[veiculo]) {
            alert("Por favor, selecione um veículo.");
            return;
        }

        if (!carga) {
            alert("Por favor, selecione uma carga.")
            return;
        }

        if (peso <= 0 || precoDiesel <= 0) {
            alert("Por favor, preencha o peso e o preço do diesel com valores válidos (ex: 25 e 5.90).");
            return;
        }

        // processamento
        const dadosRota = dbRotas[chaveRota][prioridade];
        const dadosVeiculo = dbVeiculos[veiculo];

        if (peso > dadosVeiculo.capMaxToneladas) {
            alert(`Atenção: O peso inserido (${peso}t) ultrapassa o limite máximo suportado pelo veículo ${veiculo} (${dadosVeiculo.capMaxToneladas}t). Por favor, reduza o peso ou escolha um veículo maior.`);
            return;
        }

        const consumoRealKmL = ajustarConsumoPeloPeso(dadosVeiculo.consumoKmLBase, peso, dadosVeiculo.capMaxToneladas);
        const combustivelGastoLitros = dadosRota.distanciaKm / consumoRealKmL;
            
        const custoTotal = combustivelGastoLitros * precoDiesel;
        const emissaoCO2 = calcularEmissaoCO2(combustivelGastoLitros);

        // atualizar cards e rota do mapa
        document.getElementById('valor-custo').innerText = `R$ ${custoTotal.toFixed(2).replace('.', ',')}`;
        document.getElementById('valor-tempo').innerText = `${dadosRota.tempoHoras.toFixed(1)} h`;
        document.getElementById('valor-co2').innerText = `${emissaoCO2.toFixed(2).replace('.', ',')} kg`;
        document.getElementById('valor-combustivel').innerText = `${combustivelGastoLitros.toFixed(1).replace('.', ',')} L`;
        atualizarMapa(prioridadeSelecionada);
    });
}

const btnSalvarRelatorio = document.getElementById('btn-salvar-relatorio');
if (btnSalvarRelatorio) {
    document.getElementById('btn-salvar-relatorio').addEventListener('click', function() {
        const custoAtual = document.getElementById('valor-custo').innerText;
        if (custoAtual === "—") {
            const textoOriginal = this.innerHTML;
            this.innerHTML = "CALCULE A ROTA PRIMEIRO";
            this.style.color = "#e11d48"; // vermelho
            this.style.borderColor = "#e11d48";
            
            setTimeout(() => {
                this.innerHTML = textoOriginal;
                this.style.color = "";
                this.style.borderColor = "";
            }, 2500);
            return;
        }

        const relatorioSalvo = {
            data: new Date().toLocaleDateString('pt-BR'),
            origem: document.getElementById('origem').value,
            destino: document.getElementById('destino').value,
            veiculo: document.getElementById('veiculo').value,
            prioridade: prioridadeSelecionada,
            resultados: {
                custo: custoAtual,
                tempo: document.getElementById('valor-tempo').innerText,
                co2: document.getElementById('valor-co2').innerText,
                combustivel: document.getElementById('valor-combustivel').innerText
            }
        };

        
        let historico = JSON.parse(localStorage.getItem('historico_routly')) || [];
        historico.push(relatorioSalvo);
        localStorage.setItem('historico_routly', JSON.stringify(historico));

        const btn = this;
        const textoOriginal = btn.innerHTML;
        
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;"><polyline points="20 6 9 17 4 12"></polyline></svg> SALVO EM RELATÓRIOS`;
        btn.style.backgroundColor = '#4a9d6e';
        btn.style.color = '#ebe6d6';

        setTimeout(() => {
            btn.innerHTML = textoOriginal;
            btn.style.backgroundColor = 'transparent';
            btn.style.color = '#4a9d6e';
        }, 3000);
    });
}

// para o modo claro e escuro
  function toggleTheme(btn) {
    document.body.classList.toggle('dark');
    btn.textContent = document.body.classList.contains('dark') ? '☀︎' : '☽';
  }


// pg de relatorios
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('reports-container');
    
    if (!container) return;
        
    const historico = JSON.parse(localStorage.getItem('historico_routly')) || [];

    if (historico.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Nenhum relatório salvo</h2>
                <p>Vá até a página "Nova Rota", calcule uma viagem e clique em "Salvar Relatório".</p>
            </div>
        `;
        return;
    }

    historico.reverse().forEach((relatorio) => {
        const card = document.createElement('div');
        card.className = 'report-card';
            
        card.innerHTML = `
            <div class="report-left">
                <div class="report-info">
                    <h3>${relatorio.origem} ➔ ${relatorio.destino}</h3>
                </div>
                <div class="report-details">
                    <span><strong>Data da simulação:</strong> ${relatorio.data}</span>
                    <span><strong>Veículo:</strong> ${relatorio.veiculo}</span>
                    <span><strong>Foco:</strong> ${relatorio.prioridade}</span>
                </div>
                <div class="report-metrics">
                    <div class="report-metric"><span class="lbl">Custo Total</span><span class="val">${relatorio.resultados.custo}</span></div>
                    <div class="report-metric"><span class="lbl">Tempo Estimado</span><span class="val">${relatorio.resultados.tempo}</span></div>
                    <div class="report-metric"><span class="lbl">Emissão CO₂</span><span class="val">${relatorio.resultados.co2}</span></div>
                    <div class="report-metric"><span class="lbl">Combustível</span><span class="val">${relatorio.resultados.combustivel}</span></div>
                </div>
            </div>
            <div class="report-right">
                <button class="btn-download" onclick="simularDownload(this)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    BAIXAR PDF
                </button>
            </div>
        `;
        container.appendChild(card);
    });
});

function simularDownload(btn) {
    const textoOriginal = btn.innerHTML;
        
    btn.innerHTML = 'GERANDO PDF...';
    btn.style.backgroundColor = '#ebe6d6';
    btn.style.color = '#1a2e44';
    btn.style.borderColor = '#ebe6d6';
        
    setTimeout(() => {
        btn.innerHTML = '✔ CONCLUÍDO';
        btn.style.backgroundColor = '#4a9d6e';
        btn.style.color = '#1a2e44';
        btn.style.borderColor = '#4a9d6e';
            
        setTimeout(() => {
            btn.innerHTML = textoOriginal;
            btn.style.backgroundColor = 'transparent';
            btn.style.color = '#4a9d6e';
        }, 2500);
    }, 1500);
}