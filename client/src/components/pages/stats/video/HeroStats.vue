<template>
  <div class="text-center">
    <h1 class="page-title">Heroes</h1>

    <div style="max-width: 400px" class="mx-auto">
      <template v-if="loading">
        <div class="d-flex justify-content-center my-3">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </template>
      <div class="d-flex justify-content-end my-2">
        <b-button
          variant="outline-primary"
          size="sm"
          @click="exportCsv"
          :disabled="loading"
        >
          Export CSV
        </b-button>
      </div>
      <b-table
        :fields="fields"
        :items="bodies"
        responsive
        class="m-auto"
        style="max-width: 400px"
      >
        <template #cell(icon)="data">
          <div class="d-flex align-items-center p-1">
            <HeroImage
              :hero="data.item.hero_name"
              :small="true"
              :size="36"
              style="height: 36px"
            ></HeroImage>
          </div>
        </template>
        <template #cell(attribute)="data">
          <div class="d-flex align-items-center justify-content-start p-2">
            <img
              :src="`/images/attributes/${data.item.attribute}.webp`"
              alt="attribute"
              style="margin-left: 5px"
            />
          </div>
        </template>
        <template #cell(level1Rating)="data">
          <div class="percent-td">
            <div class="text-left">
              <span>{{ data.item.level1Placement + 1 }}</span>
              <span class="text-muted ml-1">{{ data.item.level1Rating }}</span>
            </div>
            <div class="percentage-holder">
              <PercentBar
                :min="600"
                :max="1174"
                :value="data.item.level1Rating"
                class="mt-1"
                v-b-tooltip.hover
                :title="data.item.level1Rating"
              ></PercentBar>
            </div>
          </div>
        </template>
        <template #cell(level30Rating)="data">
          <div class="percent-td">
            <div class="text-left">
              <span>{{ data.item.level30Placement + 1 }}</span>
              <span class="text-muted ml-1">{{ data.item.level30Rating }}</span>
            </div>
            <div class="percentage-holder">
              <PercentBar
                :max="1246"
                :min="600"
                :value="data.item.level30Rating"
                class="mt-1"
                v-b-tooltip.hover
                :title="data.item.level30Rating"
              ></PercentBar>
            </div>
          </div>
        </template>
        <template #cell(placementDiff)="data">
          <div class="percent-td">
            <div
              class="text-left"
              v-if="data.item.placementDiff > 0"
              style="color: green"
            >
              +{{ data.item.placementDiff }}
            </div>
            <div
              class="text-left"
              v-else-if="data.item.placementDiff < 0"
              style="color: red"
            >
              {{ data.item.placementDiff }}
            </div>
            <div v-else>
              {{ data.item.placementDiff }}
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import HeroImage from "../../games/components/HeroImage.vue";
import PercentBar from "../../../utility/PercentBar.vue";
import { percentage } from "../../../../filters/filters";
import { attributes } from "./heroAttributes";

export default {
  components: {
    HeroImage,
    PercentBar,
  },

  data: () => ({
    bodies: [],
    fields: [],
    sortBy: "level1Rating",
    sortDesc: true,
    loading: true,
  }),

  created() {
    this.loadStats();
    this.fields = [
      {
        key: "icon",
        label: "Hero",
        thClass: "table-head text-left",
      },
      {
        key: "attribute",
        label: "",
        thClass: "table-head text-left",
        sortable: true,
      },
      {
        key: "level1Rating",
        label: "Level 1",
        thClass: "table-head text-left",
        sortable: true,
      },
      {
        key: "level30Rating",
        label: "level 30",
        thClass: "table-head text-left",
        sortable: true,
      },
      {
        key: "placementDiff",
        label: "",
        thClass: "table-head text-left",
        sortable: true,
      },
    ];
  },

  methods: {
    percentage,
    loadStats() {
      this.loading = true;
      const level30Ratings = {
        npc_dota_hero_medusa: 1207,
        npc_dota_hero_spectre: 1199,
        npc_dota_hero_dragon_knight: 1184,
        npc_dota_hero_terrorblade: 1148,
        npc_dota_hero_monkey_king: 1126,
        npc_dota_hero_morphling: 1125,
        npc_dota_hero_kez: 1113,
        npc_dota_hero_earth_spirit: 1094,
        npc_dota_hero_slark: 1085,
        npc_dota_hero_nevermore: 1070,
        npc_dota_hero_tusk: 1067,
        npc_dota_hero_ogre_magi: 1056,
        npc_dota_hero_viper: 1051,
        npc_dota_hero_broodmother: 1050,
        npc_dota_hero_templar_assassin: 1050,
        npc_dota_hero_faceless_void: 1049,
        npc_dota_hero_bloodseeker: 1048,
        npc_dota_hero_pangolier: 1047,
        npc_dota_hero_phantom_lancer: 1044,
        npc_dota_hero_life_stealer: 1044,
        npc_dota_hero_drow_ranger: 1042,
        npc_dota_hero_naga_siren: 1040,
        npc_dota_hero_gyrocopter: 1038,
        npc_dota_hero_bane: 1035,
        npc_dota_hero_juggernaut: 1035,
        npc_dota_hero_shadow_demon: 1035,
        npc_dota_hero_slardar: 1032,
        npc_dota_hero_ember_spirit: 1031,
        npc_dota_hero_luna: 1031,
        npc_dota_hero_batrider: 1030,
        npc_dota_hero_troll_warlord: 1029,
        npc_dota_hero_doom_bringer: 1029,
        npc_dota_hero_nyx_assassin: 1028,
        npc_dota_hero_sven: 1027,
        npc_dota_hero_phantom_assassin: 1027,
        npc_dota_hero_furion: 1027,
        npc_dota_hero_lina: 1025,
        npc_dota_hero_night_stalker: 1025,
        npc_dota_hero_primal_beast: 1025,
        npc_dota_hero_arc_warden: 1025,
        npc_dota_hero_vengefulspirit: 1023,
        npc_dota_hero_bounty_hunter: 1022,
        npc_dota_hero_rattletrap: 1022,
        npc_dota_hero_queenofpain: 1022,
        npc_dota_hero_treant: 1022,
        npc_dota_hero_marci: 1022,
        npc_dota_hero_void_spirit: 1020,
        npc_dota_hero_kunkka: 1019,
        npc_dota_hero_snapfire: 1019,
        npc_dota_hero_storm_spirit: 1018,
        npc_dota_hero_razor: 1012,
        npc_dota_hero_lycan: 1010,
        npc_dota_hero_brewmaster: 1010,
        npc_dota_hero_ursa: 1010,
        npc_dota_hero_leshrac: 1010,
        npc_dota_hero_weaver: 1009,
        npc_dota_hero_chaos_knight: 1004,
        npc_dota_hero_omniknight: 1004,
        npc_dota_hero_hoodwink: 1002,
        npc_dota_hero_earthshaker: 1001,
        npc_dota_hero_largo: 1001,
        npc_dota_hero_dawnbreaker: 998,
        npc_dota_hero_abyssal_underlord: 997,
        npc_dota_hero_tidehunter: 997,
        npc_dota_hero_mars: 997,
        npc_dota_hero_mirana: 995,
        npc_dota_hero_spirit_breaker: 995,
        npc_dota_hero_muerta: 994,
        npc_dota_hero_sniper: 993,
        npc_dota_hero_antimage: 993,
        npc_dota_hero_rubick: 992,
        npc_dota_hero_shredder: 991,
        npc_dota_hero_lone_druid: 991,
        npc_dota_hero_windrunner: 991,
        npc_dota_hero_venomancer: 990,
        npc_dota_hero_death_prophet: 989,
        npc_dota_hero_magnataur: 989,
        npc_dota_hero_obsidian_destroyer: 988,
        npc_dota_hero_legion_commander: 987,
        npc_dota_hero_centaur: 987,
        npc_dota_hero_skeleton_king: 987,
        npc_dota_hero_elder_titan: 985,
        npc_dota_hero_beastmaster: 984,
        npc_dota_hero_puck: 983,
        npc_dota_hero_clinkz: 982,
        npc_dota_hero_grimstroke: 978,
        npc_dota_hero_pudge: 976,
        npc_dota_hero_silencer: 974,
        npc_dota_hero_huskar: 973,
        npc_dota_hero_invoker: 973,
        npc_dota_hero_axe: 972,
        npc_dota_hero_enchantress: 972,
        npc_dota_hero_shadow_shaman: 969,
        npc_dota_hero_pugna: 969,
        npc_dota_hero_sand_king: 968,
        npc_dota_hero_alchemist: 965,
        npc_dota_hero_bristleback: 965,
        npc_dota_hero_lion: 965,
        npc_dota_hero_phoenix: 965,
        npc_dota_hero_dark_willow: 962,
        npc_dota_hero_techies: 960,
        npc_dota_hero_winter_wyvern: 959,
        npc_dota_hero_dazzle: 955,
        npc_dota_hero_abaddon: 955,
        npc_dota_hero_riki: 952,
        npc_dota_hero_lich: 952,
        npc_dota_hero_chen: 950,
        npc_dota_hero_dark_seer: 950,
        npc_dota_hero_wisp: 948,
        npc_dota_hero_zuus: 947,
        npc_dota_hero_tinker: 947,
        npc_dota_hero_meepo: 946,
        npc_dota_hero_crystal_maiden: 946,
        npc_dota_hero_oracle: 944,
        npc_dota_hero_visage: 943,
        npc_dota_hero_jakiro: 937,
        npc_dota_hero_ancient_apparition: 935,
        npc_dota_hero_keeper_of_the_light: 933,
        npc_dota_hero_tiny: 929,
        npc_dota_hero_disruptor: 910,
        npc_dota_hero_ringmaster: 909,
        npc_dota_hero_witch_doctor: 906,
        npc_dota_hero_enigma: 905,
        npc_dota_hero_necrolyte: 875,
        npc_dota_hero_undying: 874,
        npc_dota_hero_warlock: 854,
        npc_dota_hero_skywrath_mage: 823,
      };

      const level1Ratings = {
        npc_dota_hero_slark: 1218,
        npc_dota_hero_spectre: 1173,
        npc_dota_hero_ogre_magi: 1161,
        npc_dota_hero_treant: 1159,
        npc_dota_hero_juggernaut: 1135,
        npc_dota_hero_ember_spirit: 1117,
        npc_dota_hero_night_stalker: 1106,
        npc_dota_hero_bloodseeker: 1096,
        npc_dota_hero_spirit_breaker: 1075,
        npc_dota_hero_bounty_hunter: 1069,
        npc_dota_hero_pudge: 1066,
        npc_dota_hero_abyssal_underlord: 1056,
        npc_dota_hero_antimage: 1046,
        npc_dota_hero_skeleton_king: 1041,
        npc_dota_hero_tusk: 1041,
        npc_dota_hero_chaos_knight: 1040,
        npc_dota_hero_terrorblade: 1039,
        npc_dota_hero_life_stealer: 1036,
        npc_dota_hero_largo: 1036,
        npc_dota_hero_phantom_lancer: 1034,
        npc_dota_hero_primal_beast: 1033,
        npc_dota_hero_lycan: 1033,
        npc_dota_hero_kez: 1033,
        npc_dota_hero_doom_bringer: 1033,
        npc_dota_hero_kunkka: 1033,
        npc_dota_hero_centaur: 1032,
        npc_dota_hero_tiny: 1032,
        npc_dota_hero_axe: 1031,
        npc_dota_hero_sven: 1030,
        npc_dota_hero_dragon_knight: 1030,
        npc_dota_hero_brewmaster: 1030,
        npc_dota_hero_faceless_void: 1028,
        npc_dota_hero_legion_commander: 1027,
        npc_dota_hero_monkey_king: 1026,
        npc_dota_hero_tidehunter: 1026,
        npc_dota_hero_omniknight: 1025,
        npc_dota_hero_shadow_shaman: 1025,
        npc_dota_hero_marci: 1023,
        npc_dota_hero_phantom_assassin: 1022,
        npc_dota_hero_shadow_demon: 1021,
        npc_dota_hero_elder_titan: 1020,
        npc_dota_hero_abaddon: 1019,
        npc_dota_hero_alchemist: 1019,
        npc_dota_hero_viper: 1018,
        npc_dota_hero_bane: 1017,
        npc_dota_hero_ursa: 1017,
        npc_dota_hero_dawnbreaker: 1016,
        npc_dota_hero_sand_king: 1014,
        npc_dota_hero_slardar: 1014,
        npc_dota_hero_rattletrap: 1013,
        npc_dota_hero_storm_spirit: 1013,
        npc_dota_hero_meepo: 1012,
        npc_dota_hero_earth_spirit: 1011,
        npc_dota_hero_riki: 1010,
        npc_dota_hero_dark_seer: 1010,
        npc_dota_hero_shredder: 1009,
        npc_dota_hero_void_spirit: 1008,
        npc_dota_hero_magnataur: 1008,
        npc_dota_hero_dark_willow: 1005,
        npc_dota_hero_luna: 1003,
        npc_dota_hero_earthshaker: 1002,
        npc_dota_hero_gyrocopter: 1000,
        npc_dota_hero_queenofpain: 1000,
        npc_dota_hero_bristleback: 999,
        npc_dota_hero_naga_siren: 999,
        npc_dota_hero_jakiro: 997,
        npc_dota_hero_templar_assassin: 994,
        npc_dota_hero_snapfire: 993,
        npc_dota_hero_medusa: 993,
        npc_dota_hero_lina: 993,
        npc_dota_hero_pangolier: 993,
        npc_dota_hero_batrider: 992,
        npc_dota_hero_beastmaster: 991,
        npc_dota_hero_undying: 990,
        npc_dota_hero_nyx_assassin: 987,
        npc_dota_hero_rubick: 985,
        npc_dota_hero_muerta: 985,
        npc_dota_hero_zuus: 985,
        npc_dota_hero_mars: 984,
        npc_dota_hero_troll_warlord: 982,
        npc_dota_hero_razor: 980,
        npc_dota_hero_vengefulspirit: 979,
        npc_dota_hero_venomancer: 978,
        npc_dota_hero_obsidian_destroyer: 976,
        npc_dota_hero_broodmother: 973,
        npc_dota_hero_death_prophet: 973,
        npc_dota_hero_silencer: 972,
        npc_dota_hero_arc_warden: 971,
        npc_dota_hero_tinker: 971,
        npc_dota_hero_weaver: 970,
        npc_dota_hero_visage: 970,
        npc_dota_hero_chen: 970,
        npc_dota_hero_mirana: 969,
        npc_dota_hero_lich: 969,
        npc_dota_hero_nevermore: 966,
        npc_dota_hero_ringmaster: 966,
        npc_dota_hero_morphling: 965,
        npc_dota_hero_drow_ranger: 965,
        npc_dota_hero_lion: 964,
        npc_dota_hero_warlock: 964,
        npc_dota_hero_leshrac: 964,
        npc_dota_hero_clinkz: 963,
        npc_dota_hero_disruptor: 958,
        npc_dota_hero_huskar: 958,
        npc_dota_hero_pugna: 956,
        npc_dota_hero_grimstroke: 956,
        npc_dota_hero_winter_wyvern: 956,
        npc_dota_hero_windrunner: 955,
        npc_dota_hero_phoenix: 953,
        npc_dota_hero_ancient_apparition: 953,
        npc_dota_hero_lone_druid: 953,
        npc_dota_hero_dazzle: 952,
        npc_dota_hero_witch_doctor: 950,
        npc_dota_hero_sniper: 946,
        npc_dota_hero_techies: 944,
        npc_dota_hero_enigma: 942,
        npc_dota_hero_necrolyte: 942,
        npc_dota_hero_enchantress: 941,
        npc_dota_hero_wisp: 939,
        npc_dota_hero_furion: 938,
        npc_dota_hero_crystal_maiden: 919,
        npc_dota_hero_hoodwink: 918,
        npc_dota_hero_keeper_of_the_light: 912,
        npc_dota_hero_oracle: 911,
        npc_dota_hero_puck: 911,
        npc_dota_hero_invoker: 864,
        npc_dota_hero_skywrath_mage: 821,
      };

      this.bodies = Object.keys(level1Ratings).map((hero) => {
        return {
          hero_name: hero,
          level1Rating: Math.round(level1Ratings[hero], 2),
          level30Rating: Math.round(level30Ratings[hero], 2),
          attribute: attributes[hero],
        };
      });

      // normalize the level 30 ratings to the range of level 1 ratings
      const maxLevel1Rating = Math.max(
        ...this.bodies.map((body) => body.level1Rating)
      );
      const maxLevel30Rating = Math.max(
        ...this.bodies.map((body) => body.level30Rating)
      );
      console.log(...this.bodies.map((body) => body.level30Rating));
      this.bodies.forEach((body) => {
        body.level30Rating = Math.round(
          (body.level30Rating / maxLevel30Rating) * maxLevel1Rating,
          2
        );
      });

      // Calculate the difference in placement between level 1 and level 30
      for (const body of this.bodies) {
        body.level1Placement = this.bodies.filter(
          (b) => b.level1Rating > body.level1Rating
        ).length;
        body.level30Placement = this.bodies.filter(
          (b) => b.level30Rating > body.level30Rating
        ).length;
        body.placementDiff = body.level1Placement - body.level30Placement;
      }

      // sort by level 1 rating, descending
      this.bodies.sort((a, b) => b.level1Rating - a.level1Rating);

      this.loading = false;
    },
    exportCsv() {
      if (!this.bodies || !this.bodies.length) return;
      const fields =
        this.fields && this.fields.length
          ? this.fields
          : [
              { key: "icon", label: "Hero" },
              { key: "attribute", label: "Attribute" },
              { key: "level1Rating", label: "Level 1" },
              { key: "level30Rating", label: "Level 30" },
              { key: "placementDiff", label: "Placement Diff" },
            ];

      const escape = (val) => {
        if (val === null || val === undefined) return "";
        const s = String(val);
        if (s.includes('"') || s.includes(",") || s.includes("\n")) {
          return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
      };

      const header = fields.map((f) => f.label || f.key).join(",");

      const rows = this.bodies.map((item) => {
        return fields
          .map((f) => {
            const k = f.key;
            if (k === "icon") {
              return escape(
                (item.hero_name || "").replace(/^npc_dota_hero_/, "")
              );
            }
            return escape(item[k] != null ? item[k] : "");
          })
          .join(",");
      });

      const csvContent = [header, ...rows].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hero-stats.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style>
.percentage-holder {
  margin: auto;
}

.percent-td {
  padding: 0 15px;
}

.table td {
  max-width: 80px !important;
}
</style>
