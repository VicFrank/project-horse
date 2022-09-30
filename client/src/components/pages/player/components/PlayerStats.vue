<template>
  <table class="table mx-auto mb-3" style="max-width: 600px">
    <tbody>
      <tr>
        <td v-if="stats.mmr" class="tb-head">MMR</td>
        <td v-if="stats.ladder_mmr && isUser" class="tb-head">Ladder MMR</td>
        <td class="tb-head">games</td>
        <td class="tb-head">Avg Place</td>
        <td class="tb-head">Placements</td>
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
</template>

<script>
import PlacemementGraph from "../../stats/components/PlacementGraph.vue";

export default {
  components: {
    PlacemementGraph,
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
  },
};
</script>

<style>
</style>