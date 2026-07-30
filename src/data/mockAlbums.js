/* ─── album data ────────────────────────────────────────────────────────── */

export const featuredAlbums = [
  { id: 'ts-midnights',    title: 'Midnights',                  artist: 'Taylor Swift',         color: 'from-indigo-900 to-violet-700',    year: 2022, songs: 13, duration: '44 min 10 sec', image: 'https://picsum.photos/seed/ts-midnights/400/400'    },
  { id: 'tw-afterhours',   title: 'After Hours',                artist: 'The Weeknd',            color: 'from-red-900 to-rose-600',         year: 2020, songs: 14, duration: '56 min 13 sec', image: 'https://picsum.photos/seed/tw-afterhours/400/400'   },
  { id: 'be-happier',      title: 'WHEN WE ALL FALL ASLEEP',    artist: 'Billie Eilish',         color: 'from-lime-400 to-green-700',       year: 2019, songs: 14, duration: '42 min 05 sec', image: 'https://picsum.photos/seed/be-happier/400/400'      },
  { id: 'dl-futurenow',    title: 'Future Nostalgia',           artist: 'Dua Lipa',              color: 'from-yellow-400 to-orange-500',    year: 2020, songs: 11, duration: '37 min 01 sec', image: 'https://picsum.photos/seed/dl-futurenow/400/400'    },
  { id: 'or-sour',         title: 'SOUR',                       artist: 'Olivia Rodrigo',        color: 'from-purple-400 to-fuchsia-600',   year: 2021, songs: 11, duration: '34 min 46 sec', image: 'https://picsum.photos/seed/or-sour/400/400'         },
  { id: 'es-equals',       title: '=',                          artist: 'Ed Sheeran',            color: 'from-sky-500 to-blue-700',         year: 2021, songs: 14, duration: '48 min 38 sec', image: 'https://picsum.photos/seed/es-equals/400/400'       },
  { id: 'ag-positions',    title: 'Positions',                  artist: 'Ariana Grande',         color: 'from-pink-300 to-rose-500',        year: 2020, songs: 14, duration: '41 min 22 sec', image: 'https://picsum.photos/seed/ag-positions/400/400'    },
  { id: 'bm-silksonicvol', title: 'An Evening with Silk Sonic', artist: 'Bruno Mars',            color: 'from-amber-400 to-yellow-600',     year: 2021, songs:  9, duration: '30 min 48 sec', image: 'https://picsum.photos/seed/bm-silksonicvol/400/400' },
  { id: 'cp-musicspheres', title: 'Music of the Spheres',       artist: 'Coldplay',              color: 'from-cyan-400 to-teal-600',        year: 2021, songs: 12, duration: '43 min 55 sec', image: 'https://picsum.photos/seed/cp-musicspheres/400/400' },
  { id: 'id-mercury',      title: 'Mercury — Act 1',            artist: 'Imagine Dragons',       color: 'from-orange-400 to-red-600',       year: 2021, songs: 13, duration: '45 min 17 sec', image: 'https://picsum.photos/seed/id-mercury/400/400'      },
  { id: 'tc-astroworld',   title: 'ASTROWORLD',                 artist: 'Travis Scott',          color: 'from-amber-600 to-orange-800',     year: 2018, songs: 17, duration: '58 min 31 sec', image: 'https://picsum.photos/seed/tc-astroworld/400/400'   },
  { id: 'sc-shortncurlsy', title: "Short n' Sweet",             artist: 'Sabrina Carpenter',     color: 'from-pink-400 to-pink-700',        year: 2024, songs: 12, duration: '36 min 44 sec', image: 'https://picsum.photos/seed/sc-shortncurlsy/400/400' },
  { id: 'pm-hollywood',    title: "Hollywood's Bleeding",       artist: 'Post Malone',           color: 'from-slate-500 to-slate-800',      year: 2019, songs: 17, duration: '58 min 09 sec', image: 'https://picsum.photos/seed/pm-hollywood/400/400'    },
  { id: 'hs-harryshouse',  title: "Harry's House",              artist: 'Harry Styles',          color: 'from-emerald-300 to-green-600',    year: 2022, songs: 13, duration: '42 min 22 sec', image: 'https://picsum.photos/seed/hs-harryshouse/400/400'  },
  { id: 'bts-proof',       title: 'Proof',                      artist: 'BTS',                   color: 'from-purple-500 to-indigo-700',    year: 2022, songs: 48, duration: '2 hr 48 min',    image: 'https://picsum.photos/seed/bts-proof/400/400'       },
  { id: 'bp-bornpink',     title: 'BORN PINK',                  artist: 'BLACKPINK',             color: 'from-fuchsia-400 to-pink-600',     year: 2022, songs:  8, duration: '24 min 18 sec', image: 'https://picsum.photos/seed/bp-bornpink/400/400'     },
  { id: 'ar-manmarziyaan', title: 'Manmarziyaan',               artist: 'Anirudh Ravichander',   color: 'from-rose-400 to-red-700',         year: 2018, songs: 10, duration: '38 min 55 sec', image: 'https://picsum.photos/seed/ar-manmarziyaan/400/400' },
  { id: 'as-arijitlive',   title: 'Arijit Singh Live',          artist: 'Arijit Singh',          color: 'from-blue-400 to-indigo-600',      year: 2023, songs: 20, duration: '1 hr 22 min',    image: 'https://picsum.photos/seed/as-arijitlive/400/400'   },
  { id: 'arr-lagaan',      title: 'Lagaan',                     artist: 'A. R. Rahman',          color: 'from-yellow-500 to-amber-700',     year: 2001, songs: 11, duration: '55 min 40 sec', image: 'https://picsum.photos/seed/arr-lagaan/400/400'      },
  { id: 'kat-wild',        title: 'WILD',                       artist: 'KATSEYE',               color: 'from-pink-300 to-pink-500',        year: 2024, songs:  6, duration: '18 min 22 sec', image: 'https://picsum.photos/seed/kat-wild/400/400'        },
];

export const allAlbums = [...featuredAlbums];

export function findAlbumsByArtist(artistName) {
  const key = artistName.trim().toLowerCase();
  return allAlbums.filter((a) => a.artist.toLowerCase() === key);
}

/* ─── track generation ──────────────────────────────────────────────────── */

const TRACK_BANKS = {
  'ts-midnights':    ['Lavender Haze','Maroon','Anti-Hero','Snow on the Beach','Midnight Rain','Question…?','Vigilante Shit','Bejeweled','Labyrinth','Karma','Sweet Nothing','Mastermind'],
  'tw-afterhours':   ['Alone Again','Too Late','Hardest to Love','Scared to Live','Snowchild','Escape from LA','Heartless','Faith','Blinding Lights','In Your Eyes','Save Your Tears','Repeat After Me'],
  'be-happier':      ['!!!!!!!','bad guy','xanny','you should see me in a crown','all the good girls go to hell','wish you were gay',"when the party's over",'8','my strange addiction','bury a friend','ilomilo','listen before i go','i love you','goodbye'],
  'dl-futurenow':    ['Future Nostalgia',"Don't Start Now",'Cool','Physical','Levitating','Pretty Please','Hallucinate','Love Again','Break My Heart','Good in Bed','Boys Will Be Boys'],
  'or-sour':         ['brutal','traitor','drivers license','1 step forward 3 steps back','deja vu','good 4 u','enough for you','happier','favorite crime','hope ur ok'],
  'es-equals':       ['Tides','Shivers','Bad Habits','Visiting Hours','Cobblestone','Overpass Graffiti','The Greatest','Bad Habits (remix)','Leave Your Life','Collide','2step','Stop the Rain','Be Right Now'],
  'ag-positions':    ['shut up','34+35','motive','just like magic','off the table','six thirty','safety net','my hair','nasty','west side','love language','positions','obvious','test drive'],
  'bm-silksonicvol': ['Fly As Me','After Last Night','smokin out the window','Put On a Smile','777','Skate','Leave the Door Open'],
  'cp-musicspheres': ['Music of the Spheres','My Universe','People of the Pride','Infinity Sign','Higher Power','Humankind','Let Somebody Go','Human Heart','Animals','Coloratura'],
  'id-mercury':      ['Wrecked','Cutthroat','Nothingelse','Follow You','My Life','Lonely','Guilt','Sharks',"It's Time",'Bones','Thanos','Dull Knives'],
  'tc-astroworld':   ['STARGAZING','CAROUSEL','SICKO MODE','R.I.P. SCREW','STOP TRYING TO BE GOD','NO BYSTANDERS','SKELETONS','WAKE UP','5% TINT','NC-17','ASTROTHUNDER','YOSEMITE',"CAN'T SAY",'WHO WHAT','COFFEE BEAN','HOUSTONFORNICATION','LOST FOREVER'],
  'sc-shortncurlsy': ['Taste','Espresso','Please Please Please','Feather','Nonsense','Because I Liked a Boy','Read Your Mind','Lonesome','Tornado Warnings','Dumb & Poetic','Slim Pickins'],
  'pm-hollywood':    ["Hollywood's Bleeding",'Saint-Tropez','Enemies','Internet','Wow.','Circles','Goodbyes','Die for Me','Only Wanna Be With You','Staring at the Sun','Take What You Want','A Thousand Bad Times','Allergic','Hateful','Myself','I Know','Rockstar'],
  'hs-harryshouse':  ['Music For a Sushi Restaurant','Late Night Talking','Grapejuice','As It Was','Daylight','Little Freak','Matilda','Cinema','Daydreaming','Keep Driving','Satellite','Love of My Life'],
  'bts-proof':       ['Born Singer','No More Dream','N.O','Boy In Luv','Danger','I Need U','Run','Fire','Save Me','Blood Sweat & Tears','Spring Day','DNA'],
  'bp-bornpink':     ['Pink Venom','Shut Down','Typa Girl','Yeah Yeah Yeah','Hard to Love','The Happiest Girl','Tally','Ready for Love'],
  'ar-manmarziyaan': ['Daryaa','Grey Wala Colour','Halka Halka','Ik Vaari','Nashe Si Chadh Gayi','Parchhaiyaan','Sarphira','The Breakup Song'],
  'as-arijitlive':   ['Tum Hi Ho','Ae Dil Hai Mushkil','Channa Mereya','Tera Yaar Hoon Main','Phir Le Aya Dil','Kabira','Saware','Kal Ho Naa Ho','Raabta','Mast Magan'],
  'arr-lagaan':      ['Ghanan Ghanan','Mitwa','O Palanhare','Radha Kaise Na Jale','Chale Chalo','O Rey Chhori','Lagaan Title Music','Saga of Bhuvan','Fight of Champions'],
  'kat-wild':        ['Touch','Debut','1 of a Kind','Shooting Star',"That's My Girl",'WILD'],
};

const DEFAULT_TRACKS = ['Track 01','Track 02','Track 03','Track 04','Track 05','Track 06','Track 07','Track 08','Track 09','Track 10'];

function randomDuration() {
  const m = Math.floor(Math.random() * 4) + 2;
  const s = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function getMockTracks(album) {
  const names = TRACK_BANKS[album.id] || DEFAULT_TRACKS;
  return names.map((name, i) => ({
    id: `${album.id}-track-${i + 1}`,
    trackNumber: i + 1,
    title: name,
    artist: album.artist,
    duration: randomDuration(),
  }));
}