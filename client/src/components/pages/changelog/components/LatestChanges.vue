<template>
<div>
  <div v-if="$i18n.locale == 'en'">
    <h2>Update 4.5 2/1/2023</h2>

    <h3>Featured</h3>

    <ul>
      <li> Added 15 spells</li>
      <li> Benched 14 spells</li>
      <li> Year of the Rabbit Bundle now on sale! Includes the Year of the Rabbit Terrain, Chinese Sound Pack, and 2 War
        Chests.</li>
    </ul>

    <h3>General</h3>
    <ul>
      <li>Added "ALT" hotkey for hiding tooltips when viewing match summary</li>
    </ul>

    <h3>Spells</h3>
    <router-link to="/learn/spells">View all Spells</router-link>
    <ul>
      <li>Benched Arctic Burn</li>
      <li>Benched Corrosive Haze</li>
      <li>Benched Feral Impulse</li>
      <li>Benched Finger of Death</li>
      <li>Benched Global Silence</li>
      <li>Benched Impetus</li>
      <li>Benched Magnetic Field</li>
      <li>Benched Mana Shield</li>
      <li>Benched Mist Coil</li>
      <li>Benched Poison Attack</li>
      <li>Benched Press the Attack</li>
      <li>Benched Sleight of Fist</li>
      <li>Benched Sunder</li>
      <li>Benched Wave of Terror</li>
      <li>Added Arcane Bolt</li>
      <li>Added Battery Assault</li>
      <li>Added Berserkers Rage</li>
      <li>Added Burning Spear</li>
      <li>Added Crippling Fear</li>
      <li>Added Cursed Crown</li>
      <li>Added Doom</li>
      <li>Added Earth Splitter</li>
      <li>Added Gods Strength</li>
      <li>Added Ice Path</li>
      <li>Added Rolling Thunder</li>
      <li>Added Snowball</li>
      <li>Added Spirit Link</li>
      <li>Added Starbreaker</li>
      <li>Added Swashbuckle</li>
      <li>Battle Trance Gaben Rampage now grants both 70 attack speed and 25% status resistance to everyone, regardless of
        melee</li>
      <li>or ranged.</li>
      <li>Black Hole radius from 300 to 350</li>
      <li>Blade Fury Super DPS from 100 to 80</li>
      <li>Blade Fury Gaben attack damage from 75% to 100%</li>
      <li>Blade Fury Gaben attacks every 1s instead of 1.2s</li>
      <li>Chakram damage per second from 50/100/150 to 70/140/210</li>
      <li>Chakram Super is now: grants Second Chakram, grants Flamethrower.</li>
      <li>Chakram Gaben is now: when Chakram lands, spawns 5 additional Chakrams that shoot out in all directions</li>
      <li>Chaos Strike critical min from 120% to 120%/140%/180%</li>
      <li>Chaotic Offering Golem Flaming Fists damage from 40/50/60 to 30/40/50</li>
      <li>Chaotic Offering Golem Permanent Immolation damage from 30/50/70 to 20/40/60</li>
      <li>Chemical Rage Gaben removed Berserk Potion</li>
      <li>Chemical Rage Gaben remains permanent and now grants Mjolnir</li>
      <li>Death Pulse radius from 700 to 800</li>
      <li>Dispersion damage reflect from 8/12/20 to 4/8/16%</li>
      <li>Dispersion Super now additionally grants +5% damage reflected.</li>
      <li>Dragon Slave cooldown from 9s to 6.5s</li>
      <li>Dragon Slave Super no longer grants any CDR</li>
      <li>Duel cast range from 200/250/300 to 300/350/400</li>
      <li>Duel Super bonus cast range from 350 to 250</li>
      <li>Duel Gaben replaced with: both units in Duel gain 80% damage reduction from any non-Duel target.</li>
      <li>Empower will no longer cast on self unless it is the only target in range</li>
      <li>Empower Super additionally allows the spell to be granted to both units</li>
      <li>Enchant Totem Super no longer becomes a passive ability</li>
      <li>Enchant Totem Super additionally costs 0 mana, and has 0 cast point.</li>
      <li>Enchant Totem damage from 75/150/300 to 100/200/400%</li>
      <li>Eye of the Storm Super and Gaben have been swapped</li>
      <li>Fiend's Grip fix for the unit continue to channel it despite the spell being dispelled from the enemy</li>
      <li>Fiends Grip Super additionally allows you to cast other spells while channeling</li>
      <li>Fiends Grip Gaben replaced with: -50s CD, for every 1s you spend channeling Fiends Grip the cooldown is reduced by
        10s.</li>
      <li>Flesh Golem damage amp from 10/15/20 to 5/10/15</li>
      <li>Flesh Golem Super damage amp from 10 to 15%</li>
      <li>Flesh Golem Strength percentage increase from 30/40/50 to 20/30/40%</li>
      <li>Flesh Golem Super Strength percentage increase from 10% to 20%</li>
      <li>Grow damage from 50/100/150 to 33/66/99</li>
      <li>Grow Super now additionally grants 51 damage</li>
      <li>Icarus Dive now also slows Attack Speed by 10/20/40</li>
      <li>Ice Blast min radius from 275 to 375</li>
      <li>Ice Blast Gaben replaced with: Grants Second Ice Age: casts Cold Feet on entire enemy team upon cast of Ice Blast
      </li>
      <li>Infernal Blade break duration from 4 to 2 seconds (does not affect the duration of the spell itself)</li>
      <li>Insatiable Hunger Gaben changed to: every 4 attacks, spawns a Spinner's Snare on enemy.</li>
      <li>Leech Seed cast range from 400 to 400/450/550</li>
      <li>Lightning Bolt Gaben radius increased from 325 to 425</li>
      <li>Lucent Beam ministun removed from the Gaben</li>
      <li>Mortimer's Kisses Glob Count from 6 to 8</li>
      <li>Mortimer's Kisses Super no longer increases Glob Count</li>
      <li>Mortimer's Kisses Super additionally grants +20 DPS</li>
      <li>Nature's Call Super Treants become Greater Treants (this was the previous Gaben)</li>
      <li>Nature's Call Gaben replaced with: When a unit dies on the enemy team, summons a Treant (Greater Treant for heroes).
      </li>
      <li>Caster must still be alive for this to occur.</li>
      <li>Overload attack speed slow from 0.8s to 1.2s</li>
      <li>Quill Spray stack damage from 28/30/34 to 21/25/33</li>
      <li>Reality Rift Super now spawns an illusion (removed from Gaben)</li>
      <li>Reality Rift fixed to actually be blocked by Linken's Sphere</li>
      <li>Reaper's Scythe AI changed to cast when unit is below 40% HP</li>
      <li>Resonant Pulse base shield absorb from 40/80/160 to 50/100/200</li>
      <li>Resonant Pulse damage from 70/120/220 to 75/150/300</li>
      <li>Shadow Dance fixed to not allow certain spells like Eye of the Storm or Death Ward to target them</li>
      <li>Sharpshooter Wind Up time from 2.25s to 1.5s</li>
      <li>Spear of Mars cooldown reduced from 15/14/12 to 13/12/10s</li>
      <li>Static Link Super no longer grants +7s buff duration.</li>
      <li>Static Link Super now grants infinite duration (lasts entire round).</li>
      <li>Static Link Gaben no longer grants infinite duration.</li>
      <li>Trample Super 20% magic resistance removed</li>
      <li>Trample Super grants Spell Immunity while Trampling</li>
      <li>Tricks of the Trade Super fixed to not jump in allies sometimes</li>
      <li>Vampiric Spirit Gaben Wraithfire Blast stun duration from 1.4s to 0.75s</li>
      <li>Warcry Super additionally adds +400 AOE</li>
      <li>Warcry Gaben additionally makes it undispellable</li>
    </ul>
    <h3>Gods</h3>
    <router-link to="/learn/gods">View all Gods</router-link>
    <ul>
      <li>Jmuy fix for when spell cooldowns would sometimes count up</li>
      <li>Lady Anshu fix for the targetted unit sometimes dying during Battle Trance</li>
      <li>Prellex bonus damage from upgrading shop removed</li>
      <li>Prellex creep damage gain per round from 3 to 6</li>
      <li>Prellex creep magic resistance from 60% to 50%</li>
      <li>Prellex Neutral Creep changes:</li>
      <li>Alpha Wolf packleader aura from 30% to 20%</li>
      <li>Ancient Black Dragon Fireball DPS from 85 to 60</li>
      <li>Ancient Rock Golem from -4 armor to -5 armor</li>
      <li>Ancient Rumblehide Wardrums accuracy from 80% to 50%</li>
      <li>Ancient Thunderhide Slam duration from 2 to 4</li>
      <li>Centaur Courser from shop 3 to to shop 4</li>
      <li>Dark Troll summoner from shop 4 to shop 3</li>
      <li>Giant Wolf intimidate AOE from 300 to 500</li>
      <li>Hill Troll Priest heal from 250 to 100</li>
      <li>Hill Troll Priest heal amp from 15 to 10%</li>
      <li>Kobold Soldier disarm cooldown from 9 to 6</li>
      <li>Ogre Frostmage armor cooldown from 5 to 8 seconds</li>
      <li>Satyr Banisher purge manacost from 50 to 120</li>
      <li>Satyr Banisher purge cooldown from 3 to 8</li>
      <li>Vacation Aghanim boosted spells cost 4 instead of 5</li>
    </ul>
  </div>
  <div v-if="$i18n.locale == 'cn'">
    <h2>4.5 2023-2-1</h2>

    <h3>特别推荐</h3>

    <ul>
      <li>新增了 15 个法术</li>
      <li>14 个法术加入候选</li>
      <li>兔年捆绑包大促！包含兔年地形、中国音效包以及 2 个战争宝箱。</li>
    </ul>

    <h3>通用</h3>
    <ul>
      <li>新增了“ALT”热键以在查看匹配摘要时隐藏提示</li>
    </ul>

    <h3>法术</h3>
    <router-link to="/learn/spells">查看法术</router-link>
    <ul>
      <li>已将“严寒烧灼”加入候选</li>
      <li>已将“侵蚀雾霭”加入候选</li>
      <li>已将“野性驱使”加入候选</li>
      <li>已将“死亡之指”加入候选</li>
      <li>已将“全领域静默”加入候选</li>
      <li>已将“推进”加入候选</li>
      <li>已将“磁场”加入候选</li>
      <li>已将“魔法护盾”加入候选</li>
      <li>已将“迷雾缠绕”加入候选</li>
      <li>已将“毒性攻击”加入候选</li>
      <li>已将“强攻”加入候选</li>
      <li>已将“无影拳”加入候选</li>
      <li>已将“魂断”加入候选</li>
      <li>已将“恐怖心潮”加入候选</li>
      <li>已将“奥法鹰隼”加入候选</li>
      <li>新增了“弹幕冲击”</li>
      <li>新增了“狂战士之怒”</li>
      <li>新增了“沸血之矛”</li>
      <li>新增了“伤残恐惧”</li>
      <li>新增了“诅咒王冠”</li>
      <li>新增了“末日”</li>
      <li>新增了“裂地沟壑”</li>
      <li>新增了“神之力量”</li>
      <li>新增了“冰封路径”</li>
      <li>新增了“滚雷”</li>
      <li>新增了“雪球”</li>
      <li>新增了“幽魂链接”</li>
      <li>新增了“星破天惊”</li>
      <li>新增了“虚张声势”</li>
      <li>战斗专注 G 胖版狂怒现会为所有人（无论近战还是远程单位）提供 70 攻击速度与 25% 状态抗性。</li>
      <li>黑洞范围从 300 调整为 350</li>
      <li>剑刃风暴超级版 DPS 从 100 调整为 80</li>
      <li>剑刃风暴 G 胖版攻击伤害从 75% 调整为 100%</li>
      <li>剑刃风暴 G 胖版将每 1 秒攻击而不是每 1.2 秒</li>
      <li>锯齿飞轮每秒伤害从50/100/150调整为70/140/210</li>
      <li>锯齿飞轮超级版现会提供锯齿飞轮（二）与喷火装置。</li>
      <li>锯齿飞轮 G 胖版现会在飞轮落地时生成 5 额外锯齿飞轮并向四周射出</li>
      <li>混沌一击最低致命一击伤害从 120% 调整为 120%/140%/180%</li>
      <li>混乱之祭的傀儡烈焰之拳伤害从 40/50/60 调整为 30/40/50</li>
      <li>混乱之祭的傀儡永恒献祭伤害从 30/50/70 调整为 20/40/60</li>
      <li>化学狂暴 G 胖版移除了狂暴药剂</li>
      <li>化学狂暴 G 胖版仍将永久有效且会提供雷神之锤</li>
      <li>死亡脉冲范围从 700 调整为 800</li>
      <li>折射的伤害反弹从 8/12/20 调整为 4/8/16%</li>
      <li>折射超级版现还会额外提供 +5% 伤害反弹。</li>
      <li>龙破斩的冷却时间从 9 秒调整为 6.5 秒</li>
      <li>龙破斩超级版不再提供任何 CDR</li>
      <li>决斗的施法距离从 200/250/300 调整为 300/350/400</li>
      <li>决斗超级版施法距离加成从 350 调整为 250</li>
      <li>决斗 G 胖版替换为两个决斗中单位获得 80% 的非决斗单位伤害减免。</li>
      <li>授予力量不再会对自己施放除非其是范围内的唯一目标</li>
      <li>授予力量超级版额外允许向两个单位提供法术</li>
      <li>强化图腾超级版不再是被动技能</li>
      <li>强化图腾超级版额外消耗 0 魔法值且没有施法前摇。</li>
      <li>强化图腾伤害从 75/150/300 调整为 100/200/400%</li>
      <li>风暴之眼超级版与 G 胖版对调</li>
      <li>即便是魔爪已从敌人身上被驱散该法术仍会在单位继续持续施法时抓住敌人</li>
      <li>魔爪超级版允许在持续施法时施放其他法术</li>
      <li>魔爪 G 胖版替换为 -50 秒冷却时间且每持续施法魔爪 1 秒其冷却时间都会缩短 10 秒。</li>
      <li>血肉傀儡的伤害增强从 10/15/20 调整为 5/10/15</li>
      <li>血肉傀儡超级版伤害增强从 10% 调整为 15%</li>
      <li>力量力量百分比提高从 30/40/50% 调整为 20/30/40%</li>
      <li>血肉傀儡超级版力量百分比提高从 10% 提高至 20%</li>
      <li>长大伤害从 50/100/150 调整为 33/66/99</li>
      <li>长大超级版现还会额外提供 51 伤害。</li>
      <li>凤凰冲击现还会使得攻击速度减缓 10/20/40</li>
      <li>冰晶爆轰最小范围从 275 调整为 375</li>
      <li>冰晶爆轰 G 胖版替换为提供第二冰河时代：在施放冰晶爆轰时对敌方全队施放寒霜之足</li>
      <li>阎刃破坏持续时间从 4 秒调整为 2 秒（不会影响法术本身的持续时间）</li>
      <li>极度饥渴 G 胖版变更为每 4 次攻击在敌人身上生成一个蛛纱陷阱。</li>
      <li>寄生种子施放范围从 400 调整为 400/450/550</li>
      <li>雷击 G 胖版范围从 325 提高至 425</li>
      <li>月光眩晕从 G 胖版中移除</li>
      <li>蜥蜴绝吻的火团数量从 6 调整 8</li>
      <li>蜥蜴绝吻超级版不再提高火团数量</li>
      <li>蜥蜴绝吻超级版额外提供 +20 DPS</li>
      <li>自然的呼唤超级版树人成为大树人（这是之前 G 胖版的效果）</li>
      <li>自然的呼唤 G 胖版替换为当敌方队伍中有单位死亡时召唤一个树人（英雄死亡时召唤大树人）。施法者必须保持存活。</li>
      <li>超负荷攻击速度减缓从 0.8 秒调整为 1.2 秒</li>
      <li>刺针扫射叠加伤害从 28/30/34 调整为 21/25/33</li>
      <li>实相裂隙超级版现还会生成一个幻象（从 G 胖版中移除）</li>
      <li>实相裂隙会被林肯法球阻挡</li>
      <li>死神镰刀 AI 变更为单位生命值低于 40% 时施放</li>
      <li>共鸣脉冲基础护甲吸收从 40/80/160 调整为 50/100/200</li>
      <li>共鸣脉冲伤害从 70/120/220 调整为 75/150/300</li>
      <li>暗影之舞可阻止风暴之眼或死亡守卫等法术将其作为目标</li>
      <li>一箭穿心装载时间从 2.25 秒调整为 1.5 秒</li>
      <li>战神迅矛冷却时间从 15/14/12 秒下调为 13/12/10 秒</li>
      <li>静电连接超级版不再提供 +7 秒增益持续时间。</li>
      <li>静电连接超级版现会提供无限持续时间（持续整个回合）。</li>
      <li>静电连接 G 胖版不再提供无限持续时间。</li>
      <li>踏超级版的 20% 魔法抗性已移除</li>
      <li>踏超级版会在技能生效时提供技能免疫</li>
      <li>绝杀秘技超级版不再会有时跃入友方中</li>
      <li>吸血灵魂 G 胖版冥火爆击眩晕持续时间从 1.4 秒调整为 0.75 秒</li>
      <li>战吼超级版额外增加 +400 AOE</li>
      <li>战吼 G 胖版无法驱散</li>
    </ul>
    <h3>神</h3>
    <router-link to="/learn/gods">查看所有神</router-link>
    <ul>
      <li>J'muy 法术冷却时间有时会增加</li>
      <li>安苏夫人的目标单位有时会在战斗专注期间死亡</li>
      <li>普雷利克斯商店升级伤害加成已移除</li>
      <li>普雷利克斯小兵每回合伤害获得从3调整为6</li>
      <li>普雷利克斯小兵魔法抗性从60%调整为50%</li>
      <li>普雷利克斯中立生物变更：</li>
      <li>头狼狼群领袖光环从30%调整为20%</li>
      <li>远古黑龙火球 DPS 从 85 调整为 60</li>
      <li>远古岩石傀儡从 -4 护甲调整为 -5 护甲</li>
      <li>远古岚肤兽战鼓准确度从 80% 调整为 50%</li>
      <li>远古雷肤兽猛击持续时间从 2 调整为 4</li>
      <li>半人马猎手从 3 级商店调整为了 4 级商店</li>
      <li>黑暗巨魔召唤法师从 4 级商店调整为了 3 级商店</li>
      <li>巨狼的恫吓 AOE 从 300 调整为 500</li>
      <li>巨魔牧师治疗量从 250 调整为 100</li>
      <li>巨魔牧师治疗增强从 15% 调整为 10%</li>
      <li>狗头人士兵缴械冷却时间从 9 调整为 6</li>
      <li>食人魔冰霜法师护甲冷却时间从 5 秒调整为 8 秒</li>
      <li>萨特放逐者净化魔法消耗从 50 调整为 120</li>
      <li>萨特放逐者净化冷却时间从 3 调整 8</li>
      <li>假期阿哈利姆提升法术消耗从 5 调整为 4</li>
    </ul>
  </div>
</div>
</template>