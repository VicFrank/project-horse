<template>
  <div>
    <!-- Add a new code -->
    <b-button v-b-modal.create-code variant="success" size="sm"
      >Create a New Code</b-button
    >
    <b-modal
      id="create-code-error"
      title="Error"
      :ok-label="$t('common.close')"
      @ok="error = ''"
    >
      <p>{{ error }}</p>
    </b-modal>
    <b-modal
      id="create-code"
      title="Create Redemption Code"
      @ok="createCode"
      @cancel="clearNewCode"
      :ok-disabled="
        !(
          newCode.code &&
          ((newCode.cosmetics && newCode.cosmetics.length > 0) || newCode.coins)
        )
      "
    >
      <b-form-group id="input-group-2" label="Code Name" label-for="input-2">
        <b-form-input
          type="text"
          v-model="newCode.code"
          placeholder="Enter the code"
        ></b-form-input>
      </b-form-group>
      <b-form-group id="input-group-2" label="Coins" label-for="input-2">
        <b-form-input
          type="number"
          v-model="newCode.coins"
          placeholder="Coins"
          class="mt-3"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-2"
        label="Limit (optional, default infinite)"
        label-for="input-2"
      >
        <b-form-input
          type="number"
          v-model="newCode.redemption_limit"
          placeholder="Limit"
          class="mt-3"
        ></b-form-input>
      </b-form-group>
      <hr />
      <b-form-group id="input-group-2" label="Cosmetics" label-for="input-2">
        <b-form-input
          type="text"
          v-model="cosmeticsFilter"
          placeholder="Search cosmetics"
          class="mt-3"
        ></b-form-input>
      </b-form-group>
      <b-form-select
        v-model="newCode.cosmetic"
        :options="filteredCosmetics"
        :select-size="7"
        class="mt-3"
      ></b-form-select>
      <b-button
        variant="success"
        size="sm"
        class="mt-2"
        @click="addCosmetic"
        :disabled="!newCode.cosmetic"
      >
        Add Cosmetic
      </b-button>
      <div>
        <div
          v-for="cosmetic in newCode.cosmetics"
          :key="cosmetic.cosmetic_id"
          class="d-flex align-items-center my-1"
        >
          <b-button
            v-b-modal.delete-cosmetic
            variant="danger"
            size="sm"
            class="mr-3"
            @click="removeCosmetic(cosmetic)"
            >x</b-button
          >
          {{ $t(`cosmetics.${cosmetic.cosmetic_name}`) }}
          <span class="text-muted mx-1">{{ cosmetic.cosmetic_name }}</span>
        </div>
      </div>
    </b-modal>
    <!-- List existing codes -->
    <div class="d-flex flex-wrap p-3">
      <div v-for="code in codes" :key="code.code" class="p-2 text-center">
        <div class="text-center" style="height: 90px; overflow-y: auto">
          <div>{{ code.code }}</div>
          <div class="text-muted">
            ({{ code.num_redeemed.toLocaleString() }} /
            {{
              code.redemption_limit != null
                ? code.redemption_limit.toLocaleString()
                : "∞"
            }})
          </div>
          <div v-if="code.coins">
            <img
              src="../../../../assets/images/coin1.png"
              alt="coins"
              class="coins-image"
              style="width: 20px; height: 20px"
            />
            {{ code.coins }}
          </div>
          <div
            v-for="cosmetic in code.rewards"
            :key="cosmetic.cosmetic_id"
            class="text-muted"
          >
            {{ cosmetic.cosmetic_name }}
          </div>
        </div>
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
            v-if="!code.active"
            @click="toggleEnabled(code)"
            size="sm"
            class="w-100 mt-1"
            >Enable</b-button
          >
          <b-button
            @click="tryDeleteCode(code)"
            size="sm"
            class="w-100 mt-1"
            variant="danger"
          >
            Delete</b-button
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
    filteredCosmetics: [],
    loading: true,
    newCode: {},
    cosmeticsFilter: "",
    error: "",
  }),

  created() {
    fetch(`/api/cosmetics`)
      .then((res) => res.json())
      .then((cosmetics) => {
        this.cosmetics = cosmetics.map((cosmetic) => ({
          value: cosmetic,
          text: cosmetic.cosmetic_name,
        }));
        this.filteredCosmetics = this.cosmetics;
      });
    this.getCodes();
  },

  watch: {
    cosmeticsFilter(val) {
      if (val) {
        this.filteredCosmetics = this.cosmetics.filter((cosmetic) =>
          cosmetic.text.toLowerCase().includes(val.toLowerCase())
        );
      } else {
        this.filteredCosmetics = this.cosmetics;
      }
    },
  },

  methods: {
    addCosmetic() {
      if (!this.newCode.cosmetics) this.newCode.cosmetics = [];
      this.newCode.cosmetics.push(this.newCode.cosmetic);
      this.newCode.cosmetic = null;
    },
    removeCosmetic(cosmetic) {
      this.newCode.cosmetics = this.newCode.cosmetics.filter(
        (c) => c.cosmetic_id !== cosmetic.cosmetic_id
      );
      this.$forceUpdate();
    },
    clearNewCode() {
      this.newCode = {};
    },
    getCodes() {
      fetch(`/api/redemption_codes`)
        .then((res) => res.json())
        .then((codes) => {
          this.codes = codes;
          this.loading = false;
        });
    },
    createCode(bvModalEvent) {
      bvModalEvent.preventDefault();
      if (!this.newCode.cosmetics) this.newCode.cosmetics = [];
      const cosmeticIDs = this.newCode.cosmetics.map(
        (cosmetic) => cosmetic.cosmetic_id
      );
      fetch(`/api/redemption_codes/${this.newCode.code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cosmeticIDs,
          coins: this.newCode.coins,
          redemptionLimit: this.newCode.redemption_limit,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            this.error = res.error;
            this.$bvModal.show("create-code-error");
          } else {
            this.getCodes();
            this.clearNewCode();
            this.$bvModal.hide("create-code");
          }
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
      fetch(`/api/redemption_codes/${code.code}/active`, {
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
    tryDeleteCode(code) {
      this.$bvModal
        .msgBoxConfirm(`Are you sure you want to delete code ${code.code}?`, {
          title: "Confirm Delete",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "DELETE",
          cancelTitle: "Cancel",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.deleteCode(code);
          }
        });
    },
    deleteCode(code) {
      fetch(`/api/redemption_codes/${code.code}`, {
        method: "DELETE",
      }).then(() => {
        this.loading = true;
        this.getCodes();
      });
    },
  },
};
</script>

<style scoped>
</style>