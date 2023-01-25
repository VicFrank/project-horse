<template>
  <div>
    <b-alert v-if="error != ''" show variant="danger" dismissible>
      {{ error }}
    </b-alert>
    <b-alert v-if="success != ''" show variant="success" dismissible
      >Transaction Success!</b-alert
    >
    <div v-if="loading" class="d-flex justify-content-center mb-3">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div>Your SteamID is: {{ yourSteamID }}</div>
    <b-form-input
      v-model="steamID"
      placeholder="Enter Steam ID..."
    ></b-form-input>
    <b-button
      type="submit"
      variant="primary"
      class="mt-3"
      @click="getPlayerData(steamID)"
      >Find Player</b-button
    >

    <template v-if="playerData.username">
      <b-card class="mt-3">
        <b-card-title class="d-flex align-items-center"
          >{{ playerData.username }}
          <RankBadge
            class="ml-2"
            :badge="playerData.badge"
            :pips="playerData.pips"
            :rank="playerData.rank"
            :height="40"
          ></RankBadge>
          <img
            src="/images/battlepass_logo.png"
            alt="Battle Pass"
            style="height: 30px"
            :class="{ grayscale: !battlePass.unlocked }"
            v-b-tooltip.hover
            :title="
              battlePass.unlocked
                ? `Upgraded Battle Pass`
                : 'Has not Upgraded Battle Pass'
            "
          />
          <img
            src="/images/cosmetics/plus.png"
            alt="Plus Badge"
            v-b-tooltip.hover
            style="height: 30px"
            :title="
              playerData.has_plus
                ? `Plus Expires ${playerData.plus_expiration}`
                : 'Does not have plus'
            "
            :class="{
              grayscale: !playerData.has_plus,
            }"
          />
        </b-card-title>
        <b-card-sub-title> {{ playerData.steam_id }}</b-card-sub-title>
        <b-list-group flush>
          <b-list-group-item>
            <b-button v-b-modal.modal-1 variant="success" size="sm">+</b-button>
            Gold <span class="text-muted">{{ playerData.coins }}</span>
            <b-modal id="modal-1" title="Give Coins" @ok="giveCoins">
              <b-form-input type="number" v-model="coins"></b-form-input>
            </b-modal>
          </b-list-group-item>
          <b-list-group-item>
            <b-button v-b-modal.give-bp variant="success" size="sm">+</b-button>
            Battle Pass XP
            <span class="text-muted">{{ battlePass.total_xp }}</span>
            <b-modal id="give-bp" title="Give Battle Pass XP" @ok="giveBP">
              <b-form-input type="number" v-model="bp"></b-form-input>
            </b-modal>
          </b-list-group-item>
        </b-list-group>
      </b-card>

      <b-card title="Events">
        <b-button v-b-toggle.collapse-2 variant="primary">Events</b-button>
        <b-collapse
          id="collapse-2"
          class="mt-2 mb-2"
          @show="isCollapseOpen = true"
          @hidden="isCollapseOpen = false"
        >
          <b-card>
            <b-list-group-item
              v-for="[i, transaction] in Object.entries(transactions)"
              :key="i"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div>{{ transaction.log_event }}</div>
                  <div class="text-muted">
                    {{ new Date(transaction.log_time).toLocaleString() }}
                  </div>
                </div>
                <div>
                  <template v-if="transaction.log_event == 'paypal'"
                    >Item ID: {{ transaction.log_data.itemID }}</template
                  >
                  <template v-else>
                    <pre>{{ transaction.log_data }}</pre>
                  </template>
                </div>
              </div>
            </b-list-group-item>
          </b-card>
        </b-collapse>
      </b-card>

      <b-card title="Cosmetics">
        <b-button v-b-toggle.collapse-1 variant="primary">Give Items</b-button>
        <b-collapse id="collapse-1" class="mt-2 mb-2">
          <b-form-input
            v-model="cosmeticsFilter"
            placeholder="Search Items..."
          ></b-form-input>
          <b-card>
            <div
              v-for="option of filteredOptions"
              :key="option.value.cosmetic_id"
              class="d-flex align-items-center my-1"
            >
              <b-button
                :disabled="loading"
                variant="success"
                class="mr-3"
                @click="addItem(option.value)"
                >Add</b-button
              >
              <div>{{ option.text }}</div>
            </div>
          </b-card>
        </b-collapse>
        <h4 class="card-title">Inventory</h4>
        <div
          v-for="(cosmetic, index) in cosmetics"
          :key="
            cosmetic.cosmetic_id + cosmetic.created + cosmetic.equipped + index
          "
          class="d-flex align-items-center my-1"
        >
          <b-button
            v-b-modal.delete-item
            variant="danger"
            size="sm"
            class="mr-3"
            @click="setItem(cosmetic)"
            >x</b-button
          >
          {{ $t(`cosmetics.${cosmetic.cosmetic_name}`) }}
          <span class="text-muted mx-1">{{ cosmetic.cosmetic_name }}</span>
          <span v-if="cosmetic.equipped">: Equipped</span>
        </div>
      </b-card>
      <b-modal id="delete-item" title="Delete Item" @ok="deleteItem">
        <p>Delete this item from this player's inventory?</p>
        <pre style="color: white">{{ currentItem }}</pre>
      </b-modal>
    </template>
  </div>
</template>

<script>
import RankBadge from "../../../utility/RankBadge.vue";

export default {
  components: {
    RankBadge,
  },

  data: () => ({
    error: "",
    steamID: "",
    cosmeticsFilter: "",
    playerData: {},
    cosmetics: [],
    battlePass: {},
    options: [],
    filteredOptions: [],
    selected: [],
    loading: false,
    success: "",
    coins: null,
    bp: null,
    currentItem: {},
    transactions: [],
    showTransactions: false,
    isCollapseOpen: false,
  }),

  created() {
    fetch(`/api/cosmetics`)
      .then((res) => res.json())
      .then((cosmetics) => {
        this.options = cosmetics.map((cosmetic) => ({
          value: cosmetic,
          text: cosmetic.cosmetic_name,
        }));
        this.filteredOptions = this.options;
      })
      .catch((err) => (this.error = err));
  },

  computed: {
    yourSteamID() {
      return this.$store.state.auth.userSteamID;
    },
  },

  watch: {
    cosmeticsFilter: function () {
      if (!this.cosmeticsFilter) this.filteredOptions = this.options;
      else {
        this.filteredOptions = this.options.filter((option) => {
          return option.text
            .toLowerCase()
            .includes(this.cosmeticsFilter.toLowerCase());
        });
      }
    },
  },

  methods: {
    setItem(cosmetic) {
      this.currentItem = cosmetic;
    },
    getTransactions(steamID) {
      fetch(`/api/logs/players/${steamID}`)
        .then((res) => res.json())
        .then((transactions) => (this.transactions = transactions));
    },
    getPlayerData(steamID) {
      this.transactions = [];
      fetch(`/api/players/${steamID}`)
        .then((res) => res.json())
        .then((playerData) => {
          this.playerData = playerData;
          if (this.playerData.username == null) {
            this.error = "No player with this SteamID found";
          }
        })
        .catch((err) => (this.error = err));

      this.getTransactions(steamID);

      fetch(`/api/players/${steamID}/cosmetics`)
        .then((res) => res.json())
        .then((cosmetics) => {
          this.cosmetics = cosmetics;
        })
        .catch((err) => (this.error = err));

      fetch(`/api/players/${steamID}/battle_pass`)
        .then((res) => res.json())
        .then((battlePass) => {
          this.battlePass = battlePass;
        })
        .catch((err) => (this.error = err));
    },
    deleteItem() {
      const transaction = {
        itemTransaction: {
          items: {
            [this.currentItem.cosmetic_id]: -1,
          },
        },
      };

      this.currentItem = {};
      this.doTransaction(transaction);
    },
    addItem(item) {
      const transaction = {
        itemTransaction: {
          items: {
            [item.cosmetic_id]: 1,
          },
        },
      };

      this.doTransaction(transaction);
    },
    giveCoins() {
      this.doTransaction({
        itemTransaction: {
          coins: this.coins,
        },
      });
    },
    giveBP() {
      this.doTransaction({
        itemTransaction: {
          battlePass: {
            bonusExp: this.bp,
          },
        },
      });
    },
    doTransaction(transaction) {
      this.loading = true;

      fetch(`/api/players/${this.steamID}/transaction`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      })
        .then((res) => {
          if (!res.ok) throw Error("Transaction failed");
          return res;
        })
        .then((res) => res.json())
        .then((res) => {
          this.loading = false;
          this.success = res.message;
          this.getPlayerData(this.steamID);
          if (this.steamID === this.yourSteamID)
            this.$store.dispatch("REFRESH_COINS");
          this.$store.dispatch("REFRESH_BATTLE_PASS");
        })
        .catch((err) => {
          this.error == err;
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.add-button {
  font-size: 26px;
}

.grayscale {
  filter: grayscale(100%);
}
</style>
