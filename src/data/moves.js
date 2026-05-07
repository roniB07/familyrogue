const MOVES = [
  { id: 'kuchentherapie', name: 'Kuchentherapie', type: 'wise', category: 'status', power: 0, accuracy: 100, pp: 10, effect: 'heal_30', description: 'Heilt 30% der max HP' },
  { id: 'familienrat', name: 'Familienrat', type: 'wise', category: 'status', power: 0, accuracy: 100, pp: 12, effect: 'stat_boost_def', description: 'Erhoeht DEF' },
  { id: 'stricknadelsturm', name: 'Stricknadelsturm', type: 'wise', category: 'physical', power: 65, accuracy: 95, pp: 14, effect: 'none', description: 'Praeziser Nadeltreffer' },
  { id: 'geheimrezept', name: 'Geheimrezept', type: 'wise', category: 'special', power: 85, accuracy: 90, pp: 8, effect: 'debuff_atk', description: 'Schwacht ATK' },
  { id: 'tiktok_verwirrungslache', name: 'Tiktok Verwirrungslache', type: 'wise', category: 'special', power: 70, accuracy: 95, pp: 12, effect: 'debuff_spd', description: 'Lachen mit Tempoverlust' },
  { id: 'afro_aura', name: 'Afro Aura', type: 'wise', category: 'status', power: 0, accuracy: 100, pp: 10, effect: 'stat_boost_spatk', description: 'Erhoeht SPATK' },
  { id: 'ahnenblick', name: 'Ahnenblick', type: 'wise', category: 'special', power: 75, accuracy: 100, pp: 10, effect: 'none', description: 'Alter Blick, harter Treffer' },
  { id: 'stammesurteil', name: 'Stammesurteil', type: 'wise', category: 'special', power: 95, accuracy: 85, pp: 6, effect: 'damage_10', description: 'Bonus-Schaden nach Urteil' },

  { id: 'bauchklatscher', name: 'Bauchklatscher', type: 'tank', category: 'physical', power: 90, accuracy: 90, pp: 8, effect: 'none', description: 'Ein voller Einschlag' },
  { id: 'krebshand_zerquetschen', name: 'Krebshand Zerquetschen', type: 'tank', category: 'physical', power: 85, accuracy: 92, pp: 8, effect: 'debuff_def', description: 'Zerquetscht Verteidigung' },
  { id: 'birken_hit', name: 'Birken Hit', type: 'tank', category: 'physical', power: 80, accuracy: 95, pp: 10, effect: 'none', description: 'Der klassische Birkenzweig' },
  { id: 'sofa_slam', name: 'Sofa Slam', type: 'tank', category: 'physical', power: 70, accuracy: 100, pp: 12, effect: 'none', description: 'Schwer und sicher' },
  { id: 'kofferblock', name: 'Kofferblock', type: 'tank', category: 'status', power: 0, accuracy: 100, pp: 12, effect: 'stat_boost_def', description: 'Mehr DEF' },
  { id: 'familienpanzer', name: 'Familienpanzer', type: 'tank', category: 'status', power: 0, accuracy: 100, pp: 10, effect: 'heal_20', description: 'Harte Schale, kleine Heilung' },
  { id: 'tischkante', name: 'Tischkante', type: 'tank', category: 'physical', power: 100, accuracy: 80, pp: 6, effect: 'damage_5', description: 'Riskanter Kantentreffer' },
  { id: 'einkaufstueten_wurf', name: 'Einkaufstueten-Wurf', type: 'tank', category: 'physical', power: 60, accuracy: 100, pp: 15, effect: 'debuff_spd', description: 'Verlangsamt Gegner' },

  { id: 'basketball_dunk', name: 'Basketball Dunk', type: 'speedster', category: 'physical', power: 90, accuracy: 92, pp: 8, effect: 'none', description: 'Sprung aus dem Nichts' },
  { id: 'dreihundertsechzig_noscope', name: '360 Noscope', type: 'speedster', category: 'physical', power: 110, accuracy: 70, pp: 5, effect: 'damage_10', description: 'Wenn es sitzt, sitzt es' },
  { id: 'sprintschritt', name: 'Sprintschritt', type: 'speedster', category: 'status', power: 0, accuracy: 100, pp: 12, effect: 'stat_boost_spd', description: 'Mehr SPD' },
  { id: 'roller_dash', name: 'Roller Dash', type: 'speedster', category: 'physical', power: 65, accuracy: 100, pp: 14, effect: 'none', description: 'Schneller Treffer' },
  { id: 'fernbedienung_flip', name: 'Fernbedienung Flip', type: 'speedster', category: 'physical', power: 60, accuracy: 95, pp: 15, effect: 'debuff_def', description: 'Lenkt ab und schwacht DEF' },
  { id: 'klingel_spurt', name: 'Klingel-Spurt', type: 'speedster', category: 'special', power: 75, accuracy: 95, pp: 10, effect: 'none', description: 'Kurz klingeln, schnell weg' },
  { id: 'flur_slalom', name: 'Flur-Slalom', type: 'speedster', category: 'status', power: 0, accuracy: 100, pp: 10, effect: 'stat_boost_atk', description: 'Mehr ATK durch Momentum' },
  { id: 'turbo_hausaufgaben', name: 'Turbo Hausaufgaben', type: 'speedster', category: 'special', power: 80, accuracy: 90, pp: 9, effect: 'debuff_atk', description: 'Stressiger Spezialtreffer' },

  { id: 'palaqinka_backpfeife', name: 'Palaqinka Backpfeife', type: 'support', category: 'physical', power: 75, accuracy: 95, pp: 10, effect: 'none', description: 'Suess, aber hart' },
  { id: 'kamehameha', name: 'Kamehameha', type: 'support', category: 'special', power: 105, accuracy: 85, pp: 6, effect: 'damage_10', description: 'Energie aus der Kueche' },
  { id: 'medizintee', name: 'Medizintee', type: 'support', category: 'status', power: 0, accuracy: 100, pp: 10, effect: 'heal_35', description: 'Heilt 35% HP' },
  { id: 'motivationsrede', name: 'Motivationsrede', type: 'support', category: 'status', power: 0, accuracy: 100, pp: 12, effect: 'stat_boost_atk', description: 'Mehr ATK' },
  { id: 'deckenwurf', name: 'Deckenwurf', type: 'support', category: 'special', power: 60, accuracy: 100, pp: 15, effect: 'debuff_spd', description: 'Bremst Gegner' },
  { id: 'snack_pause', name: 'Snack-Pause', type: 'support', category: 'status', power: 0, accuracy: 100, pp: 8, effect: 'heal_25', description: 'Heilt 25% HP' },
  { id: 'teamgeist', name: 'Teamgeist', type: 'support', category: 'status', power: 0, accuracy: 100, pp: 10, effect: 'stat_boost_spatk', description: 'Mehr SPATK' },
  { id: 'haussegen', name: 'Haussegen', type: 'support', category: 'special', power: 70, accuracy: 95, pp: 12, effect: 'debuff_def', description: 'Gegner wird weich' },

  { id: 'hacken', name: 'Hacken', type: 'trickster', category: 'special', power: 85, accuracy: 90, pp: 8, effect: 'debuff_def', description: 'Systemfehler beim Gegner' },
  { id: 'salzstangen_bohrer', name: 'Salzstangen Bohrer', type: 'trickster', category: 'physical', power: 80, accuracy: 95, pp: 10, effect: 'none', description: 'Knuspriger Drill' },
  { id: 'brillen_laser', name: 'Brillen Laser', type: 'trickster', category: 'special', power: 90, accuracy: 90, pp: 8, effect: 'debuff_atk', description: 'Blendet und schwacht ATK' },
  { id: 'taschenspieler', name: 'Taschenspieler', type: 'trickster', category: 'status', power: 0, accuracy: 100, pp: 12, effect: 'stat_boost_spd', description: 'Schneller Trick' },
  { id: 'wifi_stoerung', name: 'Wifi-Stoerung', type: 'trickster', category: 'special', power: 65, accuracy: 100, pp: 14, effect: 'debuff_spatk', description: 'Senkt SPATK' },
  { id: 'sockenfalle', name: 'Sockenfalle', type: 'trickster', category: 'physical', power: 70, accuracy: 95, pp: 12, effect: 'debuff_spd', description: 'Rutschiger Treffer' },
  { id: 'versteckte_karte', name: 'Versteckte Karte', type: 'trickster', category: 'status', power: 0, accuracy: 100, pp: 10, effect: 'stat_boost_atk', description: 'Mehr ATK' },
  { id: 'chaos_knopf', name: 'Chaos-Knopf', type: 'trickster', category: 'special', power: 100, accuracy: 80, pp: 6, effect: 'damage_15', description: 'Riskanter Bonus-Schaden' }
];

const MOVE_BY_ID = Object.fromEntries(MOVES.map(function (move) { return [move.id, move]; }));
