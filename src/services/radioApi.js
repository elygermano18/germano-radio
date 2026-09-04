// src/services/radioApi.js

import { localRadios } from '../data/localRadios';

const BASE_URL = 'https://de1.api.radio-browser.info/json';
const HEADERS = { 'User-Agent': 'GermanoRadio/1.0' };

// Lista fixa de estados brasileiros
const BRAZILIAN_STATES = [
  'Acre', 'Alagoas', 'Amapa', 'Amazonas', 'Bahia', 'Ceara', 
  'Distrito Federal', 'Espirito Santo', 'Goias', 'Maranhao', 
  'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Para', 
  'Paraiba', 'Parana', 'Pernambuco', 'Piaui', 'Rio de Janeiro', 
  'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondonia', 'Roraima', 
  'Santa Catarina', 'Sao Paulo', 'Sergipe', 'Tocantins'
];

// Lista de gêneros com os nomes EXATOS que a API Radio Browser reconhece
const BRAZILIAN_GENRES = [
  { name: 'Sertanejo', tag: 'sertanejo' },
  { name: 'Forró', tag: 'forro' },
  { name: 'Funk', tag: 'funk' },
  { name: 'MPB', tag: 'mpb' },
  { name: 'Rock', tag: 'rock' },
  { name: 'Pagode', tag: 'pagode' },
  { name: 'Samba', tag: 'samba' },
  { name: 'Axé', tag: 'axe' },
  { name: 'Gospel', tag: 'gospel' },
  { name: 'Eletrônica', tag: 'electronic' },
  { name: 'Pop', tag: 'pop' },
  { name: 'Hip Hop', tag: 'hiphop' },
  { name: 'Reggae', tag: 'reggae' },
  { name: 'Jazz', tag: 'jazz' },
  { name: 'Clássica', tag: 'classical' },
  { name: 'Notícias', tag: 'news' },
  { name: 'Esportes', tag: 'sports' },
  { name: 'Talk/Entrevistas', tag: 'talk' }
];

export const radioApi = {
  async getPopular(limit = 50) {
    const res = await fetch(
      `${BASE_URL}/stations/search?countrycode=BR&limit=${limit}&order=clickcount&reverse=true`,
      { headers: HEADERS }
    );
    return res.json();
  },

  async searchByName(name, limit = 50) {
    const res = await fetch(
      `${BASE_URL}/stations/search?countrycode=BR&name=${encodeURIComponent(name)}&limit=${limit}`,
      { headers: HEADERS }
    );
    return res.json();
  },

  async getByState(state, limit = 100) {
    console.log('Buscando estado:', state);
    const res = await fetch(
      `${BASE_URL}/stations/search?countrycode=BR&state=${encodeURIComponent(state)}&limit=${limit}&order=clickcount&reverse=true`,
      { headers: HEADERS }
    );
    const data = await res.json();
    console.log('Resultado do estado:', data.length, 'rádios');
    return data;
  },

  async getByCity(city, state = '', limit = 50) {
    console.log('Buscando cidade:', city, 'estado:', state);
    let url = `${BASE_URL}/stations/search?countrycode=BR&city=${encodeURIComponent(city)}&limit=${limit}&order=clickcount&reverse=true`;
    
    if (state) {
      url += `&state=${encodeURIComponent(state)}`;
    }
    
    const res = await fetch(url, { headers: HEADERS });
    const data = await res.json();
    console.log('Resultado da cidade:', data.length, 'rádios');
    return data;
  },

  async getByGenre(tag, limit = 50) {
    console.log('Buscando gênero (tag):', tag);
    const res = await fetch(
      `${BASE_URL}/stations/search?countrycode=BR&tag=${encodeURIComponent(tag)}&limit=${limit}&order=clickcount&reverse=true`,
      { headers: HEADERS }
    );
    const data = await res.json();
    console.log('Resultado do gênero:', data.length, 'rádios');
    return data;
  },

  getStates() {
    return BRAZILIAN_STATES;
  },

  getGenres() {
    return BRAZILIAN_GENRES;
  },

  // NOVO: Retorna a lista de rádios locais que você cadastrou manualmente
  getLocalRadios() {
    return localRadios;
  }
};