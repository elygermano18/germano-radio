// src/data/localRadios.js

export const localRadios = [
  {
    stationuuid: 'local-recife-1', // ID único (inventado por você)
    name: 'Rádio Pagode 90',
    url_resolved: 'https://stm15.xcast.com.br:12534/stream?1788484281524', // <-- TROQUE PELO LINK REAL
    favicon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Radio_Clube_PE.png/200px-Radio_Clube_PE.png',
    state: 'Pernambuco',
    country: 'Brasil',
    tags: 'noticias, tradicional, local',
    bitrate: 128
  },
  {
    stationuuid: 'local-recife-2',
    name: 'Rádio Nova Timbaúba FM',
    url_resolved: 'https://radio.novatimbaubafm.com:8204/live', // <-- TROQUE PELO LINK REAL
    favicon: 'https://example.com/logo-radiojornal.png',
    state: 'Pernambuco',
    country: 'Brasil',
    tags: 'jornalismo, noticias, local',
    bitrate: 96
  },
   {
    stationuuid: 'local-recife-3',
    name: 'Rádio Hunter Pagode',
    url_resolved: 'https://live.hunter.fm/pagode_low', // <-- TROQUE PELO LINK REAL
    favicon: 'https://example.com/logo-radiojornal.png',
    state: 'Pernambuco',
    country: 'Brasil',
    tags: 'jornalismo, noticias, local',
    bitrate: 128
  }

  // Para adicionar mais, é só copiar um bloco {}, colar e mudar os dados!
];