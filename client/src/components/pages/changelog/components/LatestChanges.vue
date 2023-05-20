<template>
  <div>
    <div v-if="$i18n.locale == 'en'">
      <h2>Update 5/20/2023</h2>
      <h3>Featured</h3>
      <ul>
        <li>Season 6 Battlepass released</li>
        <li>8 New Gods</li>
        <li>15 additional spells</li>
        <li>Click FX now emit sounds for all players viewing in the area</li>
        <li>Mute functionality available through PLUS</li>
        <li>God & Spell Balance</li>
      </ul>
      <h3>General</h3>
      <ul>
        <li>Click FXs now emit sound for all players</li>
        <li>
          Reworked player avatars. Removed player rank badge. Now when you hover
          over the player avatars, they will show:
        </li>
        <ul>
          <li>The selected god abilities</li>
          <li>
            Specific information about the God abilities (i.e: spell selected
            with Icefrog)
          </li>
          <li>Player rank badge</li>
          <li>
            Player’s Battlepass Level and whether they have purchased the pass
          </li>
          <li>Whether the Player has PLUS enabled</li>
          <li>
            A button to mute sounds from each player (click FX and Gaben
            notifications). This is only available with PLUS
          </li>
        </ul>
        <li>
          Universal Heroes now show up for the attribute they have the highest
          stat gain in (Bane is random)
        </li>
        <li>
          Fixed a bug that broke hotkeys after choosing items after a pantheon
          trial
        </li>
      </ul>
      <h3>Pantheon Trials</h3>
      <ul>
        <li>
          The shopping phase before the Pantheon Round now provides only half
          gold
        </li>
        <li>
          The following spells now have half duration during Pantheon Trials:
        </li>
        <ul>
          <li>Omnislash</li>
          <li>Pierce the Veil</li>
          <li>Shadow Dance</li>
          <li>Tricks of the Trade</li>
        </ul>
        <li>Added Dandelion Amulet as a B Tier item</li>
        <li>Added Defiant Shell as a B Tier item</li>
        <li>Added Eternal Shroud as an A Tier item</li>
        <li>Added Harpoon as an A Tier item</li>
        <li>Added Martyr's Plate as an A Tier item</li>
        <li>Added Pavise as a B Tier item</li>
        <li>Added Phylactery as a B Tier item</li>
        <li>Added Orb of Destruction as B Tier item</li>
        <li>Added Vampire Fangs as a B Tier item</li>
        <li>Added Vindicators Axe as a B Tier item</li>
        <li>Removed Hood of Defiance</li>
        <li>Ascetic Cap HP regen from 20 to 25</li>
        <li>Ascetic Cap bonus HP from 250 to 400</li>
        <li>Blast Rig cooldown from 20s to 8s</li>
        <li>Eternal Shroud mana restored from 25% to 50%</li>
        <li>Eternal Shroud Strength from 14 to 18</li>
        <li>Stormcrafter cooldown from 3s to 2s</li>
      </ul>
      <h3>Gods</h3>
      <ul>
        <li>
          Counter Terrorist Decoy Grenade damage from 35% to 0/30/40/50/60%
        </li>
        <li>
          Counter Terrorist Flashbang Shrapnel bonus damage from 15 to
          0/16/18/20/22
        </li>
        <li>
          Counter Terrorist HE Grenade knockback distance from 400 to
          0/450/500/550/600
        </li>
        <li>Counter Terrorist Smoke Grenade from 4 to 0/4/4.5/5/5.5</li>
        <li>
          Counter Terrorist Incendiary Grenade DPS from 50 to 0/60/70/80/90
        </li>
        <li>
          Counter Terrorist Riot Shield damage reduction from 50% to
          0/45/50/55/60%
        </li>
        <li>Dr Kleiner permanent int from 3 to 3/3/4/4/5</li>
        <li>Medic magic immunity buff duration from 1.5 to 1.25s</li>
        <li>Roshan Slam is now instant cast</li>
        <li>Roshan Spell Block status resistance from 0/50/50% to 40/60/80%</li>
        <li>
          Terrorist Plant Bomb timer from 20/18/16/14/12 to 19/17/15/13/11
        </li>
        <li>
          Terrorist Plant Bomb explosion damage from 80/70/60/50/40% to
          82/74/66/58/50%
        </li>
        <li>Tower God immunity duration from 1.75 to 1.5s</li>
        <li>
          Rubick added a new power, Arcane Transference, to change the priority
          of the spell
        </li>
      </ul>
      <h3>Spells</h3>
      <ul>
        <li>
          There are now 190 total spells in the game (Up from 175. Still
          filtered to 100 per game)
        </li>
        <li>Added Arctic Burn</li>
        <li>Added Atrophy Aura</li>
        <li>Added Chaos Strike</li>
        <li>Added Corrosive Haze</li>
        <li>Added Coup De Grace</li>
        <li>Added Feral Impulse</li>
        <li>Added Grave Chill</li>
        <li>Added Ice Path</li>
        <li>Added Insatiable Hunger</li>
        <li>Added Omnislash</li>
        <li>Added Poison Attack</li>
        <li>Added Shadow Dance</li>
        <li>Added Tricks of the Trade</li>
        <li>Added Unleash</li>
        <li>Added Waveform</li>
        <li>Arctic Burn no longer grants flying movement</li>
        <li>
          Arctic Burn Super now additionally causes the Arctic Burn debuff to
          splash in a 500 AOE
        </li>
        <li>
          Arctic Burn Super now additionally causes caster to heal from all
          damage dealt by Arctic Burn
        </li>
        <li>
          Arctic Burn Gaben now also grants Arctic Burn to the closest allied
          unit
        </li>
        <li>Blackhole radius from 350 to 380</li>
        <li>Blackhole Super no longer grants +100 DPS</li>
        <li>Blackhole Super drops a level 4 Midnight Pulse in the center</li>
        <li>Blackhole damage from 20/60/100 to 50/100/150</li>
        <li>Blast Off! no longer silences</li>
        <li>Blast Off! now stuns for 0.8/1/1.4 seconds</li>
        <li>Blast Off! Super no longer stuns</li>
        <li>Blast Off! Super now additionally silences for 4.4 seconds</li>
        <li>Blast Off! AI now targets most backline unit in range</li>
        <li>Brain Sap Super no longer applies Enfeeble</li>
        <li>
          Brain Sap Gaben now additionally applies a level 2 Enfeeble to all
          units hit
        </li>
        <li>Brain Sap Gaben AOE from 550 to 500</li>
        <li>Chakra Magic Super CDR from -4s to -3s</li>
        <li>Chaos Strike lifesteal from 24/36/60 to 20/40/80</li>
        <li>
          Corrosive Haze Super replaced with: casts Slithereen Crush in 325 AOE
          around target, applying Corrosive Haze to every unit hit
        </li>
        <li>
          Corrosive Haze Gaben replaced with: spawns a 600 radius puddle around
          target, granting 15 armor, 40% status resistance, and 30 HP regen to
          any allies standing in it
        </li>
        <li>
          Counter Helix changed from 20% proc chance to procs every 4 hits
        </li>
        <li>Counter Helix Super now procs every 4 auto attacks as well</li>
        <li>Counter Helix Gaben no longer grants 10% proc chance</li>
        <li>
          Counter Helix Gaben now additionally grants: procs every 3 hits
          instead of 4
        </li>
        <li>Doom Gaben AOE from 325 to 300</li>
        <li>Doom duration from 7/9/11 to 6/8/10</li>
        <li>Grave Chill movespeed bonus from 30/40/60 to 25/50/100</li>
        <li>Grave Chill Super no longer reduces cooldown or disarms</li>
        <li>Grave Chill Super now grants +5s duration</li>
        <li>Ice Path stun duration from 1.0/1.5/2.5 to 0.7/1.1/1.9</li>
        <li>Ice Path path duration from 4.5 to 3</li>
        <li>
          Insatiable Hunger Super now replaced with: +30% base damage, +2s
          duration
        </li>
        <li>
          Insatiable Hunger Gaben now additionally grants you 1.4 BAT (unless
          caster's is already faster)
        </li>
        <li>Kraken Shell damage threshold from 600/550/450 to 600</li>
        <li>Kraken Shell damage threshold timer from 7s to 5s</li>
        <li>
          Life Break Gaben now additionally grants you Spell Immunity for the
          duration of the taunt
        </li>
        <li>Magic Missile Super no longer pierces Spell Immunity</li>
        <li>Mystic Flare Super now additionally reduces cooldown by 10s</li>
        <li>Overgrowth radius from 500 to 600</li>
        <li>Overgrowth Super +1s duration to +2s duration</li>
        <li>Pierce the Veil duration from 6/7/8 to 4/5/6</li>
        <li>Pierce the Veil Super now additionally grants +2s duration</li>
        <li>Plague Wards Super no longer grants 2 wards</li>
        <li>Plague Wards Super no longer grants CDR</li>
        <li>Plague Wards Super grants 4x HP and damage instead of 2.5x</li>
        <li>Press the Attack HP regen from 40/50/70 to 40/60/100</li>
        <li>Press the Attack movespeed from 10/14/22% to 10/20/40%</li>
        <li>Press the Attack Super now additionally grants +2s duration</li>
        <li>Press the Attack Gaben spell immunity from 2s to 3s</li>
        <li>Primal Roar Gaben replaced with: grants Drums of Slom</li>
        <li>Reality Rift Super Chaos Bolt no longer pierces Spell Immunity</li>
        <li>Reality Rift Gaben no longer grants 2x armor reduction</li>
        <li>Shadow Dance duration from 4/4.25/4.5 to 2/3/4</li>
        <li>Shadow Dance Super +80 attack speed to +100 attack speed</li>
        <li>Shadow Dance Gaben no longer grants Depth Shroud</li>
        <li>
          Shadow Dance Gaben now grants all Shadow Dance buffs even while not in
          Shadow Dance
        </li>
        <li>
          Sun Ray Gaben now spawns a level 1 Supernova instead of a level 3
          Supernova
        </li>
        <li>Trample from 35% damage to 40% damage</li>
        <li>Trample Super from 25% damage to 30%</li>
        <li>
          Vampiric Spirit Gaben skeletons stop respawning when caster dies
        </li>
        <li>Wave of Terror Super 20% armor and base damage steal to 30%</li>
        <li>Wave of Terror range from 1400 to 1600</li>
        <li>Wave of Terror radius from 325 to 40</li>
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