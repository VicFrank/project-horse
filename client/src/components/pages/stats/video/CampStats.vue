<template>
  <div class="camp-stats-page">
    <h1 class="page-title">Neutral Camp Rankings</h1>

    <div class="stats-container mx-auto">
      <b-table
        :fields="fields"
        :items="standings"
        responsive
        dark
        class="camp-table m-auto"
        :tbody-tr-class="rowClass"
        @row-clicked="toggleMatchups"
        sort-by="rank"
      >
        <template #cell(camp)="data">
          <div class="d-flex align-items-center">
            <img
              :src="getCampImage(data.item.name)"
              :alt="data.item.name"
              class="camp-icon mr-2"
            />
            <span class="camp-name">{{ data.item.name }}</span>
          </div>
        </template>
        <template #cell(size)="data">
          <span
            :class="
              'size-badge size-' +
              data.item.size.toLowerCase().replace('_', '-')
            "
          >
            {{ formatSize(data.item.size) }}
          </span>
        </template>
        <template #cell(mmr)="data">
          <div class="mmr-cell">
            <span class="mmr-value">{{ data.item.mmr }}</span>
            <div class="mmr-bar-container">
              <PercentBar
                :min="minMmr"
                :max="maxMmr"
                :value="data.item.mmr - minMmr"
                class="mt-1"
              ></PercentBar>
            </div>
          </div>
        </template>
        <template #cell(record)="data">
          <span class="record-text">
            <span class="text-success">{{
              parseRecord(data.item.record).wins
            }}</span>
            <span class="text-muted">-</span>
            <span class="text-danger">{{
              parseRecord(data.item.record).losses +
              parseRecord(data.item.record).draws
            }}</span>
          </span>
        </template>
        <template #cell(winrate)="data">
          <span :class="winrateClass(data.item.record, data.item.name)">
            {{ winrate(data.item.record, data.item.name) }}%
          </span>
        </template>

        <!-- Expanded matchup row -->
        <template #row-details="data">
          <div class="matchup-details p-3">
            <h5 class="mb-3">
              <img
                :src="getCampImage(data.item.name)"
                :alt="data.item.name"
                class="camp-icon-sm mr-2"
              />
              {{ data.item.name }} — Matchup Results
            </h5>
            <!-- Single unified matchup grid -->
            <div class="matchup-grid-container">
              <table class="table table-dark matchup-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Camp</th>
                    <th>Record</th>
                    <th>Win %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="m in getMatchups(data.item.name)"
                    :key="m.opponent"
                    :class="getMatchupRowClass(data.item.name, m)"
                    :style="getMatchupRowStyle(data.item.name, m)"
                  >
                    <td class="text-center rank-col">
                      {{ getCampRank(m.opponent) }}
                    </td>
                    <td class="d-flex align-items-center matchup-camp-cell">
                      <img
                        :src="getCampImage(m.opponent)"
                        :alt="m.opponent"
                        class="camp-icon-xs mr-2"
                      />
                      <span
                        :class="{
                          'selected-camp': m.opponent === data.item.name,
                        }"
                        >{{ m.opponent }}</span
                      >
                    </td>
                    <td class="record-col">
                      <span v-if="!m.isSelectedCamp" class="record-text">
                        <span class="text-success">{{ m.wins }}</span>
                        <span class="text-muted">-</span>
                        <span class="text-danger">{{ m.losses }}</span>
                        <template v-if="m.draws > 0">
                          <span class="text-muted">-</span>
                          <span class="text-warning">{{ m.draws }}</span>
                        </template>
                      </span>
                    </td>
                    <td
                      :class="
                        m.isSelectedCamp
                          ? ''
                          : getWinrateClass(m.wins, m.losses, m.draws)
                      "
                    >
                      {{
                        m.isSelectedCamp
                          ? ""
                          : getWinrate(m.wins, m.losses, m.draws) + "%"
                      }}
                    </td>
                  </tr>
                  <tr v-if="getMatchups(data.item.name).length === 0">
                    <td colspan="4" class="text-muted text-center">
                      No matchup data available
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import PercentBar from "../../../utility/PercentBar.vue";
import { campUnits } from "./campUnits";
import fightReport from "./fight-report.json";

export default {
  components: {
    PercentBar,
  },

  data() {
    return {
      standings: [],
      matrix: {},
      fields: [
        {
          key: "rank",
          label: "#",
          thClass: "table-head text-center",
          tdClass: "text-center rank-cell",
          sortable: true,
        },
        {
          key: "camp",
          label: "Camp",
          thClass: "table-head text-left",
          sortable: false,
        },
        {
          key: "size",
          label: "Size",
          thClass: "table-head text-center",
          tdClass: "text-center",
          sortable: true,
        },
        {
          key: "mmr",
          label: "MMR",
          thClass: "table-head text-left",
          sortable: true,
        },
        // {
        //   key: "record",
        //   label: "Record",
        //   thClass: "table-head text-center",
        //   tdClass: "text-center",
        //   sortable: false,
        // },
        {
          key: "winrate",
          label: "Win %",
          thClass: "table-head text-center",
          tdClass: "text-center",
          sortable: true,
        },
      ],
    };
  },

  computed: {
    maxMmr() {
      if (!this.standings.length) return 2200;
      return Math.max(...this.standings.map((s) => s.mmr));
    },
    minMmr() {
      if (!this.standings.length) return -200;
      return Math.min(...this.standings.map((s) => s.mmr));
    },
  },

  created() {
    this.loadData();
  },

  methods: {
    loadData() {
      this.matrix = fightReport.matrix;
      this.standings = fightReport.standings.map((s) => ({
        ...s,
        _showDetails: false,
      }));
    },

    getCampImage(campName) {
      const camp = campUnits[campName];
      if (!camp || !camp.units || camp.units.length === 0) {
        return "/images/creeps/npc_dota_neutral_kobold.png";
      }
      // Use the last unit (the "boss" unit)
      const lastUnit = camp.units[camp.units.length - 1];
      return `/images/creeps/${lastUnit}.png`;
    },

    formatSize(size) {
      const map = {
        SMALL: "Small",
        MEDIUM: "Medium",
        LARGE: "Large",
        ANCIENT: "Ancient",
        CREEP_WAVE: "Creep Wave",
      };
      return map[size] || size;
    },

    parseRecord(record) {
      const parts = record.split("-");
      return {
        wins: parseInt(parts[0]),
        losses: parseInt(parts[1]),
        draws: parseInt(parts[2] || 0),
      };
    },

    winrate(record) {
      // Calculate winrate from matrix data, excluding self-matchups
      const standing = this.standings.find((s) => s.record === record);
      if (!standing) {
        // Fallback to record string if standing not found
        const { wins, losses, draws } = this.parseRecord(record);
        const total = wins + losses + draws;
        if (total === 0) return "0.0";
        return ((wins / total) * 100).toFixed(1);
      }

      const campMatchups = this.matrix[standing.name];
      if (!campMatchups) return "0.0";

      let totalWins = 0;
      let totalLosses = 0;
      let totalDraws = 0;

      for (const [opponent, matchupRecord] of Object.entries(campMatchups)) {
        // Skip self-matchups
        if (opponent === standing.name) continue;

        const { wins, losses, draws } = this.parseRecord(matchupRecord);
        totalWins += wins;
        totalLosses += losses;
        totalDraws += draws;
      }

      const total = totalWins + totalLosses + totalDraws;
      if (total === 0) return "0.0";
      return ((totalWins / total) * 100).toFixed(1);
    },

    winrateClass(record, campName) {
      const wr = parseFloat(this.winrate(record, campName));
      if (wr >= 60) return "text-success font-weight-bold";
      if (wr >= 45) return "text-warning";
      return "text-danger";
    },

    rowClass(item) {
      if (!item) return "";
      return item._showDetails ? "row-expanded" : "clickable-row";
    },

    toggleMatchups(item) {
      this.$set(item, "_showDetails", !item._showDetails);
    },

    getMatchups(campName) {
      const campMatchups = this.matrix[campName];
      if (!campMatchups) {
        // Even if no matchup data, add the selected camp
        return [
          {
            opponent: campName,
            wins: 0,
            losses: 0,
            draws: 0,
            isSelectedCamp: true,
          },
        ];
      }

      const results = [];
      for (const [opponent, record] of Object.entries(campMatchups)) {
        if (opponent === campName) continue; // skip mirror matches
        const { wins, losses, draws } = this.parseRecord(record);

        // Include all matchups
        results.push({ opponent, wins, losses, draws, isSelectedCamp: false });
      }

      // Add the selected camp itself
      results.push({
        opponent: campName,
        wins: 0,
        losses: 0,
        draws: 0,
        isSelectedCamp: true,
      });

      // Sort by MMR (same order as main table - by rank/MMR descending)
      results.sort((a, b) => {
        const aStanding = this.standings.find((s) => s.name === a.opponent);
        const bStanding = this.standings.find((s) => s.name === b.opponent);

        const aRank = aStanding ? aStanding.rank : 999;
        const bRank = bStanding ? bStanding.rank : 999;

        return aRank - bRank; // Sort by rank ascending (lower rank = better)
      });

      return results;
    },

    getCampRank(campName) {
      const standing = this.standings.find((s) => s.name === campName);
      return standing ? standing.rank : "-";
    },

    getMatchupRowClass(selectedCamp, matchup) {
      if (matchup.opponent === selectedCamp) {
        return "selected-camp-row";
      }
      return "";
    },

    getMatchupRowStyle(selectedCamp, matchup) {
      // Selected camp keeps its blue highlight
      if (matchup.opponent === selectedCamp) {
        return {};
      }

      // Calculate win percentage
      const total = matchup.wins + matchup.losses + matchup.draws;
      if (total === 0) {
        return { background: "rgba(108, 117, 125, 0.1) !important" };
      }

      const winrate = (matchup.wins / total) * 100;

      // Create gradient from red (0%) to green (100%)
      // At 50% we want a neutral/dark color
      let r, g, b, alpha;

      if (winrate >= 50) {
        // 50-100%: transition from dark to green
        const factor = (winrate - 50) / 50; // 0 to 1
        r = Math.round(40 * (1 - factor));
        g = Math.round(167 * factor + 80 * (1 - factor));
        b = Math.round(69 * factor + 40 * (1 - factor));
        alpha = 0.15 + factor * 0.05; // 0.15 to 0.20
      } else {
        // 0-50%: transition from red to dark
        const factor = winrate / 50; // 0 to 1
        r = Math.round(220 * (1 - factor) + 40 * factor);
        g = Math.round(53 * (1 - factor) + 40 * factor);
        b = Math.round(69 * (1 - factor) + 40 * factor);
        alpha = 0.15 + (1 - factor) * 0.05; // 0.20 to 0.15
      }

      return {
        background: `rgba(${r}, ${g}, ${b}, ${alpha}) !important`,
      };
    },

    getWinrate(wins, losses, draws) {
      const total = wins + losses + draws;
      if (total === 0) return "0.0";
      return ((wins / total) * 100).toFixed(1);
    },

    getWinrateClass(wins, losses, draws) {
      const wr = parseFloat(this.getWinrate(wins, losses, draws));
      if (wr >= 60) return "text-success font-weight-bold";
      if (wr >= 45) return "text-warning";
      return "text-danger";
    },
  },
};
</script>

<style scoped>
.camp-stats-page {
  padding: 20px;
}

.stats-container {
  max-width: 700px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
}

.camp-table {
  font-size: 16px;
}

.camp-icon {
  width: 42px;
  height: 42px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.camp-icon-sm {
  width: 36px;
  height: 36px;
  border-radius: 3px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.camp-icon-xs {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.camp-name {
  font-weight: 500;
  white-space: nowrap;
  font-size: 16px;
}

.rank-cell {
  font-weight: bold;
  font-size: 18px;
}

.size-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.size-small {
  background: rgba(108, 117, 125, 0.3);
  color: #adb5bd;
}

.size-medium {
  background: rgba(0, 123, 255, 0.2);
  color: #6cb3ff;
}

.size-large {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.size-ancient {
  background: rgba(220, 53, 69, 0.2);
  color: #ff6b7a;
}

.size-creep-wave {
  background: rgba(40, 167, 69, 0.2);
  color: #5dd879;
}

.mmr-cell {
  min-width: 100px;
}

.mmr-value {
  font-weight: 600;
  font-size: 16px;
}

.mmr-bar-container {
  width: 100%;
  max-width: 140px;
}

.record-text {
  font-family: monospace;
  font-size: 15px;
}

.clickable-row {
  cursor: pointer;
}

.row-expanded {
  background-color: rgba(0, 123, 255, 0.1) !important;
}

.matchup-details {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.matchup-details h5 {
  font-size: 20px;
  font-weight: 600;
}

.matchup-grid-container {
  max-width: 100%;
  overflow-x: auto;
}

.matchup-table {
  font-size: 15px;
  margin-bottom: 0;
  min-width: 650px;
}

.matchup-table thead th {
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 10px 12px;
  border-color: rgba(255, 255, 255, 0.1);
}

.matchup-table td,
.matchup-table th {
  padding: 12px 16px;
  border-color: rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

.matchup-table tbody tr {
  transition: none;
}

.matchup-camp-cell {
  font-size: 15px;
  font-weight: 500;
  padding-left: 20px !important;
}

.rank-col {
  font-weight: bold;
  font-size: 16px;
}

.record-col {
  font-family: monospace;
}

.selected-camp-row {
  background: rgba(0, 123, 255, 0.25) !important;
  border-left: 3px solid #007bff;
}

.table td {
  vertical-align: middle;
}
</style>
