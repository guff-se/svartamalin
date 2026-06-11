// Statiska lat/lon-positioner för alla dekorations-sprites. Speglar konstanterna
// i src/components/map.js. Håll synkat manuellt om de ändras där.

export const DECOR_POS = {
  // Land (drive-fas)
  wagon: [18.041, 59.247],
  tree1: [17.96, 59.31],
  tree2: [17.7, 59.27],
  tree3: [18.045, 59.339],
  village1: [17.890, 59.236],
  village2: [17.489289, 59.255525],
  village3: [17.835, 59.195],
  globen: [18.083310, 59.293617],
  skull: [17.84, 59.21],
  robbers: [17.788, 59.255],
  dragon0: [17.95, 59.155],
  dragon1: [17.34, 59.25],

  // Hav (boat-fas)
  kraken: [17.529805, 59.294257],
  octopus: [17.771634, 59.221499],
  mermaid: [17.584792, 59.295477],
  seaMonster: [17.42, 59.34],
  whale1: [17.65, 59.30],
  decorShip: [17.41, 59.28],
  storm: [17.42, 59.36],
  compass: [18.103259, 59.208657],
}

// Sprite-storlekar (SVG-units i originalkartan) — bredd × höjd.
export const DECOR_SIZE = {
  wagon: 90,
  tree: 70,
  village: 75,
  village3: 130,
  globen: 70,
  skull: 70,
  robbers: 110,
  dragon: 90,
  kraken: 180,
  octopus: 140,
  mermaid: 110,
  seaMonster: 160,
  whale: 130,
  decorShip: 130,
  storm: 180,
  compass: 150,
  ourShip: 90,
  stockholm: 320,
  sodertalje: 260,
  harborDock: 36,
}
