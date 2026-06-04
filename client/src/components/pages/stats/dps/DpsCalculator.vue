<template>
  <b-container
    fluid
    class="dps-calculator py-4"
    style="max-width: 1600px; margin: 0 auto"
  >
    <div class="text-center mb-4">
      <h1 class="page-title">DPS Calculator</h1>
      <p class="text-muted small">
        Optimize DPS and EHP. Add items to either side to compare who wins a
        fight.
      </p>
    </div>

    <!-- Hero panels -->
    <b-row class="mb-4" align-h="center">
      <b-col lg="5" md="6" class="mb-3">
        <HeroPanel title="Attacker" v-model="attacker" />
      </b-col>

      <!-- DPS display + swap -->
      <b-col
        lg="2"
        md="12"
        class="d-flex flex-column align-items-center justify-content-center mb-3"
      >
        <b-button
          size="sm"
          variant=""
          class="swap-btn mb-2"
          title="Swap DPS and EHP sides"
          @click="swapSides"
        >
          ⇄ Swap
        </b-button>
        <div class="dps-display">
          <div class="dps-label">Attacker DPS</div>
          <div class="dps-value">{{ fmtDps(currentResult.effectiveDPS) }}</div>
          <div class="dps-sub">
            <span
              v-if="currentResult.procDPS > 0"
              class="dps-proc text-info"
              title="Chain lightning AoE DPS"
            >
              +{{ fmtDps(currentResult.procDPS) }} chain
            </span>
            <span
              v-if="currentResult.mkbProcDPS > 0"
              class="dps-proc text-violet"
              title="MKB/Javelin proc DPS (magic)"
            >
              +{{ fmtDps(currentResult.mkbProcDPS) }} mkb
            </span>
            <span
              v-if="currentResult.bashProcDPS > 0"
              class="dps-proc text-danger"
              title="Bash proc DPS (physical)"
            >
              +{{ fmtDps(currentResult.bashProcDPS) }} bash
            </span>
            <span
              v-if="currentResult.manaBurnDPS > 0"
              class="dps-proc text-teal"
              title="Mana burn DPS (Diffusal Blade)"
            >
              +{{ fmtDps(currentResult.manaBurnDPS) }} burn
            </span>
            <span
              v-if="currentResult.burnDPS > 0"
              class="dps-proc text-warning"
              title="Radiance burn AoE DPS"
            >
              +{{ fmtDps(currentResult.burnDPS) }} aura
            </span>
          </div>
          <div class="dps-detail-row">
            <span class="dps-detail-label">ATK CD</span>
            <span class="dps-detail-val">{{
              currentResult.aps > 0 ? fmtAps(1 / currentResult.aps) + "s" : "—"
            }}</span>
          </div>
          <div class="dps-detail-row">
            <span class="dps-detail-label">AS</span>
            <span class="dps-detail-val">{{
              fmtIas(currentResult.rawIAS)
            }}</span>
          </div>
          <div class="dps-detail-row">
            <span class="dps-detail-label">Crit ×</span>
            <span class="dps-detail-val">{{
              fmtCrit(currentResult.critMult)
            }}</span>
          </div>
          <div class="dps-detail-row">
            <span class="dps-detail-label">Enemy Armor</span>
            <span class="dps-detail-val">{{
              fmtDps(currentResult.effectiveArmor)
            }}</span>
          </div>
          <div v-if="currentResult.missChance > 0" class="dps-detail-row">
            <span class="dps-detail-label">Miss%</span>
            <span class="dps-detail-val">{{
              fmtPct(currentResult.missChance)
            }}</span>
          </div>

          <!-- Separator + counter DPS -->
          <hr class="my-2" style="border-color: #2d2a4a" />
          <div class="dps-label" style="margin-top: 4px">Defender DPS</div>
          <div class="dps-value" style="font-size: 1.5rem; color: #ef4444">
            {{ fmtDps(counterResult.effectiveDPS) }}
          </div>
          <div v-if="counterResult.missChance > 0" class="dps-detail-row">
            <span class="dps-detail-label">Miss%</span>
            <span class="dps-detail-val">{{
              fmtPct(counterResult.missChance)
            }}</span>
          </div>
          <div v-if="defenderItemStats.damageBlock" class="dps-detail-row">
            <span class="dps-detail-label">Block</span>
            <span class="dps-detail-val">{{
              fmtBlock(defenderItemStats.damageBlock, defenderHero.isMelee)
            }}</span>
          </div>
          <div v-if="fightResult.blockedByDef > 0" class="dps-detail-row">
            <span class="dps-detail-label">Blocked DPS</span>
            <span class="dps-detail-val" style="color: #4ade80"
              >-{{ fmtDps(fightResult.blockedByDef) }}</span
            >
          </div>
        </div>
      </b-col>

      <b-col lg="5" md="6" class="mb-3">
        <HeroPanel title="Defender" v-model="defender" />
      </b-col>
    </b-row>

    <!-- Fight outcome -->
    <div v-if="fightResult.ttkAtk > 0" class="text-center mb-3 fight-outcome">
      <div class="text-muted small" style="font-size: 0.75rem">
        {{ fightResult.atkName }} kills {{ fightResult.defName }} in
        <b>{{ fmtDps(fightResult.ttkAtk) }}s</b>
        &nbsp;·&nbsp; {{ fightResult.defName }} kills
        {{ fightResult.atkName }} in
        <b>{{ fmtDps(fightResult.ttkDef) }}s</b>
      </div>
      <div
        class="font-weight-bold"
        :class="
          fightResult.winner === fightResult.atkName
            ? 'text-success'
            : 'text-danger'
        "
        style="font-size: 1rem"
      >
        <template v-if="fightResult.isDraw">
          <span class="text-warning">Draw</span>
          <span class="text-muted font-weight-normal">
            &nbsp;({{ fmtDps(fightResult.ttkAtk) }}s each)
          </span>
        </template>
        <template v-else>
          <span
            :class="fightResult.attackerWins ? 'text-success' : 'text-danger'"
          >
            {{ fightResult.winner }} wins
          </span>
          <span class="text-muted font-weight-normal"
            >({{ fmtDps(fightResult.ratio) }}×
            {{ fightResult.ratio >= 1 ? "faster" : "slower" }})</span
          >
        </template>
      </div>
    </div>

    <!-- Simulate button -->
    <div class="text-center mb-3">
      <b-button
        size="sm"
        class="sim-btn"
        :disabled="simRunning || !attackerHero.bat || !defenderHero.bat"
        @click="runSimulation"
      >
        {{ simRunning ? "Simulating…" : "⚔ Simulate 100 Fights" }}
      </b-button>
      <b-button
        v-if="simResult"
        size="sm"
        class="ml-2"
        style="
          color: #6b7280;
          background: transparent;
          border: none;
          font-size: 0.75rem;
        "
        @click="simResult = null"
        >✕ Clear</b-button
      >
    </div>

    <!-- Simulation results -->
    <div v-if="simResult" class="sim-results mb-4">
      <div class="sim-results-header">
        Simulation Results
        <span
          class="text-muted"
          style="font-size: 0.75rem; font-weight: normal"
        >
          · {{ simResult.n }} fights</span
        >
      </div>

      <div class="sim-summary-grid">
        <div class="sim-stat">
          <div class="sim-stat-label">Attacker Wins</div>
          <div class="sim-stat-value text-success">
            {{ simResult.atkWins }}
            <span class="sim-stat-pct"
              >({{ simResult.atkWinPct.toFixed(0) }}%)</span
            >
          </div>
        </div>
        <div class="sim-stat">
          <div class="sim-stat-label">Defender Wins</div>
          <div class="sim-stat-value text-danger">
            {{ simResult.defWins }}
            <span class="sim-stat-pct"
              >({{ simResult.defWinPct.toFixed(0) }}%)</span
            >
          </div>
        </div>
        <div class="sim-stat">
          <div class="sim-stat-label">Draws / Timeout</div>
          <div class="sim-stat-value text-warning">
            {{ simResult.draws }}
            <span class="sim-stat-pct"
              >({{ simResult.drawPct.toFixed(0) }}%)</span
            >
          </div>
        </div>
        <template v-if="simResult.atkMeanTTK != null">
          <div class="sim-stat">
            <div class="sim-stat-label">Atk Kill (avg ± σ)</div>
            <div class="sim-stat-value">
              {{ simResult.atkMeanTTK.toFixed(1) }}s
              <span class="sim-stat-pct"
                >± {{ simResult.atkStdTTK.toFixed(1) }}</span
              >
            </div>
          </div>
          <div class="sim-stat">
            <div class="sim-stat-label">Atk Kill (range)</div>
            <div class="sim-stat-value">
              {{ simResult.atkMinTTK.toFixed(1) }}–{{
                simResult.atkMaxTTK.toFixed(1)
              }}s
            </div>
          </div>
          <div
            class="sim-stat"
            title="Attacker HP remaining at end of won fights"
          >
            <div class="sim-stat-label">Atk HP left (avg)</div>
            <div class="sim-stat-value text-success">
              {{ (simResult.atkWinMeanHPPct * 100).toFixed(1) }}%
            </div>
          </div>
          <div
            class="sim-stat"
            title="Range of attacker HP remaining across won fights"
          >
            <div class="sim-stat-label">Atk HP left (range)</div>
            <div class="sim-stat-value">
              {{ (simResult.atkWinMinHPPct * 100).toFixed(1) }}–{{
                (simResult.atkWinMaxHPPct * 100).toFixed(1)
              }}%
            </div>
          </div>
        </template>
        <template v-if="simResult.defMeanTTK != null">
          <div class="sim-stat">
            <div class="sim-stat-label">Def Kill (avg ± σ)</div>
            <div class="sim-stat-value">
              {{ simResult.defMeanTTK.toFixed(1) }}s
              <span class="sim-stat-pct"
                >± {{ simResult.defStdTTK.toFixed(1) }}</span
              >
            </div>
          </div>
          <div class="sim-stat">
            <div class="sim-stat-label">Def Kill (range)</div>
            <div class="sim-stat-value">
              {{ simResult.defMinTTK.toFixed(1) }}–{{
                simResult.defMaxTTK.toFixed(1)
              }}s
            </div>
          </div>
        </template>
      </div>

      <!-- Example fight log -->
      <div class="sim-log-header" @click="showSimLog = !showSimLog">
        <span>Example Fight</span>
        <span
          class="ml-2"
          :class="
            simResult.exampleFight.winner === 'attacker'
              ? 'text-success'
              : simResult.exampleFight.winner === 'defender'
              ? 'text-danger'
              : 'text-warning'
          "
          style="font-size: 0.78rem; font-weight: bold"
        >
          <template v-if="simResult.exampleFight.winner === 'attacker'">
            {{ fightResult.atkName }} wins @
            {{ simResult.exampleFight.ttkAtk.toFixed(2) }}s
            <span class="text-success" style="font-weight: normal">
              — {{ Math.round(simResult.exampleFight.atkFinalHP) }}/{{
                simResult.exampleFight.atkMaxHP
              }}
              HP ({{
                (simResult.exampleFight.atkFinalHPPct * 100).toFixed(1)
              }}%)
            </span>
          </template>
          <template v-else-if="simResult.exampleFight.winner === 'defender'">
            {{ fightResult.defName }} wins @
            {{ simResult.exampleFight.ttkDef.toFixed(2) }}s
          </template>
          <template v-else>Draw / Timeout</template>
        </span>
        <span class="ml-auto" style="font-size: 0.7rem; color: #6b7280">{{
          showSimLog ? "▲" : "▼"
        }}</span>
      </div>

      <div v-if="showSimLog" class="sim-log">
        <div
          v-for="(entry, i) in simResult.exampleFight.log"
          :key="i"
          class="sim-log-row"
          :class="entry.isAtk ? 'sim-log-atk' : 'sim-log-def'"
        >
          <span class="sim-log-t">{{ entry.t.toFixed(2) }}s</span>
          <span class="sim-log-actor">{{ entry.isAtk ? "[A]" : "[D]" }}</span>
          <template v-if="entry.missed">
            <span class="sim-log-miss">MISS</span>
          </template>
          <template v-else>
            <span class="sim-log-dmg">{{ Math.round(entry.totalDmg) }}</span>
            <span v-if="entry.isCrit" class="sim-log-tag sim-log-crit"
              >CRIT</span
            >
            <span v-if="entry.isMkbProc" class="sim-log-tag sim-log-mkb"
              >MKB</span
            >
            <span v-if="entry.hasBash" class="sim-log-tag sim-log-bash"
              >BASH</span
            >
            <span v-if="entry.blocked" class="sim-log-tag sim-log-block"
              >BLK</span
            >
            <span class="sim-log-arrow">→</span>
            <span class="sim-log-hp">
              <template v-if="entry.isAtk">
                DEF {{ Math.round(entry.defHP) }}/{{
                  simResult.exampleFight.defMaxHP
                }}
              </template>
              <template v-else>
                ATK {{ Math.round(entry.atkHP) }}/{{
                  simResult.exampleFight.atkMaxHP
                }}
              </template>
            </span>
          </template>
        </div>
        <div
          v-if="simResult.exampleFight.log.length === 0"
          class="text-muted small py-2 text-center"
        >
          No attacks logged.
        </div>
      </div>
    </div>

    <!-- Table controls -->
    <div
      class="d-flex align-items-center px-1 mb-2"
      style="gap: 8px; flex-wrap: wrap"
    >
      <span class="text-white font-weight-bold">Next Item Rankings</span>
      <b-button
        size="sm"
        variant=""
        class="p-0 border-0"
        style="
          line-height: 1;
          font-size: 0.9rem;
          cursor: pointer;
          color: #c084fc;
          background: transparent;
        "
        title="Export rankings as CSV"
        @click="exportCsv"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          style="vertical-align: middle"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </b-button>
      <div class="ml-auto d-flex align-items-center" style="gap: 8px">
        <!-- EHP mode toggle -->
        <div class="btn-group btn-group-sm" style="font-size: 0.7rem">
          <b-button
            size="sm"
            variant=""
            :pressed="ehpMode === 'physical'"
            @click="ehpMode = 'physical'"
            class="ehp-mode-btn"
            :class="{ 'ehp-mode-active': ehpMode === 'physical' }"
          >
            Phys
          </b-button>
          <b-button
            size="sm"
            variant=""
            :pressed="ehpMode === 'magical'"
            @click="ehpMode = 'magical'"
            class="ehp-mode-btn"
            :class="{ 'ehp-mode-active': ehpMode === 'magical' }"
          >
            Magic
          </b-button>
        </div>
        <b-form-input
          v-model="search"
          placeholder="Search items..."
          size="sm"
          style="
            max-width: 180px;
            background: #13102e;
            border-color: #403652;
            color: #d1d5db;
          "
        />
        <b-form-checkbox
          v-model="upgradeMode"
          switch
          class="text-muted small m-0 mr-2"
        >
          Upgrades
        </b-form-checkbox>
        <b-form-checkbox
          v-model="showActives"
          switch
          class="text-muted small m-0"
        >
          Show Active
        </b-form-checkbox>
      </div>
    </div>

    <!-- Results table -->
    <b-table
      :items="displayRows"
      :fields="tableFields"
      :busy="computing"
      dark
      hover
      small
      responsive
      class="dps-table"
      :sort-by="sortBy"
      style="cursor: pointer"
      @row-clicked="onRowClicked"
      :sort-desc="sortDesc"
      @sort-changed="onSortChanged"
    >
      <!-- Loading -->
      <template #table-busy>
        <div class="text-center text-muted py-3">Computing…</div>
      </template>

      <!-- Rank -->
      <template #cell(rank)="{ index }">
        <span class="rank-badge">{{ index + 1 }}</span>
      </template>

      <!-- Item name + icon -->
      <template #cell(dname)="{ item }">
        <div
          class="item-name-cell"
          v-b-tooltip.html.left="{
            title: itemTooltip(item),
            boundary: 'viewport',
          }"
        >
          <img v-if="item.img" :src="item.img" class="item-icon-sm" />
          <span :class="item.key.endsWith('_active') ? 'text-warning' : ''">{{
            item.dname
          }}</span
          ><span v-if="item.isUpgrade" class="text-info ml-1" title="Upgrade"
            >*</span
          >
        </div>
      </template>

      <!-- Cost -->
      <template #cell(cost)="{ item }">
        <span v-if="item.cost === 0" class="text-warning">Free</span>
        <span v-else style="color: #fbb829">{{ fmtGold(item.cost) }}</span>
      </template>

      <!-- DPS Gain -->
      <template #cell(dpsGain)="{ item }">
        <span :class="dpsGainClass(item.dpsGain)">
          {{ item.dpsGain > 0 ? "+" : ""
          }}{{ item.dpsGain != null ? item.dpsGain.toFixed(1) : "0.0" }}
        </span>
      </template>

      <!-- EHP Gain -->
      <template #cell(ehpGainDisplay)="{ item }">
        <span :class="dpsGainClass(item.ehpGainDisplay || 0)">
          {{ item.ehpGainDisplay > 0 ? "+" : ""
          }}{{
            item.ehpGainDisplay != null
              ? Math.round(item.ehpGainDisplay).toLocaleString()
              : "0"
          }}
        </span>
      </template>

      <!-- Chain / Burn / Proc DPS -->
      <template #cell(procGain)="{ item }">
        <span v-if="item.procGain > 0.05" class="text-info"
          >+{{ item.procGain.toFixed(1) }} chain</span
        >
        <span v-else-if="item.burnGain > 0.05" class="text-warning"
          >+{{ item.burnGain.toFixed(1) }} burn</span
        >
        <span v-else-if="item.mkbProcGain > 0.05" class="text-violet"
          >+{{ item.mkbProcGain.toFixed(1) }} proc</span
        >
        <span v-else-if="item.bashProcGain > 0.05" class="text-danger"
          >+{{ item.bashProcGain.toFixed(1) }} bash</span
        >
        <span v-else-if="item.manaBurnGain > 0.05" class="text-teal"
          >+{{ item.manaBurnGain.toFixed(1) }} mana burn</span
        >
        <span v-else class="text-muted">—</span>
      </template>

      <!-- DPS / Gold — color scaled + efficiency bar -->
      <template #cell(dpsPerGold)="{ item }">
        <div style="display: flex; align-items: center; gap: 6px">
          <span
            v-if="item.dpsPerGold === Infinity"
            class="text-warning font-weight-bold"
            >∞</span
          >
          <span
            v-else
            class="dps-per-gold"
            :style="{
              color: efficiencyColor(item.dpsPerGold, efficiencyRange),
            }"
          >
            {{ item.dpsPerGold > 0 ? (item.dpsPerGold * 100).toFixed(2) : "—" }}
          </span>
          <b-progress
            v-if="item.dpsPerGold > 0 && item.dpsPerGold !== Infinity"
            :value="effBarWidth(item.dpsPerGold, efficiencyRange)"
            max="100"
            height="4px"
            class="flex-grow-1"
            style="max-width: 50px; background: #2d2a4a"
            variant="primary"
          ></b-progress>
        </div>
      </template>

      <!-- EHP / Gold — color scaled + efficiency bar -->
      <template #cell(ehpPerGold)="{ item }">
        <div style="display: flex; align-items: center; gap: 6px">
          <span
            class="dps-per-gold"
            :style="{
              color: efficiencyColor(item.ehpPerGold, ehpEfficiencyRange),
            }"
          >
            {{ item.ehpPerGold > 0 ? (item.ehpPerGold * 100).toFixed(2) : "—" }}
          </span>
          <b-progress
            v-if="item.ehpPerGold > 0"
            :value="effBarWidth(item.ehpPerGold, ehpEfficiencyRange)"
            max="100"
            height="4px"
            class="flex-grow-1"
            style="max-width: 50px; background: #2d2a4a"
            variant="primary"
          ></b-progress>
        </div>
      </template>

      <!-- Fight Gain -->
      <template #cell(fightGain)="{ item }">
        <div
          style="
            display: flex;
            align-items: center;
            gap: 4px;
            justify-content: flex-end;
          "
        >
          <span :class="dpsGainClass(item.fightGain || 0)">
            {{ item.fightGain > 0 ? "+" : ""
            }}{{
              item.fightGain != null ? (item.fightGain * 100).toFixed(1) : "0.0"
            }}
          </span>
          <span
            v-if="item.fightOutcome === 'win'"
            title="Attacker wins with this item"
            style="color: #4ade80; font-size: 0.7rem"
            >✓</span
          >
          <span
            v-else-if="item.fightOutcome === 'loss'"
            title="Defender still wins"
            style="color: #ef4444; font-size: 0.7rem"
            >✗</span
          >
        </div>
      </template>

      <!-- Fight / Gold -->
      <template #cell(fightPerGold)="{ item }">
        <div style="display: flex; align-items: center; gap: 6px">
          <span
            class="dps-per-gold"
            :style="{
              color: efficiencyColor(item.fightPerGold, fightEfficiencyRange),
            }"
          >
            {{
              item.fightPerGold > 0 ? (item.fightPerGold * 100).toFixed(2) : "—"
            }}
          </span>
          <b-progress
            v-if="item.fightPerGold > 0"
            :value="effBarWidth(item.fightPerGold, fightEfficiencyRange)"
            max="100"
            height="4px"
            class="flex-grow-1"
            style="max-width: 50px; background: #2d2a4a"
            variant="primary"
          ></b-progress>
        </div>
      </template>

      <!-- Attacker networth -->
      <template #cell(networth)="{ item }">
        <span class="text-muted">{{ fmtGold(item.networth) }}</span>
      </template>
    </b-table>
    <div
      v-if="defenderItemStats.damageBlock"
      class="text-muted mt-1"
      style="font-size: 0.6rem; text-align: right"
    >
      * Damage block reduces DPS but isn't factored into EHP.
    </div>
  </b-container>
</template>

<script>
import HeroPanel from "./HeroPanel.vue";
import itemData from "../../../../data/items.json";
import { getHeroById } from "../../../../services/heroStats.js";
import { getUnitStats, SPECIAL_UNITS_MAP } from "../../../../services/units.js";
import {
  resolveItemStats,
  calcDps,
  calcEhp,
  mergeBonuses,
  calcItemTable,
  armorToPhysMult,
  runFightSimulation,
} from "../../../../services/dpsCalc.js";

function getAttrVal(item, key) {
  const KEY_ALIASES = {
    bonus_str: "bonus_strength",
    strength: "bonus_strength",
    bonus_agi: "bonus_agility",
    agility: "bonus_agility",
    bonus_int: "bonus_intellect",
    bonus_intelligence: "bonus_intellect",
    all_stats: "bonus_all_stats",
    bonus_stats: "bonus_all_stats",
    armor_bonus: "bonus_armor",
    armor: "bonus_armor",
    attack_speed_bonus: "bonus_attack_speed",
    bonus_speed: "bonus_attack_speed",
    damage: "bonus_damage",
    bonus_damage_melee: "bonus_damage",
    evasion: "bonus_evasion",
    lifesteal: "bonus_lifesteal",
    attack_lifesteal: "bonus_lifesteal",
    lifesteal_percent: "bonus_lifesteal",
  };
  const a = (item.attrib || []).find(
    (a) => (KEY_ALIASES[a.key] || a.key) === key,
  );
  return a ? parseFloat(a.value) : null;
}

const EMPTY_ITEMS = [null, null, null, null, null, null];

const FILTERS_KEY = "dps-calc-filters";

function loadFilters() {
  try {
    const raw = localStorage.getItem(FILTERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {};
}

function saveFilters(state) {
  try {
    localStorage.setItem(
      FILTERS_KEY,
      JSON.stringify({
        search: state.search,
        showActives: state.showActives,
        upgradeMode: state.upgradeMode,
        sortBy: state.sortBy,
        sortDesc: state.sortDesc,
        ehpMode: state.ehpMode,
      }),
    );
  } catch {
    /* ignore */
  }
}

function defaultState(heroId = "npc_dota_hero_antimage") {
  return {
    heroId,
    level: 1,
    items: [...EMPTY_ITEMS],
    activeItems: [],
    bonuses: {},
  };
}

export default {
  name: "DpsCalculator",

  components: { HeroPanel },

  data() {
    const saved = loadFilters();
    return {
      attacker: defaultState("npc_dota_hero_antimage"),
      defender: defaultState("npc_dota_hero_axe"),
      tableRows: [],
      computing: false,
      simResult: null,
      simRunning: false,
      showSimLog: true,
      search: saved.search ?? "",
      hideZero: true,
      showActives: saved.showActives ?? false,
      upgradeMode: saved.upgradeMode ?? false,
      sortBy: saved.sortBy ?? "dpsPerGold",
      sortDesc: saved.sortDesc ?? true,
      ehpMode: saved.ehpMode ?? "physical",
      debounceTimer: null,
    };
  },

  computed: {
    attackerHero() {
      return getUnitStats(this.attacker.heroId, this.attacker.level) || {};
    },
    defenderHero() {
      return getUnitStats(this.defender.heroId, this.defender.level) || {};
    },
    attackerItemStats() {
      const base = resolveItemStats(
        this.attacker.items,
        this.attackerHero.primaryAttr,
        this.attacker.activeItems || [],
      );
      return mergeBonuses(base, this.attacker.bonuses);
    },
    defenderItemStats() {
      const base = resolveItemStats(
        this.defender.items,
        this.defenderHero.primaryAttr,
        this.defender.activeItems || [],
      );
      return mergeBonuses(base, this.defender.bonuses);
    },
    currentResult() {
      if (!this.attackerHero.bat) return {};
      const raw = calcDps(
        this.attackerHero,
        this.attackerItemStats,
        this.defenderHero,
        this.defenderItemStats,
      );
      // Towers have reinforced armor — reduce all incoming attack damage
      const reduction = this.defenderHero.damageReduction || 0;
      if (!reduction) return raw;
      return {
        ...raw,
        effectiveDPS: raw.effectiveDPS * (1 - reduction),
        bashProcDPS: raw.bashProcDPS * (1 - reduction),
        manaBurnDPS: raw.manaBurnDPS * (1 - reduction),
      };
    },

    // Defender's DPS against the attacker
    counterResult() {
      if (!this.defenderHero.bat) return {};
      return calcDps(
        this.defenderHero,
        this.defenderItemStats,
        this.attackerHero,
        this.attackerItemStats,
      );
    },

    attackerEhp() {
      if (!this.attackerHero.bat) return {};
      return calcEhp(this.attackerHero, this.attackerItemStats);
    },

    defenderEhp() {
      if (!this.defenderHero.bat) return {};
      return calcEhp(this.defenderHero, this.defenderItemStats);
    },

    /**
     * Shared fight constants: the block/regen adjustments that apply to both
     * fightResult and the per-row fightGain estimates in displayRows.
     * Extracted here so both use identical math.
     */
    fightConstants() {
      const INNATE_MELEE_BLOCK = { chance: 50, melee: 16, ranged: 16 };

      const mergeBlock = (itemBlock, hero) => {
        if (!hero.isMelee || hero.noInnateBlock) return itemBlock;
        if (!itemBlock || !itemBlock.chance) return INNATE_MELEE_BLOCK;
        if (INNATE_MELEE_BLOCK.melee >= (itemBlock.melee || 0))
          return INNATE_MELEE_BLOCK;
        return itemBlock;
      };

      // Returns post-armor blocked DPS:
      // blockChance × blockAmt × enemyAps × enemyHitChance × physMult(defenderArmor)
      const calcBlocked = (
        block,
        hero,
        enemyAps,
        enemyHitChance,
        defenderEffectiveArmor,
      ) => {
        const active = mergeBlock(block, hero);
        if (!active || !active.chance || !active.melee) return 0;
        const amt = hero.isMelee ? active.melee : active.ranged || active.melee;
        return (
          (active.chance / 100) *
          amt *
          enemyAps *
          enemyHitChance *
          armorToPhysMult(defenderEffectiveArmor)
        );
      };

      const atkAps = this.currentResult.aps || 0;
      const defAps = this.counterResult.aps || 0;
      const atkHitChance = 1 - (this.currentResult.missChance || 0);
      const defHitChance = 1 - (this.counterResult.missChance || 0);

      const blockedByDef = calcBlocked(
        this.defenderItemStats.damageBlock,
        this.defenderHero,
        atkAps,
        atkHitChance,
        this.currentResult.effectiveArmor ?? 0,
      );
      const blockedByAtk = calcBlocked(
        this.attackerItemStats.damageBlock,
        this.attackerHero,
        defAps,
        defHitChance,
        this.counterResult.effectiveArmor ?? 0,
      );

      return {
        blockedByDef,
        blockedByAtk,
        atkRegen:
          (this.attackerItemStats.healthRegen || 0) +
          ((this.attackerItemStats.lifesteal || 0) / 100) *
            (this.currentResult.effectiveDPS || 0),
        defRegen:
          (this.defenderItemStats.healthRegen || 0) +
          ((this.defenderItemStats.lifesteal || 0) / 100) *
            (this.counterResult.effectiveDPS || 0),
      };
    },

    fightResult() {
      const atkDPS = this.currentResult.effectiveDPS;
      const defDPS = this.counterResult.effectiveDPS;
      const atkHP = this.attackerEhp.totalHP;
      const defHP = this.defenderEhp.totalHP;
      if (!atkDPS || !defDPS || !atkHP || !defHP) return {};

      const { blockedByDef, blockedByAtk, atkRegen, defRegen } =
        this.fightConstants;

      const effectiveAtkDPS = Math.max(0, atkDPS - blockedByDef - defRegen);
      const effectiveDefDPS = Math.max(0, defDPS - blockedByAtk - atkRegen);

      const ttkAtk = defHP / effectiveAtkDPS;
      const ttkDef = atkHP / effectiveDefDPS;

      const atkName =
        SPECIAL_UNITS_MAP[this.attacker.heroId]?.dname ||
        getHeroById(this.attacker.heroId)?.dname ||
        this.attacker.heroId;
      const defName =
        SPECIAL_UNITS_MAP[this.defender.heroId]?.dname ||
        getHeroById(this.defender.heroId)?.dname ||
        this.defender.heroId;

      const winner = ttkAtk <= ttkDef ? atkName : defName;
      const ratio = ttkAtk <= ttkDef ? ttkDef / ttkAtk : ttkAtk / ttkDef;

      const isMirror = atkName === defName;
      const isDraw = Math.abs(ttkAtk - ttkDef) < 0.01;
      const attackerWins = ttkAtk <= ttkDef;

      return {
        ttkAtk,
        ttkDef,
        atkName,
        defName,
        winner,
        ratio,
        blockedByDef,
        blockedByAtk,
        isMirror,
        isDraw,
        attackerWins,
      };
    },

    // Min/max dpsPerGold for scaling colors (only positive values)
    efficiencyRange() {
      const vals = this.tableRows.map((r) => r.dpsPerGold).filter((v) => v > 0);
      if (!vals.length) return null;
      return { min: Math.min(...vals), max: Math.max(...vals) };
    },

    // Min/max ehpPerGold for scaling colors (only positive values)
    ehpEfficiencyRange() {
      const vals = this.displayRows
        .map((r) => r.ehpPerGold)
        .filter((v) => v > 0);
      if (!vals.length) return null;
      return { min: Math.min(...vals), max: Math.max(...vals) };
    },

    // Min/max fightPerGold for scaling colors (only positive values)
    fightEfficiencyRange() {
      const vals = this.displayRows
        .map((r) => r.fightPerGold)
        .filter((v) => v > 0);
      if (!vals.length) return null;
      return { min: Math.min(...vals), max: Math.max(...vals) };
    },

    displayRows() {
      let rows = this.tableRows;
      // Always hide items with negligible DPS and EHP gain
      rows = rows.filter(
        (r) =>
          r.dpsGain > 0.005 ||
          (r.ehpPhysGain || 0) > 5 ||
          (r.ehpMagGain || 0) > 5 ||
          (r.lifestealGain || 0) > 0,
      );
      // Hide active-item synthetic rows unless toggled on
      if (!this.showActives) {
        rows = rows.filter((r) => !r.key.endsWith("_active"));
      }
      if (this.search) {
        const q = this.search.toLowerCase();
        rows = rows.filter((r) => r.dname.toLowerCase().includes(q));
      }
      // Compute display fields based on ehpMode
      const atkDPS = this.currentResult.effectiveDPS || 0;
      const defDPS = this.counterResult.effectiveDPS || 0;
      const atkHP = this.attackerEhp.totalHP || 0;
      const defHP = this.defenderEhp.totalHP || 0;
      const baseAtkEhpPhys = this.attackerEhp.ehpPhys || 1;

      // Use the same block/regen constants as fightResult so fightGain is consistent.
      const { blockedByDef, blockedByAtk, atkRegen, defRegen } =
        this.fightConstants;

      // Effective DPS values after block and regen (defender-side constants don't change per row).
      // effectiveDefDPS doesn't change per row (defender items are fixed).
      const effectiveDefDPS = Math.max(0, defDPS - blockedByAtk - atkRegen);

      const baseTtkDef =
        effectiveDefDPS > 0 ? atkHP / effectiveDefDPS : Infinity;

      for (const row of rows) {
        const ehpGain =
          this.ehpMode === "magical"
            ? row.ehpMagGain || 0
            : row.ehpPhysGain || 0;
        row.ehpGainDisplay = ehpGain;
        row.ehpPerGold = row.cost > 0 ? ehpGain / row.cost : 0;

        // Fight gain: additive proportional gains in DPS and EHP.
        //
        //   fightGain = ΔDPS / DPS + ΔEHP / EHP
        //
        // Why additive and not multiplicative/log:
        //  • Multiplicative (A × B − 1) introduces a quadratic cross-term that
        //    inflates large all-stats items (Skadi +35 stats) vs small ones
        //    (Crown +4 stats) far beyond their real per-gold advantage.
        //  • Log (ln A + ln B) is concave, so it compresses larger absolute
        //    gains and can rank a cheap small-crit item above a more efficient
        //    large-crit item (e.g. Crystalys > Daedalus despite Daedalus having
        //    more DPS per gold).
        //  • Additive is linear in each dimension independently: twice the
        //    proportional stat gain = twice the F/100g.  For pure DPS items the
        //    ranking collapses to ΔDPS / cost (correct); for pure EHP items to
        //    ΔEHP / cost (correct); for mixed items the two terms add without
        //    a synergy bonus.
        //
        // DPS denominator = raw atkDPS (pre-block, pre-regen).  effectiveAtkDPS
        // can approach zero when block/regen nearly cancels damage output, which
        // would artificially inflate any DPS item's proportional contribution.
        const newAtkEhpPhys = row.statEhpPhys || baseAtkEhpPhys;
        const newAtkDPS = atkDPS + (row.dpsGain || 0);
        const newEffectiveAtkDPS = Math.max(
          0,
          newAtkDPS - blockedByDef - defRegen,
        );
        const dpsPropGain = atkDPS > 0 ? (row.dpsGain || 0) / atkDPS : 0;
        const ehpPropGain =
          baseAtkEhpPhys > 0
            ? (newAtkEhpPhys - baseAtkEhpPhys) / baseAtkEhpPhys
            : 0;
        row.fightGain = dpsPropGain + ehpPropGain;
        row.fightPerGold = row.cost > 0 ? (row.fightGain * 100) / row.cost : 0;

        // Win/loss outcome still uses the TTK ratio for accuracy.
        const newTtkAtk =
          newEffectiveAtkDPS > 0 ? defHP / newEffectiveAtkDPS : Infinity;
        const newTtkDef = (newAtkEhpPhys / baseAtkEhpPhys) * baseTtkDef;
        const newWinRatio =
          newTtkDef > 0 && newTtkAtk < Infinity
            ? newTtkDef / newTtkAtk
            : newTtkDef === Infinity
            ? 0
            : Infinity;
        row.fightOutcome =
          newWinRatio > 1.005 ? "win" : newWinRatio < 0.995 ? "loss" : "draw";
      }
      return rows;
    },

    tableFields() {
      const num = { thClass: "text-right", tdClass: "text-right" };
      return [
        {
          key: "rank",
          label: "#",
          sortable: false,
          thStyle: { width: "40px" },
        },
        { key: "dname", label: "Item", sortable: true },
        { key: "cost", label: "Cost", sortable: true, ...num },
        { key: "dpsGain", label: "DPS Gain", sortable: true, ...num },
        {
          key: "ehpGainDisplay",
          label:
            (this.ehpMode === "magical" ? "Magic EHP Gain" : "EHP Gain") +
            (this.defenderItemStats.damageBlock ? "*" : ""),
          sortable: true,
          ...num,
        },
        { key: "fightGain", label: "Fight Gain", sortable: true, ...num },
        { key: "procGain", label: "Procs", sortable: false },
        { key: "dpsPerGold", label: "DPS/100g", sortable: true, ...num },
        {
          key: "ehpPerGold",
          label: this.defenderItemStats.damageBlock ? "EHP*/100g" : "EHP/100g",
          sortable: true,
          ...num,
        },
        { key: "fightPerGold", label: "F/100g", sortable: true, ...num },
      ];
    },
  },

  watch: {
    attacker: {
      deep: true,
      handler() {
        this.simResult = null;
        this.scheduleRecompute();
      },
    },
    defender: {
      deep: true,
      handler() {
        this.simResult = null;
        this.scheduleRecompute();
      },
    },
    upgradeMode: { handler: "onUpgradeChange" },
    search: "persistFilters",
    showActives: "persistFilters",
    sortBy: "persistFilters",
    sortDesc: "persistFilters",
    ehpMode: "persistFilters",
  },

  mounted() {
    this.recompute();
  },

  methods: {
    scheduleRecompute() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.recompute(), 120);
    },

    async runSimulation() {
      this.simRunning = true;
      await this.$nextTick();
      this.simResult = runFightSimulation(
        this.attackerHero,
        this.attackerItemStats,
        this.defenderHero,
        this.defenderItemStats,
        100,
      );
      this.simRunning = false;
    },

    formatSimLogLine(entry) {
      const notes = [];
      if (entry.isCrit) notes.push("CRIT");
      if (entry.isMkbProc) notes.push("MKB");
      if (entry.hasBash) notes.push("BASH");
      if (entry.blocked) notes.push("BLK");
      return notes;
    },

    persistFilters() {
      saveFilters(this);
    },

    onUpgradeChange() {
      this.persistFilters();
      this.scheduleRecompute();
    },

    recompute() {
      if (!this.attackerHero.bat || !this.defenderHero.bat) return;
      this.computing = true;
      // Push to next tick so the UI updates "Computing…" immediately
      this.$nextTick(() => {
        try {
          this.tableRows = calcItemTable(
            this.attackerHero,
            this.attacker.items,
            this.defenderHero,
            this.defender.items,
            this.attacker.activeItems || [],
            this.upgradeMode,
            this.attacker.bonuses,
          );
        } finally {
          this.computing = false;
        }
      });
    },

    onRowClicked(row) {
      // Active synthetic rows (e.g. armlet_active, mask_of_madness_active)
      if (row.key.endsWith("_active")) {
        const baseKey = row.key.replace(/_active$/, "");
        const items = [...this.attacker.items];
        const active = [...(this.attacker.activeItems || [])];

        // Equip item if not already in a slot
        if (!items.includes(baseKey)) {
          const emptyIdx = items.indexOf(null);
          if (emptyIdx === -1) return; // all slots full
          items[emptyIdx] = baseKey;
        }

        // Add to activeItems if not already active
        if (!active.includes(baseKey)) active.push(baseKey);

        this.attacker = { ...this.attacker, items, activeItems: active };
        return;
      }
      // Upgrade row — replace the component item in-place
      if (row.isUpgrade && row.upgradeFrom) {
        const items = [...this.attacker.items];
        const compIdx = items.indexOf(row.upgradeFrom);
        if (compIdx !== -1) {
          items[compIdx] = row.key;
          this.attacker = { ...this.attacker, items };
          return;
        }
      }
      // Find first empty slot
      const items = [...this.attacker.items];
      const emptyIdx = items.indexOf(null);
      if (emptyIdx === -1) return; // all slots full
      items[emptyIdx] = row.key;
      this.attacker = { ...this.attacker, items };
    },

    onSortChanged({ sortBy, sortDesc }) {
      this.sortBy = sortBy;
      this.sortDesc = sortDesc;
    },

    swapSides() {
      const tmp = { ...this.attacker };
      this.attacker = { ...this.defender };
      this.defender = tmp;
    },

    dpsGainClass(gain) {
      if (gain > 5) return "text-success";
      if (gain > 0) return "text-info";
      return "text-muted";
    },

    efficiencyColor(val, range) {
      if (!range || val <= 0) return "#6b7280";
      const t = Math.max(
        0,
        Math.min(1, (val - range.min) / (range.max - range.min || 1)),
      );
      // Green (high) → Yellow → Red (low)
      if (t > 0.5) {
        const s = (t - 0.5) * 2;
        const r = Math.round(255 * (1 - s));
        return `rgb(${r}, 220, 80)`;
      } else {
        const s = t * 2;
        const g = Math.round(220 * s);
        return `rgb(255, ${g}, 80)`;
      }
    },

    effBarWidth(val, range) {
      if (!range || val <= 0) return 0;
      return Math.max(
        0,
        Math.min(100, ((val - range.min) / (range.max - range.min || 1)) * 100),
      );
    },

    fmtDps(v) {
      return v != null ? Number(v).toFixed(1) : "0.0";
    },
    fmtAps(v) {
      return v != null ? Number(v).toFixed(2) : "0.00";
    },
    fmtIas(v) {
      return v != null ? Math.round(Number(v)) : "0";
    },
    fmtCrit(v) {
      return v != null ? Number(v).toFixed(3) : "1.000";
    },
    fmtPct(v) {
      return v != null ? (Number(v) * 100).toFixed(1) + "%" : "0.0%";
    },
    fmtGold(v) {
      return v != null ? Number(v).toLocaleString() : "0";
    },

    fmtBlock(block, isMelee) {
      if (!block) return "—";
      const amt = isMelee ? block.melee : block.ranged || block.melee;
      return `${block.chance}% × ${amt}`;
    },

    exportCsv() {
      const atkHero = getHeroById(this.attacker.heroId);
      const defHero = getHeroById(this.defender.heroId);
      const atkName = atkHero?.dname || this.attacker.heroId;
      const defName = defHero?.dname || this.defender.heroId;
      const r = this.currentResult;

      const headerRows = [
        `Attacker,${atkName} (lvl ${this.attacker.level})`,
        `Defender,${defName} (lvl ${this.defender.level})`,
        `Current DPS,${(r.effectiveDPS || 0).toFixed(1)}`,
        `APS,${(r.aps || 0).toFixed(2)}`,
        `,`,
        `Item,Key,Cost,DPS Gain,EHP Gain,Fight Gain,Procs,DPS/100g,EHP/100g,F/100g,Attacker NW`,
      ];

      const dataRows = this.displayRows.map((row) => {
        const cost = row.cost === 0 ? "Free" : row.cost;
        const dpsGain = (row.dpsGain || 0).toFixed(1);
        const dpsPerGold =
          row.dpsPerGold === Infinity
            ? "∞"
            : row.dpsPerGold > 0
            ? (row.dpsPerGold * 100).toFixed(2)
            : "—";

        let procStr = "—";
        if (row.procGain > 0.05) procStr = `+${row.procGain.toFixed(1)} chain`;
        else if (row.burnGain > 0.05)
          procStr = `+${row.burnGain.toFixed(1)} burn`;
        else if (row.mkbProcGain > 0.05)
          procStr = `+${row.mkbProcGain.toFixed(1)} mkb`;
        else if (row.bashProcGain > 0.05)
          procStr = `+${row.bashProcGain.toFixed(1)} bash`;
        else if (row.manaBurnGain > 0.05)
          procStr = `+${row.manaBurnGain.toFixed(1)} mana burn`;

        const nw =
          row.networth != null ? Number(row.networth).toLocaleString() : "—";
        // Escape commas in dname
        const suffix = row.isUpgrade ? " *" : "";
        const name = (row.dname + suffix).includes(",")
          ? `"${row.dname}${suffix}"`
          : row.dname + suffix;
        const itemKey = row.key || "";
        const ehpGain =
          row.ehpGainDisplay != null ? Math.round(row.ehpGainDisplay) : "—";
        const fightGain =
          row.fightGain != null ? (row.fightGain * 100).toFixed(1) : "—";
        const ehpGold =
          row.ehpPerGold > 0 ? (row.ehpPerGold * 100).toFixed(2) : "—";
        const fightGold =
          row.fightPerGold > 0 ? (row.fightPerGold * 100).toFixed(2) : "—";
        return `${name},${itemKey},${cost},${dpsGain},${ehpGain},${fightGain},${procStr},${dpsPerGold},${ehpGold},${fightGold},${nw}`;
      });

      const csv = [...headerRows, ...dataRows].join("\r\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dps-export-${this.attacker.heroId}-vs-${this.defender.heroId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    itemTooltip(row) {
      const itemKey = row.key.replace(/_active$/, "");
      const item = itemData[itemKey];
      if (!item) return "";
      const isActive =
        row.key.endsWith("_active") ||
        (this.attacker.activeItems || []).includes(itemKey);
      const primaryAttr = this.attackerHero?.primaryAttr || "agility";
      const isMelee = this.attackerHero?.isMelee !== false;
      const f1 = (v) => Number(v).toFixed(1);
      const g = (k) => getAttrVal(item, k);

      const lines = [
        `<div style='font-size:0.8rem;line-height:1.7;min-width:220px;text-align:left;padding:6px'>`,
        `<div style='display:flex;justify-content:space-between;align-items:baseline;font-size:0.88rem'>` +
          `<b>${item.dname}${
            isActive ? " <span style='color:#f59e0b'>(Active)</span>" : ""
          }</b>` +
          `<span style='color:#daa520'>${item.cost}g</span>` +
          `</div><br>`,
      ];

      // Active bonuses for Armlet
      if (isActive && itemKey === "armlet") {
        const unholyDmg = g("unholy_bonus_damage");
        const unholyStr = g("unholy_bonus_strength");
        const unholyArmor = g("unholy_bonus_armor");
        if (unholyDmg)
          lines.push(
            `<span style='color:#f59e0b'>Active ATK DMG</span> <b>+${unholyDmg}</b><br>`,
          );
        if (unholyStr)
          lines.push(
            `<span style='color:#f59e0b'>Active STR</span> <b>+${unholyStr}</b><br>`,
          );
        if (unholyArmor)
          lines.push(
            `<span style='color:#f59e0b'>Active Armor</span> <b>+${unholyArmor}</b><br>`,
          );
      }

      // Active bonuses for Mask of Madness
      if (isActive && itemKey === "mask_of_madness") {
        const berserkIAS = g("berserk_bonus_attack_speed");
        const berserkArmor = g("berserk_armor_reduction");
        if (berserkIAS)
          lines.push(
            `<span style='color:#f59e0b'>Active ATK SPEED</span> <b>+${berserkIAS}</b><br>`,
          );
        if (berserkArmor)
          lines.push(
            `<span style='color:#f59e0b'>Active Armor</span> <b>-${berserkArmor}</b><br>`,
          );
      }

      // Flat damage (direct + attr-scaled)
      let dmg = g("bonus_damage") || 0;
      const str = g("bonus_strength") || g("bonus_all_stats") || 0;
      const agi = g("bonus_agility") || g("bonus_all_stats") || 0;
      const intl = g("bonus_intellect") || g("bonus_all_stats") || 0;
      const scale = primaryAttr === "universal" ? 0.7 : 1.0;
      if (primaryAttr === "strength") dmg += str * scale;
      else if (primaryAttr === "agility") dmg += agi * scale;
      else if (primaryAttr === "intellect") dmg += intl * scale;
      else dmg += (str + agi + intl) * scale;
      const ias = (g("bonus_attack_speed") || 0) + (agi || 0);
      const armor = (g("bonus_armor") || 0) + (agi || 0) / 6;
      const bonusHp =
        (g("bonus_health") || g("bonus_hp") || 0) + (str || 0) * 22;

      if (dmg)
        lines.push(
          `<span style='color:#9ca3af'>ATK DMG</span> <b>+${f1(dmg)}</b><br>`,
        );
      if (ias)
        lines.push(
          `<span style='color:#9ca3af'>ATK SPEED</span> <b>+${Math.round(
            ias,
          )}</b><br>`,
        );
      if (armor)
        lines.push(
          `<span style='color:#9ca3af'>ARMOR</span> <b style='color:#f59e0b'>+${f1(
            armor,
          )}</b><br>`,
        );
      if (bonusHp)
        lines.push(
          `<span style='color:#9ca3af'>HP</span> <b style='color:#4ade80'>+${Math.round(
            bonusHp,
          )}</b><br>`,
        );

      // Crit
      const critChance = g("crit_chance");
      const critMult = g("crit_multiplier");
      if (critChance)
        lines.push(
          `<span style='color:#fde68a'>Crit</span> ${critChance}% × ${
            critMult || 200
          }%<br>`,
        );

      // Chain
      const chainChance = g("chain_chance");
      const chainDmg = g("chain_damage");
      if (chainChance)
        lines.push(
          `<span style='color:#67e8f9'>Chain</span> ${chainChance}% × <b>${chainDmg}</b> dmg<br>`,
        );

      // MKB
      const mkbChance = g("bonus_chance");
      const mkbDmg = g("bonus_chance_damage");
      if (mkbChance)
        lines.push(
          `<span style='color:#c084fc'>MKB proc</span> ${mkbChance}% × <b>${mkbDmg}</b> dmg<br>`,
        );

      // Bash
      const bashChanceM = g("bash_chance_melee");
      const bashChanceR = g("bash_chance_ranged");
      const bashDmg = g("bonus_chance_damage");
      if (bashChanceM != null) {
        const bc = isMelee ? bashChanceM : bashChanceR ?? bashChanceM;
        lines.push(
          `<span style='color:#c084fc'>Bash</span> ${bc}% × <b>${bashDmg}</b> dmg<br>`,
        );
      }

      // Mana burn
      const manaBurn = g("feedback_mana_burn");
      const dmgPerBurn = g("damage_per_burn") ?? 1;
      if (manaBurn)
        lines.push(
          `<span style='color:#2dd4bf'>Mana burn</span> <b>${f1(
            manaBurn * dmgPerBurn,
          )}</b>/hit<br>`,
        );

      // DPS / EHP gain section
      lines.push(`<hr style='border-color:#374151;margin:4px 0'>`);
      const gainCol = row.dpsGain > 0 ? "#4ade80" : "#9ca3af";
      lines.push(
        `<span style='color:#9ca3af'>DPS gain</span> <span style='color:${gainCol}'><b>${
          row.dpsGain > 0 ? "+" : ""
        }${Number(row.dpsGain).toFixed(1)}</b></span>` +
          `<br><span style='color:#9ca3af'>EHP gain</span> <b>${
            row.ehpGainDisplay > 0 ? "+" : ""
          }${Math.round(row.ehpGainDisplay || 0).toLocaleString()}</b>`,
      );

      lines.push(`</div>`);
      return lines.join("");
    },
  },
};
</script>

<style scoped>
.dps-calculator {
  background: #0d0b1e;
  min-height: 100vh;
  color: #e5e7eb;
}

.page-title {
  color: #a78bfa;
  font-size: 1.8rem;
  font-weight: bold;
}

/* Center DPS panel */
.dps-display {
  background: #1a1640;
  border: 1px solid #403652;
  border-radius: 8px;
  padding: 16px 20px;
  text-align: center;
  min-width: 150px;
}

.dps-label {
  color: #9ca3af;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.dps-value {
  color: #a78bfa;
  font-size: 2.2rem;
  font-weight: bold;
  font-family: monospace;
  line-height: 1.1;
}

.dps-sub {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
  margin-bottom: 8px;
}

.dps-proc {
  color: #93c5fd;
  font-size: 0.75rem;
}

.dps-detail-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.78rem;
  border-top: 1px solid #2d2a4a;
  padding-top: 4px;
  margin-top: 4px;
}

.dps-detail-label {
  color: #6b7280;
}

.dps-detail-val {
  color: #d1d5db;
  font-family: monospace;
}

/* Table */
.dps-table {
  background: #13102e;
  border: 1px solid #403652;
  border-radius: 4px;
  font-size: 0.85rem;
}

.item-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-icon-sm {
  width: 44px;
  height: 32px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
}

.rank-badge {
  color: #6b7280;
  font-family: monospace;
  font-size: 0.75rem;
}

.dps-per-gold {
  font-family: monospace;
  font-weight: bold;
}

.text-violet {
  color: #c084fc;
}

.text-teal {
  color: #2dd4bf;
}

/* Keep checkbox switches and labels on one line */
.custom-switch {
  display: inline-flex !important;
  align-items: center !important;
  white-space: nowrap !important;
}
.custom-switch .custom-control-label {
  white-space: nowrap !important;
  display: inline !important;
}

/* EHP mode toggle buttons */
.ehp-mode-btn {
  padding: 1px 6px !important;
  background: transparent !important;
  border: 1px solid #403652 !important;
  color: #9ca3af !important;
  font-size: 0.7rem !important;
  line-height: 1.4 !important;
}
.ehp-mode-btn.ehp-mode-active {
  background: #403652 !important;
  color: #e5e7eb !important;
}
.ehp-mode-btn:hover {
  border-color: #7c3aed !important;
}

/* Swap button */
.swap-btn {
  font-size: 0.75rem !important;
  padding: 4px 12px !important;
  background: transparent !important;
  border: 1px solid #403652 !important;
  color: #a78bfa !important;
  cursor: pointer !important;
}
.swap-btn:hover {
  border-color: #7c3aed !important;
  color: #c084fc !important;
}

/* Simulate button */
.sim-btn {
  font-size: 0.8rem !important;
  padding: 4px 18px !important;
  background: transparent !important;
  border: 1px solid #4c1d95 !important;
  color: #a78bfa !important;
}
.sim-btn:hover:not(:disabled) {
  border-color: #7c3aed !important;
  background: #2d1a5a !important;
}
.sim-btn:disabled {
  opacity: 0.45 !important;
}

/* Simulation results box */
.sim-results {
  background: #1a1640;
  border: 1px solid #403652;
  border-radius: 8px;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
}
.sim-results-header {
  background: #2d2a4a;
  padding: 8px 16px;
  font-size: 0.85rem;
  font-weight: bold;
  color: #a78bfa;
}
.sim-summary-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 8px;
  border-bottom: 1px solid #2d2a4a;
}
.sim-stat {
  min-width: 130px;
  flex: 1;
  padding: 4px 10px;
}
.sim-stat-label {
  color: #6b7280;
  font-size: 0.67rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.sim-stat-value {
  font-size: 0.92rem;
  font-weight: bold;
  font-family: monospace;
}
.sim-stat-pct {
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: normal;
}
.sim-log-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #9ca3af;
  border-bottom: 1px solid #2d2a4a;
  user-select: none;
}
.sim-log-header:hover {
  background: #2d2a4a;
}
.sim-log {
  max-height: 300px;
  overflow-y: auto;
  padding: 2px 0;
  font-family: monospace;
  font-size: 0.78rem;
}
.sim-log-row {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 1px 16px;
  line-height: 1.65;
}
.sim-log-row:hover {
  background: rgba(45, 42, 74, 0.35);
}
.sim-log-atk {
  color: #93c5fd;
}
.sim-log-def {
  color: #fca5a5;
}
.sim-log-t {
  color: #4b5563;
  min-width: 44px;
}
.sim-log-actor {
  font-weight: bold;
  min-width: 26px;
}
.sim-log-dmg {
  min-width: 44px;
  text-align: right;
}
.sim-log-miss {
  color: #6b7280;
  font-style: italic;
}
.sim-log-tag {
  font-size: 0.66rem;
  padding: 0 3px;
  border-radius: 2px;
}
.sim-log-crit {
  background: #7c2d12;
  color: #fbbf24;
}
.sim-log-mkb {
  background: #4c1d95;
  color: #c084fc;
}
.sim-log-bash {
  background: #4a1942;
  color: #e879f9;
}
.sim-log-block {
  background: #1e3a5f;
  color: #93c5fd;
}
.sim-log-arrow {
  color: #374151;
}
.sim-log-hp {
  color: #9ca3af;
}

/* Right padding for numeric cells */
.dps-table td.text-right {
  padding-right: 4px !important;
}
</style>
