<template>
  <div>
    <h1 class="page-title" v-t="'navigation.my_stats'"></h1>
    <div v-if="loading" class="d-flex justify-content-center mb-3">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <table v-if="!loading" class="table mx-auto mb-3" style="max-width: 600px">
      <tbody>
        <tr>
          <td class="tb-head">MMR</td>
          <td class="tb-head">games</td>
          <td class="tb-head">Avg Place</td>
          <td class="tb-head">Placements</td>
        </tr>
        <tr>
          <td>{{ playerStats.mmr }}</td>
          <td>{{ playerStats.games }}</td>
          <td>{{ playerStats.results.avg_place }}</td>
          <td>
            <PlacemementGraph
              style="margin: auto; width: fit-content"
              :placements="playerStats.results.placements"
            ></PlacemementGraph>
          </td>
        </tr>
      </tbody>
    </table>
    <b-tabs
      v-if="!loading"
      content-class="mt-3"
      style="max-width: 700px; margin: auto"
    >
      <b-tab title="Gods" active>
        <GodStats :gods="godStats"></GodStats>
      </b-tab>
      <b-tab title="Abilities">
        <AbilityStats :abilities="abilityStats"></AbilityStats>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import GodStats from "../stats/GodStats.vue";
import AbilityStats from "../stats/AbilityStats.vue";
import PlacemementGraph from "../stats/components/PlacementGraph.vue";

export default {
  components: {
    GodStats,
    AbilityStats,
    PlacemementGraph,
  },

  data: () => ({
    error: "",
    playerStats: {},
    godStats: [],
    abilityStats: [],
    loading: true,
  }),

  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
  },

  created() {
    fetch(`/api/players/${this.steamID}/stats`)
      .then((res) => res.json())
      .then((playerStats) => {
        this.loading = false;
        this.playerStats = playerStats;
      });

    fetch(`/api/players/${this.steamID}/ability_stats`)
      .then((res) => res.json())
      .then((abilityStats) => {
        this.loading = false;
        this.abilityStats = abilityStats;
      });

    fetch(`/api/players/${this.steamID}/god_stats`)
      .then((res) => res.json())
      .then((godStats) => {
        this.loading = false;
        this.godStats = godStats;
      });
  },
};
</script>

<style>
</style>