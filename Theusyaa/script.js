let colecaoMidia = [];

// 1. CARREGAR DADOS (DO LOCALSTORAGE OU DO ARQUIVO JSON INICIAL)
async function carregarCatalogo() {
  const container_card = document.getElementById('catalogo-grid');
  container_card.innerHTML = `<p>Carregando itens, aguarde...</p>`;
  
  try {
    // Primeiro tenta buscar dados já salvos no navegador pelo usuário
    const dadosLocais = localStorage.getItem('dadosMidia');
    
    if (dadosLocais) {
      colecaoMidia = JSON.parse(dadosLocais);
    } else {
      // Se não houver dados locais, busca a lista padrão do arquivo dados.json
      const resposta = await fetch('dados.json');
      if (!resposta.ok) throw new Error('Não foi possível carregar o arquivo dados.json de fábrica.');
      colecaoMidia = await resposta.json();
      
      // Guarda uma cópia inicial no localStorage
      localStorage.setItem('dadosMidia', JSON.stringify(colecaoMidia));
    }
    
    rendenizarGrid(colecaoMidia);
    configurarFiltros();
  } catch (erro) {
    container_card.innerHTML = `<p style="color: #ef4444;">Erro ao carregar catálogo: ${erro.message}</p>`;
    console.error(erro);
    configurarFiltros();
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
    
    let htmlFoto = '';
    if (item.capa) {
      htmlFoto = '<img src="' + item.capa + '" alt="' + item.titulo + '" class="capa-midia" style="max-width: 100%; height: auto; display: block; border-radius: 4px; margin-bottom: 10px;">';
    }

    card.innerHTML = `
      ${htmlFoto}
      <div>
        <span class="tag-categoria">${item.categoria}</span>
        <h3>${item.titulo}</h3>
        <p class="info">Plataforma: ${item.plataforma}</p>
        <p class="info">Nota: <span class="nota">${notaFormatada}</span></p>
        <p class="info">Status: <strong style="cursor:pointer;" onclick="alterarStatus(${item.id})">${item.status || 'Disponível'}</strong></p>
      </div>
    `;
    container.appendChild(card);
  });
}

// 3. ADICIONAR NOVO ITEM PELO FORMULÁRIO (SALVANDO NO LOCALSTORAGE)
document.getElementById('form-midia').addEventListener('submit', function(evento) {
  evento.preventDefault();
  
  const titulo = document.getElementById('titulo').value;
  const imagemUrl = document.getElementById('imagemUrl').value;
  const categoria = document.getElementById('categoria').value;
  const plataforma = document.getElementById('plataforma').value;
  const nota = parseFloat(document.getElementById('nota').value);

  const novoItem = {
    id: Date.now(),
    titulo: titulo,
    categoria: categoria,
    plataforma: plataforma,
    nota: parseFloat(nota),
    status: categoria === "Jogos" ? "Jogado" : "Assistido", // Ajustado para bater com as opções da lista de status
    capa: imagemUrl
  };

  colecaoMidia.push(novoItem);
  
  // Salva a lista atualizada no LocalStorage do navegador
  localStorage.setItem('dadosMidia', JSON.stringify(colecaoMidia));
  
  rendenizarGrid(colecaoMidia);
  
  this.reset();
  alert('Item adicionado à lista local com sucesso!');
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

// 5. ALTERAR STATUS SEQUENCIALMENTE (E SALVAR)
async function alterarStatus(id) {
  const item = colecaoMidia.find(m => m.id === id);
  if(!item) return;
  
  const statusOpcoes = ["Jogar", "Jogando", "Jogado", "Assistir", "Assistindo", "Assistido"];
  
  // Descobre o próximo index da lista, se não achar o status atual, começa do 0
  const indexAtual = statusOpcoes.indexOf(item.status);
  const proximoStatus = statusOpcoes[(indexAtual + 1) % statusOpcoes.length];
  
  try {
    item.status = proximoStatus;
    
    // Atualiza o banco de dados do navegador
    localStorage.setItem('dadosMidia', JSON.stringify(colecaoMidia));
    rendenizarGrid(colecaoMidia);
  } catch(erro) {
    alert("Erro ao atualizar o status");
  }
}

// Inicia o processo
document.addEventListener('DOMContentLoaded', carregarCatalogo);

async function deletarItem(){

}
//a partir de uma funcao assincrona, crie uma funcao responsavel por deletar um item utilizando a estrutura de try... catch


