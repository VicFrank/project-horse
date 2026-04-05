<template>
  <div>
    <h1 class="page-title">God Leaderboard</h1>

    <div v-if="loading" class="d-flex justify-content-center my-4">
      <b-spinner label="Loading..."></b-spinner>
    </div>

    <div v-else-if="error" class="text-center my-4 text-danger">
      {{ error }}
    </div>

    <div v-else>
      <div class="god-grid">
        <div v-for="god in godList" :key="god" class="god-card">
          <div class="god-card-header">
            <GodImage :god="god" :height="48" class="mr-2" />
            <span class="god-name">{{ $t(`gods.${god}`) }}</span>
          </div>
          <table class="table mb-0">
            <thead>
              <tr>
                <th class="rank-col">#</th>
                <th class="text-left">Player</th>
                <th>MMR</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(entry, index) in leaderboard[god]"
                :key="entry.steam_id"
              >
                <td class="rank-col">{{ index + 1 }}</td>
                <td class="text-left">
                  <router-link :to="'/players/' + entry.steam_id">
                    {{ entry.username }}
                  </router-link>
                </td>
                <td>{{ entry.mmr }}</td>
              </tr>
              <tr v-if="!leaderboard[god] || leaderboard[god].length === 0">
                <td colspan="3" class="text-center text-muted">No data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GodImage from "../games/components/GodImage.vue";

export default {
  components: {
    GodImage,
  },

  data: () => ({
    leaderboard: {},
    loading: true,
    error: "",
  }),

  computed: {
    godList() {
      return Object.keys(this.leaderboard).sort();
    },
  },

  mounted() {
    fetch("/api/gods/leaderboard")
      .then((res) => res.json())
      .then((data) => {
        this.leaderboard = data;
        this.loading = false;
      })
      .catch(() => {
        this.error = "Error fetching god leaderboard data";
        this.loading = false;
      });
  },
};
</script>

<style scoped>
.god-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px 32px;
}

.god-card {
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
}

.god-card-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid #333;
}

.god-name {
  font-size: 16px;
  font-weight: 600;
}

.rank-col {
  width: 40px;
  text-align: center;
}

table {
  margin-bottom: 0;
}

th {
  font-size: 13px;
  padding: 6px 10px !important;
}

td {
  padding: 6px 10px !important;
  font-size: 14px;
}
</style>
