<template>
  <b-container fluid>
    <b-tabs
      v-model="activeTab"
      nav-class="border-bottom-0"
      active-nav-item-class="text-white font-weight-bold"
      nav-item-class="text-muted"
      content-class="pt-3"
    >
      <b-tab title="Efficiency">
        <div class="text-center mt-4">
          <h1 class="page-title">Item Efficiency</h1>
          <p class="text-muted">
            Comparing Gold Efficiency (Stats per Gold) vs. Slot Density (Total
            Stat Value).
          </p>
        </div>

        <!-- Filters: left-aligned, labels above each control -->
        <div
          class="d-flex flex-wrap align-items-flex-end px-3 mb-3"
          style="gap: 16px"
        >
          <div>
            <label for="stat-filter" class="text-white d-block small mb-1"
              >Filter by Stat</label
            >
            <b-form-select
              id="stat-filter"
              v-model="selectedStatFilter"
              :options="statOptions"
              @change="prepareChartData"
              style="min-width: 200px"
            ></b-form-select>
          </div>
          <div
            style="display: flex; align-items: flex-end; padding-bottom: 6px"
          >
            <b-form-checkbox
              id="convert-bonuses"
              v-model="convertToHeroBonuses"
              switch
              class="text-white mb-0"
            >
              Convert to Hero Bonuses
            </b-form-checkbox>
          </div>
          <div v-if="convertToHeroBonuses">
            <label for="primary-attr" class="text-white d-block small mb-1"
              >Primary Attribute</label
            >
            <b-form-select
              id="primary-attr"
              v-model="primaryAttribute"
              :options="primaryAttributeOptions"
              style="min-width: 160px"
            ></b-form-select>
          </div>
        </div>

        <!-- Stat Gold Values (collapsible) -->
        <b-row class="mt-2 px-3">
          <b-col md="12">
            <div
              class="d-flex align-items-center clickable-row py-2 px-3 mb-1"
              style="
                background-color: #1a1640;
                border: 1px solid #403652;
                border-radius: 4px;
                user-select: none;
              "
              @click="statValuesOpen = !statValuesOpen"
            >
              <span class="text-white font-weight-bold mr-2"
                >Stat Gold Values</span
              >
              <span class="text-muted small mr-auto"
                >Customize the gold value per point of each stat</span
              >
              <span class="text-white">{{ statValuesOpen ? "▲" : "▼" }}</span>
            </div>
            <b-collapse v-model="statValuesOpen">
              <div
                style="
                  background-color: #13102e;
                  border: 1px solid #403652;
                  border-top: none;
                  border-radius: 0 0 4px 4px;
                  padding: 16px;
                "
              >
                <div class="d-flex flex-wrap" style="gap: 12px">
                  <div
                    v-for="(defaultVal, stat) in baseStatValues"
                    :key="stat"
                    style="min-width: 160px; flex: 1"
                  >
                    <label class="text-muted small mb-1 d-block">
                      {{ statLabel(stat) }}
                      <span class="text-muted" style="font-size: 0.75em"
                        >(default: {{ defaultVal }})</span
                      >
                    </label>
                    <div class="d-flex align-items-center" style="gap: 4px">
                      <b-form-input
                        :value="
                          customStatValues[stat] !== undefined
                            ? customStatValues[stat]
                            : defaultVal
                        "
                        type="number"
                        min="0"
                        size="sm"
                        style="
                          width: 90px;
                          background: #1a1640;
                          color: #fff;
                          border-color: #403652;
                        "
                        :style="{
                          borderColor:
                            customStatValues[stat] !== undefined
                              ? '#42b983'
                              : '#403652',
                        }"
                        @input="setStatValue(stat, $event)"
                      />
                      <b-button
                        v-if="customStatValues[stat] !== undefined"
                        size="sm"
                        variant="link"
                        class="text-muted p-0"
                        title="Reset to default"
                        @click.stop="resetStatValue(stat)"
                        >✕</b-button
                      >
                    </div>
                  </div>
                </div>
                <div class="mt-3">
                  <b-button
                    size="sm"
                    variant="outline-danger"
                    @click="resetAllStatValues"
                    >Reset All to Defaults</b-button
                  >
                </div>
              </div>
            </b-collapse>
          </b-col>
        </b-row>

        <!-- Chart -->
        <b-row class="mt-2">
          <b-col md="12">
            <b-card style="background-color: #13102e; border-color: #403652">
              <div style="height: 700px; position: relative">
                <Scatter
                  v-if="chartData"
                  ref="scatter"
                  :options="chartOptions"
                  :data="chartData"
                  :key="chartKey"
                />
              </div>
            </b-card>
          </b-col>
        </b-row>

        <!-- Table -->
        <b-row class="mt-4">
          <b-col md="12">
            <b-card
              style="background-color: #13102e; border-color: #403652"
              title="Item Efficiency Table"
              class="text-white"
            >
              <b-table
                striped
                hover
                :items="filteredItems"
                :fields="tableFields"
                sort-by="displayEfficiency"
                :sort-desc="true"
                :tbody-tr-class="rowClass"
                @row-clicked="toggleDetails"
              >
                <template #cell(img)="data">
                  <img
                    v-b-tooltip.hover.html
                    :title="getItemStatsTooltip(data.item)"
                    :src="data.value"
                    :alt="data.item.name"
                    style="width: 40px; height: auto; cursor: help"
                  />
                </template>
                <template #cell(displayEfficiency)="data">
                  <span :style="{ color: efficiencyColor(data.value) }">
                    {{ (data.value * 100).toFixed(1) }}%
                  </span>
                </template>
                <template #cell(displayStatValue)="data">
                  {{ data.value.toFixed(0) }}g
                </template>
                <template #cell(recipeValue)="data">
                  {{ data.value.toFixed(0) }}g
                </template>
                <template #row-details="{ item }">
                  <div
                    class="p-3"
                    style="
                      background-color: #1a1640;
                      border-top: 1px solid #403652;
                    "
                  >
                    <div class="d-flex" style="gap: 32px; flex-wrap: wrap">
                      <!-- Stat breakdown table -->
                      <div style="flex: 1; min-width: 360px">
                        <h6 class="text-white mb-2">Stat Breakdown</h6>
                        <table
                          style="
                            width: 100%;
                            font-size: 0.85rem;
                            border-collapse: collapse;
                          "
                        >
                          <thead>
                            <tr
                              style="
                                color: #aaa;
                                border-bottom: 1px solid #403652;
                              "
                            >
                              <th style="padding: 4px 8px; text-align: left">
                                Stat
                              </th>
                              <th style="padding: 4px 8px; text-align: right">
                                Amount
                              </th>
                              <th style="padding: 4px 8px; text-align: right">
                                Unit Value
                              </th>
                              <th style="padding: 4px 8px; text-align: right">
                                Gold Value
                              </th>
                              <th style="padding: 4px 8px; text-align: right">
                                % of Total
                              </th>
                              <th style="padding: 4px 8px"></th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="row in getStatBreakdown(item).rows"
                              :key="row.stat"
                              style="border-bottom: 1px solid #2a2450"
                            >
                              <td style="padding: 4px 8px; color: #ccc">
                                {{ row.label }}
                              </td>
                              <td
                                style="
                                  padding: 4px 8px;
                                  text-align: right;
                                  color: #fff;
                                "
                              >
                                {{ row.amountDisplay }}
                              </td>
                              <td
                                style="
                                  padding: 4px 8px;
                                  text-align: right;
                                  color: #aaa;
                                "
                              >
                                {{ row.unitValue }}g
                              </td>
                              <td
                                style="
                                  padding: 4px 8px;
                                  text-align: right;
                                  color: #fff;
                                "
                              >
                                {{ row.goldValue.toFixed(0) }}g
                              </td>
                              <td
                                style="
                                  padding: 4px 8px;
                                  text-align: right;
                                  color: #aaa;
                                "
                              >
                                {{ row.pct.toFixed(1) }}%
                              </td>
                              <td style="padding: 4px 8px; width: 80px">
                                <div
                                  style="
                                    background: #2a2450;
                                    border-radius: 3px;
                                    height: 6px;
                                  "
                                >
                                  <div
                                    :style="{
                                      width: row.pct + '%',
                                      background: '#42b983',
                                      height: '100%',
                                      borderRadius: '3px',
                                    }"
                                  ></div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                          <tfoot>
                            <tr
                              style="
                                border-top: 2px solid #403652;
                                font-weight: bold;
                              "
                            >
                              <td
                                style="padding: 6px 8px; color: #fff"
                                colspan="3"
                              >
                                Total Stat Value
                              </td>
                              <td
                                style="
                                  padding: 6px 8px;
                                  text-align: right;
                                  color: #fff;
                                "
                              >
                                {{
                                  getStatBreakdown(item).totalStatValue.toFixed(
                                    0,
                                  )
                                }}g
                              </td>
                              <td colspan="2"></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>

                      <!-- Summary panel -->
                      <div style="min-width: 200px">
                        <h6 class="text-white mb-2">Efficiency Summary</h6>
                        <table
                          style="
                            font-size: 0.85rem;
                            border-collapse: collapse;
                            width: 100%;
                          "
                        >
                          <tbody>
                            <tr>
                              <td style="padding: 4px 8px; color: #aaa">
                                Item Cost
                              </td>
                              <td
                                style="
                                  padding: 4px 8px;
                                  color: #fff;
                                  text-align: right;
                                "
                              >
                                {{ item.cost }}g
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 8px; color: #aaa">
                                Stat Value
                              </td>
                              <td
                                style="
                                  padding: 4px 8px;
                                  color: #fff;
                                  text-align: right;
                                "
                              >
                                {{
                                  getStatBreakdown(item).totalStatValue.toFixed(
                                    0,
                                  )
                                }}g
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 8px; color: #aaa">
                                Gold Efficiency
                              </td>
                              <td
                                style="padding: 4px 8px; text-align: right"
                                :style="{
                                  color: efficiencyColor(
                                    item.displayEfficiency,
                                  ),
                                }"
                              >
                                {{ (item.displayEfficiency * 100).toFixed(1) }}%
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 4px 8px; color: #aaa">
                                Recipe Value
                              </td>
                              <td
                                style="padding: 4px 8px; text-align: right"
                                :style="{
                                  color:
                                    item.recipeValue > 0
                                      ? '#f0a500'
                                      : '#42b983',
                                }"
                              >
                                {{ item.recipeValue > 0 ? "+" : ""
                                }}{{ item.recipeValue.toFixed(0) }}g
                              </td>
                            </tr>
                            <tr style="border-top: 1px solid #403652">
                              <td style="padding: 6px 8px; color: #aaa">
                                Rank
                              </td>
                              <td
                                style="
                                  padding: 6px 8px;
                                  color: #fff;
                                  text-align: right;
                                "
                              >
                                #{{ getStatBreakdown(item).rank }} of
                                {{ filteredItems.length }}
                                <span style="color: #aaa; font-size: 0.8em"
                                  >(top
                                  {{
                                    getStatBreakdown(item).percentile
                                  }}%)</span
                                >
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </template>
              </b-table>
            </b-card>
          </b-col>
        </b-row>
      </b-tab>

      <b-tab title="Stat Analysis" lazy>
        <StatAnalysis
          :custom-stat-values="customStatValues"
          :base-stat-values="baseStatValues"
          @applied="onDerivedApplied"
        />
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import { Scatter } from "vue-chartjs";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  getAllItemsAnalysis,
  BASE_VALUES,
  expandItemStats,
} from "../../../../services/itemStats";
import StatAnalysis from "./StatAnalysis.vue";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, zoomPlugin);

export default {
  name: "ItemEfficiency",
  components: { Scatter, StatAnalysis },
  data() {
    const savedValues = (() => {
      try {
        return JSON.parse(
          localStorage.getItem("itemEfficiency_statValues") || "{}",
        );
      } catch {
        return {};
      }
    })();
    return {
      activeTab: 0,
      allItems: [],
      chartData: null,
      chartKey: 0,
      statValuesOpen: false,
      customStatValues: savedValues,
      convertToHeroBonuses: false,
      primaryAttribute: "strength",
      primaryAttributeOptions: [
        { value: "strength", text: "Strength" },
        { value: "agility", text: "Agility" },
        { value: "intellect", text: "Intelligence" },
        { value: "universal", text: "Universal" },
      ],
      selectedStatFilter: null,
      tableFields: [
        { key: "img", label: "Item" },
        { key: "name", label: "Name", sortable: true },
        { key: "cost", label: "Cost", sortable: true },
        { key: "displayEfficiency", label: "Efficiency %", sortable: true },
        { key: "displayStatValue", label: "Stat Value", sortable: true },
        { key: "recipeValue", label: "Recipe Value", sortable: true },
      ],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          zoom: {
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: "xy",
            },
            pan: {
              enabled: true,
              mode: "xy",
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const dataPoint = context.raw;
                let label = dataPoint.item.name || "";
                label += ` (Cost: ${dataPoint.item.cost}g)`;
                return label;
              },
              afterLabel: (context) => {
                const dataPoint = context.raw;
                const item = dataPoint.item;
                const lines = [
                  `Stat Efficiency: ${dataPoint.x.toFixed(4)}`,
                  `Stat Gold Value: ${(item.displayStatValue || 0).toFixed(
                    0,
                  )}g`,
                  `Total Slot Value: ${dataPoint.y.toFixed(0)}g`,
                  `Implied Recipe Value: ${item.recipeValue.toFixed(0)}g`,
                ];
                if (item.expandedStats) {
                  lines.push("— Effective Stats —");
                  lines.push(...this.formatExpandedStats(item.expandedStats));
                }
                return lines;
              },
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#ccc",
            },
            title: {
              display: true,
              text: "Stat Efficiency (Stat Gold Value / Item Cost)",
              color: "#fff",
              font: {
                size: 14,
              },
            },
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#ccc",
            },
            title: {
              display: true,
              text: "Slot Density (Total Stat Value in Gold)",
              color: "#fff",
              font: {
                size: 14,
              },
            },
          },
        },
      },
    };
  },
  computed: {
    statValues() {
      const merged = { ...BASE_VALUES };
      for (const key in this.customStatValues) {
        const v = parseFloat(this.customStatValues[key]);
        if (!isNaN(v) && v >= 0) merged[key] = v;
      }
      return merged;
    },
    baseStatValues() {
      return BASE_VALUES;
    },
    efficiencyRange() {
      if (!this.selectedStatFilter) return null;
      const vals = this.filteredItems.map((i) => i.displayEfficiency);
      return { min: Math.min(...vals), max: Math.max(...vals) };
    },
    statOptions() {
      const heroAttrStats = [
        "bonus_strength",
        "bonus_agility",
        "bonus_intellect",
      ];
      const options = [{ value: null, text: "All Items" }];
      for (const key in BASE_VALUES) {
        if (this.convertToHeroBonuses && heroAttrStats.includes(key)) continue;
        options.push({
          value: key,
          text: key.replace("bonus_", "").replace(/_/g, " ").toUpperCase(),
        });
      }
      return options;
    },
    filteredItems() {
      const stat = this.selectedStatFilter;
      const sv = this.statValues;

      // Build a key→item map for recomputing recipe values
      const byKey = {};
      this.allItems.forEach((i) => {
        byKey[i.key] = i;
      });

      const computeStatValue = (statsProvided) =>
        Object.entries(statsProvided).reduce(
          (sum, [k, v]) => sum + (sv[k] || 0) * Math.abs(v),
          0,
        );

      const baseList = stat
        ? this.allItems.filter((item) => {
            if (!item.statsProvided) return false;
            if (this.convertToHeroBonuses) {
              const expanded = expandItemStats(
                item.statsProvided,
                this.primaryAttribute,
              );
              return expanded[stat] !== undefined && expanded[stat] > 0;
            }
            return item.statsProvided[stat] !== undefined;
          })
        : this.allItems;

      return baseList.map((item) => {
        let displayStatValue, displayEfficiency, expandedStats;

        expandedStats = this.convertToHeroBonuses
          ? expandItemStats(item.statsProvided, this.primaryAttribute)
          : item.statsProvided;

        if (stat) {
          if (this.convertToHeroBonuses) {
            // Use the expanded amount of just the filtered stat
            const statAmount = expandedStats[stat] || 0;
            displayStatValue = statAmount * (sv[stat] || 0);
          } else {
            displayStatValue = Math.abs(item.statsProvided[stat]);
          }
          displayEfficiency = item.cost > 0 ? displayStatValue / item.cost : 0;
        } else if (this.convertToHeroBonuses) {
          displayStatValue = Object.entries(expandedStats).reduce(
            (sum, [k, v]) => sum + (sv[k] || 0) * v,
            0,
          );
          displayEfficiency = item.cost > 0 ? displayStatValue / item.cost : 0;
        } else {
          displayStatValue = computeStatValue(item.statsProvided);
          displayEfficiency = item.cost > 0 ? displayStatValue / item.cost : 0;
        }

        // Recompute recipe value using current stat weights
        let recipeValue = 0;
        if (item.components && item.components.length > 0) {
          const compStatValue = item.components.reduce((sum, compKey) => {
            const comp = byKey[compKey];
            return comp ? sum + computeStatValue(comp.statsProvided) : sum;
          }, 0);
          recipeValue = displayStatValue - compStatValue;
        }

        return {
          ...item,
          displayStatValue,
          displayEfficiency,
          expandedStats,
          recipeValue,
        };
      });
    },
  },
  watch: {
    customStatValues: {
      deep: true,
      handler(val) {
        localStorage.setItem("itemEfficiency_statValues", JSON.stringify(val));
        this.prepareChartData();
      },
    },
    convertToHeroBonuses(val) {
      const heroAttrStats = [
        "bonus_strength",
        "bonus_agility",
        "bonus_intellect",
      ];
      if (val && heroAttrStats.includes(this.selectedStatFilter)) {
        this.selectedStatFilter = null;
      }
      this.prepareChartData();
    },
    primaryAttribute() {
      this.prepareChartData();
    },
  },
  mounted() {
    this.allItems = getAllItemsAnalysis();
    this.prepareChartData();
  },
  methods: {
    statLabel(stat) {
      const LABELS = {
        bonus_strength: "Strength",
        bonus_agility: "Agility",
        bonus_intellect: "Intelligence",
        bonus_damage: "Damage",
        bonus_attack_speed: "Attack Speed",
        bonus_armor: "Armor",
        bonus_health: "Health",
        bonus_mana: "Mana",
        bonus_movement: "Move Speed",
        bonus_mana_regen: "Mana Regen",
        bonus_health_regen: "HP Regen",
        bonus_evasion: "Evasion %",
        bonus_lifesteal: "Lifesteal %",
        bonus_spell_amp: "Spell Amp %",
        corruption_armor: "Armor Corruption",
      };
      return LABELS[stat] || stat.replace("bonus_", "").replace(/_/g, " ");
    },
    setStatValue(stat, val) {
      const n = parseFloat(val);
      if (!isNaN(n) && n >= 0) {
        this.$set(this.customStatValues, stat, n);
      }
    },
    resetStatValue(stat) {
      this.$delete(this.customStatValues, stat);
    },
    resetAllStatValues() {
      this.customStatValues = {};
    },
    rowClass(item) {
      if (!item) return "";
      return item._showDetails ? "row-expanded" : "clickable-row";
    },
    toggleDetails(item) {
      this.$set(item, "_showDetails", !item._showDetails);
    },
    efficiencyColor(efficiency) {
      if (this.efficiencyRange) {
        const { min, max } = this.efficiencyRange;
        if (max === min) return "#8edc9a";
        const t = (efficiency - min) / (max - min);
        if (t >= 0.75) return "#42b983";
        if (t >= 0.5) return "#8edc9a";
        if (t >= 0.25) return "#f0a500";
        return "#e05252";
      }
      // Absolute thresholds for unfiltered view
      if (efficiency >= 1.0) return "#42b983";
      if (efficiency >= 0.8) return "#8edc9a";
      if (efficiency >= 0.6) return "#f0a500";
      return "#e05252";
    },
    getStatBreakdown(item) {
      const stats = item.expandedStats || item.statsProvided || {};
      const totalStatValue = item.displayStatValue;

      const STAT_LABELS = {
        bonus_health: { label: "Health", decimals: 0 },
        bonus_health_regen: { label: "HP Regen", decimals: 2 },
        bonus_mana: { label: "Mana", decimals: 0 },
        bonus_mana_regen: { label: "Mana Regen", decimals: 2 },
        bonus_armor: { label: "Armor", decimals: 2 },
        bonus_attack_speed: { label: "Attack Speed", decimals: 0 },
        bonus_damage: { label: "Damage", decimals: 2 },
        bonus_strength: { label: "Strength", decimals: 0 },
        bonus_agility: { label: "Agility", decimals: 0 },
        bonus_intellect: { label: "Intelligence", decimals: 0 },
        bonus_movement: { label: "Move Speed", decimals: 0 },
        bonus_evasion: { label: "Evasion %", decimals: 1 },
        bonus_lifesteal: { label: "Lifesteal %", decimals: 1 },
        bonus_spell_amp: { label: "Spell Amp %", decimals: 1 },
        corruption_armor: { label: "Armor Corruption", decimals: 0 },
      };

      const rows = Object.entries(stats)
        .filter(([stat, v]) => v > 0 && this.statValues[stat] !== undefined)
        .map(([stat, amount]) => {
          const unitValue = this.statValues[stat] || 0;
          const goldValue = amount * unitValue;
          const pct =
            totalStatValue > 0 ? (goldValue / totalStatValue) * 100 : 0;
          const meta = STAT_LABELS[stat] || {
            label: stat.replace("bonus_", "").replace(/_/g, " "),
            decimals: 2,
          };
          return {
            stat,
            label: meta.label,
            amount,
            amountDisplay: amount.toFixed(meta.decimals),
            unitValue,
            goldValue,
            pct: Math.min(pct, 100),
          };
        })
        .filter((r) => r.unitValue > 0)
        .sort((a, b) => b.goldValue - a.goldValue);

      // Rank by displayEfficiency among all currently filtered items
      const sorted = [...this.filteredItems].sort(
        (a, b) => b.displayEfficiency - a.displayEfficiency,
      );
      const rank = sorted.findIndex((i) => i.name === item.name) + 1;
      const percentile = Math.round(
        ((sorted.length - rank) / sorted.length) * 100,
      );

      return { rows, totalStatValue, rank, percentile };
    },
    // Format expanded stat map into readable strings e.g. ['+44 HP', '+0.20 HPR', '+1 Dmg']
    formatExpandedStats(expanded) {
      const LABELS = {
        bonus_health: (v) => `+${v.toFixed(0)} HP`,
        bonus_health_regen: (v) => `+${v.toFixed(2)} HP Regen`,
        bonus_mana: (v) => `+${v.toFixed(0)} Mana`,
        bonus_mana_regen: (v) => `+${v.toFixed(2)} Mana Regen`,
        bonus_armor: (v) => `+${v.toFixed(2)} Armor`,
        bonus_attack_speed: (v) => `+${v.toFixed(0)} Atk Spd`,
        bonus_damage: (v) => `+${v.toFixed(2)} Dmg`,
        bonus_strength: (v) => `+${v.toFixed(0)} STR`,
        bonus_agility: (v) => `+${v.toFixed(0)} AGI`,
        bonus_intellect: (v) => `+${v.toFixed(0)} INT`,
        bonus_movement: (v) => `+${v.toFixed(0)} Move Spd`,
        bonus_evasion: (v) => `+${v.toFixed(0)}% Evasion`,
        bonus_lifesteal: (v) => `+${v.toFixed(0)}% Lifesteal`,
        bonus_spell_amp: (v) => `+${v.toFixed(0)}% Spell Amp`,
        corruption_armor: (v) => `-${v.toFixed(0)} Armor (enemy)`,
      };
      return Object.entries(expanded)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => (LABELS[k] ? LABELS[k](v) : `+${v.toFixed(2)} ${k}`));
    },
    getItemStatsTooltip(item) {
      const stats = item.expandedStats || item.statsProvided || {};
      const lines = this.formatExpandedStats(stats);
      return lines.length ? lines.join("<br>") : item.name;
    },
    onDerivedApplied() {
      // Switch back to the Efficiency tab so the user sees the updated chart
      this.activeTab = 0;
    },
    prepareChartData() {
      const points = this.filteredItems.map((item) => ({
        x: item.displayEfficiency,
        y: item.statValue,
        item: item,
      }));

      const pointStyles = this.filteredItems.map((item) => {
        const img = new Image();
        img.src = item.img;
        img.width = 44; // Approx standard dota item ratio (88x64 or 44x32)
        img.height = 32;
        return img;
      });

      this.chartData = {
        datasets: [
          {
            label: "Dota 2 Items",
            backgroundColor: "#42b983", // Vue green
            borderColor: "#35495e",
            data: points,
            pointStyle: pointStyles,
            pointRadius: 6,
            pointHoverRadius: 10,
            hoverBackgroundColor: "#fff",
          },
        ],
      };

      // Force chart to re-render properly with new images
      this.chartKey += 1;
    },
  },
};
</script>

<style scoped>
.page-title {
  color: #fff;
  font-weight: bold;
}

.clickable-row {
  cursor: pointer;
}

.row-expanded {
  background-color: rgba(66, 185, 131, 0.08) !important;
  cursor: pointer;
}

/* Force chart canvas to use the app dark background */
canvas {
  background-color: #13102e;
  border-radius: 4px;
}
</style>
