let grafo = [];

document.getElementById("files").addEventListener("change", lerArquivo, false);
document.getElementById("button").addEventListener("click", executarDijkstra);

function lerArquivo(e) {
  let file = e.target.files[0];
  let reader = new FileReader();

  reader.readAsBinaryString(file);

  reader.onloadend = function() {
    let result = reader.result;

    grafo = JSON.parse(result);
    document.getElementById("grafo").innerHTML =
      "Estrutura do Grafo: " + reader.result;
  };
}

function executarDijkstra() {
  let origem = document.getElementById("origem").value.toLowerCase();
  let destino = document.getElementById("destino").value.toLowerCase();

  if (origem && destino && grafo.length > 0) {
    let [caminho, pesoFinal] = dijkstra(grafo, origem, destino);

    document.getElementById("pesoFinal").innerHTML = "Peso final: " + pesoFinal;
    document.getElementById("verticesPercorridos").innerHTML =
      "Vértices percorridos: " + caminho;
  } else {
    if (grafo.length === 0) {
      alert("Selecione o arquivo de entrada no formato JSON.");
      return;
    }
    if (!origem) {
      alert("Informe o vértice de origem.");
      return;
    }
    if (!destino) {
      alert("Informe o vértice de destino.");
      return;
    }
  }
}

// Definição da função de Dijkstra
const dijkstra = (caminho, verticeInicio, verticeFinal) => {
  const Q = new Set();
  const dicionario = {
    anterior: {},
    distancia: {},
    adjacente: {}
  };

  const anterior = {};
  const distancia = {};
  const adjacente = {};

  const verticeComDistanciaMinima = (Q, distancia) => {
    let distanciaMinima = Infinity;
    let u = null;

    for (let vertice of Q) {
      if (distancia[vertice] < distanciaMinima) {
        distanciaMinima = distancia[vertice];
        u = vertice;
      }
    }
    return u;
  };

  for (let i = 0; i < caminho.length; i++) {
    let v1 = caminho[i][0];
    let v2 = caminho[i][1];
    let peso = caminho[i][2];

    Q.add(v1);
    Q.add(v2);

    distancia[v1] = Infinity;
    distancia[v2] = Infinity;

    if (adjacente[v1] === undefined) {
      adjacente[v1] = {};
    }

    if (adjacente[v2] === undefined) {
      adjacente[v2] = {};
    }

    adjacente[v1][v2] = peso;
    adjacente[v2][v1] = peso;
  }

  distancia[verticeInicio] = 0;

  while (Q.size) {
    let u = verticeComDistanciaMinima(Q, distancia);
    // Vizinho continua no Q
    let vizinho = Object.keys(adjacente[u]).filter(v => Q.has(v));

    Q.delete(u);

    if (u === verticeFinal) {
      // Para quando encontrar o vertice final
      break;
    }

    for (let v of vizinho) {
      let alt = distancia[u] + adjacente[u][v];
      if (alt < distancia[v]) {
        distancia[v] = alt;
        anterior[v] = u;
      }
    }
  }

  {
    let u = verticeFinal;
    let S = [u];
    let peso = 0;

    while (anterior[u] !== undefined) {
      S.unshift(anterior[u]);
      peso += adjacente[u][anterior[u]];
      u = anterior[u];
    }
    return [S, peso];
  }
};
