<template>
  <div v-if="!loading && quests.length > 0" class="pb-2 quests-background">
    <div class="px-3 py-3">
      <span v-t="'profile.daily_quests'"></span>
    </div>
    <div
      v-if="loading"
      class="d-flex justify-content-between"
      style="overflow-x: auto"
    >
      <div
        v-for="i in 7"
        :key="i"
        class="mx-3 single-quest"
        style="width: 125px"
      >
        <div style="height: 48px"></div>
        <div class="quest-xp" style="height: 27px"></div>
      </div>
    </div>
    <div
      v-if="!loading"
      class="d-flex justify-content-between"
      style="overflow-x: auto"
    >
      <div
        v-for="quest in quests"
        :key="quest.welcome_quest_id"
        class="mx-3 single-quest"
      >
        <div v-if="quest.claimed" class="overlay"></div>
        <div v-if="quest.coin_reward > 0" class="quest-xp-text text-center p-3">
          {{ quest.coin_reward }} Coins
        </div>
        <img
          style="height: 115px; width: 100%; object-fit: cover"
          v-if="quest.cosmetic_name"
          v-bind:src="cosmeticImageSrc(quest)"
          :alt="quest.cosmetic_name"
        />
        <div class="text-center quest-xp py-1">
          Day {{ quest.day }}
          <i v-if="quest.claimed" class="fas fa-check ml-1"></i>
        </div>
        <div class="text-center">
          <button
            v-on:click="claimQuest(quest)"
            v-if="!quest.claimed && quest.can_claim"
            type="button"
            class="btn btn-primary mt-2"
          >
            Claim
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    showError: false,
    quests: [],
    loading: true,
  }),

  created() {
    this.getQuests();
  },

  methods: {
    getQuests() {
      fetch(`/api/players/${this.$store.state.auth.userSteamID}/welcome_quests`)
        .then(
          (res) => res.json(),
          (err) => {
            this.error = err;
            this.showError = true;
            console.error(err);
          }
        )
        .then((quests) => {
          this.loading = false;
          this.quests = quests;
        })
        .catch((err) => {
          this.error = err;
          this.showError = true;
        });
    },
    claimQuest(quest) {
      const { welcome_quest_id } = quest;
      this.quests = this.quests.map((q) =>
        q.welcome_quest_id === welcome_quest_id ? { ...q, claimed: true } : q
      );
      fetch(
        `/api/players/${this.$store.state.auth.userSteamID}/welcome_quests/claim?questID=${welcome_quest_id}`,
        { method: "post" }
      )
        .then((res) => res.json())
        .then(() => {
          this.getQuests();
          this.$store.dispatch("REFRESH_PLAYER");
          this.$store.dispatch("REFRESH_BATTLE_PASS");
        })
        .catch((err) => {
          this.error = err;
          this.showError = true;
        });
    },
    cosmeticImageSrc(cosmetic) {
      const { cosmetic_name } = cosmetic;
      return `/images/cosmetics/${cosmetic_name}.png`;
    },
  },
};
</script>

<style scoped>
.single-quest {
  border: solid 1.1px #403652;
  background-color: #2d223b;
  border-bottom: 0;
  min-width: 125px;
  position: relative;
}

.quest-xp {
  background-color: #1f1a2b;
  border: solid 1.1px #403652;
  border-top: 0;
  border-bottom: 3px solid #3c1278;
}

.overlay {
  position: absolute;
  top: 0;
  background-color: #403652;
  opacity: 0.5;
  width: 100%;
  height: 100%;
}
</style>