<template>
  <div>
    <div v-if="$i18n.locale == 'en'">
      <h2>Update 5.0b 3/15/2023</h2>

      <h3>General</h3>

      <ul>
        <li>Muerta added as an S tier Body</li>
        <li>Fixed Ctrl+Click selling bugging out</li>
        <li>Year of PLUS updated to give the newest God chest</li>
        <li>You can now rearrange spells onto empty slots</li>
      </ul>

      <h3>Spells</h3>

      <router-link to="/learn/spells">View all Spells</router-link>
      <ul>
        <li>Benched Empower</li>
        <li>Benched Coup de Gras</li>
        <li>Enabled Wave of Terror</li>
        <li>Enabled Sunder</li>
        <li>Battle Trance Gaben fixed to actually work (was previously doing nothing)</li>
        <li>Crippling Fear changed so that players in the same relative starting position can now cast it simultaneously.
          Previously it would choose a random person</li>
        <li>False Promise fixed to not work through to the next round sometimes</li>
        <li>Essence Shift Super fixed to not give multiple stacks sometimes</li>
        <li>Mortimer's Kisses AI fixed to target farthest unit from you instead of farthest from arena center</li>
        <li>Searing Arrows Gaben Burning Army skeletons no longer proc attack modifiers aside from Searing Arrows</li>
      </ul>

      <h3>Gods</h3>

      <router-link to="/learn/gods">View all Gods</router-link>
      <ul>
        <li>Brewmaster Storm Brewling Wind Walk damage from 0/20/40/60/80 to 0/60/120/180/240</li>
        <li>Brewmaster Storm Brewling will now have a minimum of 900 cast range for all 3 of his abilities (from 600).
          This is to prevent him from running into melee range. The range of this spell will be increased if you have a
          spell equipped with a longer cast range. In addition, the attack range of the unit is temporarily boosted to 900
          while using the invisibility spell</li>
        <li>Brewmaster Storm Brewling will no longer cast dispel unless an enemy is in range</li>
        <li>Brewmaster Storm Brewling spells cost mana now</li>
        <li>Brewmaster Fire Brewling Immolation damage from 0/25/50/75/100 to 0/32/64/96/128</li>
        <li>Brewmaster Earth Brewling Demolish attack damage from 0/20/40/60/80 to 0/25/50/75/100</li>
        <li>CT equipment now shows AOE when hovering over the skill in the bottom right</li>
        <li>CT fixes for HE grenade sometimes not working</li>
        <li>Dr. Kleiner shop now rerolls for every 2 spells purchased</li>
        <li>Dr Kleiner shop no longer rerolls at the end of a round</li>
        <li>Icefrog God Tab added to show tooltip of your chosen spell</li>
        <li>Icefrog: Spell choices at beginning of game from 5 to 4</li>
        <li>Roshan Spell Block Level 2 additionally gives permanent 50% status resistance</li>
        <li>Roshan Slam Level 3 primary attribute reduction from 15 to 25%</li>
        <li>Roshan Bash Level 2 additionally improves proc chance from 15 to 20%</li>
        <li>Shopkeeper shop size from 2/3/4 to 2/3/5</li>
        <li>Vacation Aghanim proc chance from 5% to 7%</li>
      </ul>
    </div>
    <div v-if="$i18n.locale == 'cn'">
      <h2>5.0b 2023-3-15</h2>

      <h3>通用</h3>
      <ul>
        <li>已将琼英碧灵作为 S 阶身体添加</li>
        <li>修复了“Ctrl + 点击”出售导致 Bug 的问题</li>
        <li>如果你没有拿到所有物品则竞技场和地形宝箱将固定不提供重复物品</li>
        <li>更新了年度 PLUS 以提供最新神之宝箱</li>
      </ul>

      <h3>法术</h3>
      <router-link to="/learn/spells">查看法术</router-link>
      <ul>
        <li>已将“授予力量”加入候选</li>
        <li>已将“恩赐解脱”加入候选</li>
        <li>启用了“恐怖心潮”</li>
        <li>启用了“魂断”</li>
        <li>更改了伤残恐惧以使玩家现可同时施放。之前其会随机选择一人。</li>
      </ul>

      <h3>神</h3>
      <router-link to="/learn/gods">查看所有神</router-link>
      <ul>
        <li>酒仙狂风小酒仙疾风步伤害从 0/20/40/60/80 调整为 0/60/120/180/240</li>
        <li>酒仙狂风小酒仙的 3 个技能现都有最低 900 的施法距离（调整自 600）。这是为了防止其进入近战范围。如果你装备有施法距离更长的法术则此法术的施法距离将提高。此外，单位的攻击范围将在使用隐身法术时暂时提高至 900
        </li>
        <li>酒仙狂风小酒仙将不会再在敌人位于范围外时施放驱散</li>
        <li>酒仙狂风小酒仙法术将立即消耗魔法值</li>
        <li>酒仙烈火小酒仙献祭伤害从 0/25/50/75/100 调整为 0/32/64/96/128</li>
        <li>酒仙大地小酒仙粉碎击攻击伤害从 0/20/40/60/80 调整为 0/25/50/75/100</li>
        <li>CT 装备现会在于右下方悬浮在技能上时展示 AOE</li>
        <li>CT 修复了高爆手雷有时无效的问题</li>
        <li>克莱纳博士商店现会每购买 2 个法术后重选</li>
        <li>克莱纳博士商店不再会在每回合结束后重选</li>
        <li>添加了冰蛙神标签页以展示所选法术的工具提示</li>
        <li>冰蛙：游戏开始时的法术选项从 5 个调整为 4 个</li>
        <li>肉山 2 级法术抵抗将额外提供永久 50% 状态抗性</li>
        <li>肉山 3 级猛击主要属性减免从 15% 调整为 25%</li>
        <li>肉山 2 级重击额外将触发几率从 15% 提高至 20%</li>
        <li>店主商店规模从 2/3/4 调整为 2/3/5</li>
        <li>假期阿哈利姆触发几率从 5% 调整为 7%</li>
    </ul>
  </div>
</div></template>