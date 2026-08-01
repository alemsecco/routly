// funções de cálculo — consumo, emissão e custo

const FATOR_EMISSAO_DIESEL = 2.68; // kg de CO2 por litro de diesel (IPCC)
const PERDA_MAX_EFICIENCIA = 0.35; // até 35% a mais de consumo com carga cheia

export function calcularEmissaoCO2(litrosConsumidos) {
  return litrosConsumidos * FATOR_EMISSAO_DIESEL;
}

export function ajustarConsumoPeloPeso(consumoBase, pesoSugerido, capMax) {
  const pesoUtil = pesoSugerido > capMax ? capMax : pesoSugerido;
  const taxaOcupacao = pesoUtil / capMax;
  return consumoBase * (1 - (taxaOcupacao * PERDA_MAX_EFICIENCIA));
}

// função principal — recebe todos os dados e devolve os resultados
export function calcularRota({ dadosRota, dadosVeiculo, peso, precoDiesel }) {
  const consumoRealKmL = ajustarConsumoPeloPeso(
    dadosVeiculo.consumoKmLBase,
    peso,
    dadosVeiculo.capMaxToneladas
  );
  const combustivelGastoLitros = dadosRota.distanciaKm / consumoRealKmL;
  const custoTotal = combustivelGastoLitros * precoDiesel;
  const emissaoCO2 = calcularEmissaoCO2(combustivelGastoLitros);

  return {
    custoTotal:  `R$ ${custoTotal.toFixed(2).replace('.', ',')}`,
    tempo:       `${dadosRota.tempoHoras.toFixed(1)} h`,
    co2:         `${emissaoCO2.toFixed(2).replace('.', ',')} kg`,
    combustivel: `${combustivelGastoLitros.toFixed(1).replace('.', ',')} L`
  };
}
