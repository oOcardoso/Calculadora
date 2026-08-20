const telaAtualEl = document.getElementById('telaAtual');
const telaAnteriorEl = document.getElementById('telaAnterior');
 
let atual = '0';
let anterior = '';
let operador = null;
let reiniciarProximoNumero = false;
 
function atualizarTela() {
  telaAtualEl.textContent = formatarNumero(atual);
  telaAnteriorEl.textContent = anterior && operador ? `${formatarNumero(anterior)} ${operador}` : '';
}
 
function formatarNumero(valor) {
  if (valor === '' || valor === undefined) return '0';
  const [inteira, decimal] = valor.toString().split('.');
  const inteiraFormatada = new Intl.NumberFormat('pt-BR').format(Number(inteira));
  return decimal !== undefined ? `${inteiraFormatada},${decimal}` : inteiraFormatada;
}
 
function inserirNumero(numero) {
  if (atual.length >= 12 && !reiniciarProximoNumero) return;
 
  if (reiniciarProximoNumero) {
    atual = numero === '.' ? '0.' : numero;
    reiniciarProximoNumero = false;
    return;
  }
 
  if (numero === '.' && atual.includes('.')) return;
  atual = atual === '0' && numero !== '.' ? numero : atual + numero;
}
 
function selecionarOperador(novoOperador) {
  if (operador && !reiniciarProximoNumero) {
    calcular();
  }
  anterior = atual;
  operador = novoOperador;
  reiniciarProximoNumero = true;
}
 
function calcular() {
  if (!operador || anterior === '') return;
 
  const num1 = parseFloat(anterior);
  const num2 = parseFloat(atual);
  let resultado;
 
  switch (operador) {
    case '+':
      resultado = num1 + num2;
      break;
    case '−':
      resultado = num1 - num2;
      break;
    case '×':
      resultado = num1 * num2;
      break;
    case '÷':
      resultado = num2 === 0 ? 'Erro' : num1 / num2;
      break;
    default:
      return;
  }
 
  atual = resultado === 'Erro' ? 'Erro' : arredondar(resultado).toString();
  anterior = '';
  operador = null;
  reiniciarProximoNumero = true;
}
 
function arredondar(numero) {
  return Math.round((numero + Number.EPSILON) * 1e10) / 1e10;
}
 
function limpar() {
  atual = '0';
  anterior = '';
  operador = null;
  reiniciarProximoNumero = false;
}
 
function apagar() {
  if (reiniciarProximoNumero) return;
  atual = atual.length > 1 ? atual.slice(0, -1) : '0';
}
 
function porcentagem() {
  atual = arredondar(parseFloat(atual) / 100).toString();
}
 
document.querySelectorAll('.tecla').forEach((botao) => {
  botao.addEventListener('click', () => {
    const { numero, operador: op, acao } = botao.dataset;
 
    if (numero !== undefined) inserirNumero(numero);
    else if (op !== undefined) selecionarOperador(op);
    else if (acao === 'igual') calcular();
    else if (acao === 'limpar') limpar();
    else if (acao === 'apagar') apagar();
    else if (acao === 'porcentagem') porcentagem();
 
    atualizarTela();
  });
});
 
document.addEventListener('keydown', (evento) => {
  const teclasNumericas = '0123456789';
  const mapaOperadores = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  if (teclasNumericas.includes(evento.key)) inserirNumero(evento.key);
    else if (evento.key === '.') inserirNumero('.');
    else if (mapaOperadores[evento.key]) selecionarOperador(mapaOperadores[evento.key]);
    else if (evento.key === 'Enter' || evento.key === '=') calcular();
    else if (evento.key === 'Backspace') apagar();
    else if (evento.key === 'Escape') limpar();
    else if (evento.key === '%') porcentagem();
    else return;

  atualizarTela();
});

atulizarTela();