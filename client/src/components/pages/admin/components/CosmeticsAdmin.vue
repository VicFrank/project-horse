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
      @ok="addSaleItem"
      :ok-disabled="
        !saleItem.cosmetic_id ||
        !saleItem.cost_coins ||
        saleItem.cost_coins < 0 ||
        !saleItem.start_date ||
        !saleItem.end_date
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
      <b-form-group
        id="input-group-2"
        label="Start Date (utc)"
        label-for="input-2"
      >
        <b-form-input
          type="date"
          v-model="saleItem.start_date"
          placeholder="Start Date"
          class="mt-3"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        id="input-group-2"
        label="End Date (utc)"
        label-for="input-2"
      >
        <b-form-input
          type="date"
          v-model="saleItem.end_date"
          placeholder="End Date"
          class="mt-3"
        ></b-form-input>
      </b-form-group>
    </b-modal>
    <!-- Sale Item -->
    <h3>Current Sale</h3>
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
    <!-- Future Sales -->
    <h3>Sales</h3>
    <b-card
      v-for="sale in sales"
      :key="sale.cosmetic_id"
      class="my-3"
      style="max-width: 20rem"
      :img-src="`/images/cosmetics/${sale.cosmetic_name}.png`"
      img-alt="Image"
      img-top
      tag="article"
      bg-variant="dark"
      text-variant="light"
    >
      <b-card-body>
        <b-card-title>
          {{ $t(`cosmetics.${sale.cosmetic_name}`) }}</b-card-title
        >
        <b-card-text>
          <div>{{ sale.cost_coins }} coins</div>
          <div class="mt-2">
            <b-button
              v-b-modal="`update-sale-${sale.cosmetic_id}`"
              variant="success"
              size="sm"
              >Update</b-button
            >
          </div>
          <b-modal
            :id="`update-sale-${sale.cosmetic_id}`"
            title="Update Sale Item"
            @ok="updateSaleItem(sale)"
            :ok-disabled="
              !sale.cosmetic_id ||
              !sale.cost_coins ||
              sale.cost_coins < 0 ||
              !sale.start_date ||
              !sale.end_date
            "
          >
            <b-form-group
              id="input-group-2"
              label="Sale Item"
              label-for="input-2"
            >
              <b-form-select
                v-model="sale.cosmetic_id"
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
                v-model="sale.cost_coins"
                placeholder="Price (coins)"
                class="mt-3"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-2"
              label="Start Date"
              label-for="input-2"
            >
              <b-form-input
                type="date"
                v-model="sale.start_date"
                placeholder="Start Date"
                class="mt-3"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="input-group-2"
              label="End Date"
              label-for="input-2"
            >
              <b-form-input
                type="date"
                v-model="sale.end_date"
                placeholder="End Date"
                class="mt-3"
              ></b-form-input>
            </b-form-group>
          </b-modal>
          <div class="mt-2">
            <b-button variant="danger" size="sm" @click="deleteSaleItem(sale)"
              >Delete</b-button
            >
          </div>
        </b-card-text>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    cosmeticOptions: [],
    sales: [],
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
    this.getSales();
  },

  methods: {
    getSaleItem() {
      fetch(`/api/sales/current_sale`)
        .then((res) => res.json())
        .then((res) => {
          this.saleItem = res;
        });
    },
    getSales() {
      fetch(`/api/sales`)
        .then((res) => res.json())
        .then((res) => {
          this.sales = res.map((sale) => ({
            ...sale,
            start_date: sale.start_date.split("T")[0],
            end_date: sale.end_date.split("T")[0],
          }));
        });
    },
    addSaleItem() {
      fetch(`/api/sales`, {
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
            this.getSales();
          }
        });
    },
    updateSaleItem(sale) {
      fetch(`/api/sales/${sale.sale_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sale),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            this.$bvToast.toast("Sale item updated!", {
              title: "Success",
              variant: "success",
              solid: true,
            });
          } else {
            this.$bvToast.toast("Failed to update sale item", {
              title: "Error",
              variant: "danger",
              solid: true,
            });
          }
        });
    },
    deleteSaleItem(sale) {
      if (!sale.sale_id) {
        this.sales = this.sales.filter((s) => s.start_date !== sale.start_date);
        return;
      }
      fetch(`/api/sales/${sale.sale_id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            this.$bvToast.toast("Sale item deleted!", {
              title: "Success",
              variant: "success",
              solid: true,
            });
          } else {
            this.$bvToast.toast("Failed to delete sale item", {
              title: "Error",
              variant: "danger",
              solid: true,
            });
          }
          this.getSaleItem();
          this.getSales();
        });
    },
  },
};
</script>

<style>
</style>