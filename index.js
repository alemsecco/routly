// dados simulados

const dbRotas = {
    "Curitiba-São Paulo": {
        "Custo":       { distanciaKm: 390, tempoHoras: 6.5 },
        "CO2":         { distanciaKm: 420, tempoHoras: 7.0 },
        "Equilibrado": { distanciaKm: 405, tempoHoras: 6.0 } 
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
document.querySelector('.btn-calcular').addEventListener('click', function(e) {
    e.preventDefault(); 


    const origem = document.getElementById('origem').value.trim();
    const destino = document.getElementById('destino').value.trim();
    const peso = parseFloat(document.getElementById('peso').value.replace(',', '.')) || 0;
    const precoDiesel = parseFloat(document.getElementById('preco').value.replace(',', '.')) || 0;
    const veiculo = document.getElementById('veiculo').value; 
    const prioridade = prioridadeSelecionada; 

    const chaveRota = `${origem}-${destino}`;

    // validações
    if (!dbRotas[chaveRota]) {
        alert("Para o protótipo, digite exatamente 'Curitiba' na origem e 'São Paulo' no destino.");
        return;
    }
    if (!dbVeiculos[veiculo]) {
        alert("Por favor, selecione um veículo.");
        return;
    }
    if (peso <= 0 || precoDiesel <= 0) {
        alert("Por favor, preencha o peso e o preço do diesel com valores válidos (ex: 25 e 5.90).");
        return;
    }

    // processamento
    const dadosRota = dbRotas[chaveRota][prioridade];
    const dadosVeiculo = dbVeiculos[veiculo];

    const consumoRealKmL = ajustarConsumoPeloPeso(dadosVeiculo.consumoKmLBase, peso, dadosVeiculo.capMaxToneladas);
    const combustivelGastoLitros = dadosRota.distanciaKm / consumoRealKmL;
        
    const custoTotal = combustivelGastoLitros * precoDiesel;
    const emissaoCO2 = calcularEmissaoCO2(combustivelGastoLitros);

    // atualizar cards
    document.getElementById('valor-custo').innerText = `R$ ${custoTotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('valor-tempo').innerText = `${dadosRota.tempoHoras.toFixed(1)} h`;
    document.getElementById('valor-co2').innerText = `${emissaoCO2.toFixed(2).replace('.', ',')} kg`;
    document.getElementById('valor-combustivel').innerText = `${combustivelGastoLitros.toFixed(1).replace('.', ',')} L`;
});