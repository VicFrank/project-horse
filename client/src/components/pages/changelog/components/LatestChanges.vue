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
        <li>已纳入 7 大新神（比如冰蛙和肉山）！</li>
        <li>星系神宝箱 2（可回收为原始的神之宝箱 1）</li>
        <li>第 5 赛季战斗通行证中包括竞技场宝箱、终结技宝箱、点击效果等！</li>
        <li>3 个新竞技场（2Fort、传送门、G 胖）</li>
      </ul>

      <h3>通用</h3>
      <ul>
        <li>移除了就绪按钮</li>
        <li>平局时将正确显示双方的终结技效果</li>
        <li>已添加出售法术热键（Ctrl + 鼠标左键）</li>
        <li>神选择页面进行了调整以容纳更多神，也让确认神的提示更加明显</li>
        <li>如果你没有及时选择神，其会选择你已突出显示的神而不是随机选择</li>
        <li>添加了一个效果以在没有花费 3 个或更多金币时为新玩家提供金币重置的视觉提示</li>
        <li>添加了黄金卡片进度追踪器</li>
      </ul>

      <h3>法术</h3>
      <router-link to="/learn/spells">查看法术</router-link>
      <ul>
        <li>已将“狂战士狂暴”加入候选</li>
        <li>新增了“强攻”</li>
        <li>新增了“无影拳”</li>
        <li>剑刃风暴 G 胖版 -8 秒 CDR 调整为 -6 秒 CDR</li>
        <li>诅咒王冠眩晕延迟缩短 1 秒</li>
        <li>末日 G 胖版现可即时施放</li>
        <li>幽灵船 G 胖版额外船只不会施放潮汐波</li>
        <li>冰晶爆轰持续时间从 3/5/7 调整为 5/7/9</li>
        <li>冰封路径施法距离从 1200 调整为 1000</li>
        <li>冰封路径距离从 1200 调整为 1000</li>
        <li>寄生种子超级版水潭范围从 350 调整为 300</li>
        <li>寄生种子超级版每秒伤害/治疗从 100 调整为 50</li>
        <li>强攻 AI 优先治疗生命值低于 80% 的友方（范围内）</li>
        <li>脉冲新星超级版不再提供血精石</li>
        <li>脉冲新星超级版现会在生效期间施放 2 级恶魔敕令</li>
        <li>脉冲新星 G 胖版不再提供虚无主义</li>
        <li>脉冲新星 G 胖版现会提供血精石</li>
        <li>毁灭 G 胖版现还会额外提供 +600 范围</li>
        <li>幽魂链接攻击速度从 16/32/64 调整为 14/28/56</li>
        <li>幽魂链接共享吸血从 10/20/40 调整为 7/14/28</li>
        <li>幽魂链接超级版共享吸血从 +30% 调整为 +20%</li>
        <li>星破天惊超级版不再提供 +30 挥击伤害。</li>
        <li>星破天惊超级版现还会额外提供黯灭</li>
        <li>粘性燃油超级版不再会在 AOE 内施加粘性燃油（仅会在击中目标时施加）</li>
        <li>粘性燃油 G 胖版现还会在 375 AOE 内施加将攻击粘性燃油</li>
        <li>风行闪避从 100% 调整为 80%</li>
      </ul>

      <h3>神</h3>
      <router-link to="/learn/gods">查看所有神</router-link>
      <ul>
        <li>添加了獸神（10 级战斗通行证）- 卡匠大赛第三名优胜者（october）提供概念</li>
        <li>添加了克莱纳博士神（21 级战斗通行证）- 卡匠大赛第三名优胜者（Pio_Romero）提供概念</li>
        <li>添加了肉山神（63 级战斗通行证）</li>
        <li>添加了医务人员神（80 级战斗通行证）</li>
        <li>添加了酒仙神（神之宝箱 2，稀有）</li>
        <li>添加了反恐精英神（神之宝箱 2，非常稀有）</li>
        <li>添加了冰蛙神（神之宝箱 2，极为稀有）- 卡匠大赛第一名优胜者（ubRtstcl）提供概念</li>
        <li>爆炸波：胆汁爆炸伤害从 20% 提高至 25%</li>
        <li>爆炸波：胆汁爆炸范围从 350 调整为 375</li>
        <li>虚空假面：时间向前几率从 35% 调整为 30%</li>
        <li>幻影刺客：每单位致命一击伤害从 2% 调整为 2.5%</li>
        <li>普雷利克斯变更：</li>
        <ul>
          <li>黑蜉蝣魔法抗性光环从 15% 调整为 12%</li>
          <li>森林巨魔牧师治疗强化从 10% 调整为 8%</li>
          <li>鹰身女妖风暴巫师连环闪电冷却时间从 4 调整为 6</li>
          <li>鹰身女妖风暴巫师连环闪电伤害从 140 调整为 100</li>
          <li>食人魔拳手食人魔挥击范围从 300 调整为 240</li>
          <li>食人魔拳手食人魔挥击伤害从 15% 调整为 10%</li>
          <li>萨特窃神者魔法回复光环从 10 调整至 8</li>
          <li>萨特窃神者魔法灼烧从 100 基础伤害调整为 40</li>
          <li>萨特苦难使者震荡波从 300 伤害调整为 240</li>
          <li>萨特生命值回复从 10 调整为 8</li>
          <li>萨特放逐者净化冷却时间从 8 调整为 12</li>
          <li>番茄雷霆一击伤害从 300 调整为 240</li>
          <li>番茄雷霆一击攻击速度与移动速度减缓从 55% 调整为 45%</li>
        </ul>
        <li>拉比克：拉比克冷却时间从 20/12/4 调整为 12/8/4</li>
        <li>拉比克：升级技能窃取所需的点数从 0/5/15/25/35/45/55/65/75 调整为 0/7/14/21/28/35/42/49/56/63</li>
        <li>旁观者：身体重选时不再提供折扣</li>
        <li>恐怖分子炸弹定时器从 18/16/14/12/10 调整为 20/18/16/14/12</li>
        <li>恐怖分子炸弹爆炸伤害从 90/80/70/60/50% 调整为 80/70/60/50/40%</li>
      </ul>
    </div>
  </div>
</template>