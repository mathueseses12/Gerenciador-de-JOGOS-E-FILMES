let colecaoMidia = [];

// 1. CARREGAR DADOS DO ARQUIVO JSON
async function carregarCatalogo() {
  const container_card = document.getElementById('catalogo-grid');
  container_card.innerHTML = `<p>Carregando itens, aguarde...</p>`;
  
  try {
    const resposta = await fetch('dados.json');
    if (!resposta.ok) throw new Error('Não foi possível carregar o arquivo dados.json.');
    
    colecaoMidia = await resposta.json();
    rendenizarGrid(colecaoMidia);
    configurarFiltros();
  } catch (erro) {
    container_card.innerHTML = `<p style="color: #ef4444;">Erro ao carregar catálogo: ${erro.message}</p>`;
    console.error(erro);
  }
}
//metodo post
async function adicionarItem(event){
event.preventDefault();

const.novoItem = {
  id: ,
  titulo: ,
  categoria: ,
  plataforma: ,
  nota: ,
  status:
}
}

// 2. RENDERIZAR OS CARDS NA TELA
function rendenizarGrid(lista) {
  const container = document.getElementById('catalogo-grid');
  container.innerHTML = '';
  
  if (lista.length === 0) {
    container.innerHTML = `<p class="info">Nenhum item cadastrado nesta categoria</p>`;
    return;
  }
  
  lista.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    
    const notaFormatada = Number(item.nota).toFixed(1);
    
    // CORREÇÃO MÁGICA: Montando o HTML por partes para o interpretador não bugar os símbolos de \${}
    let htmlFoto = '';
    if (item.capa) {
      htmlFoto = '<img src="' + item.capa + '" alt="' + item.titulo + '" class="capa-midia">';
    }

    card.innerHTML = `
      ${htmlFoto}
      <div>
        <span class="tag-categoria">${item.categoria}</span>
        <h3>${item.titulo}</h3>
        <p class="info">Plataforma: ${item.plataforma}</p>
        <p class="info">Nota: <span class="nota">${notaFormatada}</span></p>
        <p class="info">Status: <strong>${item.status || 'Disponível'}</strong></p>
      </div>
    `;
    container.appendChild(card);
  });
}

// 3. ADICIONAR NOVO ITEM PELO FORMULÁRIO
document.getElementById('form-midia').addEventListener('submit', function(evento) {
  evento.preventDefault();
  
  const titulo = document.getElementById('titulo').value;
  const categoria = document.getElementById('categoria').value;
  const plataforma = document.getElementById('plataforma').value;
  const nota = document.getElementById('nota').value;

  const novoItem = {
    titulo: titulo,
    categoria: categoria,
    plataforma: plataforma,
    nota: parseFloat(nota),
    status: categoria === "Jogos" ? "jogado" : "assistido",
    capa: "" 
  };

  colecaoMidia.push(novoItem);
  rendenizarGrid(colecaoMidia);
  
  this.reset();
});

// 4. CONFIGURAR OS BOTÕES DE FILTRO
function configurarFiltros() {
  const botoes = document.querySelectorAll('.filtros button');
  
  botoes.forEach(botao => {
    botao.addEventListener('click', () => {
      const categoriaSelecionada = botao.textContent.trim();
      
      if (categoriaSelecionada === 'Todos') {
        rendenizarGrid(colecaoMidia);
      } else {
        // Correção inteligente para bater "Jogos" com "Jogos", "Filmes" com "Filme", etc.
        const listaFiltrada = colecaoMidia.filter(item => {
          const catItem = item.categoria.toLowerCase();
          const catBotao = categoriaSelecionada.toLowerCase();
          return catItem.startsWith(catBotao.substring(0, 4));
        });
        rendenizarGrid(listaFiltrada);
      }
    });
  });
}

// Inicia o processo
document.addEventListener('DOMContentLoaded', carregarCatalogo);
