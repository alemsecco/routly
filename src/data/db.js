// banco de dados simulado — rotas e veículos disponíveis

export const dbRotas = {
  "Curitiba-Paranaguá": {
    "Custo": {distanciaKm: 85, tempoHoras: 1.5 },
    "CO2": {distanciaKm: 95, tempoHoras: 1.7 },
    "Equilibrado": {distanciaKm: 90, tempoHoras: 1.3 }
  },
  "Curitiba-Ponta Grossa": {
    "Custo": {distanciaKm: 110, tempoHoras: 1.8 },
    "CO2": {distanciaKm: 125, tempoHoras: 2.0 },
    "Equilibrado": {distanciaKm: 115, tempoHoras: 1.5 }
  },
  "Curitiba-Londrina": {
    "Custo": {distanciaKm: 380, tempoHoras: 5.8 },
    "CO2": {distanciaKm: 410, tempoHoras: 6.2 },
    "Equilibrado": {distanciaKm: 385, tempoHoras: 5.5 }
  },
  "Curitiba-Maringá": {
    "Custo": {distanciaKm: 415, tempoHoras: 6.2 },
    "CO2": {distanciaKm: 450, tempoHoras: 6.8 },
    "Equilibrado": {distanciaKm: 425, tempoHoras: 6.0 }
  }
};

// apenas caminhão trator, não rígido (trator tem carreta, rígido não)
export const dbVeiculos = {
  "Carreta LS (3 Eixos)": { consumoKmLBase: 2.6, capMaxToneladas: 48.5 },
  "Carreta Vanderlea": {consumoKmLBase: 2.0, capMaxToneladas: 53   },
  "Carreta Quarto Eixo": {consumoKmLBase: 2.0, capMaxToneladas: 58.5 },
  "Bi-trem (7 Eixos)": {consumoKmLBase: 2.0, capMaxToneladas: 57   },
  "Rodo-trem (9 Eixos)": {consumoKmLBase: 1.5, capMaxToneladas: 74   }
};

export const listaOrigens = ["Curitiba"];
export const listaDestinos = ["Paranaguá", "Ponta Grossa", "Londrina", "Maringá"];
export const listaCargas = [
  "Milho",
  "Soja",
  "Eletro-eletrônicos",
  "Carga viva (pequeno porte)",
  "Carga viva (grande porte)",
  "Peças, móveis e máquinas",
  "Outro"
];
