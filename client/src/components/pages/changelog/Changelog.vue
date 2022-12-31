<template>
  <div style="max-width: 1200px">
    <h1 class="page-title" v-t="'changelog.page_title'"></h1>
    <div class="pl-3 change-log">
      <h2>Update 4.0 1/1/2023</h2>
      <h3>Featured</h3>

      <ul>
        <li>Seasons are now 2 months long</li>
        <li>Battlepass is 4x easier to level</li>
        <li>Gods will now be introduced via the Battlepass</li>
        <li>
          Damage formula and timer changed to have more rounds played (without
          making the game itself longer)
        </li>
        <li>5 new Gods</li>
      </ul>

      <h3>General</h3>

      <ul>
        <li>
          Changed the damage formula
          <ul>
            <li>
              <b>Old</b>: Round number + (number of remaining heroes * shop
              level)
            </li>
            <li>
              <b>New</b>: 5+(Round Number/4.5)+(Number of Units Alive * Round
              Number/4.5)
            </li>
            <li>Note: This has the following implications:</li>
            <ol>
              <li>
                More damage taken in early rounds and less damage taken later
              </li>
              <li>No longer scales based on shop level</li>
              <li>
                Game will last roughly 15% longer (in round amount, not overall
                time)
              </li>
            </ol>
          </ul>
        </li>
        <li>
          Round buy timers lowered for every round (to account for the changes
          above)
        </li>
        <li>Shop will no longer close automatically</li>
        <li>Gold effect added when gaining extra gold with certain Gods</li>
        <li>Added more restraints to make sure units stay inside arena</li>
      </ul>

      <h3>Gods</h3>

      <ul>
        <li>
          Added Sideshop Man (unlocked for FREE at Battlepass Level 5. This is
          Chaos God from the past season)
          <ul>
            <li>Ability: Going Out of Existence Sale</li>
            <li>Type: Passive</li>
            <li>
              Description: First re-roll is always free, spells sell for full
              value, and your hero re-rolls are one less gold.
            </li>
          </ul>
        </li>

        <li>
          Added Vacation Aghanim (unlocked at Battlepass Level 11)
          <ul>
            <li>Ability: Sorcery For Dummies: Volume 5</li>
            <li>Type: Passive</li>
            <li>
              Description: Each spell in your shop has a 5% chance to be worth 2
              points instead of 1. These spells will cost 5 gold.
            </li>
          </ul>
        </li>

        <li>
          Added Prellex (unlocked for FREE at Battlepass Level 15)
          <ul>
            <li>Ability: Bringer of the Faithful</li>
            <li>Type: Passive</li>
            <li>
              Description: You are given a melee creep at the beginning of the
              game. Each time you upgrade shop, you are given a choice of 3
              neutral creeps. The skills of the chosen neutral will be added to
              your creep permanently. Neutral creep choices and your melee
              creep's stats improve which each shop level.
            </li>
          </ul>
        </li>
        <li>
          Added Faceless Void (unlocked for FREE at Battlepass Level 60)
          <ul>
            <li>Ability: Time's Bond</li>
            <li>Type: Active</li>
            <li>
              Description: Select a spell with this ability to individually lock
              it. Once the round ends, the spell will cost 1 less gold. Can be
              repeated. Charges: 0/1/2/3/4
            </li>
          </ul>
        </li>

        <li>
          Added Terrorist (unlocked for FREE at Battlepass Level 80)
          <ul>
            <li>Ability: Plant Bomb</li>
            <li>Type: Passive</li>
            <li>
              Description: Bomb is planted at the beginning of the round on a
              timer. If you lose before the timer runs out, the bomb is defused.
              However, if the timer expires, the bomb will explode, dealing
              non-lethal damage to all enemy units. Timer and explosion scale
              with shop level. Timer: 18/16/14/12/10 seconds Explosion Damage:
              90/80/70/60/50% current HP percentage
            </li>
            <li>Ability: Clutch Play</li>
            <li>Type: Passive</li>
            <li>
              Description: If the bomb explodes and the Terrorist wins, they
              gain 3 gold the following round. If the opponent defuses the bomb,
              they gain 3 gold the following round.
            </li>
          </ul>
        </li>

        <li>
          Glados reworked
          <ul>
            <li>Ability: Orange & Blue Portal</li>
            <li>Type: Active</li>
            <li>
              Description: Attach an Orange or Blue Portal to a unit. They will
              gain spell lifesteal and share all healing and regen with the
              opposite Portal unit. Spell Lifesteal 20/25/30/35/40% (half
              against creeps)
            </li>
          </ul>
        </li>

        <li>Aghanim rescaled from 20/30/40/50/60 to 45/50/55/60/65</li>
        <li>
          Boneless ADDITIONALLY starts with 1 extra shop slot (+1 on each level)
        </li>
        <li>PA movement to crit from 15 to 10</li>
        <li>Muerta crit base from 100% to 150%</li>
        <li>
          Ogre points required per level from 0/20/40/ 60/80 to
          0/20/40/60/80/100
        </li>
        <li>
          Ogre chance to multicast from 25/35/45/55/65 to 35/45/55/65/75/100
        </li>
        <li>Centaur HP per from 60 to 70</li>
        <li>Centaur return damage from 25% to 35%</li>
        <li>Tower God minimum range from 750 to 850</li>
        <li>Lifestealer Infest burst damage from 150 to 0/75/150/225/300</li>
        <li>Lifestealer attack interval from 1s to 0.75s</li>
        <li>
          Legion points required per level from 0/10/30/50/70/100 to
          0/15/30/45/60/75
        </li>
        <li>Legion damage from 3/6/9/12/15/20 to 4/7/10/13/16/19</li>
        <li>
          Rubick points required per level from 0/10/20/30/40/50/60/70/80 to
          0/5/15/25/35/45/55/65/75
        </li>
        <li>Techies Sticky Bomb from level 2 to level 4</li>
        <li>Techies Proximity Mine damage reduction from 50% to 25%</li>
      </ul>

      <h3>Spells</h3>

      <ul>
        <li>Added Elder Dragon Form</li>
        <li>
          Added Earthshock
          <ul>
            <li>
              Differences from Dota: Cooldown: 10/8/4. Damage: 75/150/300. Slows
              attack speed by 20/40/80 Leap distance: 400.
            </li>
            <li>
              Super: ( +500 radius, gains Enrage upon use for 1.5 seconds)
            </li>
            <li>Gaben: (Entire team Earthshocks for half values)</li>
          </ul>
        </li>
        <li>Arcane Aura self bonus factor from 4 to 2</li>
        <li>Arcane Aura ally bonus factor from 2 to 1</li>
        <li>
          Arcane Aura now ADDITIONALLY grants caster and team + 20/40/80 mana
          per spell cast
        </li>
        <li>Arcane Aura Super REPLACED with bonus +80 mana per cast</li>
        <li>Blink damage from 175 to 40/80/160</li>
        <li>Blink Silence duration from 1.75s to 0.4/0.8/1.6</li>
        <li>Brain Sap cooldown from 14/12/8 to 12/10/6</li>
        <li>Brain Sap Super cooldown reduction from 3 to 2</li>
        <li>Boundless Strike fixed to not stun through magic immunity</li>
        <li>
          Chakra Magic Gaben ADDITIONALLY allows it to work with ultimates
        </li>
        <li>
          Dark Pact Gaben: Allies only cast the base ability at 50% damage (no
          super benefits)
        </li>
        <li>Duel now works with castable attack modifiers</li>
        <li>Duel duration from 5/6/7 to 5.5/6.5/7.5</li>
        <li>Duel damage from 10/20/30 to 11/22/33</li>
        <li>Elder Dragon Form splash AOE from 0/350/350 to 0/250/250</li>
        <li>Elder Dragon Form Super ADDITIONALLY grants +15% splash</li>
        <li>Elder Dragon Form Super ADDITIONALLY grants +100 splash radius</li>
        <li>Essence Shift no longer double procs with attack modifiers</li>
        <li>Essence Shift Super fixed to not given Gaben effect</li>
        <li>
          Essence Shift fixed to no longer gain stacks from killing
          creeps/illusions
        </li>
        <li>Fissure Gaben Aftershock stun reduced from 0.75 to 0.4</li>
        <li>Flame Guard now properly absorbs magic damage</li>
        <li>Focus Fire cast range is now equal to your attack range</li>
        <li>Fortunes End back to instant cast time</li>
        <li>Fortunes End AOE now scales 150/200/300</li>
        <li>
          Ghost Ship Super Tidal Wave spawns wave at boat location, pushing
          units hit by Boat towards your side
        </li>
        <li>
          Inner Beast Gaben should spawn a Wraith Pact totem that tries to hit
          as many enemies as possible (rather than just grant the effect)
        </li>
        <li>Jingu Mastery Super now ADDITIONALLY grants Echo Saber</li>
        <li>Mana Shield damage absorb from 70% to 40/50/70%</li>
        <li>Mana Shield drain per mana from 0.5/1/1.5/2 to 0.8/1.2/2</li>
        <li>Meat Hook Super - remove -4s CDR & remove +120 dmg</li>
        <li>Mystic Flare will no longer cast on allies when multicasted</li>
        <li>Reaper's Scythe mana regen per stack from 1/2/3 to 2/4/6</li>
        <li>Reaper's Scythe Super bonus mana regen per stack from 3 to 6</li>
        <li>Reaper's Scythe Super +100 cast range to +500</li>
        <li>Vampiric Spirit skeleton damage from 32 ‒ 37 to 22 - 27</li>
      </ul>

      <h3>Bodies</h3>
      <ul>
        <li>Hoodwink body from S to A Tier</li>
      </ul>

      <h2>Update 3.5 12/15/2022</h2>
      <h3>General</h3>
      <ul>
        <li>
          Matchmaking system unlocked for all ranks. Visit on our website:
          <a href="https://abilityarena.com/matchmaking"
            >https://abilityarena.com/matchmaking</a
          >
        </li>
        <li>
          By using the website you will be gaining MMR at a higher rate. To
          organize play sessions, be sure to join
          <a href="https://discord.gg/NRDjuTPNvS">our discord</a>
        </li>
        <li>Added Announcement Card</li>
        <li>Many tooltips and keywords fixed</li>
        <li>Added Pure Damage keyword</li>
      </ul>

      <h3>Gods</h3>
      <ul>
        <li>Added Muerta God (unlocked for Free)</li>
        <ul>
          <li>Ability: Phantom's Touch</li>
          <li>Type: Active</li>
          <li>
            Description: Every 8 attacks the selected unit will deal a 100%
            splash magic damage critical strike in a 500 AOE. The critical
            strike damage is based on how much spell damage your team has dealt
            to enemy heroes. When the 8th attack lands, the crit percentage
            resets.
          </li>
        </ul>
        <li>Boneless Aghanim shop upgrades now cost 20% less</li>
        <li>Kanna self attack speed buff from 9 per summon to 5</li>
        <li>Kanna summon attack speed from 4.5 to 5</li>
        <li>Selemene spell amp per mana from 0.02% to 0.015%</li>
      </ul>

      <h3>Spells</h3>
      <ul>
        <li>Boundless Strike cooldown fixed to be 20/16/8 again</li>
        <li>Burrowstrike AI fixed to hit multiple targets</li>
        <li>Chaotic Offering Gaben fixed to spawn both golems properly</li>
        <li>Essence Shift fixed to have independent stacks</li>
        <li>Essence Shift stack duration from 6/12/24 to 5/10/20</li>
        <li>
          Eye of the Storm Super Lightning Rod buff from 50% values to 33%
        </li>
        <li>Leech Seed re-enabled</li>
        <li>Lifebreak re-enabled and fixed</li>
        <li>Nature's Call fixed to have proper HP gains</li>
        <li>
          Sidekick will not longer cast on an illusion instead of the actual
          hero
        </li>
        <li>
          Fixed break mechanic not working on Dragon's Blood, Essence Flux, and
          Essence Shift
        </li>
      </ul>

      <h2>Update 3.0 12/1/2022</h2>
      <h3>Featured</h3>
      <ul>
        <li>8 brand new Gods!</li>
        <li>New Galaxy God Chest (no more duplicate Gods)</li>
        <li>New spells</li>
        <li>All new season 3 Battlepass</li>
        <li>Added Win Streaks</li>
        <li>Store page redesign</li>
      </ul>
      <h3>General</h3>

      <ul>
        <li>
          Replaced the God chest with a new Galaxy God Chest 1. This chest will
          act similarly to regular Dota chests. This version will have 12 Gods +
          3 Rares with escalating odds. You will not get a duplicate God untless
          you have all the non rares.
        </li>
      </ul>

      <h3>Gods</h3>

      <li>Added Santa Greevil God (unlocked via Battlepass)</li>
      <ul>
        <li>Ability: Gift Exchange</li>
        <li>Type: Passive</li>
        <li>
          An automatic gift exchange will give you a Good Gift or Bad Gift
          depending on if you win or not. Opposing player can accept/decline
          their gift during the early stages of the battle.
        </li>
      </ul>
      <li>Added Chaos God Season 3 (unlocked via Battlepass)</li>
      <ul>
        <li>Ability: ?</li>
        <li>Type: Passive</li>
        <li>
          First re-roll is always free, spells sell for full value, and hero
          re-rolls are less gold.
        </li>
      </ul>
      <li>Added GLaDOS God (unlocked via chest or PLUS)</li>
      <ul>
        <li>Ability: Orange Portal & Blue Portal</li>
        <li>Type: Active</li>
        <li>Units with opposing portals a ttached will share HP/Mana</li>
      </ul>
      <li>
        Added Boneless Aghanim God to replace the old Lifestealer (unlocked via
        chest)
      </li>
      <ul>
        <li>Ability: Sorcery For Dummies: Volume 3</li>
        <li>Type: Passive</li>
        <li>
          Ultimates never enter your pool of spells. Shop scales differently
          than other Gods.
        </li>
      </ul>
      <li>Added a completely reworked Lifestealer God (Free to all)</li>
      <ul>
        <li>Ability: Infest</li>
        <li>Type: Active</li>
        <li>
          Once selected unit is low, they will jump inside a random enemy,
          dealing physical attacks and healing dramatically. Once it exits, it
          deals damage in an area.
        </li>
      </ul>
      <li>
        Added Cave Johnson God (unlocked as a Rare in the Galaxy God Chest)
      </li>
      <ul>
        <li>Ability: Mantis Radiation</li>
        <li>Type: Passive</li>
        <li>
          Your heroes cannot heal, but they gain buffs based on their primary
          attribute.
        </li>
      </ul>
      <li>
        Added Bathtime Aghanim God (unlocked as a Very Rare in the Galaxy God
        Chest)
      </li>
      <ul>
        <li>Ability: Sorcery For Dummies: Volume 4</li>
        <li>Type: Passive</li>
        <li>
          Every round a random ability is upgraded to the next threshold
          temporarily. Amount of spells upgraded scales with shop level.
        </li>
      </ul>
      <li>
        Added Techies God (unlocked as an Ultra Rare in the Galaxy God Chest)
      </li>
      <ul>
        <li>
          God is split into three abilities, belonging to Squee, Spleen, and
          Spoon respectively. All three abilities can be cast on the same unit.
          Level 2/4/5 unlocks a random member of the team.
        </li>
        <li>Ability: Squee's Sticky Bomb</li>
        <li>Type: Active</li>
        <li>
          Doing enough spell damage will apply a Sticky Bomb to the enemy.
        </li>
        <li>Ability: Spoon's Reactive Taser</li>
        <li>Type: Active</li>
        <li>A chance when getting attacked to trigger a Reactive Taser.</li>
        <li>Ability: Spleen's Proximity Mine</li>
        <li>Type: Active</li>
        <li>A chance on attack to cast a Proximity Mine</li>
      </ul>

      <ul>
        <li>Aghanim upgrade chance from 25/30/35/40/45 to 20/30/40/50/60%</li>
        <li>Alchemist gold required from 11/10/9/8/7 to 10/9/8/7/6</li>
        <li>Bloodseeker attack speed per stack from 30 to 40</li>
        <li>Centaur HP per round from 50 to 60</li>
        <li>Centaur retaliate damage from 20% to 25%</li>
        <li>Jmuy cooldown reduction from 10/20/30/40/50 to 30/35/40/45/50</li>
        <li>
          Ogre Magi spell point requirement from 0/25/50/75/100 to 0/20/40/60/80
        </li>
        <li>Phantom Assassin critical strike chance from 15% to 20%</li>
        <li>
          Rubick spell points required from 0/11/22/33/44/55/66/77/88 to
          0/10/20/30/40/50/60/70/80
        </li>
        <li>Tower God fortification duration from 1.5 to 1.75</li>
      </ul>

      <h3>Spells</h3>

      <ul>
        <li>Added Blast Off</li>
        <li>Added Chakram</li>
        <li>Added Essence Shift</li>
        <li>Added Mana Shield</li>
        <li>Added Sun Ray</li>
        <li>Added War Cry</li>
        <li>Benched Elder Dragon Form</li>
        <li>Benched Moonglaives</li>
        <li>Benched Omnislash</li>
        <li>Astral Spirit damage per hero from 10/20/30/40 to 8/16/24/32</li>
        <li>Astral Spirit armor per creep from 0.5 to 1</li>
        <li>Astral Spirit Gaben magic immunity from 2s to 1.5s</li>
        <li>
          Black Hole AI changed to cast on closest unit instead of searching for
          multi-target
        </li>
        <li>Blink now has the silence/damage from Super by default</li>
        <li>
          Boundless Strike Super fixed to not deal double damage to the middle
          target
        </li>
        <li>
          Brain Sap Super additionally adds +Health to the unit equivalent to
          the amount sapped
        </li>
        <li>
          Burrowstrike Super additionally increases cast range to 1300, grants
          2s cooldown reduction, and +0.3 second stun duration
        </li>
        <li>
          Burrowstrike Super Caustic Finale base damage increased from 130 to
          230. Duration increased from 5 to 12
        </li>
        <li>Chemical Rage BAT for ranged from 1.5/1.4/1.3 to 1.6/1.5/1.4</li>
        <li>Chemical Rage BAT for melee from 1.3/1.2/1.1 to 1.4/1.3/1.2</li>
        <li>Chemical Rage Super additionally grants -0.1s BAT</li>
        <li>
          Corrosive Haze Super replaced with: now allows Corrosive Haze to stack
          on the unit. Remove the healing reduction
        </li>
        <li>Corrosive Haze Gaben replaced with casts in an 350 AOE</li>
        <li>Culling Blade cast range from 175 to 225</li>
        <li>Culling Blade super additionally grants +200 cast range</li>
        <li>
          Demonic Cleanse (Demonic Purge Gaben) fixed to cost 50 mana instead of
          150
        </li>
        <li>Double edge cast range increased +100</li>
        <li>Double Edge Super additionally slows attack speed too</li>
        <li>Double Edge Super additionally grants +200 damage radius</li>
        <li>Double Edge Gaben radius from +100 to 0</li>
        <li>
          Dragon Slave Super additionally deals 50 extra damage per unit it hits
        </li>
        <li>Duel cast ranged reduced by 500 (to regular Dota numbers)</li>
        <li>Duel duration from 4/6/8 to 5/6/7</li>
        <li>
          Duel Super replaced with: 10 Duel damage per duel, +500 cast range,
          +1s duration, -20s CD
        </li>
        <li>Duel Gaben replaced with: "You can cast spells while dueling"</li>
        <li>Epicenter radius increase per pulse from 25 to 15</li>
        <li>Epicenter Super from +5 pulses to +3 pulses</li>
        <li>
          Eye of the Storm Super additionally grants Lightning Rod: caster also
          gets hit by Eye of the Storm, gaining the opposite effects (healing
          and +armor) for half value.
        </li>
        <li>
          Eye of the Storm Super Lightning Rod buff from 50% values to 33%
        </li>
        <li>Fade Bolt Super +10% damage reduction to +0% and -4s CDR to 0s</li>
        <li>Fade Bolt Gaben additionally grants -4s CDR</li>
        <li>Fiends Grip now has +5% mana drain (removed from Super)</li>
        <li>
          Fiends Grip Super replaced with: "Additionally deals 5% HP per second"
        </li>
        <li>Flesh Golem strength multiplier from 40/50/60% to 30/40/50%</li>
        <li>
          Flesh Golem Super additionally grants +10% damage amp and +10%
          strength multiplier
        </li>
        <li>Fortunes End now has its normal Dota channel time</li>
        <li>Glaives of Wisdom fixed to not work with 0 mana</li>
        <li>
          Iceblast Super additionally will cast Ice Vortex on the ground below
          the target
        </li>
        <li>Jingu Gaben soldiers now have +400 attack range</li>
        <li>
          Leech Seed additional Super: Leech Seed becomes a puddle that leech
          seeds from every unit standing in it
        </li>
        <li>
          Life Break Super additionally adds: every unit hit in the path of the
          Life Break takes 100% of caster's self-damage as magical
        </li>
        <li>
          Poison Attack Super now additionally leeches Magic Resistance (grants
          stolen magic resist to attacker)
        </li>
        <li>Purification cast range increased from 550 to 800</li>
        <li>
          Purification Super additionally grants Gaben's Blessing: casts 2 more
          Purifications on the same unit, seperated by 3s intervals
        </li>
        <li>Purification Gaben Guardian Angel effect from 5s to 2s</li>
        <li>Reality Rift AI fixed to cast on farthest target in range</li>
        <li>Reality Rift cast range from 550/600/700 to 900/1100/1300</li>
        <li>Reality Rift Super cast range from 1000 to 500</li>
        <li>
          Reality Rift Super additionally casts level 2 Chaos Bolt on target
        </li>
        <li>
          Reality Rift Gaben Chaos Bolt additionally summons a Phantasm Illusion
          on target hit
        </li>
        <li>
          Resonant Pulse Super additionally: grants 1s of Magic Immunity for
          every unit hit
        </li>
        <li>Rot deals 2x damage to summons</li>
        <li>Sleight of Fist Super no longer grants Desolator</li>
        <li>Sleight of Fist Super grants +1000 cast range + True Strike</li>
        <li>Spear of Mars now has +200 range by default</li>
        <li>
          Static Link Gaben replaced with steals attack speed as well, and
          duration still lasts the entire round
        </li>
        <li>Sticky Napalm Super no longer incorrectly stacks to infinity</li>
        <li>Sunder Super additionally grants +400 cast range</li>
        <li>Trample Base Damage from 0/20/40/60 to 15/30/45/60</li>
        <li>
          Trample Super grants 20% magic resist while trampling and -5s CDR
        </li>
        <li>Walrus Punch cooldown from 36/24/12s to 20/15/10s</li>
        <li>Walrus Punch manacost from 50/75/100 to 75</li>
        <li>
          Walrus Punch Super additionally removes manacost and reduces cooldown
          by 4s
        </li>
        <li>Warpath Super and Gaben swapped</li>
        <li>Wild Axes AI fixed to target units farther away</li>
        <li>Windrun should now cast off cooldown</li>
      </ul>

      <h3>Monetization</h3>

      <ul>
        <li>
          Battlepass Season 3 released! Here are the highlighted features:
        </li>
        <li>Level 10/14/34: Santa Greevil Emote Packs</li>
        <li>Level 19: Santa Greevil Finisher</li>
        <li>Level 20: Chaos God</li>
        <li>Level 23: Epic Sound Pack</li>
        <li>Level 28: Santa Greevil Win Streak</li>
        <li>Level 30: Santa Greevil Arena</li>
        <li>Level 39: Santa Greevil God Avatar</li>
        <li>Level 40: Santa Greevil God Unlock</li>
        <li>Store Page redesigned for better functionality</li>
        <li>
          Win Streaks added (Fire is in store and Santa Greevil is in
          Battlepass). These streaks have 3 levels of intensity for winning
          3/6/9 rounds in a row.
        </li>
        <li>
          God Chests have been deleted and replaced with the Galaxy God Chest 1.
          More info regarding how we are doing future chests will be in the dev
          blog.
        </li>
        <li>War Chests can now drop multiple items (up to 5).</li>
        <li>
          Temporary PLUS memberships and God chests can no longer drop from War
          Chests
        </li>
        <li>Temporary PLUS will now have a chance to drop in Quests</li>
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