// Display metadata for public/music/*.mp3. Add a line here to add a track.
export type Track = { file: string; artist: string; title: string; start?: number };

export const tracks: Track[] = [
  { file: "tame-impala_loser.mp3", artist: "Tame Impala", title: "Loser", start: 40 },
  { file: "ninho_mal-lune.mp3", artist: "Ninho", title: "Mal luné" },
  { file: "calvin-harris_im-not-alone.mp3", artist: "Calvin Harris", title: "I'm Not Alone" },
  { file: "marina_primadonna.mp3", artist: "Marina", title: "Primadonna" },
  { file: "lil-peep-lil-tracy_witchblades.mp3", artist: "Lil Peep, Lil Tracy", title: "Witchblades" },
  { file: "fakemink_under-your-skin.mp3", artist: "Fakemink", title: "Under Your Skin" },
  { file: "fakemink-skepta_chiltern-firehouse.mp3", artist: "Fakemink, Skepta", title: "Chiltern Firehouse" },
  { file: "novaj_always-on-my-mind-let-u-go.mp3", artist: "Novaj", title: "Always on My Mind (Let U Go)" },
  { file: "day_no-im-not-a-human.mp3", artist: "Day", title: "No, I'm Not a Human" },
];

export const trackUrl = (t: Track) => `/music/${t.file}`;
