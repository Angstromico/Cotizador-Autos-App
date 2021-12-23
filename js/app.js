//Constructores
function Seguro(marca, año, tipo) {
  this.marca = marca;
  this.año = año;
  this.tipo = tipo;
}
function UI() {}
//Llena las opciones de años
UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear(),
    min = max - 20,
    selectYear = document.getElementById('year');

  for (let i = max; i > min; i--) {
    let option = document.createElement('OPTION');
    option.value = i;
    option.textContent = i;
    selectYear.append(option);
  }
};
//Alertas
UI.prototype.mensaje = (mensaje, tipo) => {
  const div = document.createElement('DIV'),
    form = document.getElementById('cotizar-seguro'),
    resultado = document.getElementById('resultado');
  div.classList.add('mensaje', 'mt-10');
  if (tipo === 'error') {
    div.classList.add('error');
  }
  if (tipo === 'correcto') {
    div.classList.add('correcto');
  }
  div.textContent = mensaje;
  form.insertBefore(div, resultado);
  setTimeout(() => {
    div.remove();
  }, 3000);
};
//prototype para Seguro
Seguro.prototype.cotizar = function () {
  let cantidad;
  const base = 2000,
    currentYear = new Date().getFullYear(),
    diferencialAnual = (currentYear - this.año) * 3;
  switch (this.marca) {
    case '1':
      cantidad = base * 1.15;
      break;
    case '2':
      cantidad = base * 1.05;
      break;
    case '3':
      cantidad = base * 1.3;
      break;
    default:
      cantidad = base;
      break;
  }
  //Calcular Precio Acorde al Año y el tipo
  cantidad -= (diferencialAnual * cantidad) / 100;
  if (this.tipo === 'basico') {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }
  return cantidad;
};
//Mostrar Resultados
UI.prototype.mostrar = (total, seguro) => {
  let label;
  const div = document.createElement('DIV'),
    resultado = document.getElementById('resultado'),
    cargando = document.getElementById('cargando'),
    { marca, año, tipo } = seguro;
  switch (marca) {
    case '1':
      label = 'Americano';
      break;
    case '2':
      label = 'Asiatico';
      break;
    case '3':
      label = 'Europeo';
      break;
    default:
      break;
  }
  div.classList.add('mt-10');
  div.innerHTML = `
        <p class="header">Resumen</p>
        <p class="font-bold">Marca: ${label} </p>
        <p class="font-bold">Año: ${año} </p>
        <p class="font-bold">Plan Seguro: ${tipo} </p>
        <p class="font-bold">Costo Seguro: ${total} $</p>
    `;

  //Mostrar animación de Carga
  cargando.style.display = 'block';
  setTimeout(() => {
    cargando.style.display = 'none';
    resultado.append(div);
  }, 3000);
};
//Instanciar UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
  //Agregar Años al Select
  ui.llenarOpciones();
});
eventListeners();
function eventListeners() {
  const form = document.getElementById('cotizar-seguro');
  form.addEventListener('submit', cotizarSeguro);
}
function cotizarSeguro(e) {
  e.preventDefault();
  //Leer Datos de Formulario
  const marca = document.getElementById('marca').value,
    year = document.getElementById('year').value,
    tipo = document.querySelector('input[name="tipo"]:checked').value,
    resultadoAnterior = document.querySelector('#resultado div'),
    form = document.getElementById('cotizar-seguro');
  //Ocultar Resumen Pasado
  if (resultadoAnterior) {
    resultadoAnterior.remove();
  }
  if (!marca || !year || !tipo) {
    ui.mensaje('Debe Llenar todos los Campos', 'error');
    return;
  }
  ui.mensaje('Cotizando...', 'correcto');

  //Instanciar Seguro
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizar();
  ui.mostrar(total, seguro);
  //Resetear Formulario
  form.reset();
}
