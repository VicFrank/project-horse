<template>
  <div style="max-width: 700px; margin: auto">
    <template v-if="loading">
      <div class="d-flex justify-content-center my-3">
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </template>
    <template v-else-if="results.length === 0">
      <p class="text-center my-3">No season results found.</p>
    </template>
    <b-table v-else :fields="fields" :items="results" responsive class="m-auto">
      <template #cell(season)="data">
        <div class="text-left p-2">Season {{ data.item.season }}</div>
      </template>
      <template #cell(mmr)="data">
        <div class="p-2">{{ data.item.mmr }}</div>
      </template>
      <template #cell(leaderboard_rank)="data">
        <div class="p-2">
          {{
            data.item.leaderboard_rank != null
              ? "#" + data.item.leaderboard_rank
              : "—"
          }}
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  props: {
    results: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    fields: [
      {
        key: "season",
        label: "Season",
        thClass: "table-head text-left",
        sortable: true,
      },
      {
        key: "mmr",
        label: "Final MMR",
        thClass: "table-head",
        sortable: true,
      },
      {
        key: "leaderboard_rank",
        label: "Placement",
        thClass: "table-head",
        sortable: true,
      },
    ],
  }),

  created() {
    this.$emit("created");
  },
};
</script>
