<script>
/*
interface Ability {
  name: string;
  id: string;
  categories: Array<string>;
  description: string;
  values: Array<string>;
  cooldowns: Array<number>;
  manaCost: Array<number>;
  superUpgrade: string;
  gabenUpgrade: string;
  isUlt: boolean;
  tags: Array<string>;
  icon: string;
}
*/

export default {
  data() {
    return {
      searchText: "",
      tagFilter: "",
      loading: true,
      allTags: [],
      abilities: [],
      filteredAbilities: []
    };
  },
  methods: {
    fetchAbilities() {
      fetch("../../data/abilities.json")
        .then((res) => res.json())
        .then((abilities) => {
          this.abilities = abilities;
        }).then(fetch('https://double-edge-studios-llc.github.io/enabled_abilities.txt')
          .then(r => r.text())
          .then(t => t.split('\n').filter(line => !line.startsWith('#') || !line.startsWith('#')))
          .then((enabledAbilities) => {
            this.abilities = this.abilities.filter(({ id }) => enabledAbilities.includes(id));
            this.allTags = Array.from(new Set(this.abilities.reduce((prev, curr) => prev.concat(curr.tags), [])));
            this.loading = false;
            this.updateShownAbilities();
          }))
    },
    updateShownAbilities() {
      let filtered = this.abilities;
      if (this.tagFilter !== "") {
        filtered = filtered.filter(a => a.tags.filter(tag => tag.toLowerCase().includes(this.tagFilter.toLowerCase())).length > 0)
      }
      if (this.searchText !== "")
        filtered = filtered.filter(a => a.name.toLowerCase().includes(this.searchText.toLowerCase()))
      this.filteredAbilities = filtered;
    },
    setTagFilter(tag) {
      this.tagFilter = this.tagFilter === tag ? "" : tag;
    }
  },
  created() {
    this.fetchAbilities();
  },
  watch: {
    searchText: function () {
      this.updateShownAbilities()
    },
    tagFilter: function () {
      this.updateShownAbilities()
    },
  }
};
</script>

<template>
  <div class="container">
    <div class="row my-4">
      <div class="col-xl-12">
        <div class="search-bar spell-search">
          <div class="search-input">
            <input type="text" name="search" placeholder="Search..." v-model="searchText" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="loading" class="d-flex justify-content-center mb-3">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div class="tag-container">
      <div v-for="tag in allTags" :key="tag" class="tag-button px-2 py-1 mx-2 my-1"
        :class="{ 'filter-selected': tagFilter == tag }" @click="setTagFilter(tag)">
        {{ tag.split(/(?=[A-Z])/).join(' ') }}
      </div>
    </div>
    <div class="card-container">
      <div v-for="ability in filteredAbilities" :key="ability.id" class="spell-card">
        <h4 class="pt-2 pl-2" style="background: #1b182f">
          {{ ability.name }}
        </h4>
        <div style="display: flex; flex-direction: row" class="">
          <div id="types" class="m-2">
            <div v-for="catStr in ability.categories" :key="catStr">
              {{ catStr }}
            </div>
          </div>
          <img style="margin-left: auto; margin-right: 8px"
            :src="`../images/ability_icons/${ability.icon}.png`" />
        </div>
        <div id="desc" class="p-2">
          {{ ability.description }}
        </div>
        <div id="values" class="p-2">
          <div v-for="val in ability.values" :key="val">
            <span class="uppercase"> {{ val.split(":")[0] }}: </span>
            <span>{{ val.split(":")[1] }}</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; align-items: center">
            <div v-if="ability.cooldowns.length > 0" class="py-2">
              <img src="./clock.svg" width="16px" height="16px" />
              <span>
                {{
                    ability.cooldowns
                      .slice(0, Math.min(ability.cooldowns.length, 3))
                      .join(" / ")
                }}
              </span>
            </div>
            <div v-if="ability.manaCost.length" class="pl-4">
              <div style="display: flex">
                <div style="height: 16px; width: 16px; background: blue"></div>
                <span class="pl-2">
                  {{
                      ability.manaCost
                        .slice(0, Math.min(ability.manaCost.length, 3))
                        .join(" / ")
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div id="super" class="p-2 mt-auto mb-0 ">
          <span class="">Super: </span>
          <span class="">
            {{ ability.superUpgrade.split("Super: ")[1] }}
          </span>
        </div>
        <div id="gaben" class="p-2 mb-0">
          <span class="">Gaben: </span>
          <span>{{ ability.gabenUpgrade.split("Gaben: ")[1] }}</span>
        </div>
        <div v-if="ability.differences" id="differences" class="p-2 mb-0">
          <span>Differences from Dota: </span>
          {{ ability.differences }}
        </div>
      </div>
    </div>
  </div>
</template>



<style>
.spell-search {
  display: block;
}

.spell-card {
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  margin: 0.5rem;
  background: var(--primary-color-dark)
}

#super {
  background: rgb(32 26 79);
}

#gaben {
  background: rgb(45 34 63);
}

#differences {
  background: var(--primary-color);
}

.filter-selected {
  box-shadow: 0 0 10px 0 var(--secondary-color)
}

.tag-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

.tag-button {
  text-transform: capitalize;
  background: #1b182f;
  user-select: none;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>