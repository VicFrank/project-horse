<template>
  <div>
    <div class="d-flex justify-content-between">
      <div>
        <div>
          <b-badge variant="success" class="m-2">
            {{ numActiveAbilities }} Active Abilities
          </b-badge>
        </div>
        <div>
          <b-form-checkbox v-model="showDeprecated" @change="filterAbilities()"
            >Show Deprecated</b-form-checkbox
          >
        </div>
      </div>

      <div>
        <b-button variant="primary" size="sm" v-b-modal.create-ability>
          <b-icon-plus icon="plus" aria-hidden="true"></b-icon-plus>
          Add Ability
        </b-button>
      </div>

      <AddAbilityModal @onCreateAbility="createAbility"></AddAbilityModal>
    </div>
    <div class="abilities-container">
      <div
        v-for="ability of filteredAbilities"
        :key="ability.ability_name"
        class="text-center m-3"
        style="position: relative"
      >
        <div v-if="!ability.active" class="overlay"></div>
        <AbilityImage
          class="mx-auto"
          :icon="ability.icon"
          :size="100"
        ></AbilityImage>
        <div
          v-bind:class="{
            'my-1': true,
            'text-muted': !ability.active,
          }"
        >
          {{ $t(`abilities.${ability.ability_name}`) }}
        </div>
        <div class="text-muted full-name">{{ ability.ability_name }}</div>
        <div v-if="ability.error" class="text-danger">Error</div>
        <div>
          <b-button
            variant="secondary"
            size="sm"
            @click="toggleActive(ability)"
          >
            <template v-if="ability.active">
              <b-icon-x icon="x"></b-icon-x>
              Disable
            </template>
            <template v-if="!ability.active">
              <b-icon-check icon="check"></b-icon-check>
              Enable
            </template>
            <b-spinner
              small
              v-if="ability.loading"
              :label="Loading"
            ></b-spinner>
          </b-button>
        </div>
        <div>
          <b-button
            variant="danger"
            size="sm"
            @click="toggleDeprecated(ability)"
          >
            <template v-if="ability.deprecated">
              <b-icon-arrow-counterclockwise
                icon="arrow-counterclockwise"
              ></b-icon-arrow-counterclockwise>
              Undeprecate</template
            >
            <template v-if="!ability.deprecated">
              <b-icon-x icon="x"></b-icon-x>
              Deprecate</template
            >
            <b-spinner
              small
              v-if="ability.loading"
              :label="Loading"
            ></b-spinner>
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AbilityImage from "../../games/components/AbilityImage.vue";
import AddAbilityModal from "./AddAbilityModal.vue";

// import the icons
import {
  BIconPlus,
  BIconX,
  BIconCheck,
  BIconArrowCounterclockwise,
} from "bootstrap-vue";

export default {
  components: {
    AbilityImage,
    AddAbilityModal,
    BIconPlus,
    BIconX,
    BIconCheck,
    BIconArrowCounterclockwise,
  },

  data: () => ({
    loading: true,
    showDeprecated: false,
    abilities: [],
    filteredAbilities: [],
    numActiveAbilities: null,
  }),

  created() {
    fetch(`/api/abilities`)
      .then((res) => res.json())
      .then((abilities) => {
        this.abilities = abilities;
        this.updateNumActive();
        this.filterAbilities();
        this.loading = false;
      });
  },

  methods: {
    filterAbilities() {
      this.filteredAbilities = this.abilities.filter((ability) => {
        if (this.showDeprecated) return true;
        return !ability.deprecated;
      });
    },

    updateNumActive() {
      this.numActiveAbilities = this.abilities.filter(
        (ability) => ability.active && !ability.deprecated
      ).length;
    },

    toggleActive(ability) {
      ability.loading = true;
      const { active, deprecated } = ability;
      fetch(`/api/abilities/${ability.ability_name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: !active,
          deprecated,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          ability.active = data.active;
          ability.loading = false;
          this.updateNumActive();
        })
        .catch(() => {
          ability.error = true;
          ability.loading = false;
        });
    },

    toggleDeprecated(ability) {
      ability.loading = true;
      const { deprecated } = ability;
      fetch(`/api/abilities/${ability.ability_name}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: false,
          deprecated: !deprecated,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          ability.deprecated = data.deprecated;
          ability.loading = false;
          this.updateNumActive();
        })
        .catch(() => {
          ability.error = true;
          ability.loading = false;
        });
    },

    createAbility(ability) {
      fetch(`/api/abilities/${ability.ability_name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ability),
      })
        .then((res) => res.json())
        .then((data) => {
          this.abilities.unshift(data);
          this.updateNumActive();
          this.filterAbilities();
        })
        .catch(() => {
          this.$bvToast.toast("Error creating ability", {
            title: "Error",
            variant: "danger",
            solid: true,
          });
        });
    },
  },
};
</script>

<style scoped>
button {
  width: 100%;
  margin: 2px 0px;
}
.abilities-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #403652;
  opacity: 0.5;
  width: 100px;
  height: 100px;
}

.full-name {
  font-size: 0.6rem;
}
</style>