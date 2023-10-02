'use strict';
const inputName = document.querySelector('.js-input-serie');
const btnSrc = document.querySelector('.js-btn-src');
const form = document.querySelector('.js-form-series');
const results = document.querySelector('.js-results-series');
const aside = document.querySelector('.js-aside-series');
const favorites = document.querySelector('.js-favorite-series');
const url = '//api.tvmaze.com/search/shows?q=';
const resetBtn = document.querySelector('.js-resetBtn');
// Datos
let favoritesList = [];
let seriesList = [];

// Función que recoja la búsqueda a la API de las series
loadFromLocalStorage();
function getSeries() {
  const nameSerie = inputName.value;
  fetch(url + nameSerie)
    .then((response) => response.json())
    .then((infoSeries) => {
      seriesList = infoSeries;

      // Llamar función que las pinta en HTML
      renderSerieList();
    });
}

// Plantilla de HTML de cada búsqueda de la serie
function renderSerie(serie) {
  let html = '';

  html += `<article class="js-serieBox minibox" id="${serie.show.id}">`;

  html += `<img class="imgSrc" src="${
    serie.show.image
      ? serie.show.image.medium
      : 'https://via.placeholder.com/70x90/ffffff/666666/?text=TV'
  }" alt="${serie.show.name}" title="${serie.show.name}" />`;

  html += `<h2>${serie.show.name}</h2>`;
  html += `</article>`;
  return html;
}

// Con esta función pintamos todos los resultados de la búsqueda de series a través de un bucle
function renderSerieList() {
  results.innerHTML = ''; // Dejamos el results en blanco para que a la hora de realizar nueva búsqueda no se acumulen
  for (const serie of seriesList) {
    results.innerHTML += renderSerie(serie);
  }
  addEventstoseries(); // Llamamos a esta función después de pintar las series
}

// Pulsar el botón y que aparezcan los resultados de la búsqueda de series
function handleClickBtn(event) {
  event.preventDefault();
  getSeries();
}

// Función para renderizar favoritos
function renderFavorites() {
  favorites.innerHTML = ''; // Limpiamos la lista de favoritos antes de renderizar
  for (const favSerie of favoritesList) {
    favorites.innerHTML += renderSerie(favSerie);
  }
}

// Función que maneja lo que ocurre al dar clic en las series
function handleClickSerie(event) {
  const idSerie = parseInt(event.currentTarget.id);

  // Ya teniendo el id del artículo que se hizo clic, añadimos a favoritos
  const seriefound = seriesList.find((serie) => serie.show.id === idSerie);
  const positionFav = favoritesList.findIndex(
    (serie) => serie.show.id === idSerie
  );
  if (positionFav === -1) {
    favoritesList.push(seriefound);
    event.currentTarget.classList.remove('minibox');
    event.currentTarget.classList.add('mark');
  } else {
    favoritesList.splice(positionFav, 1);
    event.currentTarget.classList.remove('mark');
    event.currentTarget.classList.add('minibox');
  }

  renderFavorites();
  localStorage.setItem('favorites', JSON.stringify(favoritesList));
}

// Función para agregar eventos a los artículos que contienen las series con un bucle, ya que no sabemos cuántos resultados hay
function addEventstoseries() {
  const allArticles = document.querySelectorAll('.js-serieBox');
  for (const article of allArticles) {
    article.addEventListener('click', handleClickSerie);
  }
}
function getInfofromLocalStorage() {
  const result = JSON.parse(localStorage.getItem('favorites'));
  if (result === null) {
    return [];
  } else {
    favoritesList = result;
    renderFavorites();

    return favoritesList;
  }
}

// Cargar favoritos almacenados en localStorage cuando se carga la página

function loadFromLocalStorage() {
  const storedFavorites = localStorage.getItem('favorites');
  if (storedFavorites) {
    favoritesList = JSON.parse(storedFavorites);
    renderFavorites();
  }
}

function handleClickResetBtn(event) {
  event.preventDefault();
  favorites.innerHTML = ''; // Dejamos el results en blanco para que a la hora de realizar n
  localStorage.removeItem('favorites');
}

// Eventos
btnSrc.addEventListener('click', handleClickBtn);
resetBtn.addEventListener('click', handleClickResetBtn);
