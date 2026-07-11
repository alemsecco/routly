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
document.getElementById('origem').addEventListener('change', function() {
    document.getElementById('mapa-texto-origem').textContent = this.value || 'Origem';
});

document.getElementById('destino').addEventListener('change', function() {
    document.getElementById('mapa-texto-destino').textContent = this.value || 'Destino';
});

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