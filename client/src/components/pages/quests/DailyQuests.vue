<template>
  <div class="content">
    <div class="quest container p-0">
      <b-alert v-model="showError" show variant="danger" dismissible>
        {{ error }}
      </b-alert>
      <div class="row">
        <template v-if="loading">
          <div class="col-sm-12 col-md-12 col-lg-4 col-xl-4">
            <div class="single-quest loading-quest"></div>
            <div class="quest-xp loading-quest-footer"></div>
          </div>
          <div class="col-sm-12 col-md-12 col-lg-4 col-xl-4">
            <div class="single-quest loading-quest"></div>
            <div class="quest-xp loading-quest-footer"></div>
          </div>
        </template>
        <div
          v-for="quest in quests"
          :key="quest.quest_id"
          class="col-sm-12 col-md-12 col-lg-4 col-xl-4"
        >
          <div class="single-quest">
            <p>{{ quest.quest_name }}</p>
            <ProgressBar
              :progress="quest.capped_quest_progress"
              :required="quest.required_amount"
            />
          </div>
          <div class="d-flex flex-row quest-xp">
            <div v-if="!quest.claimed" class="quest-rewards">
              <span v-if="quest.coin_reward > 0" class="pog-text mr-1">
                <img class="coin" src="/images/coin1.png" alt="Gold" />
                {{ quest.coin_reward }}
              </span>
              <span v-if="quest.xp_reward > 0" class="quest-xp-text"
                >{{ quest.xp_reward }} {{ $t("common.xp") }}</span
              >
            </div>
            <img
                style="height: 100%; width: auto; object-fit: cover"
                v-if="quest.cosmetic_name"
                v-bind:src="`/images/cosmetics/${quest.cosmetic_name}.png`"
                :alt="quest.cosmetic_name"
              />
            <button
              v-on:click="claimQuest(quest)"
              v-if="quest.quest_completed && !quest.claimed"
              type="button"
              class="btn btn-primary ml-auto mr-3 my-2"
            >
              {{ $t("common.claim") }}
            </button>
            <a
              v-if="quest.can_reroll"
              v-on:click="rerollQuest(quest)"
              class="ml-auto mr-3 reroll-button"
            >
              <img src="./reroll.svg" alt="Reroll" />
            </a>
            <template v-else-if="!quest.quest_completed">
              <span class="ml-auto mr-2 next-quest-text">{{
                getTimeUntilReroll(quest.created)
              }}</span>
              <a class="mr-3 reroll-button-inactive">
                <img src="./reroll.svg" alt="Reroll" />
              </a>
            </template>
            <template v-else-if="quest.claimed">
              <span class="ml-auto mr-2 next-quest-text">{{
                getTimeUntilNextQuest(quest.created)
              }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "../../utility/ProgressBar";
import dayjs from "dayjs";
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default {
  data: () => ({
    error: "",
    showError: false,
    quests: [],
    loading: true,
  }),

  components: {
    ProgressBar,
  },

  created() {
    this.getDailyQuests();
  },

  methods: {
    getTimeUntilReroll(created) {
      const time = dayjs(created).add(24, "hours").fromNow();
      return `Can refresh ${time}`;
    },
    getTimeUntilNextQuest(created) {
      const time = dayjs(created).add(24, "hours").fromNow();
      return `New Quest ${time}`;
    },
    getDailyQuests() {
      // time request
      fetch(`/api/players/${this.$store.state.auth.userSteamID}/daily_quests`)
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
    rerollQuest(quest, index) {
      const { quest_id } = quest;
      this.quests = this.quests.map((q) =>
        q.quest_id === quest_id ? { ...q, can_reroll: false } : q
      );
      fetch(
        `/api/players/${this.$store.state.auth.userSteamID}/daily_quests/reroll?questID=${quest_id}`,
        { method: "post" }
      )
        .then((res) => {
          if (!res.ok) throw Error(res.statusText);
          return res;
        })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            this.quests = this.quests.splice(index);
            // refresh the daily quests
            this.getDailyQuests();
          }
        })
        .catch((err) => {
          this.error = err;
          this.showError = true;
        });
    },
    claimQuest(quest) {
      const { quest_id } = quest;
      this.quests = this.quests.map((q) =>
        q.quest_id === quest_id ? { ...q, claimed: true } : q
      );
      fetch(
        `/api/players/${this.$store.state.auth.userSteamID}/daily_quests/claim?questID=${quest_id}`,
        { method: "post" }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            // refresh the daily quests
            this.getDailyQuests();
            this.$store.dispatch("REFRESH_BATTLE_PASS");
            this.$store.dispatch("REFRESH_PLAYER");
          }
        })
        .catch((err) => {
          this.error = err;
          this.showError = true;
        });
    },
  },
};
</script>

<style scoped>
.coin {
  width: 20px;
  height: 20px;
}
.reroll-button {
  cursor: pointer;
  line-height: 43px;
}

.reroll-button-inactive {
  cursor: default;
  line-height: 43px;
}

.reroll-button-inactive img {
  opacity: 0.4;
  filter: alpha(opacity=40); /* msie */
  background-color: #000;
  border-radius: 100%;

  cursor: default;
}

.single-quest {
  border: solid 1.1px #403652;
  background-color: #2d223b;
  padding: 2em 1em;
  border-bottom: 0;
}

.single-quest p {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #fcfcfc;
  font-family: "Radiance-Semibold";
}

.quest-xp {
  height: 50px;
  background-color: #1f1a2b;
  border: solid 1.1px #403652;
  border-top: 0;
  border-bottom: 3px solid #3c1278;
}

.next-quest-text {
  line-height: 50px;
}

.quest-rewards {
  padding: 1rem;
}

.loading-quest {
  height: 117px;
}

.loading-quest-footer {
  height: 50px;
}
</style>
