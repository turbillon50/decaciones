import type { Decade, Genre, Playlist, Track } from "@/lib/types";

export const tracks: Track[] = [
  // ── 80s ─────────────────────────────────────────────────────────────────
  { id:"celia-quimbara",    title:"Quimbara",                artist:"Celia Cruz",           album:"Celia & Johnny",            year:1983, decade:"80s", genre:"salsa",      durationSeconds:245, cover:"/images/salsa.jpg",      spotifyQuery:"Quimbara Celia Cruz", youtubeId:"TxRWQHCSmUg" },
  { id:"oscar-abusadora",   title:"Abusadora",               artist:"Wilfrido Vargas",       album:"El Africano",               year:1984, decade:"80s", genre:"cumbia",     durationSeconds:238, cover:"/images/cumbia.jpg",     spotifyQuery:"Abusadora Wilfrido Vargas", youtubeId:"QweFe4CeAJg" },
  { id:"avina-corazon",     title:"Corazón de Melao",        artist:"Joe Arroyo",            album:"La Noche",                  year:1986, decade:"80s", genre:"salsa",      durationSeconds:262, cover:"/images/salsa.jpg",      spotifyQuery:"Corazon de Melao Joe Arroyo", youtubeId:"ywpo6TNuZO4" },
  { id:"lmiguel-sera",      title:"Será que no Me Amas",     artist:"Luis Miguel",           album:"Soy Como Quiero Ser",        year:1987, decade:"80s", genre:"romanticas", durationSeconds:221, cover:"/images/romanticas.jpg", spotifyQuery:"Sera Que No Me Amas Luis Miguel", youtubeId:"pOnxY24Y5vA" },
  { id:"soda-persiana",     title:"Persiana Americana",      artist:"Soda Stereo",           album:"Signos",                    year:1986, decade:"80s", genre:"romanticas", durationSeconds:292, cover:"/images/romanticas.jpg", spotifyQuery:"Persiana Americana Soda Stereo", youtubeId:"LalPz4lIZYk" },
  { id:"africano-vargas",   title:"El Africano",             artist:"Wilfrido Vargas",       album:"El Africano",               year:1984, decade:"80s", genre:"cumbia",     durationSeconds:234, cover:"/images/cumbia.jpg",     spotifyQuery:"El Africano Wilfrido Vargas", youtubeId:"1DbXzlhKS5s" },

  // ── 90s ─────────────────────────────────────────────────────────────────
  { id:"mana-rayando",      title:"Rayando el Sol",          artist:"Maná",                  album:"Falta Amor",                year:1990, decade:"90s", genre:"romanticas", durationSeconds:251, cover:"/images/romanticas.jpg", spotifyQuery:"Rayando el Sol Mana", youtubeId:"8lbsQyMhMT8" },
  { id:"oscar-leon-amor",   title:"Detalles",                artist:"Oscar D'León",          album:"El Sonero del Mundo",       year:1992, decade:"90s", genre:"salsa",      durationSeconds:263, cover:"/images/salsa.jpg",      spotifyQuery:"Detalles Oscar DLeon", youtubeId:"A95iNmgA9-8" },
  { id:"aventura-obsesion", title:"Obsesión",                artist:"Aventura",              album:"We Broke the Rules",        year:2002, decade:"2000s",genre:"bachata",    durationSeconds:252, cover:"/images/bachata.jpg",    spotifyQuery:"Obsesion Aventura", youtubeId:"8_QY5gFQUTg" },
  { id:"juan-gabriel-amor", title:"Amor Eterno",             artist:"Juan Gabriel",          album:"Rock This Town",            year:1990, decade:"90s", genre:"romanticas", durationSeconds:287, cover:"/images/romanticas.jpg", spotifyQuery:"Amor Eterno Juan Gabriel", youtubeId:"RgKqxLAhRKE" },
  { id:"carlos-vives-bicicleta",title:"La Bicicleta",       artist:"Carlos Vives",          album:"Bicicleta",                 year:1993, decade:"90s", genre:"cumbia",     durationSeconds:244, cover:"/images/cumbia.jpg",     spotifyQuery:"La Bicicleta Carlos Vives", youtubeId:"-UV0QGLmYys" },
  { id:"macarena-hey",      title:"Macarena",                artist:"Los Del Rio",           album:"A mí me gusta",             year:1994, decade:"90s", genre:"cumbia",     durationSeconds:218, cover:"/images/cumbia.jpg",     spotifyQuery:"Macarena Los Del Rio", youtubeId:"zWaymcVmJ-A" },
  { id:"chichi-procura",    title:"Procura",                 artist:"Chichi Peralta",        album:"Pa Otro Lao",               year:1997, decade:"90s", genre:"salsa",      durationSeconds:248, cover:"/images/salsa.jpg",      spotifyQuery:"Procura Chichi Peralta", youtubeId:"pry-ZU6StYk" },
  { id:"daft-harder",       title:"Harder Better Faster",   artist:"Daft Punk",             album:"Discovery",                 year:2001, decade:"2000s",genre:"electronica",durationSeconds:224, cover:"/images/electronica.jpg",spotifyQuery:"Harder Better Faster Stronger Daft Punk", youtubeId:"gAjR4_CbPpQ" },

  // ── 2000s ────────────────────────────────────────────────────────────────
  { id:"daddy-gasolina",    title:"Gasolina",                artist:"Daddy Yankee",          album:"Barrio Fino",               year:2004, decade:"2000s",genre:"reggaeton",  durationSeconds:193, cover:"/images/reggaeton.jpg",  spotifyQuery:"Gasolina Daddy Yankee", youtubeId:"CCF1_jI8Prk" },
  { id:"romeo-ella",        title:"Ella Me Levantó",         artist:"Romeo Santos",          album:"Formula Vol.1",             year:2011, decade:"2010s",genre:"bachata",    durationSeconds:258, cover:"/images/bachata.jpg",    spotifyQuery:"Ella Me Levanto Romeo Santos", youtubeId:"QFs3PIZb3js" },
  { id:"shakira-hips",      title:"Hips Don't Lie",         artist:"Shakira",               album:"Oral Fixation",             year:2005, decade:"2000s",genre:"cumbia",     durationSeconds:218, cover:"/images/cumbia.jpg",     spotifyQuery:"Hips Dont Lie Shakira", youtubeId:"DUT5rEU6pqM" },
  { id:"wisin-rakata",      title:"Rakata",                  artist:"Wisin & Yandel",        album:"Pa'l Mundo",                year:2005, decade:"2000s",genre:"reggaeton",  durationSeconds:229, cover:"/images/reggaeton.jpg",  spotifyQuery:"Rakata Wisin Yandel", youtubeId:"uvIuAHsfNdc" },
  { id:"don-omar-danza",    title:"Danza Kuduro",            artist:"Don Omar ft Lucenzo",   album:"Meet the Orphans",          year:2010, decade:"2010s",genre:"reggaeton",  durationSeconds:213, cover:"/images/reggaeton.jpg",  spotifyQuery:"Danza Kuduro Don Omar Lucenzo", youtubeId:"71sqkgaUncI" },
  { id:"marc-vivir",        title:"Vivir Mi Vida",           artist:"Marc Anthony",          album:"3.0",                       year:2013, decade:"2010s",genre:"salsa",      durationSeconds:248, cover:"/images/salsa.jpg",      spotifyQuery:"Vivir Mi Vida Marc Anthony", youtubeId:"YXnjy5YlDwk" },

  // ── 2010s ────────────────────────────────────────────────────────────────
  { id:"adele-rolling",     title:"Rolling in the Deep",     artist:"Adele",                 album:"21",                        year:2010, decade:"2010s",genre:"romanticas", durationSeconds:228, cover:"/images/romanticas.jpg", spotifyQuery:"Rolling in the Deep Adele", youtubeId:"rYEDA3JcQqw" },
  { id:"romeo-propuesta",   title:"Propuesta Indecente",     artist:"Romeo Santos",          album:"Formula Vol.2",             year:2013, decade:"2010s",genre:"bachata",    durationSeconds:271, cover:"/images/bachata.jpg",    spotifyQuery:"Propuesta Indecente Romeo Santos", youtubeId:"QFs3PIZb3js" },
  { id:"nicky-trumpets",    title:"Trumpets",                artist:"Nicky Jam",             album:"Fenix",                     year:2015, decade:"2010s",genre:"reggaeton",  durationSeconds:215, cover:"/images/reggaeton.jpg",  spotifyQuery:"Trumpets Nicky Jam", youtubeId:"6n7cL1jokAE" },
  { id:"j-balvin-ginza",    title:"Ginza",                   artist:"J Balvin",              album:"Energía",                   year:2015, decade:"2010s",genre:"reggaeton",  durationSeconds:244, cover:"/images/reggaeton.jpg",  spotifyQuery:"Ginza J Balvin", youtubeId:"zZjSX01P5dE" },
  { id:"carlos-bicicleta2", title:"Volví a Nacer",           artist:"Carlos Vives",          album:"Bicicleta",                 year:2014, decade:"2010s",genre:"cumbia",     durationSeconds:237, cover:"/images/cumbia.jpg",     spotifyQuery:"Volvi a Nacer Carlos Vives", youtubeId:"CJ_zRSv3Hr8" },
  { id:"bad-bunny-diles",   title:"Diles",                   artist:"Bad Bunny",             album:"XTDL",                      year:2017, decade:"2010s",genre:"reggaeton",  durationSeconds:202, cover:"/images/reggaeton.jpg",  spotifyQuery:"Diles Bad Bunny", youtubeId:"UWV41yEiGq0" },

  // ── 2020s ────────────────────────────────────────────────────────────────
  { id:"bad-yonaguni",      title:"Yonaguni",                artist:"Bad Bunny",             album:"El Último Tour Del Mundo",  year:2020, decade:"2020s",genre:"reggaeton",  durationSeconds:195, cover:"/images/reggaeton.jpg",  spotifyQuery:"Yonaguni Bad Bunny", youtubeId:"doLMt10ytHY" },
  { id:"maluma-hawai",      title:"Hawái",                   artist:"Maluma",                album:"Papi Juancho",               year:2020, decade:"2020s",genre:"reggaeton",  durationSeconds:198, cover:"/images/reggaeton.jpg",  spotifyQuery:"Hawaii Maluma", youtubeId:"pK060iUFWXg" },
  { id:"romeo-su-novio",    title:"Su Novio",                artist:"Romeo Santos",          album:"Fórmula Vol.3",             year:2022, decade:"2020s",genre:"bachata",    durationSeconds:268, cover:"/images/bachata.jpg",    spotifyQuery:"Su Novio Romeo Santos", youtubeId:"8iPcqtHoR3U" },
  { id:"karol-provenza",    title:"Provenza",                artist:"Karol G",               album:"Mañana Será Bonito",        year:2022, decade:"2020s",genre:"cumbia",     durationSeconds:241, cover:"/images/cumbia.jpg",     spotifyQuery:"Provenza Karol G", youtubeId:"ca48oMV59LU" },
  { id:"shakira-bzrp",      title:"BZRP Music Sessions #53", artist:"Bizarrap × Shakira",    album:"BZRP Session",              year:2023, decade:"2020s",genre:"electronica",durationSeconds:214, cover:"/images/electronica.jpg",spotifyQuery:"Bizarrap Shakira Session 53", youtubeId:"CocEMWdc7Ck" },
  { id:"peso-ella-baila",   title:"Ella Baila Sola",         artist:"Eslabon Armado × Peso Pluma",album:"Ella Baila Sola",     year:2023, decade:"2020s",genre:"cumbia",     durationSeconds:175, cover:"/images/cumbia.jpg",     spotifyQuery:"Ella Baila Sola Eslabon Armado Peso Pluma", youtubeId:"lZiaYpD9ZrI" },
];

const byDecade = (d: Track["decade"]) => tracks.filter(t => t.decade === d);
const byGenre  = (g: Track["genre"])  => tracks.filter(t => t.genre  === g);

export const decades: Decade[] = [
  { id:"80s",   label:"80s", years:"1980–1989", description:"La rockola dorada: salsa clásica, románticas y los primeros ritmos tropicales.",    image:"/images/80s.jpg",   tracks:byDecade("80s") },
  { id:"90s",   label:"90s", years:"1990–1999", description:"La explosión tropical: cumbia, salsa romántica y el rock en español.",               image:"/images/90s.jpg",   tracks:byDecade("90s") },
  { id:"2000s", label:"2000s",years:"2000–2009",description:"El reggaeton nace y conquista. La electrónica llega a las pistas.",                  image:"/images/2000s.jpg", tracks:byDecade("2000s") },
  { id:"2010s", label:"2010s",years:"2010–2019",description:"El boom del urbano latino: bachata de estadios y reggaeton global.",                  image:"/images/2010s.jpg", tracks:byDecade("2010s") },
  { id:"2020s", label:"2020s",years:"2020–hoy", description:"Lo de ahorita: corridos tumbados, reggaeton de autor y ritmos sin fronteras.",        image:"/images/2020s.jpg", tracks:byDecade("2020s") },
];

export const genres: Genre[] = [
  { id:"salsa",      name:"Salsa",      description:"Ritmo, sabor y swing desde el Caribe hasta México.",   image:"/images/salsa.jpg",      tracks:byGenre("salsa") },
  { id:"bachata",    name:"Bachata",    description:"Romanticismo profundo con cuerdas y voz apasionada.", image:"/images/bachata.jpg",    tracks:byGenre("bachata") },
  { id:"cumbia",     name:"Cumbia",     description:"El ritmo más mexicano: festivo, bailable y eterno.",  image:"/images/cumbia.jpg",     tracks:byGenre("cumbia") },
  { id:"reggaeton",  name:"Reggaetón",  description:"El perreo que conquistó el mundo desde PR.",          image:"/images/reggaeton.jpg",  tracks:byGenre("reggaeton") },
  { id:"electronica",name:"Electrónica",description:"Beats sintéticos y drops que mueven masas.",          image:"/images/electronica.jpg",tracks:byGenre("electronica") },
  { id:"romanticas", name:"Románticas", description:"Baladas que tocan el alma sin importar la época.",    image:"/images/romanticas.jpg", tracks:byGenre("romanticas") },
];

export const playlists: Playlist[] = [
  { id:"rockola-de-oro",      title:"Rockola de Oro",        subtitle:"Los clásicos que nunca fallan",    description:"La selección definitiva de éxitos atemporales.", cover:"/images/hero.jpg",       tracks:tracks.filter(t => ["80s","90s"].includes(t.decade)).slice(0,12) },
  { id:"noche-tropical",      title:"Noche Tropical",        subtitle:"Para mover los pies toda la noche",description:"Salsa, cumbia y bachata sin parar.",               cover:"/images/salsa.jpg",      tracks:tracks.filter(t => ["salsa","bachata","cumbia"].includes(t.genre)).slice(0,12) },
  { id:"urbano-actual",       title:"Urbano Actual",         subtitle:"Lo que suena ahorita",             description:"Reggaeton y electrónica del momento.",             cover:"/images/reggaeton.jpg",  tracks:tracks.filter(t => ["reggaeton","electronica"].includes(t.genre)).slice(0,10) },
];

export const defaultQueue: Track[] = tracks.slice(0, 12);
