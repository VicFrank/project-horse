<template>
  <div>
    <h2>Cosmetics</h2>
    <!-- Set the sale item -->
    <b-button v-b-modal.set-sale variant="success" size="sm"
      >Set Sale Item</b-button
    >
    <b-modal
      id="set-sale"
      title="Set Sale Item"
      @ok="setSaleItem"
      :ok-disabled="
        !saleItem.cosmetic_id || !saleItem.cost_coins || saleItem.cost_coins < 0
      "
    >
      <b-form-group id="input-group-2" label="Sale Item" label-for="input-2">
        <b-form-select
          v-model="saleItem.cosmetic_id"
          :options="cosmeticOptions"
          placeholder="Select a cosmetic"
        ></b-form-select>
      </b-form-group>
      <b-form-group
        id="input-group-2"
        label="Price (coins)"
        label-for="input-2"
      >
        <b-form-input
          type="number"
          v-model="saleItem.cost_coins"
          placeholder="Price (coins)"
          class="mt-3"
        ></b-form-input>
      </b-form-group>
    </b-modal>
    <!-- Sale Item -->
    <b-card
      v-if="saleItem.cosmetic_name"
      class="my-3"
      style="max-width: 20rem"
      :img-src="`/images/cosmetics/${saleItem.cosmetic_name}.png`"
      img-alt="Image"
      img-top
      tag="article"
      bg-variant="dark"
      text-variant="light"
    >
      <b-card-body>
        <b-card-title>
          {{ $t(`cosmetics.${saleItem.cosmetic_name}`) }}</b-card-title
        >
        <b-card-text>
          <b>{{ saleItem.cost_coins }} coins</b>
        </b-card-text>
      </b-card-body>
    </b-card>
    <div v-if="!saleItem.cosmetic_name" class="mt-3">
      <p>No sale item set.</p>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    cosmeticOptions: [],
    saleItem: {
      cosmetic_id: null,
      cost_coins: null,
    },
  }),

  created() {
    fetch(`/api/cosmetics`)
      .then((res) => res.json())
      .then((cosmetics) => {
        this.cosmeticOptions = cosmetics.map((cosmetic) => ({
          value: cosmetic.cosmetic_id,
          text: cosmetic.cosmetic_name,
        }));
      });
    this.getSaleItem();
  },

  methods: {
    setSaleItem() {
      fetch(`/api/cosmetics/sale/update_sale`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.saleItem),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            this.$bvToast.toast("Sale item set!", {
              title: "Success",
              variant: "success",
              solid: true,
            });
          } else {
            this.$bvToast.toast("Failed to set sale item", {
              title: "Error",
              variant: "danger",
              solid: true,
            });
            this.getSaleItem();
          }
        });
    },
    getSaleItem() {
      fetch(`/api/cosmetics/sale/current_sale`)
        .then((res) => res.json())
        .then((res) => {
          this.saleItem = res;
        });
    },
  },
};
</script>

<style>
</style>