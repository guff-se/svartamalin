/**
 * Q-5 porträttvägg (Q5-01). Sångordning, samma tabell som content/huvudstory/quests/Q-5.md.
 * 16 bokstäver → I SVÄRDFISKENS MUN. 8 tomma. Enben hänger obesatt.
 */
export const Q5_CREWS = {
  1: 'Korvetten Kurtisanen',
  2: 'Fregatten Fördärvet',
  3: 'Barken Bortförklaringen',
  4: 'Fregatten Fromheten',
  5: 'Galeonen Gnället',
}

/** @typedef {{ slug: string, pirateName: string, pirateNameId: number, letter: string, crewId: number }} Q5Card */

/** @type {Q5Card[]} */
export const Q5_WALL = [
  { slug: 'amaliawahlstrom', pirateName: 'Kapten Enben', pirateNameId: 1, letter: 'I', crewId: 3 },
  { slug: 'minimacklin', pirateName: 'Kapten Blodig', pirateNameId: 5, letter: 'S', crewId: 2 },
  { slug: 'josefinansund', pirateName: 'Kapten Frodig', pirateNameId: 6, letter: 'V', crewId: 3 },
  { slug: 'alexandrapalmquist', pirateName: 'Kapten Babord', pirateNameId: 8, letter: 'Ä', crewId: 5 },
  { slug: 'josefinlowing', pirateName: 'Kapten Kuling', pirateNameId: 9, letter: 'R', crewId: 2 },
  { slug: 'louisevonbahr', pirateName: 'Kapten Fuling', pirateNameId: 11, letter: 'D', crewId: 2 },
  { slug: 'fabianmacklin', pirateName: 'Kapten Nykter', pirateNameId: 18, letter: 'F', crewId: 3 },
  { slug: 'malintadaa', pirateName: 'Svarta Malin', pirateNameId: 60, letter: 'I', crewId: 1 },
  { slug: 'ulrikahammar', pirateName: 'Kapten Barnsben', pirateNameId: 23, letter: 'S', crewId: 1 },
  { slug: 'navidmodiri', pirateName: 'Kapten Döver', pirateNameId: 31, letter: 'K', crewId: 2 },
  { slug: 'jesperlejfjord', pirateName: 'Kapten Hjärter', pirateNameId: 32, letter: 'E', crewId: 4 },
  { slug: 'gustaftadaa', pirateName: 'Löjtnant Spader', pirateNameId: 33, letter: 'N', crewId: 2 },
  { slug: 'johannabergman', pirateName: 'Kapten Klöver', pirateNameId: 34, letter: 'S', crewId: 3 },
  { slug: 'hampuslindblad', pirateName: 'Kapten Blåskägg', pirateNameId: 36, letter: 'M', crewId: 3 },
  { slug: 'viktoransund', pirateName: 'Kapten Rödskägg', pirateNameId: 37, letter: 'U', crewId: 4 },
  { slug: 'edvinthungren', pirateName: 'Kapten Rötägg', pirateNameId: 38, letter: 'N', crewId: 5 },
  { slug: 'petterwallberg', pirateName: 'Kapten Lösskägg', pirateNameId: 39, letter: '', crewId: 1 },
  { slug: 'jesperlindmarker', pirateName: 'Kapten Hurring', pirateNameId: 41, letter: '', crewId: 1 },
  { slug: 'amandamungsgard', pirateName: 'Kapten Kosing', pirateNameId: 44, letter: '', crewId: 4 },
  { slug: 'linneaekbom', pirateName: 'Kapten Rosing', pirateNameId: 45, letter: '', crewId: 5 },
  { slug: 'elinmartensson', pirateName: 'Kapten Plåthorn', pirateNameId: 51, letter: '', crewId: 5 },
  { slug: 'minervalowgren', pirateName: 'Kapten Prygel', pirateNameId: 54, letter: '', crewId: 4 },
  { slug: 'ludvigvonbahr', pirateName: 'Kapten Dunka', pirateNameId: 55, letter: '', crewId: 5 },
  { slug: 'linneaappert', pirateName: 'Kapten Planka', pirateNameId: 57, letter: '', crewId: 1 },
]

export const Q5_COLS = 2
export const Q5_PER_PAGE = 4
