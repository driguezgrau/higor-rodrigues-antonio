
Il Armazenar os dados  
let dados = 0;  

// Gerar ID aleatório com 5 dígitos  
function gerarId () {
     return Math.floor(10000 + Math.random() * 90000); 
    }  

// Adicionar dados à tabela  
document.getElementById('form').addEventListener('submit', function (event) {  
    event.preventDefault();
    
    const descricao = document.getElementById('descricao').value;  
    const valor = parseFloat(document.getElementById('valor').value.replace(',', '.')); // Aceita centavos  
    const tipo = document.getElementById('tipo').value;  

// Captura a data do input e formata corretamente  
    const dataInput = new Date(document.getElementById('data').value);  
    const data = `${String(dataInput.getDate()).padStart(2, '0')}/${String(dataInput.getMonth() + 1).padStart(2, '0')}/${dataInput.getFullYear()}`; //Formato DD/MM/AAAA 

// Adiciona os dados ao array  
    dados.push({ id: gerarId, descricao, valor, tipo, data });  

// Limpa o formulário  
    document.getElementById('form').reset();  

// Atualiza a tabela e o gráfico  
    atualizarTabela();  
    atualizarGrafico();  
    });  

// Atualizar tabela com dados  
    function atualizarTabela(filtroData = null) {  
    const tabelaBody = document.getElementById('tabelaBody');  
    tabelaBody.innerHTML = ''; // Limpa a tabela  

    dados.forEach(item => {  
// Aplica filtro se uma data for fornecida  
    if (!filtroData || item.data === filtroData) {  
    const row = document.createElement('tr');  
    row.innerHTML = '
        <td>${item.id}</td> 
        <td>${item.descricao}</td> 
        <td>${item.valor.toFixed(2).replace('.', ',')}</td> 
        <td style="color: ${item.tipo === 'receita' ? 'green' : 'red'};">${item.tipo}</td> 
        <td>${item.data}</td>  
        <td><button onclick="removerItem(${item.id})">Remover</button></td>;  

tabelaBody.appendChild(row);  
       }  
    });  
}  

// Filtrar por data  
function filtrarPorData() {  
    const dataSelecionada = new Date(document.getElementById('filtroData').value);  
    const dataFormatada = `${String(dataSelecionada.getDate()).padStart(2, '0')}/${String(dataSelecionada.getMonth() + 1).padStart(2, '0')}/${dataSelecionada.getFullYear()}`;  
atualizarTabela(dataFormatada);  
atualizarGrafico();  //Atualiza apos filtrar
}  

// Remover item da tabela  
function removerItem(id) {  
    dados = dados.filter(item => item.id !== id);  
    atualizarTabela();  
    atualizarGrafico();  //atualiza o grafico apos remover
}  

// Função para atualizar o gráfico  
function atualizarGrafico() {  
    const ctx = document.getElementById('graficoCanvas').getContext('2d');  
    const receitas = dados.filter(d => d.tipo === 'receita').reduce((acc, curr) => acc + curr.valor, 0);  
    const despesas = dados.filter(d => d.tipo === 'despesa').reduce((acc, curr) => acc + curr.valor, 0);  

//Configuração do grafico     
const chartData = {  
    labels: ['Receitas', 'Despesas'],  
    datasets: [{  
        label: 'Total',  
        data: [receitas, despesas],  
        backgroundColor: ['#4CAF50', '#F44336'],  
}]  
};  

// Se o gráfico já existe, destrua-o antes de criar um novo  
if (window.meuGrafico) {  
    window.meuGrafico.destroy();  
}  
window.meuGrafico = new Chart(ctx, {  
    type: 'bar',  
    data: chartData,  
    options: {  
        responsive: false,  
        scales: {  
            y: {  
                beginAtZero: true  
            }  
        }  
            }  
        });  
    }  

// Imprimir tabela e gráfico  
    function imprimirPlanilhaGrafico() {  
        const originalContent = document.body.innerHTML; // Armazena o conteúdo original  
        const dataSelecionada = new Date(document.getElementById('filtroData').value);  
        const dataFormatada = `${String(dataSelecionada.getDate()).padStart(2, '0')}/${String(dataSelecionada.getMonth() + 1).padStart(2, '0')}/${dataSelecionada.getFullYear()}`;  

// Filtrar dados para impressão  
    const dadosFiltrados = dados.filter(item => item.data === dataFormatada);  

    const printContent =  
        <div style="text-align: center;">  
        <h1>Planilha Dinâmica</h1>  
        <table style="margin: auto; border-collapse: collapse; width: 100%;">  
            <thead></>
                <tr>  
                    <th>ID</th>  
                    <th>Descrição</th>  
                    <th>Valor</th>  
                    <th>Tipo</th>  
                    <th>Data</th>  
                    </tr>  
                    </thead>  
                    <tbody>  
                    ${dadosFiltrados.map(({ id, descricao, valor, tipo, data }) =>  
                        <tr>  
                    <td>${id}</td>  
                    <td>${descricao}</td>  
                    <td>${valor.toFixed(2).replace('.', ',')}</td>  
                    <td style="color: ${tipo === 'receita' ? 'green' : 'red'};">${tipo}</td>  
                    <td>${data}</td>  
                </tr>`).join('')}  
                </tbody>  
            </table>  
            <h2>Gráfico de Receitas e Despesas</h2>  
            <canvas id="graficoCanvasImpressao" width="200" height="100"></canvas>  
        </div>
        `;  

    document.body.innerHTML = printContent; // Substitui o conteúdo do body  

// Cria o gráfico após o conteúdo estar no DOM  
    const ctx = document.getElementById('graficoCanvasImpressao').getContext('2d');  
    const receitas = dadosFiltrados.filter(d => d.tipo === 'receita').reduce((acc, curr) => acc + curr.valor, 0);  
    const despesas = dadosFiltrados.filter(d => d.tipo === 'despesa').reduce((acc, curr) => acc + curr.valor, 0);  

    const chartData = {  
    labels: ['Receitas', 'Despesas'],  
    datasets: [{  
    label: 'Total',  
    data: [receitas, despesas],  
    backgroundColor: ['#4CAF50', '#F44336'],  
        }]  
    };  

new Chart(ctx, {  
type: 'bar',  
data: chartData,  
});  

document.addEventListener('keydown', function(event) {  
if (event.key === 'Escape') {  
window.location.reload(); // Volta para o conteúdo original  
window.print(); // Inicia a impressão  
document.body.innerHTML = originalContent; // Restaura o conteúdo original  
}  
});  

// Carregar dados salvos no localStorage ao carregar a página  
window.onload = function () {  
const dadosSalvos = localStorage.getItem('dados');  
if (dadosSalvos) {  
dados = JSON.parse(dadosSalvos);  
atualizarTabela();  
atualizarGrafico();  
}  
};  

// Salvar dados no localStorage antes de sair  
window.onbeforeunload = function () {  
localStorage.setItem('dados', JSON.stringify(dados));  
};  