<template>
  <div>
    <h1 class="page-title">Battle Pass</h1>
    <div class="timeline">
      <ul class="battlepass-timeline">
        <li v-for="i in 50" :key="i">
          <div
            class="timeline-container"
            v-bind:class="{ left: i % 2 === 0, right: i % 2 === 1 }"
          >
            <div class="timeline-content">
              <span
                v-b-tooltip.hover.html
                :title="`${$t('battle_pass.level_tooltip', {
                  total_xp: getLevelTotalXP(i),
                  next_level: getNextLevelXP(i),
                })}`"
              >
                {{ $t("battle_pass.level") }} {{ i }}
                <i class="fas fa-info-circle info-icon"></i>
              </span>
              <div class="lvl-wrapper">
                <template v-if="loading">
                  <img src="./images/bp_placeholder.png" alt="placeholder" />
                </template>
                <template v-else>
                  <img
                    v-if="getItemImage(i)"
                    :src="getItemImage(i)"
                    :alt="getRewardItem(i)"
                    @click="$bvModal.show(`bp-modal-${i}`)"
                  />
                  <b-modal
                    v-if="getRewardItem(i)"
                    :id="`bp-modal-${i}`"
                    centered
                    hide-header
                    hide-footer
                  >
                    <h2 class="mb-2 text-center">{{ getRewardItem(i) }}</h2>

                    <div class="text-center">
                      <div>
                        <img
                          v-if="getItemImage(i)"
                          :src="getItemImage(i)"
                          :alt="getRewardItem(i)"
                          class="mb-2"
                        />
                      </div>
                      (Cosmetic description goes here)
                    </div>
                  </b-modal>
                </template>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    rewards: [],
    loading: true,
  }),

  created() {
    fetch(`/api/battle_pass/levels`)
      .then((res) => res.json())
      .then((rewards) => {
        this.rewards = rewards;
        this.loading = false;
      })
      .catch((err) => (this.error = err));
  },

  computed: {
    bpLevel() {
      return this.$store.getters.bpLevel;
    },
  },

  methods: {
    isEven(number) {
      return number % 2 === 0;
    },
    getRewards(level) {
      return this.rewards[level - 1];
    },
    getRewardItem(level) {
      const reward = this.rewards[level - 1].cosmetic_id;
      return reward;
    },
    getLevelTotalXP(level) {
      if (!this.getRewards(level)) return null;
      return this.getRewards(level).total_xp;
    },
    getNextLevelXP(level) {
      if (!this.getRewards(level)) return null;
      return this.getRewards(level).next_level_xp;
    },
    hasItemReward(level) {
      return this.rewards[level - 1].cosmetic_id !== null;
    },
    getItemImage(level) {
      const cosmetic_id = this.getRewardItem(level);
      if (!cosmetic_id || cosmetic_id === null)
        return require("./images/bp_placeholder.png");

      return require(`./images/${cosmetic_id}.png`);
    },
  },
};
</script>

<style scoped>
.info-icon {
  font-size: 12px;
  vertical-align: top;
}

.modal-content {
  /* color: #212529; */
  background-color: #13171d;
}

.close {
  color: white;
}

.modal-backdrop {
  opacity: 0.5;
}

.modal-title {
  font-size: 36px;
}

.reward {
  text-align: center;
  margin-bottom: 10px;

  font-size: 24px;
}

.reward-image {
  width: auto;
  height: 30px;
}

.battlepass-timeline {
  position: relative;
  width: 960px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 1em 0;
  list-style-type: none;
}

.battlepass-timeline:before {
  position: absolute;
  left: 50%;
  top: 0;
  content: " ";
  display: block;
  width: 6px;
  height: 100%;
  margin-left: -3px;
  background-image: linear-gradient(
    to bottom,
    #135272,
    #0b86c4 48%,
    #135272 99%
  );
  z-index: 5;
}

.battlepass-timeline li:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.left {
  position: relative;
  width: 300px;
  float: left;
  text-align: right;
}

.left:before {
  position: absolute;
  left: 110%;
  top: -70px;
  transform: rotate(90deg);
  content: " ";
  display: block;
  width: 6px;
  height: 300px;
  background-image: linear-gradient(
    to bottom,
    #135272,
    #0b86c4 48%,
    #135272 99%
  );
  z-index: -1;
}

.left span {
  position: relative;
  left: 52%;
  bottom: -31px;
  font-size: 32px;
  color: #fcfcfc;
}

.right {
  position: relative;
  width: 300px;
  float: right;
}

.right:before {
  position: absolute;
  right: 110%;
  top: -70px;
  transform: rotate(90deg);
  content: " ";
  display: block;
  width: 6px;
  height: 300px;
  background-image: linear-gradient(
    to bottom,
    #135272,
    #0b86c4 48%,
    #135272 99%
  );
  z-index: -1;
}

.right span {
  position: relative;
  right: 52%;
  bottom: -31px;
  font-size: 32px;
  color: #fcfcfc;
}

.lvl-wrapper {
  position: relative;
  display: inline-block;
  top: -1em;

  width: 300px;
}

.lvl-wrapper img {
  height: 150px;

  cursor: pointer;
}

.lvl-wrapper img:hover {
  box-shadow: 0 0 30px 0 rgba(11, 134, 196, 0.3);
}

.lvl-locked {
  box-shadow: unset;
  filter: grayscale(100%);
}

.lvl-locked:hover {
  filter: grayscale(0%);
}

/* Media queries - Responsive timeline on screens less than 600px wide */
@media screen and (max-width: 960px) {
  .battlepass-timeline {
    width: 480px;
  }

  .battlepass-timeline:before {
    left: 100%;
  }

  .right {
    position: relative;
    width: 300px;
    float: left;
    text-align: right;
  }

  .right:before {
    position: absolute;
    left: 110%;
    top: -70px;
    transform: rotate(90deg);
    content: " ";
    display: block;
    width: 6px;
    height: 300px;
    background-image: linear-gradient(
      to bottom,
      #135272,
      #0b86c4 48%,
      #135272 99%
    );
    z-index: -1;
  }

  .right span {
    position: relative;
    left: 52%;
    bottom: -31px;
    font-size: 32px;
    color: #fcfcfc;
  }
}
</style>