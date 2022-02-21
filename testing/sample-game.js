const sampleGamePlayers = [
  {
    steamID: '76561197960956468',
    hasLost: true,
    mmr: 1000,
  },
  {
    steamID: '76561197964547457',
    hasLost: false,
    mmr: 1000,
  },
  {
    steamID: '76561198014254115',
    hasLost: false,
    mmr: 1000,
  },
  {
    steamID: '76561197960287930',
    hasLost: false,
    mmr: 1000,
  },
  {
    steamID: '76561198052211234',
    hasLost: false,
    mmr: 1000,
  },
  {
    steamID: '76561198015161808',
    hasLost: false,
    mmr: 1000,
  },
  {
    steamID: '76561198007141460',
    hasLost: false,
    mmr: 1000,
  },
  {
    steamID: '76561198030851434',
    hasLost: false,
    mmr: 1000,
  },
]

const sampleGame = {
  player_events = [
    {
      matchID: '1',
      steamID: '76561198030851434',
      username: "VicFrank",
      ranked: true,
      place: 8,
      rounds: 1,
      endTime: 300,
      players: sampleGamePlayers,
      heroes: [
        {
          name: "npc_dota_hero_antimage",
          level: 10,
          abilities: [
            {
              name: "ability_custom_windrunner_windrun",
              level: 3,
              slot: 1,
              element: "fire"
            },
            {
              name: "ability_custom_naga_siren_mirror_image",
              level: 6,
              slot: 2,
              element: "water"
            },
            {
              name: "custom_abaddon_death_coil",
              level: 9,
              slot: 3,
              element: "water"
            },
            {
              name: "ability_custom_skywrath_mage_ancient_seal",
              level: 1,
              slot: 4,
              element: "water"
            },
          ]
        }
      ]
    }
  ],
  matchID: '1', 
  duration: 3000,
  ranked: true,
  cheatsEnabled: false,
  roundResults: [
    [
      {
        roundNumber: 1,
        combatants: [
          {
            steamID: '76561198030851434',
            damageTaken: 100,
            isDummy: false,
          },
          {
            steamID: '76561198052211234',
            damageTaken: 0,
            isDummy: false,
          },
        ]
      },
      {
        roundNumber: 1,
        combatants: [
          {
            steamID: '76561198015161808',
            damageTaken: 100,
            isDummy: false,
          },
          {
            steamID: '76561198052211234',
            damageTaken: 0,
            isDummy: false,
          },
        ]
      },
      {
        roundNumber: 1,
        combatants: [
          {
            steamID: '76561197960287930',
            damageTaken: 100,
            isDummy: false,
          },
          {
            steamID: '76561198014254115',
            damageTaken: 0,
            isDummy: false,
          },
        ]
      },
      {
        roundNumber: 1,
        combatants: [
          {
            steamID: '76561197964547457',
            damageTaken: 100,
            isDummy: false,
          },
          {
            steamID: '76561197960956468',
            damageTaken: 0,
            isDummy: false,
          },
        ]
      },
    ]
  ]
}
