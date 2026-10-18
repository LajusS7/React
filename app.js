const { useState } = React;

const characters = [
  { id: 1, name: "Nero", weapon: "Red Queen", info: "Uses the Devil Bringer arm and the Exceed system." },
  { id: 2, name: "Dante", weapon: "Rebellion", info: "Switches between 4 styles: Trickster, Swordmaster, Gunslinger, Royalguard." },
];

const weapons = [
  { id: 1, name: "Red Queen", owner: "Nero" },
  { id: 2, name: "Blue Rose", owner: "Nero" },
  { id: 3, name: "Rebellion", owner: "Dante" },
  { id: 4, name: "Ebony & Ivory", owner: "Dante" },
  { id: 5, name: "Lucifer", owner: "Dante" },
  { id: 6, name: "Pandora", owner: "Dante" },
  { id: 7, name: "Gilgamesh", owner: "Dante" },
];

const enemies = [
  { id: 1, name: "Scarecrow", type: "Basic" },
  { id: 2, name: "Mephisto", type: "Basic" },
  { id: 3, name: "Faust", type: "Basic" },
  { id: 4, name: "Berial", type: "Boss" },
  { id: 5, name: "Echidna", type: "Boss" },
  { id: 6, name: "Agnus", type: "Boss" },
];

const items = [
  { id: 1, name: "Vital Star", effect: "Restores health" },
  { id: 2, name: "Devil Star", effect: "Restores devil trigger gauge" },
  { id: 3, name: "Holy Water", effect: "Damages enemies on screen" },
  { id: 4, name: "Gold Orb", effect: "Revives you after dying" },
];
