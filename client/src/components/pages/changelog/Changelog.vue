<template>
  <div style="max-width: 650px">
    <h1 class="page-title" v-t="'changelog.page_title'"></h1>
    <div class="pl-3 change-log">
      <h3>Season 2</h3>
      <h4>Featured</h4>

      <ul>
        <li>Brand new God selection system</li>
        <li>3 New Gods (Rubick, Rune God, Chaos God)</li>
        <li>20+ New Spells</li>
        <li>
          Private matchmaking for Immortal players now available as a beta test
          on our website
        </li>
        <li>All new Season 2 Battle Pass!</li>
        <li>2 new Arenas (Phantom Assassin & Rune God)</li>
        <li>New Rune God Finisher</li>
        <li>More hats</li>
      </ul>

      <p>This season we have simply added spells without rotating any out.</p>
      <p>
        This means that instead of 150 spells in the general pool, there will be
        170. Each game the bans will still lower the amount of spells in each
        game to 100.
      </p>

      <h4>General</h4>

      <ul>
        <li>
          Implemented a new God Selection system. Players will now have a random
          33% of their owned Gods to choose from. You are able to reshuffle
          once, but can still get the same Gods again on the following
          selection. PLUS members will be able to discard Gods so they do not
          show up on the second selection screen. TLDR: The more Gods you own,
          the more you will be able to select from
        </li>
        <li>
          Currently beta testing a matchmaking client on our website for
          Immortal players
        </li>
        <li>Moved Ready Up button to make it more visible</li>
        <li>
          Added God tabs for better visualization of buffs (ie: PA & Selemene)
        </li>
      </ul>

      <h4>Gods</h4>

      <p>Added Rune God (unlocked via Battlepass)</p>
      <ul>
        <li><b>Ability:</b> Fill Bottle</li>
        <li><b>Type:</b> Active</li>
        <li>
          Selected unit gains a random rune at the beginning of battle. Each
          shop upgrade will give more runes.
        </li>
      </ul>

      <p>Added Rubick God (unlocked via PLUS or chest)</p>
      <ul>
        <li><b>Ability:</b> Spell Steal</li>
        <li><b>Type:</b> Active</li>
        <li>
          Selected unit gains Spell Steal, which upgrades based on how many
          total spell points you have. Spell Steal does not count towards your
          four spell hero limit.
        </li>
      </ul>

      <p>Added Chaos God (unlocked via Battlepass)</p>
      <ul>
        <li><b>Ability:</b> ?</li>
        <li><b>Type:</b> Passive</li>
        <li>
          50 magical damage per second is dealt to both allies and enemies (not
          lethal). This God is temporary and will be removed from everyone's
          inventory at the end of the season
        </li>
      </ul>

      <ul>
        <li>The Gambler is now available via PLUS or chests</li>
        <li>Donkey Aghanim has been rotated out of PLUS</li>
        <li>Rix, Oathbound has been rotated out of PLUS</li>
        <li>Aghanim upgrade chance from 45/50/55/60/65% to 30/35/40/45/50%</li>
        <li>
          Alchemist interest gained per gold from 1 per 10 to 1 per 11/10/9/8/7
          (depends on shop level)
        </li>
        <li>Bloodseeker lifesteal per hero death from 15% to 17.5%</li>
        <li>
          Dazzle Shallow Grave from 0.75/1.5/2.25/3/3.75 to 0.8/1.6/2.4/3.2/4
        </li>
        <li>Donkey Aghanim from 25% extra shop cost to 20%</li>
        <li>Jmuy cooldown reduction from 0/10/20/30/40% to 10/20/30/40/50%</li>
        <li>Jmuy cooldowns no longer tick down just before combat starts</li>
        <li>Selemene spell amp from 0.04% to 0.03%</li>
        <li>
          Selemene buff is now team-wide and benefits from every unit losing
          mana
        </li>
      </ul>

      <h4>Spells</h4>

      <ul>
        <li>Added Boundless Strike</li>
        <li>Added Burning Barrage</li>
        <li>Added Dragons Blood</li>
        <li>Added Death Ward</li>
        <li>Added Enchant Totem</li>
        <li>Added Epicenter</li>
        <li>Added Fiends Grip</li>
        <li>Added Fortunes End</li>
        <li>Added Frostbite</li>
        <li>Added Ice Blast</li>
        <li>Added Inner Fire</li>
        <li>Added Lil Shredder</li>
        <li>Added Lucent Beam</li>
        <li>Added Moon Glaives</li>
        <li>Added Press the Attack</li>
        <li>Added Pulverize</li>
        <li>Added Reality Rift</li>
        <li>Added Shadow Dance</li>
        <li>Added Sidekick</li>
        <li>Added Spear of Mars</li>
        <li>Added Summon Familiars</li>
        <li>Arc Lightning Gaben replaced with Grants Timeless Relic</li>
        <li>Blackhole Gaben Refresher Orb now costs 0 mana</li>
        <li>Blink Super CDR from 50% to 80%</li>
        <li>
          Boundless Strike Super now also adds a perpendicular Boundless Strike
          at the end of the first strike
        </li>
        <li>
          Boundless Strike Gaben changed to: applies Bloodthorn effect to every
          unit hit
        </li>
        <li>
          Burrowstrike Super replaced with: applies max level Caustic Finale to
          units hit by Burrow
        </li>
        <li>Chakra Magic Gaben changed to: Grants Blinding Light</li>
        <li>
          Corrosive Haze Super now also makes it undispellable and permanent
        </li>
        <li>Counter Helix Super now also grants Vanguard</li>
        <li>
          Counter Helix Gaben now also grants Crimson Guard (replaces Vanguard)
        </li>
        <li>Dark Pact Super now also causes Dark Pact to dispel enemies</li>
        <li>
          Dark Pact Gaben replaced with: Every time the main unit casts Dark
          Pact, the entire team will also cast it for 50% damage
        </li>
        <li>
          Empower Gaben is replaced with: casts on everyone at the start of the
          round (undispellable, infinite duration)
        </li>
        <li>Firesnap Cookie cast range from 700 to 800</li>
        <li>
          Firesnap Cookie Super now also grants Aghs Shard (max level Mortimer's
          Kiss puddle)
        </li>
        <li>Frost Shield duration from 5/6/7/8 to 4/5/6/7</li>
        <li>Frost Shield Super duration from +2s duration to +1s</li>
        <li>Focus Fire Super now entirely removes damage reduction</li>
        <li>Focus Fire Gaben no longer lets your auto attacks bounce</li>
        <li>Focus Fire Gaben removes mana cost</li>
        <li>Impetus damage from 3.5/7/10.5/14% to 4/8/12/16%</li>
        <li>Impetus Super damage from +11.5% to +6%</li>
        <li>Impetus Super now also grants Specialist Array</li>
        <li>Ink Swell Gaben replaced with: grants 2 charges</li>
        <li>Kraken Shell Gaben no longer grants Mirror Shield</li>
        <li>Life Break Gaben now also grants Heaven's Halberd</li>
        <li>Lucent Beam Gaben bounces from 3 to 4</li>
        <li>Lucent Beam Gaben bounces deal 15% less damage per bounce</li>
        <li>Nethertoxin max damage from 25/50/75/100 to 15/30/45/60</li>
        <li>Nethertoxin super max damage from 70 to 130</li>
        <li>Overload damage from 30/50/70/90 to 25/50/75/100</li>
        <li>Pulse Nova damage from 50/100/150 to 60/120/180</li>
        <li>Pulse Nova Super damage from +120 to 0</li>
        <li>Pulse Nova Super now also Grants Bloodstone</li>
        <li>Sharpshooter has 25% faster charge time by default</li>
        <li>Sharpshooter Gaben now also grants Hunter's Boomerang</li>
        <li>
          Split Earth Super replaced with casts level 2 Lightning Storm on every
          unit hit by Split Earth (can bounce)
        </li>
        <li>Static Link Super buff duration +7s (100% uptime)</li>
        <li>
          Sticky Napalm Super now applies on everyone in 375 AOE of attack as
          well
        </li>
        <li>Sunder Super also grants</li>
        <li>.2s cast point</li>
        <li>Trample Gaben now also grants Sange and Kaya</li>
        <li>Uproar Gaben moved to Super</li>
        <li>Uproar Gaben replaced with Primal Beast's Aghs</li>
        <ul>
          <li>
            When the hero activates Uproar, they release 3 waves of 2
            projectiles per stack of uproar each in a circle around them.
            Projectiles deal damage and Break enemies hit. After a short delay,
            each projectile splinters in two
          </li>
        </ul>
        <li>
          Vampiric Spirit Gaben also grants: when Skeletons respawn, they cast
          level 2 Wraithfire Blast on a random enemy (global range)
        </li>
        <li>Wild Axes Super bonus damage from 40 to 30</li>
      </ul>

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