<template>
  <div>
    <h1 class="page-title" v-t="'achievements.page_title'"></h1>
    <div>
      <b-alert v-if="error != ''" show variant="danger" dismissible>{{
        error
      }}</b-alert>
      <div v-if="loading" class="d-flex justify-content-center mb-3">
        <b-spinner label="Loading..."></b-spinner>
      </div>
      <div class="row" v-for="quest in achievements" :key="quest.quest_id">
        <div class="col-xl-12">
          <div class="achievement">
            <div class="achievement-row">
              <div class="description">
                <i
                  v-for="i in quest.questTier"
                  :key="i"
                  class="fas fa-star mb-2"
                ></i>
                <h3>{{ quest.quest_name }}</h3>
                <p class="achievement-description">
                  {{ quest.quest_description }}
                </p>
              </div>
              <div class="rewards">
                <p v-if="quest.coin_reward > 0" class="pog-text">
                  {{ quest.coin_reward }} COINS
                </p>
                <p class="quest-xp-text">{{ quest.xp_reward }} XP</p>
              </div>
            </div>
            <ProgressBar
              :progress="quest.capped_quest_progress"
              :required="quest.required_amount"
            />
            <button
              v-on:click="claimQuest(quest)"
              v-if="quest.quest_completed && !quest.claimed"
              type="button"
              class="btn btn-primary mt-3"
            >
              Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "../../utility/ProgressBar";

export default {
  data: () => ({
    error: "",
    achievements: [],
    loading: true,
  }),

  components: {
    ProgressBar,
  },

  created() {
    this.getAchievements();
  },

  methods: {
    getProgressPercent(quest) {
      const progress = quest.capped_quest_progress;
      const required = quest.required_amount;

      const percent = Math.min((progress * 100) / required, 100);
      return percent;
    },
    getAchievements() {
      fetch(`/api/players/${this.$store.state.auth.userSteamID}/achievements`)
        .then((res) => res.json())
        .then((quests) => {
          this.loading = false;
          this.achievements = quests;
        });
    },
    claimQuest(quest) {
      const { quest_id } = quest;
      // show the quest as claimed in the ui
      this.achievements = this.achievements.map((achievement) =>
        achievement.quest_id === quest_id
          ? { ...achievement, claimed: true }
          : achievement
      );
      fetch(
        `/api/players/${this.$store.state.auth.userSteamID}/achievements/claim?questID=${quest_id}`,
        { method: "post" }
      )
        .then((res) => {
          if (!res.ok) throw Error(res.statusText);
          return res;
        })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            this.getAchievements();
            this.$store.dispatch("REFRESH_BATTLE_PASS");
            this.$store.dispatch("REFRESH_PLAYER");
          }
        })
        .catch((err) => {
          this.error = err;
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        });
    },
  },
};
</script>

<style scoped>
.achievement {
  position: relative;
  margin: 0.75em auto;
  padding: 2em 4em;
  border: solid 1.1px #364552;
  /* border: solid 1px #202e3a;
    background-color: #172126; */
  background-color: #222e3b;
}

.achievement h3 {
  font-family: "Radiance-Semibold";
  font-weight: 800;
  font-size: 22px;
  letter-spacing: 0.5px;
  color: #fcfcfc;
  text-transform: uppercase;
}

.achievement-description {
  font-size: 18px;
  color: #fcfcfc;
}

.achievement-row {
  display: flex;
}

.description {
  width: 75%;
}

.rewards {
  width: 25%;
}
</style>
