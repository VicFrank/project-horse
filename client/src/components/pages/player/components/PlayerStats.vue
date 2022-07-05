<template>
  <table v-if="!loading" class="table mx-auto mb-3" style="max-width: 600px">
    <tbody>
      <tr>
        <td v-if="stats.mmr" class="tb-head">MMR</td>
        <td class="tb-head">games</td>
        <td class="tb-head">Avg Place</td>
        <td class="tb-head">Placements</td>
      </tr>
      <tr>
        <td v-if="stats.mmr">{{ stats.mmr }}</td>
        <td>{{ stats.games }}</td>
        <td>{{ stats.results.avg_place }}</td>
        <td>
          <PlacemementGraph
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
  },
};
</script>

<style>
</style>