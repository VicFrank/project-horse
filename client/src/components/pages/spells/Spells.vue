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
        .then((abilities) => this.abilities = abilities)
        .then(fetch('https://double-edge-studios-llc.github.io/enabled_abilities.txt')
          .then(r => r.text())
          .then(t => t.split('\n').filter(line => !line.startsWith('#') || !line.startsWith('#')))
          .then((enabledAbilities) => {
            this.abilities = this.abilities.filter(({ id }) => enabledAbilities.includes(id));
            this.allTags = Array.from(new Set(this.abilities.reduce((prev, curr) => prev.concat(curr.tags), []))).sort();
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
      <div v-for="ability in filteredAbilities" :key="ability.id" class="ability-tooltip">
        <div class="ability-header">
          <img class="ability-icon" :src="`../images/ability_icons/${ability.icon}.png`" />
          <div class="ability-name">
            {{ ability.name }}
          </div>
        </div>
        <div style="display: flex" class="mt-2">
          <div class="categories">
            <div v-for="catStr in ability.categories" :key="catStr">
              {{ catStr }}
            </div>
          </div>
        </div>
        <div class="separator"></div>
        <div class="ability-description">
          {{ ability.description }}
        </div>
        <div class="values p-2">
          <div v-for="val in ability.values" :key="val">
            <span class="uppercase ability-value-desc"> {{ val.split(":")[0] }}: </span>
            <span class="ability-value">{{ val.split(":")[1] }}</span>
          </div>
          <div style="display: flex; flex-wrap: wrap; align-items: center; margin-top: 8px">
            <div v-if="ability.cooldowns.length > 0" class="icon-and-values pr-4">
              <div class="cooldown-icon"></div>
              <span class="ml-2">
                {{
                    ability.cooldowns
                      .slice(0, Math.min(ability.cooldowns.length, 3))
                      .join(" / ")
                }}
              </span>
            </div>
            <div v-if="ability.manaCost.length" class="icon-and-values">
              <div style="display: flex">
                <div class="mana-cost-icon"></div>
                <span class="ml-2">
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
        <div class="sink">
          <div class="super">
            <span style="color: rgb(99, 117, 255)">Super: </span>
            <span class="">
              {{ ability.superUpgrade.split("Super: ")[1] }}
            </span>
          </div>
          <div class="gaben">
            <span style="color: rgb(254, 116, 0)">Gaben: </span>
            <span>{{ ability.gabenUpgrade.split("Gaben: ")[1] }}</span>
          </div>
          <div v-if="ability.differences" class="differences">
            <span style="color: #8e8676;">Differences from Dota: </span>
            {{ ability.differences }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style>
.spell-search {
  display: block;
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
  cursor: pointer;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.ability-tooltip {
  width: 265px;
  background-color: #1b1331;
  margin: 4px;
  border: 2px solid #554f9d;

  font-size: 14px;
  display: flex;
  flex-direction: column;
}

.ability-icon {
  height: 50px;
  width: 50px;
  margin: 4px;
  box-shadow: 0px 0px 8px #000;
}

.ability-header {
  background-color: #231b40;
  width: 100%;

  display: flex;
  align-items: center;
}

.ability-name {
  margin-left: 8px;
  font-size: 20px;
  color: #e1e1e1;
  font-family: 'Reaver', 'Goudy Trajan Medium', 'FZKai-Z03', 'TH Sarabun New', 'YDYGO 540';
  font-weight: 600;
  text-transform: uppercase;
  text-shadow: 0px 1px 2px black;
}

.categories {
  color: #6548a0;
  margin-left: 8px;
}

.separator {
  height: 2px;
  background-color: #383167;
  margin: 12px;
}

.ability-description {
  color: #9a88bd;
  margin-left: 8px;
}

.ability-value-desc {
  color: #6548a0;
}

.ability-value {
  color: #e1e1e1;
}

.cooldown-icon {
  background-image: url("https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/icons/cooldown.png");
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background-size: cover;
}

.mana-cost-icon {
  width: 16px;
  height: 16px;
  border-radius: 3px;
  background: linear-gradient(#00A4DB, #007196);
}

.icon-and-values {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 4px;
}

.sink {
  margin-top: auto;
}

.super {
  color: #9a88bd;
  background: linear-gradient(rgba(104, 104, 193, 0.1), rgba(31, 31, 151, 0.16));
  box-shadow: inset 0px 0px 15px -5px rgba(98, 116, 255, 0.5);
  padding: 8px;
  margin-top: 12px;
}

.gaben {
  color: #9a88bd;
  box-shadow: inset 0px 0px 15px -5px rgba(156, 104, 74, 0.5);
  background: linear-gradient(rgba(59, 41, 34, 0.8), rgba(0, 0, 0, 0));
  padding: 8px;
  margin-top: 12px;
}

.differences {
  background: linear-gradient(rgb(43, 36, 61), rgba(38, 30, 58, 1));
  color: #67696a;
  padding: 8px;
  margin-top: 12px;
}
</style>