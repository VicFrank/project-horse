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
      <b-card
        :title="playerData.username"
        :sub-title="playerData.steam_id"
        class="mt-3"
      >
        <b-list-group flush>
          <b-list-group-item>
            Coins {{ playerData.coins }}
            <b-button v-b-modal.modal-1 variant="success" size="sm" class="ml-5"
              >+</b-button
            >
            <b-modal id="modal-1" title="Give Coins" @ok="giveCoins">
              <b-form-input type="number" v-model="coins"></b-form-input>
            </b-modal>
          </b-list-group-item>
          <b-list-group-item
            >Patreon Level {{ playerData.patreon_level }}</b-list-group-item
          >
          <b-list-group-item>MMR {{ playerData.mmr }}</b-list-group-item>
          <b-list-group-item>
            Battle Pass XP:
            <!-- {{ playerData.battlePass.total_experience }} -->
            (TODO: List current xp here)
            <b-button v-b-modal.give-bp variant="success" size="sm" class="ml-5"
              >+</b-button
            >
            <b-modal id="give-bp" title="Give Battle Pass XP" @ok="giveBP">
              <b-form-input type="number" v-model="bp"></b-form-input>
            </b-modal>
          </b-list-group-item>
        </b-list-group>
      </b-card>

      <!-- <b-card title="Transactions">
        <b-button v-b-toggle.collapse-2 variant="primary"
          >Transactions</b-button
        >
        <b-collapse id="collapse-2" class="mt-2 mb-2">
          <b-card>
            <b-list-group-item
              v-for="[i, transaction] in Object.entries(transactions)"
              :key="i"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <div>{{ transaction.log_event }}</div>
                  <div class="faded">
                    {{ transaction.log_time | dateFromNow }}
                  </div>
                </div>
                <div>
                  <template v-if="transaction.log_event == 'paypal'"
                    >Item ID: {{ transaction.log_data.itemID }}</template
                  >
                  <template v-else>{{ transaction.log_data }}</template>
                </div>
              </div>
            </b-list-group-item>
          </b-card>
        </b-collapse>
      </b-card> -->

      <b-card title="Cosmetics">
        <b-button v-b-toggle.collapse-1 variant="primary">Give Items</b-button>
        <b-collapse id="collapse-1" class="mt-2 mb-2">
          <b-card>
            <b-form-select
              v-model="selected"
              :options="options"
              multiple
              :select-size="20"
            ></b-form-select>
            <div class="mt-3">
              <strong>{{ selected }}</strong>
            </div>
            <b-button variant="success" class="mt-2" @click="addCosmeticItem"
              >Add</b-button
            >
          </b-card>
        </b-collapse>
        <b-list-group-item
          v-for="cosmetic in cosmetics"
          :key="cosmetic.cosmetic_id + cosmetic.created + cosmetic.equipped"
          class="mt-2"
        >
          {{ cosmetic.cosmetic_name }}
          <span v-if="cosmetic.equipped">: Equipped</span>
          <b-button
            v-b-modal.delete-item
            variant="danger"
            size="sm"
            class="ml-5"
            @click="setItem(cosmetic)"
            >x</b-button
          >
        </b-list-group-item>
      </b-card>
      <b-modal id="delete-item" title="Delete Item" @ok="deleteItem">
        <p>Delete this item from this player's inventory?</p>
        {{ currentItem }}
      </b-modal>
    </template>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    steamID: "",
    playerData: {},
    cosmetics: [],
    options: [],
    selected: [],
    loading: false,
    success: "",
    coins: null,
    bp: null,
    currentItem: {},
    transactions: [],
    showTransactions: false,
  }),

  created() {
    fetch(`/api/cosmetics`)
      .then((res) => res.json())
      .then((cosmetics) => {
        this.options = cosmetics.map((cosmetic) => ({
          value: cosmetic,
          text: cosmetic.cosmetic_name,
        }));
        this.options.push({
          value: null,
          text: "Select a cosmetic to add...",
        });
      })
      .catch((err) => (this.error = err));
  },

  computed: {
    yourSteamID() {
      return this.$store.state.auth.userSteamID;
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
          if (!this.playerData.username) {
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
    },
    deleteItem() {
      const itemToDelete = this.currentItem;
      const items = {};
      items[itemToDelete.cosmetic_id] = "-1";

      const transaction = {
        itemTransaction: {
          items,
        },
      };

      this.currentItem = {};
      this.doTransaction(transaction);
    },
    addCosmeticItem() {
      const selectedItems = this.selected;
      let items = {};
      for (const item of selectedItems) {
        items[item.cosmetic_id] = "1";
      }
      const transaction = {
        itemTransaction: {
          items,
        },
      };

      this.selected = [];
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
          console.log(
            this.steamID,
            this.yourSteamID,
            this.steamID === this.yourSteamID
          );
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
</style>
