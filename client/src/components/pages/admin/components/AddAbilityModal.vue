<template>
  <b-modal
    id="create-ability"
    title="Add Ability"
    @ok="createAbility"
    @hidden="clearNewAbility"
    :ok-disabled="!newAbility.ability_name || !newAbility.icon"
  >
    <b-form-group label="Ability Name">
      <b-form-input
        type="text"
        v-model="newAbility.ability_name"
        placeholder="Enter the code name of the ability"
      ></b-form-input>
    </b-form-group>
    <b-form-group label="Icon">
      <b-form-input
        type="text"
        v-model="newAbility.icon"
        placeholder="The dota name of the ability (no custom_ prefix)"
      ></b-form-input>
    </b-form-group>
    <b-form-group label="Ultimate">
      <b-form-checkbox
        v-model="newAbility.is_ultimate"
        switch
      ></b-form-checkbox>
    </b-form-group>
  </b-modal>
</template>

<script>
export default {
  name: "AddAbilityModal",
  data() {
    return {
      newAbility: {
        ability_name: "",
        icon: "",
        is_ultimate: false,
      },
    };
  },
  methods: {
    createAbility() {
      this.$emit("onCreateAbility", this.newAbility);
    },
    clearNewAbility() {
      this.newAbility = {
        ability_name: "",
        icon: "",
        is_ultimate: false,
      };
    },
  },
};
</script>

<style>
</style>