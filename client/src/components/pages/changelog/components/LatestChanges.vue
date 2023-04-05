<template>
  <div>
    <div v-if="$i18n.locale == 'en'">
      <h2>Update 5.5 4/5/2023</h2>

      <h3>Featured</h3>
      <ul>
        <li>
          Introducing Pantheon Trials, which provide items for players to equip
        </li>
        <li>Added 9 new spells</li>
        <li>Redesigned Pick screens for Gods and Arenas</li>
        <li>Click FX can now be seen by all players</li>
        <li>Gaben’s actual voice is now in the game</li>
      </ul>

      <h3>Pantheon Trials</h3>
      <ul>
        <li>
          At the beginning of the game, 3 elements are randomly selected. On
          rounds 8, 16, and 24 a Pantheon Trial will occur. Every player will
          have a choice of 1 hero to send to the Pantheon where they will fight
          to the death. Players that have higher HP will spawn first. The
          elements will alter the game state in some way during these rounds,
          whether it be negative or positive effects for all units. If the round
          goes on too long, all units will take massive damage per second. Once
          the round ends, players will select an item that can be equipped to 1
          hero. The order of selection is based on the results of the Pantheon
          round. The items available to pick are improved with each Trial. God
          abilities will NOT work during the Pantheon Trials. Gods will NOT take
          any damage from these trials.
        </li>
      </ul>

      <h3>General</h3>
      <ul>
        <li>
          New God Pick screen includes a chance for Gods to give extra gold, XP,
          or MMR. The chances that it is a God you don’t pick often is higher.
          If you random your God, you will receive a free shop re-roll at the
          beginning of the game.
        </li>
        <li>
          New God Pick screen includes the ability to filter via search (just
          type like in the Dota client)
        </li>
        <li>Reworked Loading screen to include Tips, socials, credits etc.</li>
        <li>
          Damage formula changed from 5 + (RoundNumber/3.8) +
          (NumberOfUnits*RoundNumber/3.8) to 6 + (RoundNumber/3.6) +
          (NumberOfUnits*RoundNumber/3.6)
        </li>
        <li>Gaben model size increased and now has an idle animation</li>
        <li>Top UI has been slightly reworked</li>
      </ul>

      <h3>Store</h3>
      <ul>
        <li>
          Added Punch Out! Bundle which includes the new Punch Out Arena, Punch
          Out Click FX and 2 War Chests. This Bundle will be available for 2
          weeks.
        </li>
        <li>Click FX can now be seen by all players</li>
        <li>
          Added a new cosmetic type called Spawn FX that creates a particle
          effect/sound when units are spawning on the board. A basic spawn
          effect has been instituted for all players.
        </li>
        <li>Added Darkness Spawn FX to Store</li>
        <li>War Chests cost from 1500 to 2000 gold</li>
        <li>
          War Chests odds changed: (XP from 27% to 20%, Avatar Border and Hats
          from 22% to 27.5% each, Finisher FX from 17% to 15%, Arena from 12% to
          10%)
        </li>
        <li>
          Fixed the long standing bug where the game technically started on
          round 2. First 3 bodies have been moved up a round to compensate
        </li>
        <li>Fixed Ctrl+Click selling from breaking hotkeys</li>
      </ul>

      <h3>Spells</h3>
      <router-link to="/learn/spells">View all Spells</router-link>
      <ul>
        <li>Added Rebound</li>
        <li>Added Frost Arrows</li>
        <li>Added Guardian Angel</li>
        <li>Added Living Armor</li>
        <li>Added Overgrowth</li>
        <li>Added Pierce the Veil</li>
        <li>Added Primal Roar</li>
        <li>Added Spirit Siphon</li>
        <li>Added Shadow Wave</li>
        <li>Benched Tricks of the Trade</li>
        <li>Benched Shadow Dance</li>
        <li>Benched Crippling Fear</li>
        <li>Benched Ice Path</li>
        <li>Benched Charge of Darkness</li>
        <li>Benched Boundless Strike</li>
        <li>Benched Chaos Strike</li>
        <li>Benched Searing Arrows</li>
        <li>Benched Insatiable Hunger</li>
        <li>Removed items from most abilities</li>
        <li>
          Acorn Shot Gaben replaced with: grants +60 base damage, attacks reduce
          target's armor by 10 for 7 seconds
        </li>
        <li>
          Arc Lightning Gaben replaced with: grants 20% spell amp, and 20% spell
          lifesteal
        </li>
        <li>Arcane Aura Super now also heals team for 25% of mana restored</li>
        <li>Astral Step Super no longer grants Mage Slayer</li>
        <li>Berserker's Blood Gaben replaced with: grants 60 strength</li>
        <li>
          Blackhole Gaben replaced with: all abilities reset after casting
          Blackhole (once per round)
        </li>
        <li>Blast Off! cast time from 1s to 0.5s</li>
        <li>Borrowed Time Super from +3s to +2s</li>
        <li>Burning Barrage Gaben replaced with: grants 2 charges</li>
        <li>Burning Spear current health cost from 3% to 1.5%</li>
        <li>Burning Spear damage from 5/10/20 to 7/14/28</li>
        <li>
          Chakra Magic Gaben cast range on Blinding Light from 600 to 1000
        </li>
        <li>Chakram manacost from 75/125/175 to 75</li>
        <li>
          Chemical Rage Gaben replaced with: Chemical Rage now also casts on the
          closest unit to you
        </li>
        <li>
          Counter Helix Super replaced with: Counter Helix will proc on attacks
          with independent cooldown; +120 spin damage
        </li>
        <li>
          Counter Helix Gaben replaced with: Counter Helix now applies a
          stacking debuff to enemies hit by it that causes them to deal 15% less
          total attack damage to Axe (6s duration). Increases Counter Helix
          Chance by 10%.
        </li>
        <li>Cursed Crown stun radius from 360 to 400</li>
        <li>Cursed Crown cast range from 600/625/675 to 750</li>
        <li>Cursed Crown cooldown from 18/16/12 to 16/14/10</li>
        <li>Decay Super now also grants -1s CDR</li>
        <li>Decay manacost from 85/90/100 to 50</li>
        <li>Enchant Totem Gaben replaced with: grants +60 base damage</li>
        <li>Fervor Super attack speed bonus from 10 to 15</li>
        <li>
          Fervor Gaben replaced with: Fervor no longer resets when you switch
          targets
        </li>
        <li>Fiery Soul attack speed from 35/45/65 to 20/30/50</li>
        <li>Fiend's Grip cast range from 625 to 800</li>
        <li>
          Fiends Grip Super now also spawns 2 illusions channeling Fiend's Grip,
          and Fiend's Grip only stops channeling if both of those are stunned or
          killed
        </li>
        <li>Flesh Golem Super bonus strength amp from 20% to 10%</li>
        <li>Flesh Golem Super bonus damage amp from 15% to 10%</li>
        <li>
          Flesh Golem Gaben replaced with: 10% chance to cast level 4 Soul Rip
          on target upon attack, and 10% chance to cast level 4 Soul Rip on self
          upon attack
        </li>
        <li>Flesh Heap Gaben replaced with: 2x Strength and 2x damage block</li>
        <li>
          Frost Arrows now grants Hypothermia (the Aghs Shard) by default, with
          the following scaling: burst damage per stack: 30/40/60. Health regen
          reduction per stack 2/3/5%
        </li>
        <li>
          Frost Arrows Super replaced with regen reduction per stack increased
          by 4%. +20 base damage
        </li>
        <li>
          Frost Shield Gaben replaced with: deals 6% of target hero's max HP in
          an AOE per pulse
        </li>
        <li>
          Hand of Gaben Super replaced with: Reduces cooldown by 40s, increases
          heal by 280 and grants +6 armor to all units affected
        </li>
        <li>
          Hand of Gaben Gaben replaced with: Hard dispels globally. When Hand of
          Gaben is cast, all summons gain the Martydom ability (unit suicides to
          cast a 50% value single target Hand of Gaben on low HP heroes)
        </li>
        <li>Ice Blast path radius from 275 to 475</li>
        <li>Ice Blast radius minimum from 375 to 475</li>
        <li>
          Inner Beast Super replaced with: grants +20% lifesteal and 15% attack
          damage bonus to all units
        </li>
        <li>
          Inner Beast Gaben no longer replaces Vlad's Aura with Wraith Pact --
          instead, it simply summons a Wraith Pact totem
        </li>
        <li>
          Jingu Mastery Gaben soldiers spawn every 2s rather than every 2.5s
        </li>
        <li>
          Kraken Shell Gaben replaced with: passively reflects 35% damage taken
        </li>
        <li>
          Life Break Gaben replaced with: Life Break taunts for 3 seconds. Also
          grants Gaben's Gauntlets (has the value of 15 Gauntlets of Strength)
        </li>
        <li>
          Life Drain Super channel time to start draining an additional target
          from 1.5 to 1.0s
        </li>
        <li>Life Drain manacost from 125/175/225 to 75/100/125</li>
        <li>
          Lightning Bolt Gaben replaced with: Grants Thunder Gaben's Wrath
          (level 3)
        </li>
        <li>Lil Shredder armor reduction per stack from 0.5 to 1</li>
        <li>Luminosity Gaben lifesteal bonus reduced from 200% to 150%</li>
        <li>Magic Missile Super bonus damage from 200 to 100</li>
        <li>Mana Break Super replaced with: Grants Blink Fragment</li>
        <li>Mirror Image Super replaced with: grants +25 agility</li>
        <li>Moment of Courage cooldown from 1.9/1.5/0.7 to 1.0/0.8/0.4</li>
        <li>Multishot Gaben replaced with: Grants level 3 Marksmanship</li>
        <li>
          Overpower Gaben replaced with: 25% chance to bash for 1.5 seconds and
          120 damage (2.3 second cooldown)
        </li>
        <li>Phantom Strike Super now also grants +25% bonus lifesteal</li>
        <li>Plague Wards Super cooldown reduction from 1.5s to 1.0</li>
        <li>Press the Attack heal from 30/40/60 to 40/50/70</li>
        <li>Press the Attack cooldown from 16/15/13 to 11/10/8</li>
        <li>Press the Attack cast range from 700 to 800</li>
        <li>
          Pulse Nova Super now grants level 4 Diabolic Edict instead of level 2
        </li>
        <li>
          Pulse Nova Gaben replaced with: Diabolic Edict now hits everything in
          AOE
        </li>
        <li>
          Purification Gaben replaced with: grants 50% damage reduction for 2s
        </li>
        <li>Rage Super bonus duration from 3s to 2s</li>
        <li>Rage Gaben cooldown reduction from -11s to -12s</li>
        <li>Rolling Thunder damage from 180/260/340 to 80/120/160</li>
        <li>
          Rot Gaben replaced with: Grants level 3 Dismember (does not need to be
          channeled, but gets interrupted by stuns)
        </li>
        <li>
          Shapeshift Super replaced with: blinks Shapeshift unit to enemy
          backline (1500 range), fearing enemies in 400 AOE for 1.5 seconds
        </li>
        <li>Spear of Mars spear collision size from 125 to 150</li>
        <li>Spiked Carapace reflect duration from 2 to 1.5s</li>
        <li>Spirit Bear Gaben Assault Cuirass replaced with Mjolnir</li>
        <li>
          Spirit Lance Gaben replaced with: grants 25% CDR and +50 base stat
        </li>
        <li>
          Starbreaker Super replaced with: Starbreaker now has 2 charges. +150
          swipe and smash radius. Gains spell immunity during Starbreaker.
        </li>
        <li>
          Starbreaker Gaben replaced with: each attack adds a stacking
          (dispellable) -1 armor debuff for 5 seconds. Each stack refreshes the
          duration.
        </li>
        <li>Static Link continues draining after units die</li>
        <li>
          Static Link cast range equal to at least the unit's attack range (or
          550, if they're lower than 550 attack range)
        </li>
        <li>Static Link buff duration from 9/12/18 to 15/16/18</li>
        <li>Static Link Super no longer grants infinite drain duration</li>
        <li>
          Sunray Super replaced with: +1.5% max HP damage, +1.5% max health
          heal, +25% width to Sunray
        </li>
        <li>Time Lock Super now additionally grants +4% proc chance</li>
        <li>Time Lock Gaben AOE from 400 to 450</li>
        <li>Torrent delay from 1.6s to 1s</li>
        <li>
          Trample Super no longer grants any cooldown reduction or magic
          immunity
        </li>
        <li>
          Trample Super now additionally grants +50% magic resistance and +50%
          status resistance during Trample
        </li>
        <li>
          Trample Gaben replaced with: procs attack modifiers and has no
          cooldown
        </li>
        <li>Viscous Nasal Goo cast range from 600 to 800</li>
        <li>
          Walrus Punch Super replaced with: Has no mana cost, reduces cooldown
          by 4s, +0.4s air time, breaks the target for its duration
        </li>
        <li>Warcry Armor from 3/6/12 to 4/8/16</li>
        <li>Warcry Super bonus armor from 5 to 10</li>
        <li>Warcry AOE from 800 to 1000</li>
        <li>
          Warpath Gaben replaced with: +5 to max stacks, and every cast now
          grants 2 stacks of Warpath
        </li>
      </ul>

      <h3>Gods</h3>
      <router-link to="/learn/gods">View all Gods</router-link>
      <ul>
        <li>Fixed a game crashing bug with Prellex</li>
        <li>
          Brewmaster Storm Brewling Invis is no longer considered a passive
        </li>
        <li>Dr. Kleiner's shop will now auto-reroll at the end of rounds</li>
        <li>
          Gods like Brewmaster and Roshan now have their skills viewable in the
          bottom right during shop phase
        </li>
      </ul>
    </div>
    <div v-if="$i18n.locale == 'cn'">
      <h2>5.5 2023-4-5</h2>

      <h3>特别推荐</h3>
      <ul>
        <li>隆重介绍众神试炼，玩家将可获得可装备的物品</li>
        <li>添加了 9 个新的法术</li>
        <li>重新设计了神与竞技场的挑选界面</li>
        <li>现在所有玩家均可看到点击特效</li>
      </ul>

      <h3>众神试炼</h3>
      <ul>
        <li>
          游戏开始时将随机选择 3 种元素。第 8、16 以及 24
          回合时将开始众神试炼。每个玩家都可选择 1
          名英雄以将其送入万神殿进行死斗。生命值较高的玩家将首先出生。元素将在这些回合中以某些方式改变游戏状态，无论其对于所有单位的效果是负面还是正面的。如果回合持续时间太长，则所有单位都会每秒承受巨大伤害。回合结束后，玩家可选择一个物品以将其装备至
          1
          名英雄处。选择顺序将根据万神殿回合的结果确定。可供挑选的物品将在每次试炼后改善。神之技能将无法在众神试炼中使用。神不会在这些试炼中承受任何伤害。
        </li>
      </ul>

      <h3>通用</h3>
      <ul>
        <li>
          全新的神选择界面中还会有几率让神提供额外金钱、经验值或
          MMR。你通常较少选择的神几率更高。如果你随机挑选神，则会在游戏开始时获得一次免费的商店重选。
        </li>
        <li>
          全新的神选择界面中还会提供通过搜索进行筛选的功能（与 Dota 客户端类似）
        </li>
        <li>调整了加载界面以包含提示、社交媒体信息、制作者名单等内容。</li>
        <li>
          伤害公式从“5 + (RoundNumber/3.8) +
          (NumberOfUnits*RoundNumber/3.8)”调整为“6 + (RoundNumber/3.6) +
          (NumberOfUnits*RoundNumber/3.6)”
        </li>
        <li>位于中间的 G 胖模型现有空闲动画</li>
        <li>顶部 UI 微调</li>
      </ul>

      <h3>商店</h3>
      <ul>
        <li>
          添加了“拳无虚发”包含全新“拳无虚发”竞技场、“拳无虚发”点击特效以及 2
          个战争宝箱的捆绑包。此捆绑包将上架 2 周。
        </li>
        <li>现在所有玩家均可看到点击特效</li>
        <li>
          添加了一个名为“出生特效”的全新饰品类型，当单位在面板上生成时会生成粒子特效/声音。基础的出生特效已为所有玩家启用。
        </li>
        <li>在商店中添加了“黑暗出生特效”</li>
        <li>战争宝箱的成本从 1500 金币调整为 2000 金币</li>
        <li>
          战争宝箱几率变更：（经验值从 27% 调整为 20%、头像框和帽子从 22% 调整为
          27.5%、终结技特效从 17% 调整为 15%、竞技场从 12% 调整为 10%）
        </li>
        <li>
          修复了导致游戏在第 2 回合技术性开始的长期 Bug。前 3
          个身体已提前一回合以进行补偿
        </li>
        <li>修复了“Ctrl + 点击”出售导致热键出错的问题</li>
      </ul>

      <h3>法术</h3>
      <router-link to="/learn/spells">查看法术</router-link>
      <ul>
        <li>添加了“回身踢”</li>
        <li>添加了“霜冻之箭”</li>
        <li>添加了“守护天使”</li>
        <li>添加了“活体护甲”</li>
        <li>添加了“疯狂生长”</li>
        <li>添加了“越界”</li>
        <li>添加了“原始咆哮”</li>
        <li>添加了“吸魂巫术”</li>
        <li>添加了“暗影波”</li>
        <li>已将“绝杀秘技”加入候选</li>
        <li>已将“暗影之舞”加入候选</li>
        <li>已将“伤残恐惧”加入候选</li>
        <li>已将“冰封路径”加入候选</li>
        <li>已将“暗影冲刺”加入候选</li>
        <li>已将“棒击大地”加入候选</li>
        <li>已将“混沌一击”加入候选</li>
        <li>已将“灼热之箭”加入候选</li>
        <li>已将“极度饥渴”加入候选</li>
        <li>从大部分技能中移除了物品</li>
        <li>
          爆栗出击 G 胖版替换为：提供 +60 基础伤害、攻击使得目标护甲在 7
          秒内削弱 10
        </li>
        <li>弧形闪电 G 胖版替换为：提供 20% 技能增强与 20% 法术吸血</li>
        <li>奥术光环超级版现会为团队提供 25% 已恢复魔法值的治疗量</li>
        <li>太虚之径超级版不再提供法师克星</li>
        <li>狂战士之血 G 胖版替换为：提供 60 点力量</li>
        <li>黑洞 G 胖版替换为：所有技能在施放黑洞后重置（每回合一次）</li>
        <li>爆破起飞！施放时间从 1 秒调整为 0.5 秒</li>
        <li>回光返照超级版从 +3 秒调整为 +2 秒</li>
        <li>炽烈火雨 G 胖版替换为：提供 2 充能</li>
        <li>沸血之矛当前生命值消耗从 3% 调整为 1.5%</li>
        <li>沸血之矛伤害从 5/10/20 调整为 7/14/28</li>
        <li>查克拉魔法 G 胖版致盲之光施法距离从 600 调整为 1000</li>
        <li>锯齿飞轮魔法消耗从 75/125/175 调整为 75</li>
        <li>化学狂暴 G 胖版调整为：化学狂暴现还会对距离你最近的单位施放</li>
        <li>
          反击螺旋超级版替换为：反击螺旋会在攻击时触发独立冷却时间；+120
          旋转伤害
        </li>
        <li>
          反击螺旋 G
          胖版替换为：反击螺旋现会在被击中的敌人身上施加可叠加的减益以使其对斧王造成的总攻击伤害降低
          15%（持续 6 秒）。提高 10% 的反击螺旋几率。
        </li>
        <li>诅咒王冠的眩晕范围从 360 调整为 400</li>
        <li>诅咒王冠的施法距离从 600/625/675 调整为 750</li>
        <li>诅咒王冠的冷却时间从 18/16/12 调整为 16/14/10</li>
        <li>腐朽超级版现还会提供 -1 秒冷却时间</li>
        <li>腐朽的魔法消耗从 85/90/100 调整为 50</li>
        <li>强化图腾 G 胖版替换为；提供 +60 基础伤害</li>
        <li>热血战魂超级版攻击速度加成从 10 调整为 15</li>
        <li>热血战魂 G 胖版替换为：切换目标时热血战魂不再重置</li>
        <li>炽魂攻击速度从 35/45/65 调整为 20/30/50</li>
        <li>魔爪的施法距离从 625 调整为 800</li>
        <li>
          魔爪超级版现还会生成 2
          个持续施放魔爪的幻象，魔爪只会在两个幻象同时被眩晕或击杀时停止持续施法
        </li>
        <li>血肉傀儡超级版力量增强加成从 20% 调整为 10%</li>
        <li>血肉傀儡超级版伤害增强加成从 15% 调整为 10%</li>
        <li>
          血肉傀儡 G 胖版替换为：10% 几率在攻击时对目标施放 4 级噬魂，且有 10%
          几率在攻击时对自己施放 4 级噬魂
        </li>
        <li>腐肉堆积 G 胖版替换为：2x 力量与 2x 伤害格挡</li>
        <li>
          霜冻之箭现会默认提供低温（阿哈利姆魔晶），且有以下伤害划分 -
          每次叠加爆裂伤害：30/40/60。每次叠加的生命值回复降低 2/3/5%
        </li>
        <li>霜冻之箭超级版替换为每次叠加回复降低增加 4%。+20 基础伤害</li>
        <li>
          冰霜魔盾 G 胖版替换为：每次脉冲在 AOE 内造成目标最大生命值 6% 伤害
        </li>
        <li>
          G 胖之手超级版替换为：缩短 40 秒冷却时间、提高 280
          治疗量并为所有被影响的单位提供 +6 护甲
        </li>
        <li>
          G 胖之手 G 胖版替换为：全局硬驱散。在施放 G
          胖之手时，所有召唤物都将获得殉道技能（单位自杀以对低生命值英雄施放一次
          50% 数值单个目标的 G 胖之手）
        </li>
        <li>冰晶爆轰路径范围从 275 调整为 475</li>
        <li>冰晶爆轰最小范围从 375 调整为 475</li>
        <li>
          野性之心超级版替换为：为所有单位提供 +20% 吸血与 15% 攻击伤害加成
        </li>
        <li>
          野性之心 G
          胖版不再会以怨灵之契替换弗拉迪米尔光环，而是召唤一个怨灵之契图腾
        </li>
        <li>如意棒法 G 胖版士兵会每 2 秒生成而不是每 2.5 秒</li>
        <li>海妖外壳 G 胖版替换为：被动反射 35% 受到的伤害</li>
        <li>
          牺牲 G 胖版替换为：牺牲嘲讽 3 秒同时提供 G 胖护手（具有 15
          力量护手的数值）
        </li>
        <li>
          生命汲取超级版开始汲取额外目标的持续施法时间从 1.5 秒调整为 1.0 秒
        </li>
        <li>生命汲取的魔法消耗从 125/175/225 调整为 75/100/125</li>
        <li>雷击 G 胖版替换为：提供雷霆 G 胖之怒（3 级）</li>
        <li>霹雳铁手每次叠加的护甲减免从 0.5 调整为 1</li>
        <li>熠熠生辉 G 胖版吸血加成从 200% 下调至 150%</li>
        <li>魔法箭超级版加成伤害从 200 调整为 100</li>
        <li>魔力损毁超级版替换为：提供闪烁碎片</li>
        <li>镜像超级版替换为：提供 +25 敏捷</li>
        <li>勇气之霎冷却时间从 1.9/1.5/0.7 调整为 1.0/0.8/0.4</li>
        <li>数箭齐发 G 胖版替换为：提供 3 级射手天赋</li>
        <li>
          超强力量 G 胖版替换为：25% 几率造成 1.5 秒重击以及 120 点伤害（2.3
          秒冷却时间）
        </li>
        <li>幻影突袭超级版现还会提供 +25% 吸血加成</li>
        <li>瘟疫守卫超级版冷却时间减免从 1.5 秒调整为 1.0 秒</li>
        <li>强攻治疗量从 30/40/60 调整为 40/50/70</li>
        <li>强攻冷却时间从 16/15/13 调整为 11/10/8</li>
        <li>强攻施法距离从 700 调整为 800</li>
        <li>脉冲新星超级版现会提供 4 级恶魔敕令而不是 2 级</li>
        <li>脉冲新星 G 胖版替换为：恶魔敕令现会击中 AOE 中的所有目标</li>
        <li>洗礼 G 胖版替换为：提供 2 秒的 50% 伤害减免</li>
        <li>狂暴超级版持续时间加成从 3 秒调整为 2 秒</li>
        <li>狂暴 G 胖版冷却时间减免从 -11 秒调整为 -12 秒</li>
        <li>地雷滚滚伤害从 180/260/340 调整为 80/120/160</li>
        <li>
          腐烂 G 胖版替换为：提供 3 级肢解（无需持续施法，但会被眩晕打断）
        </li>
        <li>
          变身超级版替换为：将变身单位闪烁至地方后防线（1500 范围），使得 400
          AOE 中的敌人恐惧 1.5 秒
        </li>
        <li>战神迅矛长矛碰撞尺寸从 125 调整为 150</li>
        <li>尖刺外壳反射持续时间从 2 秒调整为 1.5 秒</li>
        <li>熊灵 G 胖版强袭胸甲替换为雷神之锤</li>
        <li>灵魂之矛 G 胖版替换为：提供 25% 冷却时间并 +50 基础数据</li>
        <li>
          星破天惊超级版替换为：星破天惊现有 2 次充能。+150
          挥击与撞击范围。在星破天惊期间获得法术免疫。
        </li>
        <li>
          星破天惊 G 胖版替换为：每次攻击提供 1 层时长 5 秒的 -1
          护甲减益叠加（可驱散）。每次叠加均会刷新持续时间。
        </li>
        <li>静电连接将在单位死亡后继续汲取</li>
        <li>
          静电连接施法距离至少等于单位的攻击范围（如果攻击范围小于 550 则为
          550）
        </li>
        <li>静电连接增益持续时间从 9/12/18 调整为 15/16/18</li>
        <li>静电连接超级版不再提供无限汲取持续时间</li>
        <li>
          烈日炙烤超级版替换为：烈日炙烤 +1.5% 最大生命值伤害、+1.5%
          最大生命值治疗、+25% 宽度
        </li>
        <li>时间锁定超级版现会额外提供 +4% 触发几率</li>
        <li>时间锁定 G 胖版 AOE 从 400 调整为 500</li>
        <li>洪流延迟从 1.6 秒调整为 1 秒</li>
        <li>踏超级版不再提供任何冷却时间减免或魔法免疫</li>
        <li>
          踏超级版现会在其持续时间中额外提供 +50% 魔法抗性与 +50% 状态抗性
        </li>
        <li>踏 G 胖版替换为：触发攻击特效且无冷却时间</li>
        <li>粘稠鼻液施法距离从 600 调整为 800</li>
        <li>
          海象神拳超级版替换为：无魔法消耗、降低 4 秒冷却时间、+0.4
          秒滞空时间并在其持续时间中破坏目标
        </li>
        <li>战吼护甲从 3/6/12 调整为 4/8/16</li>
        <li>战吼超级版护甲加成从 5 调整为 10</li>
        <li>战吼 AOE 从 800 调整为 1000</li>
        <li>战意 G 胖版替换为：+5 最大叠加数且每次施放现会提供 2 层战意叠加</li>
      </ul>

      <h3>神</h3>
      <router-link to="/learn/gods">查看所有神</router-link>
      <ul>
        <li>修复了导致游戏崩溃的普雷利克斯 Bug</li>
        <li>酒仙狂风小酒仙隐身不再被视为被动</li>
        <li>克莱纳博士商店现将在回合结束时自动重选</li>
        <li>玩家可在商店阶段于画面右下方查看酒仙和肉山等神的技能</li>
      </ul>
    </div>
  </div>
</template>