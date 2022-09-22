<template>
  <div>
    <h1 class="page-title" v-t="'store.page_title'"></h1>
    <div class="container">
      <div class="row" v-if="!$route.query.type">
        <div class="sale">
          <router-link
            v-if="cosmetics.length > 0"
            :to="getCheckoutLink('buy_bp')"
          >
            <img
              src="/images/cosmetics/buy_bp.png"
              alt="Buy Battle Pass"
              class="promoted"
            />
          </router-link>
          <div class="overlay">
            <h3 v-t="'cosmetics.buy_bp'"></h3>
          </div>
        </div>
        <div class="sale">
          <router-link
            v-if="cosmetics.length > 0"
            :to="getCheckoutLink('plus_year_package')"
          >
            <img
              src="/images/cosmetics/plus_year_package.png"
              alt="Buy Plus Year Package"
              class="promoted"
            />
          </router-link>
          <div class="overlay">
            <h3 v-t="'cosmetics.plus_year_package'"></h3>
          </div>
        </div>
      </div>
      <div class="row">
        <b-alert
          v-model="showError"
          style="width: 100%"
          variant="danger"
          dismissible
        >
          {{ error }}
        </b-alert>

        <div class="cosmetics">
          <div
            class="cosmetics__item"
            v-for="cosmetic in shopCosmetics"
            :key="cosmetic.cosmetic_id"
          >
            <div
              class="cosmetic shop-item"
              @click="$bvModal.show(`bp-modal-${cosmetic.cosmetic_id}`)"
            >
              <div>
                <img
                  :src="`/images/cosmetics/${cosmetic.cosmetic_name}.png`"
                  :alt="cosmetic.cosmetic_name"
                  class="preview-image"
                />
              </div>
              <div class="cosmetic__descr">
                <div class="cosmetic__name mb-1">
                  {{ $t(`cosmetics.${cosmetic.cosmetic_name}`) }}
                </div>
                <div class="text-muted">
                  {{ $t(`cosmetic_types.${cosmetic.cosmetic_type}`) }}
                </div>
                <div class="cosmetic__price">
                  <span class="cosmetic-price">
                    <template v-if="cosmetic.cost_coins > 0">
                      {{ cosmetic.cost_coins.toLocaleString() }}
                      {{ $t("common.coins") }}
                    </template>
                    <template v-else>${{ cosmetic.cost_usd }}</template>
                  </span>
                </div>
              </div>
            </div>
            <b-modal
              :id="`bp-modal-${cosmetic.cosmetic_id}`"
              :ref="`bp-modal-${cosmetic.cosmetic_id}`"
              centered
              hide-header
              hide-footer
            >
              <p class="text-center h4">
                {{ $t(`cosmetics.${cosmetic.cosmetic_name}`) }}
              </p>
              <div class="text-center text-muted mb-3">
                {{ $t(`cosmetic_types.${cosmetic.cosmetic_type}`) }}
              </div>
              <p class="text-center">
                <template v-if="cosmetic.cost_coins > 0">
                  {{ cosmetic.cost_coins }} {{ $t("common.coins") }}
                </template>
                <template v-else>${{ cosmetic.cost_usd }}</template>
              </p>
              <div>
                <b-img-lazy
                  class="preview-image"
                  v-bind:src="cosmeticImageSrc(cosmetic)"
                  :alt="cosmetic.cosmetic_name"
                />
              </div>
              <CosmeticDescription :cosmetic="cosmetic" class="mt-4" />
              <div v-if="loggedIn" class="mt-4 d-flex justify-content-end">
                <b-button
                  class="mr-2"
                  variant="secondary"
                  @click="hideModal(cosmetic.cosmetic_id)"
                  >{{ $t("armory.cancel") }}</b-button
                >
                <b-button
                  v-if="cosmetic.cost_usd > 0"
                  class="mr-2"
                  variant="primary"
                  :to="getCheckoutLink(cosmetic.cosmetic_name)"
                  >{{ $t("store.buy") }}</b-button
                >
                <b-button
                  v-else
                  :disabled="coins < cosmetic.cost_coins"
                  class="mr-2"
                  variant="primary"
                  v-b-modal.modal-confirm-purchase
                  @click="currentCosmetic = cosmetic"
                  >{{ $t("store.buy") }}</b-button
                >
              </div>
              <div v-else class="mt-4 d-flex justify-content-center">
                <LoginButton />
              </div>
            </b-modal>
          </div>
        </div>
      </div>
    </div>
    <ConfirmPurchase
      :cosmetic="currentCosmetic"
      v-on:buy="buyItem"
      v-on:cancel="hideModal"
    />
  </div>
</template>

<script>
import ConfirmPurchase from "./components/ConfirmPurchase.vue";
import CosmeticDescription from "../cosmetics/CosmeticDescription.vue";
import LoginButton from "../../utility/LoginButton.vue";

export default {
  components: {
    LoginButton,
    ConfirmPurchase,
    CosmeticDescription,
  },

  data: () => ({
    error: "",
    showError: false,
    success: false,
    loading: false,
    currentCosmetic: {},
    cosmetics: [],
    shopCosmetics: [],
    sortPriorities: {
      "Card Frame": 1,
      Chest: 2,
    },
  }),

  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
    coins() {
      return this.$store.state.auth.coins;
    },
  },

  created() {
    // get query params
    const itemType = this.$route.query.type;
    if (this.loggedIn && this.steamID) {
      fetch(`/api/players/${this.steamID}/cosmetics`)
        .then((res) => res.json())
        .then((cosmetics) => {
          this.ownedCosmetics = cosmetics;
        })
        .catch((err) => {
          this.showError = true;
          this.error = err;
        });
    }

    fetch(`/api/cosmetics`)
      .then((res) => res.json())
      .then((cosmetics) => {
        this.cosmetics = cosmetics;
        this.shopCosmetics = cosmetics
          .filter((cosmetic) => {
            if (!itemType) return true;
            switch (itemType) {
              case "gold":
                return cosmetic.cosmetic_name.includes("gold_");
              case "chest":
                return cosmetic.cosmetic_name.includes("chest_");
              case "xp":
                return cosmetic.cosmetic_name.includes("_xp_");
              case "plus":
                return cosmetic.cosmetic_name.includes("plus_");
              case "gods":
                return cosmetic.cosmetic_name.includes("card_");
              default:
                return true;
            }
          })
          .filter(
            (cosmetic) => cosmetic.cost_coins > 0 || cosmetic.cost_usd > 0
          )
          .sort((c1, c2) => {
            // order as battlepass, plus, gods, chests
            const c1Type = this.sortPriorities[c1.cosmetic_type] || 3;
            const c2Type = this.sortPriorities[c2.cosmetic_type] || 3;
            if (c1Type !== c2Type) {
              return c1Type - c2Type;
            }
            const c1Start = c1.cosmetic_name.slice(0, 5);
            const c2Start = c2.cosmetic_name.slice(0, 5);
            if (c1Start !== c2Start) {
              if (c1Start === "chest") return -1;
              if (c2Start === "chest") return 1;
              return c1Start.localeCompare(c2Start);
            }
            return c1.cost_usd - c2.cost_usd;
          });
      })
      .catch((err) => {
        this.error = err;
        this.showError = true;
      });
  },

  methods: {
    hideModal(cosmeticID) {
      this.$refs[`bp-modal-${cosmeticID}`][0].hide();
    },
    getCheckoutLink(cosmeticName) {
      const cosmetic = this.cosmetics.find(
        (c) => c.cosmetic_name === cosmeticName
      );
      if (cosmetic) return `checkout/${cosmetic.cosmetic_id}`;
      return "checkout";
    },
    buyItem(cosmetic) {
      const { cosmetic_id, cost_coins } = cosmetic;
      this.hideModal(cosmetic_id);

      // We can't afford this item
      if (this.coins < cost_coins) {
        return;
      }

      this.selected = [];
      this.loading = true;

      fetch(`/api/players/${this.steamID}/buy_item/${cosmetic_id}`, {
        method: "post",
      })
        .then((res) => res.json())
        .then((res) => {
          this.loading = false;
          document.documentElement.scrollTop = 0;
          if (res.error) {
            this.error = res.error;
            this.showError = true;
          } else {
            this.success = true;
            this.$store.dispatch("REFRESH_COINS");
          }
        })
        .catch((err) => {
          this.error = err;
          this.loading = false;
          this.showError = true;
          document.documentElement.scrollTop = 0;
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
.shop-item {
  cursor: pointer;
}

.promoted {
  width: auto;
  height: 300px;
}

.preview-image {
  width: 200px;
  height: 200px;
  display: block;
  margin: auto;
}

.featured {
  position: relative;
  /* margin-top: 50px; */
  text-align: center;
  margin-bottom: 120px;
  box-shadow: 0 0 15px 0 #724596;
  width: 200px;
}

.sale {
  position: relative;
}

.featured h3,
.sale h3 {
  font-size: 20px;
  font-family: "Radiance-Semibold";
  line-height: 1.2;
  letter-spacing: 0.23px;
  text-align: center;
  color: #fcfcfc;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.featured p,
.sale p {
  font-size: 18px;
  font-family: "Radiance-Semibold";
  line-height: 1;
  letter-spacing: 0.45px;
  text-align: center;
  color: var(--primary-color);
}

.featured img,
.sale img {
  position: relative;
  transition: 0.25s ease-in-out;
  width: 100%;

  cursor: pointer;
}

.sales-overlay {
  position: absolute !important;
  bottom: 0;
  top: 0;
  left: 0;
  width: 100%;
}

.overlay {
  height: 60px;
  opacity: 0.8;
  padding: 0.2em 1em 1em;
  background-color: #000000;
}

.sale {
  text-align: center;
  margin: 0 auto 40px;
  box-shadow: 0 0 15px 0 #784596;

  width: 300px;
}
</style>