<template>
  <div>
    <h1 class="page-title" v-t="'changelog.page_title'"></h1>
    <div class="pl-3 change-log">
      <h3>Update 1.5</h3>
      <pre>
For a breakdown of the patch, check out our new developer blog: https://news.abilityarena.com/

For full changelog visit: https://abilityarena.com/changelog

**Featuring**

- 2 new free Gods (The Boomer & Bloodseeker)
- 3 new spells (Flesh Heap, Astral Spirit, and Bloodrage)
- Redesigned damage bars that now include stats for damage taken & healing.

**General**

- Added a Ready button that allows round 1 to start early if all 8 players confirm
- Many AI Fixes (mostly to spells that would try and cast on a random target, thus having the unit walk across the entire map sometimes
- Leaderboard now has info tool that shows what you get at end of season
- Added a blue border around PLUS Gods
- Updated many tooltips and search keywords
- Fixed some abilities not showing correct cast range/damage/mana cost

**Gods**

- Added The Boomer:
Ability: Bile Explosion
Type: Passive

Description: Ally heroes will explode on death, dealing damage in a 350 AoE. Damage dealt is 20% of the amount of damage taken
during the round. After exploding, a puddle of bile will remain on the ground that will cause enemies to take 20% more damage.
Debuff is stackable.

- Added Bloodseeker:
Ability: Blood Frenzy
Type: Active
Description: Each ally hero death will enfrenzy selected unit with 30 attack speed and 15% lifesteal

- Pudge removed for pressing ceremonial reasons
- Aghanim's scaling from 40/50/60/70/80% to 45/50/55%/60/65%
- Aghanim - fixed bug where you wouldn't be able to buy spells and would have to reconnect to fix
- Alchemist Unstable Concoction deals 15% current HP instead of 20%
- Dazzle buffed to now save units at 20% HP instead of 30%
- Donkey Aghanim shop price increase from 20% to 25%
- J'muy scaling from 10/20/30/40/50% CDR to 0/10/20/30/40%
- Sorla Khan stacking damage buff from 12% to 10%


**Spells**

- Added Flesh Heap: Base ability does not gain strength (Super: +2.0 Flesh Heap strength; Gaben: Grants Giant's Ring)
- Added Astral Spirit: 
    Super: +40 damage per hero, 5 damage per summon;
    Gaben: Once the spirit returns, gives 2 seconds of spell immunity per hero hit
- Added Bloodrage:
    Super: +25 attack speed bonus, +8% spell amp. Will also cast on closest ally within 800 range. Attack speed buff for allies is halved
    Gaben: Attacks deal 1.8% of Max HP in pure damage and also heals for the same amount)
- Benched Dragon's Blood
- Benched Boundless Strike
- Benched Lucent Beam
- Arc Lightning Gaben - fixed from bouncing on a unit that is alone
- Astral Step Super now also grants Mage Slayer
- Battle Trance Gaben replaced and changed to grant Rampage, which is now cast off cooldown
- Black Hole - Re-enabled
- Blink Super now also "Makes next ability cast after Blink have a 50% CDR"
- Burrowstrike Super changed give Sand King shard
- Chaotic Offering - Re-enabled
- Chaotic Offering Golem attack damage from 20/40/60 to 0/0/0 (still deals damage with their two passive abilities)
- Chronosphere duration from 4/4.5/5 to 3/4/5
- Chronosphere Super attack speed from 120 to 200
- Chronosphere Movespeed from 1000 to 550
- Culling Blade manacost from 60/120/180 to 60/100/140
- Demonic Purge Super is now: Grants 3 charges
- Demonic Purge Gaben is now: grants Demonic Cleanse (3 charges)
- Double Edge strength as damage from 60/80/120% to 70/110/190%
- Double Edge Super strength as damage from 40% to 0%
- Eye of the Storm radius from 800 to 500
- Eye of the Storm Super no longer grants +1 strike target. Now grants -0.2s strike interval
- Eye of the Storm Gaben no longer grants -0.1s strike interval
- Fiery Soul max stacks from 5 to 4
- Fiery Soul duration from 12 to 8
- Fiery Soul attack speed from 20/30/50 to 35/45/65
- Fiery Soul Super attack speed from 15 to 20
- Fiery Soul Gaben additionally grants 2 stacks per cast instead of 1
- Flesh Golem now makes units become melee for its duration
- Focus Fire - Fixed AI to try and always attack the unit you cast it on
- Focus Fire Super also Grants Maelstrom
- Frost Shield Super duration from 4 to 2
- Ghostship damage reduction from 20/30/40 to 10/20/30
- Ghostship Super additionally grants +10% damage reduction
- Heavenly Grace Strength from 8/18/28/38 to 8/16/24/32
- Impetus manacost from 75 to 60
- Impetus cooldown 0 at all levels
- Infernal Blade Super now breaks
- Life Break Super now deals 100% of damage to self to enemies
- Multishot Super additionally reduces cooldown by 10 seconds
- Omnislash duration from 2/2.5/3 to 3/3.25/3.5
- Omnislash bonus attack damage from 30/40/50 to 10/30/50
- Omnislash search range from 275 to 375
- Overcharge duration from 8 to 10s
- Overcharge Max health as health regen bonus: 0.5/1/2
- Overcharge Gaben: Duration 16s. Increases HP regen to 2%
- Overload charges now stack, and all charges are released on the first auto attack
- Overload damage from 30/60/120 to 30/50/90
- Overload AOE from 350 to 300
- Phantom Strike cast range from 1000 to 1500
- Poison Attack magic resistance reduction from 4/6/8/10 to 5/8/11/14%
- Poison Attack Super magic resistance reduction from +8% to +10%
- Pulse Nova damage from 70/140/210 to 50/100/150
- Pulse Nova Super damage from 60 to 120
- Reactive Armor Super from +6 stack limit to +12 stack limit
- Resonant Pulse Gaben uses the second silence only when the first one is done
- Rolling Boulder Super from +2s stun to +1s stun
- Rolling Boulder Super: from 200% extra STR as damage to 100%
- Sacred Arrow now correctly instakills creeps
- Sacred Arrow max stun duration from 3.2/3.8/4.4/5 to 3.7/4.3/4.9/5.5
- Searing Arrows damage from 24/36/60 to 20/40/80
- Searing Arrows Super damage bonus from 50 to 0
- Searing Arrows Super now grants MKB
- Sharpshooter you can now cast other things while channeling
- Sharpshooter Gaben replaced and changed to "Decreases cooldown of Sharpshooter by 20s for every unit that dies under the debuff"
- Sleight of Fist Super replaced with "Now grants Desolator"
- Sleight of Fist Super now grants Truestrike
- Sleight of Fist Gaben replaced with "Grants 2 charges"
- Stone Gaze Super now grants 10% extra physical damage amplification
- Tricks of the Trade Super grants Battlefury instead of giving 100% cleave
- Warpath Super has been changed to: allows it to stack infinitely
- Warpath Gaben has been changed to: grants 5% lifesteal per stack
- Fixed some instances where spells were being cast while stunned
- Fixed having to put attack modifiers in the first slot for spells like Multishot to work

**Monetization**

- New duplicate system
- Gold chests now drop 5 potential packages of gold (50, 100, 400, 4000, 10000) instead of a flat amount


**Body Tiers**

- Broodmother from D to B
- Lifestealer from D to C
- Juggernaut from C to B
- Luna from B to C
- Venge from A to B
- Medusa from A to B
- Sniper from A to B
- Mirana from S to A
- Outworld Destroyer from S to A
        </pre
      >
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
</style>