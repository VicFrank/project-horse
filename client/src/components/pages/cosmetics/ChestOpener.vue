<template>
  <div>
    <img
      v-if="!opened"
      class="chest-image clickable"
      v-bind:src="cosmeticImageSrc(cosmetic)"
      :alt="cosmetic.cosmetic_name"
      @click="open"
    />
    <img
      v-else
      class="chest-image"
      v-bind:src="openedImage(cosmetic.cosmetic_name)"
      :alt="cosmetic.cosmetic_name"
    />
    <div v-if="items.length > 0" class="mt-2">
      <div>
        <div
          v-for="item of items"
          :key="item.cosmetic_id"
          class="text-center mb-2"
        >
          <div class="mb-2">{{ $t(`cosmetics.${item.cosmetic_name}`) }}</div>
          <img
            class="reward-image mb-1"
            v-bind:src="cosmeticImageSrc(item)"
            :alt="item.cosmetic_name"
          />
          <div class="text-muted">{{ item.rarity }}</div>
        </div>
      </div>
    </div>
    <div v-if="coins">
      <div class="h2 text-center blue">Coins</div>
      <div class="text-center">{{ coins }}</div>
    </div>
    <b-alert v-model="showError" variant="danger" dismissible>
      {{ error }}
    </b-alert>
    <div class="mt-4 d-flex justify-content-end">
      <b-button v-if="!opened" class="mr-2" variant="secondary" @click="cancel"
        >Close</b-button
      >
      <b-button v-if="!opened" class="mr-2" variant="primary" @click="open"
        >Open</b-button
      >
      <b-button v-else class="mr-2" variant="primary" @click="claim"
        >Claim Items</b-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    error: "",
    showError: false,
    items: [],
    coins: 0,
    opened: false,
  }),
  props: {
    cosmetic: {},
  },
  computed: {
    steamID() {
      return this.$store.state.auth.userSteamID;
    },
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    claim() {
      this.$emit("claim");
    },
    open() {
      const { cosmetic_id, cosmetic_type } = this.cosmetic;

      if (cosmetic_type !== "Chest") {
        this.error = "Tried to open an item that wasn't a chest";
        this.showError = true;
        return;
      }

      const audio = new Audio(require("../../../assets/sounds/inv_ticket.wav"));
      audio.volume = 0.08;
      audio.play();

      fetch(`/api/players/${this.steamID}/open_chest/${cosmetic_id}`, {
        method: "post",
      })
        .then((res) => {
          if (!res.ok) throw Error(res.statusText);
          return res;
        })
        .then((res) => res.json())
        .then((res) => {
          this.items = res.items;
          this.coins = res.coins;
          this.opened = true;
          if (res.coins) this.$store.dispatch("REFRESH_COINS");
          this.showError = false;
          this.$emit("open");
        })
        .catch((err) => {
          this.error = err;
          this.showError = true;
        });
    },
    cosmeticImageSrc(cosmetic) {
      const { cosmetic_name, cosmetic_type } = cosmetic;
      const includedTypes = [
        "Card Frame",
        "Chest",
        "Finisher",
        "Consumable",
        "Game Consumable",
      ];
      if (includedTypes.includes(cosmetic_type))
        return require(`../../../assets/images/cosmetics/${cosmetic_name}.png`);
      else return require(`../../../assets/images/cosmetics/placeholder.png`);
    },
    openedImage(cosmeticName) {
      return require(`../../../assets/images/cosmetics/${cosmeticName}_open.png`);
    },
  },
};
</script>

<style scoped>
.chest-image {
  width: 200px;
  height: 200px;
  display: block;
  margin: auto;
  transition: all 0.2s ease-in-out;
}

.chest-image:hover {
  transform: scale(1.1);
}

.clickable {
  cursor: pointer;
}

.reward-image {
  width: 150px;
  height: 150px;
}
</style>
