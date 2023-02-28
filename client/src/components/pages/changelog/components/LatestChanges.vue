<template>
  <div>
    <div v-if="$i18n.locale == 'en'">
      <h2>Update 5.0 3/1/2023</h2>

      <h3>Featured</h3>

      <ul>
        <li>7 New Gods including the likes of Icefrog and Roshan!</li>
        <li>Galaxy God Chest 2 (which can be Recycled into the original God Chest 1)</li>
        <li>Season 5 Battlepass including Arena Chests, Finisher Chests, Click FX and more!</li>
        <li>3 new Arenas (2Fort, Portal, Gaben)</li>
        <li>Now works with the Dota 2 Tooltips Extension on Twitch</li>
      </ul>

      <h3>General</h3>

      <ul>
        <li>Game is now supported by the Dota 2 Tooltips Extension. Will automatically work for streams that have the
          extension
          installed.</li>
        <li>Removed ready button</li>
        <li>Tied rounds now properly shows both Finisher Effects</li>
        <li>Hotkey Added to sell spells (Ctrl+Left Click)</li>
        <li>God Pick Screen adjusted for more Gods and made confirming a God more obvious</li>
        <li>If you do not pick a God in time, it will select the God you have highlighted instead of randoming</li>
        <li>Added an effect for when you haven’t spent 3 or more gold in order to provide a visual cue to new players that
          gold
          resets</li>
        <li>Added Golden Card progress tracker</li>
      </ul>

      <h3>Spells</h3>

      <router-link to="/learn/spells">View all Spells</router-link>
      <ul>
        <li>Benched Berskerker's Rage</li>
        <li>Benched Swashbuckle</li>
        <li>Added Finger of Death</li>
        <li>Added Press the Attack</li>
        <li>Added Sleight of Fist</li>
        <li>Blade Fury Gaben -8s CDR to -6s CDR</li>
        <li>Cursed Crown stun delay reduced by 1 second</li>
        <li>Doom Gaben is now instant cast</li>
        <li>Ghost Ship Gaben additional ships do not cast Tidal Wave</li>
        <li>Ice Blast duration from 3/5/7 to 5/7/9</li>
        <li>Ice Path cast range from 1200 to 1000</li>
        <li>Ice Path path distance from 1200 to 1000</li>
        <li>Leech Seed Super puddle radius from 350 to 300</li>
        <li>Leech Seed Super damage/heal per second from 100 to 50</li>
        <li>Press the Attack AI prioritizes healing allies below 80% HP (in range)</li>
        <li>Pulse Nova Super no longer grants Bloodstone</li>
        <li>Pulse Nova Super now casts level 2 Diabolic Edict while active</li>
        <li>Pulse Nova Gaben no longer grants Nihilism</li>
        <li>Pulse Nova Gaben now grants Bloodstone</li>
        <li>Ravage Gaben now additionally grants +600 radius</li>
        <li>Spirit Link attack speed from 16/32/64 to 14/28/56</li>
        <li>Spirit Link Shared Lifesteal from 10/20/40 to 7/14/28</li>
        <li>Sprit Link Super Shared Lifesteal from +30% to +20%</li>
        <li>Starbreaker Super no longer grants +30 swipe damage.</li>
        <li>Starbreaker Super now additionally grants Desolator</li>
        <li>Sticky Napalm Super no longer applies Sticky Napalm in an AOE (applies only on the target hit)</li>
        <li>Sticky Napalm Gaben now additionally makes Sticky Napalms on attack apply in a 375 AOE</li>
        <li>Swashbuckle Super passive Swashbuckle can now be broken</li>
        <li>Swashbuckle Strikes from 4 to 3 (Super remains at 2)</li>
        <li>Swashbuckle Gaben from 8 Slashes to 6 (Super is 3)</li>
        <li>Windrun evasion from 100% to 80%</li>
      </ul>

      <h3>Gods</h3>

      <router-link to="/learn/gods">View all Gods</router-link>
      <ul>
        <li>Added Primal Beast God (Battlepass Level 10) - Concept by 3rd place winner of Cardsmith contest (october)</li>
        <li>Added Dr. Kleiner God (Battlepass Level 21) - Concept by 2nd place winner of Cardsmith contest (Pio_Romero)</li>
        <li>Added Roshan God (Battlepass Level 63)</li>
        <li>Added Medic God (Battlepass Level 80)</li>
        <li>Added Brewmaster God (Rare in God Chest 2)</li>
        <li>Added Counter-Terrorist God (Very Rare in God Chest 2)</li>
        <li>Added Icefrog God (Extremely Rare in God Chest 2) - Concept by 1st place winner of Cardsmith contest (ubRtstcl)
        </li>
        <li>Boomer: Bile Explosion damage from 20% to 25%</li>
        <li>Boomer: Bile Explosion radius from 350 to 375</li>
        <li>Faceless Void: The March of Time chance from 35% to 30%</li>
        <li>Phantom Assassin: PA crit damage per units moved from 2% to 2.5%</li>
        <li>Prellex Neutral Changes:</li>
        <ul>
          <li>Black Drake Magic Amp Aura from 15 to 12%</li>
          <li>Forest Hill Troll Priest Heal Amp from 10 to 8%</li>
          <li>Harpy Stormcrafter Chain Lightning cooldown from 4 to 6</li>
          <li>Harpy Stormcrafter Chain Lightning damage from 140 to 100</li>
          <li>Ogre Bruiser Ogre Smash Radius from 300 to 240</li>
          <li>Ogre Bruiser Ogre Smash Damage from 15 to 10%</li>
          <li>Satyr Mindstealer Mana Regeneration Aura from 10 to 8</li>
          <li>Satyr Mindstealer Mana Burn from 100 base damage to 40</li>
          <li>Satyr Hellcaller Shockwave from 300 damage to 240</li>
          <li>Satyr Hellcaller Health Regen from 10 to 8</li>
          <li>Satyr Trickster Purge Cooldown from 8 to 12</li>
          <li>Tomato Thunder Clap Damage from 300 to 240</li>
          <li>Tomato Thunder Clap Attack speed & Movespeed Slow from 55 to 45%</li>
        </ul>
        <li>Rubick: Spell Steal cooldown from 20/12/4 to 12/8/4</li>
        <li>Rubick: Points required to level Spell Steal from 0/5/15/25/35/45/55/65/75 to 0/7/14/21/28/35/42/49/56/63</li>
        <li>Sideshop Man: No longer grants a discount on body rerolls</li>
        <li>Terrorist Plant Bomb timer from 18/16/14/12/10 to 20/18/16/14/12</li>
        <li>Terrorist Plant Bomb explosion damage from 90/80/70/60/50% to 80/70/60/50/40%</li>
      </ul>
    </div>
    <div v-if="$i18n.locale == 'cn'">
      <h2>5 2023-3-1</h2>

      <h3>特别推荐</h3>
      <ul>

      </ul>

      <h3>通用</h3>
      <ul>

      </ul>

      <h3>法术</h3>
      <router-link to="/learn/spells">查看法术</router-link>
      <ul>
      </ul>

      <h3>神</h3>
      <router-link to="/learn/gods">查看所有神</router-link>
      <ul>
      </ul>
    </div>
  </div>
</template>