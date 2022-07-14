<template>
  <div>
    <!-- Add a new code -->
    <b-button v-b-modal.create-code variant="success" size="sm"
      >Create a New Code</b-button
    >
    <b-modal
      id="create-code"
      title="Create Redemption Code"
      @ok="createCode"
      :ok-disabled="!(newCode.code && newCode.cosmetic)"
    >
      <b-form-input
        type="text"
        v-model="newCode.code"
        placeholder="Enter the code..."
      ></b-form-input>
      <b-form-select
        v-model="newCode.cosmetic"
        :options="cosmetics"
        :select-size="7"
        class="mt-3"
      ></b-form-select>
      <div v-if="newCode.cosmetic" class="mt-3">
        Reward: <strong>{{ newCode.cosmetic.cosmetic_name }}</strong>
      </div>
    </b-modal>
    <!-- List existing codes -->
    <div class="d-flex flex-wrap p-3">
      <div v-for="code in codes" :key="code.code" class="p-2 text-center">
        <div>{{ code.code }}</div>
        <div class="text-muted">{{ code.cosmetic_name }}</div>
        <div style="width: 200px" class="text-center mt-2">
          <b-button
            v-b-modal.view-redemptions
            @click="loadPlayers(code)"
            variant="primary"
            size="sm"
            class="w-100 mt-1"
            >Redemptions</b-button
          >
          <b-button
            v-if="code.active"
            @click="toggleEnabled(code)"
            size="sm"
            class="w-100 mt-1"
            >Disable</b-button
          >
          <b-button
            v-if="code.active"
            @click="toggleEnabled(code)"
            size="sm"
            class="w-100 mt-1"
            >Enable</b-button
          >
        </div>
        <b-modal :id="`players-${code.code}`" title="Redemptions">
          <div v-if="code.loading">Loading...</div>
          <p v-if="code.players">
            Total Redemptions: {{ code.players.length }}
          </p>
          <div style="max-height: 600px; overflow-y: auto">
            <div v-for="redemption in code.players" :key="redemption.steam_id">
              <div class="d-flex align-items-center my-1">
                <div>{{ redemption.username }}</div>
                <div class="text-muted mx-1">
                  {{ redemption.date_claimed.toLocaleString() }}
                </div>
              </div>
            </div>
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    codes: [],
    cosmetics: [],
    loading: true,
    newCode: {},
  }),

  created() {
    fetch(`/api/cosmetics`)
      .then((res) => res.json())
      .then((cosmetics) => {
        this.cosmetics = cosmetics.map((cosmetic) => ({
          value: cosmetic,
          text: cosmetic.cosmetic_name,
        }));
      });
    this.getCodes();
  },

  methods: {
    getCodes() {
      fetch(`/api/redemption_codes`)
        .then((res) => res.json())
        .then((codes) => {
          this.codes = codes;
          this.loading = false;
        });
    },
    createCode() {
      fetch(`/api/redemption_codes/${this.newCode.code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cosmeticID: this.newCode.cosmetic.cosmetic_id }),
      })
        .then((res) => res.json())
        .then(() => {
          this.loading = true;
          this.getCodes();
        });
    },
    loadPlayers(code) {
      this.$bvModal.show(`players-${code.code}`);
      code.loadingPlayers = true;
      fetch(`/api/redemption_codes/${code.code}/players`)
        .then((res) => res.json())
        .then((players) => {
          code.players = players;
          code.loadingPlayers = false;
          this.$forceUpdate();
        });
    },
    toggleEnabled(code) {
      fetch(`/api/redemption_codes/${code.code}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !code.active }),
      })
        .then((res) => res.json())
        .then(() => {
          this.loading = true;
          this.getCodes();
        });
    },
  },
};
</script>

<style scoped>
</style>