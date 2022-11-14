<template>
  <div style="max-width: 1200px">
    <h1 class="page-title" v-t="'changelog.page_title'"></h1>
    <div class="pl-3 change-log">
      <pre>**General**

- You can now view all the spells in the game with filters on our website (https://abilityarena.com/learn/spells).
  Credit to JackFlapper who made this as part of the community and is now on our team!
- Starting gold changed from 3 to 6 (shop upgrade cost increased to compensate)
- XP Bundle prices have been reduced by roughly 50%
- Rune God Finisher now has sound

**Gods**

- Added Tower God (Unlocked for free)
Ability: Building
Type: Single Target

Description: Once the battle begins, the selected unit cannot move and is rooted, while its attack range is set to a minimum of 750.
This root is disabled if you are the last allied hero alive or you are facing a fellow Tower God.
Activating this ability will enable your Glyph of Fortification Passive.

Ability: Glyph of Fortification
Type: Passive

Description: When a hero dies, all remaining heroes become immune to any kind of damage for 1.5 seconds.
This ability is only active if you are using the Building ability, and your Building unit is alive.

- Aghanim upgrade chance changed from 30/35/40/45/50 to 25/30/35/40/45%
- Bloodseeker: lifesteal from 17.5 to 25%
- Bloodseeker: Affected unit will physically get larger with each ally hero that dies
- Dazzle: Shallow Grave shop scaling changed from 0.8/1.6/2.4/3.2/4 to 1/2/3/4/4 + 250HP heal
- Phantom Assassin: Critical strike from 3.5% to 2.0%
- Phantom Assassin: Distance to damage from 12 to 15
- Sorla Khan: Team damage buff from 10% to 8%
- Sorla Khan: Extra God damage from 4% per surviving unit to 2%

**Spells**

- Benched Nethertoxin
- Added Duel
- Berserker's Blood health regen from 25/40/55/70 to 15/30/45/60
- Borrowed Time duration from 1/2/3 to 1/1.5/2
- Burning Barrage cooldown from 20/16/12/8 to 22/18/14/10
- Burning Barrage damage from 50/55/60/65 to 40/45/50/55
- Burning Barrage Super damage from 25% to 35%
- Chaotic Offering manacost from 300/400/500 to 300/450/600
- Chemical Rage BAT for melee increased from 1.2/1.1/1.0 to 1.3/1.2/1.1
- Chronosphere will now cast on magic immune units (would ignore previously)
- Elder Dragon Form splash (non Black Dragon) from 75% to 60%
- Empower Super now also grants +200 Cleave Radius
- Epicenter damage increased from 60/80/100 to 80/100/120
- Familiar AI only stuns when they drop below 90% HP
- Frost Shield duration from 4/5/6/7 to 3/4/5/6
- Frost Shield Super duration from 1s to 0
- Heavenly Grace no longer grants Status Resistance by default
- Heavenly Grace Super now also grants 50% Status Resistance
- Infernal Blade now breaks by default
- Kraken Shell reduction from 16/34/52/70 to 12/24/36/48
- Kraken Shell Super reduction from +30 to +40
- Leech Seed Gaben now allows Leech Seed to be recast on the same unit more than once
- Multishot attack range multiplier from 1.75x to 2x
- Multishot CD from 26/24/22/20 to 24/20/16/12
- Multishot Super no longer has any cooldown reduction
- Multishot Super now also grants +2 arrows per wave
- Overcharge Super will no longer buff illusions
- Reactive Armor max stacks from 10/20/30/40 to 7/14/21/28
- Reaper Scythe has better AI now
- Rot radius increased by 50
- Rot Super radius reduced by 50
- Searing Arrows Gaben replaced with: Grants Burning Army
- Sleight of Fist no longer counts as moving to each target hit.
  Instead it will now travel to the center of the spell and back to the original location (these changes will only affect PA God)
- Summon Wolves Gaben reworked to: now also summons a Big Bad Wolf (in addition to the normal wolves).
  Big Bad Wolf has 5x the stats of a regular wolf, and applies Howl debuff on attack.</pre>
      <div v-for="change of changes" :key="change.timestamp">
        <h3 v-if="change.title">{{ change.title }}</h3>
        <h4>
          {{ $t("changelog.update") }}:
          {{ getTime(change.timestamp * 1000) }}
        </h4>
        <ul>
          <li v-for="line of change.lines" :key="line">{{ line }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    changes: [],
  }),

  created() {
    fetch("/api/steam/changelog")
      .then((res) => res.json())
      .then((res) => {
        let changes = res.changes;

        changes = changes.map((change) => {
          let description = change.change_description;
          const tags = ["[b]", "[/b]", "[*]", "[/list]"];

          for (let tag of tags) {
            description = description.replace(tag, "");
          }

          // parse underlines
          let underlineStart = description.indexOf("[u]");
          let underlineEnd = description.indexOf("[/u]");
          let title;

          if (underlineStart >= 0 && underlineEnd >= 0) {
            title = description.substring(underlineStart + 3, underlineEnd);
          }

          let lines = description.split(/\r?\n/);

          if (title) lines.shift();

          lines = lines
            .map((line) => {
              //filter out all tags
              for (let tag of tags) {
                line = line.replace(tag, "");
              }
              if (line.charAt(0) === "*") {
                return line.substring(2);
              }
              return line;
            })
            .filter((line) => line != "");

          return {
            ...change,
            title,
            lines,
          };
        });

        this.changes = changes;
      })
      .catch((err) => console.error(err));
  },

  methods: {
    getTime(timestamp) {
      return new Date(timestamp).toLocaleDateString("en-us");
    },
  },
};
</script>

<style scoped>
pre {
  color: #808080;
}

p {
  color: #808080;
  font-size: 18px;
  line-height: 1.4;
}
li {
  line-height: 1.4;
}

ul {
  padding-bottom: 10px;
}
</style>