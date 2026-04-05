<template>
  <div>
    <table class="table mx-auto mb-3" style="max-width: 600px">
      <tbody>
        <tr>
          <td v-if="stats.mmr" class="tb-head">{{ $t("tables.mmr") }}</td>
          <td v-if="stats.ladder_mmr && isUser" class="tb-head">
            {{ $t("tables.ladder_mmr") }}
          </td>
          <td class="tb-head">{{ $t("tables.games") }}</td>
          <td class="tb-head">{{ $t("tables.avg_place") }}</td>
          <td class="tb-head">{{ $t("tables.placements") }}</td>
        </tr>
        <tr>
          <td v-if="stats.mmr">{{ stats.mmr }}</td>
          <td v-if="stats.ladder_mmr && isUser">{{ stats.ladder_mmr }}</td>
          <td>{{ stats.games }}</td>
          <td v-if="stats.results">{{ stats.results.avg_place }}</td>
          <td v-if="!stats.results"></td>
          <td style="width: 208px">
            <PlacemementGraph
              v-if="stats.results"
              style="margin: auto; width: fit-content"
              :placements="stats.results.placements"
            ></PlacemementGraph>
          </td>
        </tr>
      </tbody>
    </table>

    <div style="max-width: 700px; margin: auto">
      <h5 class="text-center mt-4 mb-2">God Stats</h5>
      <div v-if="godStatsLoading" class="d-flex justify-content-center my-3">
        <b-spinner label="Loading..."></b-spinner>
      </div>
      <PlayerGodStats v-else :gods="godStats"></PlayerGodStats>

      <h5 class="text-center mt-4 mb-2">Season Stats</h5>
      <PlayerSeasonResults
        :results="seasonResults"
        :loading="seasonStatsLoading"
      ></PlayerSeasonResults>
    </div>
  </div>
</template>

<script>
import PlacemementGraph from "../../stats/components/PlacementGraph.vue";
import PlayerGodStats from "../../stats/gods/PlayerGodStats.vue";
import PlayerSeasonResults from "./PlayerSeasonResults.vue";

export default {
  components: {
    PlacemementGraph,
    PlayerGodStats,
    PlayerSeasonResults,
  },

  props: {
    stats: {
      type: Object,
      required: true,
    },
    isUser: {
      type: Boolean,
      required: false,
      default: false,
    },
    godStats: {
      type: Array,
      required: false,
      default: () => [],
    },
    godStatsLoading: {
      type: Boolean,
      required: false,
      default: true,
    },
    seasonResults: {
      type: Array,
      required: false,
      default: () => [],
    },
    seasonStatsLoading: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
};
</script>

<style></style>
