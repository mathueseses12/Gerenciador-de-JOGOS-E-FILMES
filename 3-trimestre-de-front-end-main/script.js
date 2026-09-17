let colecaoMidia = []

async function carregarCatalogo(){
const container_card = document.getElementById('catalogo-grid');
container_card.innerHTML = "<p>Carregando itens, aguarde.</p>";

try{
    //metodo get. fetch() ja posui get como padrao 
    const resposta = await fetch('dados.json');
    if(!resposta.ok) throw new Error('Erro ao buscar os dados')
    //Transforma os dado no formato json()
    colecaoMidia = await resposta.json();
}catch(erro){
    container_card.innerHTML = `<p style="color: #ef444">
        Erro ao carregar catalogo: ${erro.message}</p>`;
    }
}

function renderizarGrid(lista){
    const container = document.getElementById('catalogo-grid');
    container.innerHTML = "";

    if(lista.lenght === 0){
        container.innerHTML = `<p class="info">Nenhum item cadastrado
        nesta categoria</p>`;
        return;
    }
}


//executa a funcao de carregarCatalogo quando incia a pagina     
document.addEventListener('DOMContentLoaded', carregarCatalogo);