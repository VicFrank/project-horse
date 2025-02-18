<template>
  <div class="text-center">
    <h1 class="page-title">Heroes</h1>

    <div style="max-width: 400px" class="mx-auto">
      <template v-if="loading">
        <div class="d-flex justify-content-center my-3">
          <b-spinner label="Loading..."></b-spinner>
        </div>
      </template>
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
              + {{ data.item.placementDiff }}
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
      const level30Ratings = {
        npc_dota_hero_skywrath_mage: 808.02697364309,
        npc_dota_hero_warlock: 902.55713183535,
        npc_dota_hero_undying: 908.27126611198,
        npc_dota_hero_slark: 912.48589653597,
        npc_dota_hero_necrolyte: 918.92900611693,
        npc_dota_hero_witch_doctor: 919.32363142848,
        npc_dota_hero_keeper_of_the_light: 920.40623724272,
        npc_dota_hero_ringmaster: 925.81261841,
        npc_dota_hero_zuus: 926.15933507813,
        npc_dota_hero_tiny: 930.39021142985,
        npc_dota_hero_disruptor: 932.85734053478,
        npc_dota_hero_sand_king: 935.10290339694,
        npc_dota_hero_jakiro: 938.54334240047,
        npc_dota_hero_ancient_apparition: 941.74404047709,
        npc_dota_hero_crystal_maiden: 942.98279394223,
        npc_dota_hero_meepo: 945.69540432096,
        npc_dota_hero_tinker: 947.54351305934,
        npc_dota_hero_visage: 947.65266577108,
        npc_dota_hero_bristleback: 950.03134978107,
        npc_dota_hero_riki: 950.07551616009,
        npc_dota_hero_spectre: 950.33008548956,
        npc_dota_hero_dazzle: 957.10934467621,
        npc_dota_hero_alchemist: 957.12730398495,
        npc_dota_hero_invoker: 958.69040799822,
        npc_dota_hero_lich: 959.78015468622,
        npc_dota_hero_enigma: 960.27671433922,
        npc_dota_hero_oracle: 960.73818523801,
        npc_dota_hero_windrunner: 962.54874023684,
        npc_dota_hero_winter_wyvern: 963.01280933687,
        npc_dota_hero_axe: 963.25619531158,
        npc_dota_hero_shadow_shaman: 964.69458702588,
        npc_dota_hero_clinkz: 965.48077415388,
        npc_dota_hero_lion: 967.14528966734,
        npc_dota_hero_grimstroke: 968.26082865992,
        npc_dota_hero_enchantress: 970.31801573529,
        npc_dota_hero_pugna: 970.82723395451,
        npc_dota_hero_elder_titan: 971.02311218914,
        npc_dota_hero_wisp: 973.4681289664,
        npc_dota_hero_huskar: 974.80284243216,
        npc_dota_hero_silencer: 975.9818260977,
        npc_dota_hero_legion_commander: 977.04418839089,
        npc_dota_hero_lone_druid: 978.42259334319,
        npc_dota_hero_abaddon: 980.00764782704,
        npc_dota_hero_pudge: 980.80463343474,
        npc_dota_hero_dark_willow: 981.9732415269,
        npc_dota_hero_vengefulspirit: 982.19293054461,
        npc_dota_hero_techies: 982.93612882132,
        npc_dota_hero_death_prophet: 983.13192631834,
        npc_dota_hero_abyssal_underlord: 984.97498093505,
        npc_dota_hero_venomancer: 986.41996448631,
        npc_dota_hero_chaos_knight: 986.96988105211,
        npc_dota_hero_obsidian_destroyer: 986.99933575575,
        npc_dota_hero_puck: 989.93542875031,
        npc_dota_hero_shredder: 990.15996570579,
        npc_dota_hero_muerta: 990.71812102186,
        npc_dota_hero_batrider: 993.02919701792,
        npc_dota_hero_phantom_lancer: 993.18895272301,
        npc_dota_hero_centaur: 993.40820370641,
        npc_dota_hero_tidehunter: 995.00093096542,
        npc_dota_hero_skeleton_king: 996.75117757676,
        npc_dota_hero_phoenix: 997.09548158838,
        npc_dota_hero_mirana: 997.63898234734,
        npc_dota_hero_rubick: 999.49291740666,
        npc_dota_hero_beastmaster: 999.8885457631,
        npc_dota_hero_luna: 1000.90773701,
        npc_dota_hero_spirit_breaker: 1001.284501695,
        npc_dota_hero_hoodwink: 1003.5309666822,
        npc_dota_hero_antimage: 1003.9273688358,
        npc_dota_hero_chen: 1004.1199858811,
        npc_dota_hero_earthshaker: 1006.600749724,
        npc_dota_hero_ursa: 1007.0099523921,
        npc_dota_hero_omniknight: 1008.9210303842,
        npc_dota_hero_dawnbreaker: 1009.0767250692,
        npc_dota_hero_arc_warden: 1010.1151856654,
        npc_dota_hero_kunkka: 1010.1304881169,
        npc_dota_hero_treant: 1012.3861806222,
        npc_dota_hero_faceless_void: 1013.9440992816,
        npc_dota_hero_bounty_hunter: 1014.0017520648,
        npc_dota_hero_dark_seer: 1016.5044256689,
        npc_dota_hero_sniper: 1016.6387972746,
        npc_dota_hero_doom_bringer: 1017.0608330879,
        npc_dota_hero_mars: 1018.7790789999,
        npc_dota_hero_templar_assassin: 1018.9585959857,
        npc_dota_hero_broodmother: 1020.4261974154,
        npc_dota_hero_sven: 1022.1352324662,
        npc_dota_hero_razor: 1022.798264847,
        npc_dota_hero_lycan: 1025.1544629641,
        npc_dota_hero_primal_beast: 1025.8899280631,
        npc_dota_hero_night_stalker: 1027.7284401895,
        npc_dota_hero_weaver: 1027.7480843155,
        npc_dota_hero_snapfire: 1029.0437129024,
        npc_dota_hero_leshrac: 1030.0196819748,
        npc_dota_hero_storm_spirit: 1032.0902288781,
        npc_dota_hero_lina: 1032.4527765384,
        npc_dota_hero_queenofpain: 1033.0060609192,
        npc_dota_hero_marci: 1033.9202798057,
        npc_dota_hero_troll_warlord: 1034.2546942844,
        npc_dota_hero_shadow_demon: 1037.0853250218,
        npc_dota_hero_ember_spirit: 1038.1460828129,
        npc_dota_hero_furion: 1039.8811032229,
        npc_dota_hero_gyrocopter: 1039.9641463863,
        npc_dota_hero_magnataur: 1043.8284621727,
        npc_dota_hero_earth_spirit: 1043.9400925931,
        npc_dota_hero_slardar: 1045.3282616329,
        npc_dota_hero_naga_siren: 1047.4462112061,
        npc_dota_hero_void_spirit: 1047.6930322237,
        npc_dota_hero_tusk: 1049.1838137197,
        npc_dota_hero_nyx_assassin: 1051.9501461021,
        npc_dota_hero_viper: 1053.0940255348,
        npc_dota_hero_kez: 1053.2653286252,
        npc_dota_hero_life_stealer: 1057.9015506193,
        npc_dota_hero_bloodseeker: 1060.8875268978,
        npc_dota_hero_juggernaut: 1060.8894763748,
        npc_dota_hero_ogre_magi: 1063.1152696607,
        npc_dota_hero_terrorblade: 1065.8590477207,
        npc_dota_hero_dragon_knight: 1066.431307938,
        npc_dota_hero_rattletrap: 1070.4466559815,
        npc_dota_hero_pangolier: 1070.6752548947,
        npc_dota_hero_nevermore: 1071.234582206,
        npc_dota_hero_brewmaster: 1076.5596395302,
        npc_dota_hero_monkey_king: 1081.9646951892,
        npc_dota_hero_bane: 1083.3044464339,
        npc_dota_hero_drow_ranger: 1089.0278766733,
        npc_dota_hero_morphling: 1098.9852417254,
        npc_dota_hero_medusa: 1099.6380061851,
        npc_dota_hero_phantom_assassin: 1174.057775844,
      };

      const level1Ratings = {
        npc_dota_hero_skywrath_mage: 747.99364178623,
        npc_dota_hero_wisp: 897.12919449311,
        npc_dota_hero_invoker: 897.62763394176,
        npc_dota_hero_puck: 928.24808570181,
        npc_dota_hero_oracle: 928.80426111123,
        npc_dota_hero_winter_wyvern: 929.36850781644,
        npc_dota_hero_keeper_of_the_light: 929.4443222846,
        npc_dota_hero_techies: 932.77696618491,
        npc_dota_hero_hoodwink: 934.43432616498,
        npc_dota_hero_mirana: 938.48629087695,
        npc_dota_hero_crystal_maiden: 938.66365855996,
        npc_dota_hero_enchantress: 939.71587511306,
        npc_dota_hero_lone_druid: 940.08818325104,
        npc_dota_hero_sniper: 942.95146812725,
        npc_dota_hero_furion: 944.10305770755,
        npc_dota_hero_windrunner: 946.55424455967,
        npc_dota_hero_clinkz: 946.82159110704,
        npc_dota_hero_ancient_apparition: 953.3981666656,
        npc_dota_hero_enigma: 953.60983401804,
        npc_dota_hero_dazzle: 953.72268962578,
        npc_dota_hero_necrolyte: 954.03523864731,
        npc_dota_hero_witch_doctor: 955.20015896003,
        npc_dota_hero_visage: 956.59501016857,
        npc_dota_hero_phoenix: 960.22311779088,
        npc_dota_hero_lion: 960.61353512484,
        npc_dota_hero_disruptor: 960.69166692859,
        npc_dota_hero_grimstroke: 962.40639794854,
        npc_dota_hero_warlock: 962.92479229579,
        npc_dota_hero_morphling: 964.90194864883,
        npc_dota_hero_pugna: 967.4616030983,
        npc_dota_hero_huskar: 967.86088610175,
        npc_dota_hero_drow_ranger: 968.39722687146,
        npc_dota_hero_venomancer: 969.48835540541,
        npc_dota_hero_ringmaster: 969.81697958589,
        npc_dota_hero_lich: 970.71753395148,
        npc_dota_hero_leshrac: 970.88125892325,
        npc_dota_hero_nevermore: 971.50275331924,
        npc_dota_hero_chen: 971.59486755688,
        npc_dota_hero_weaver: 972.84161513756,
        npc_dota_hero_death_prophet: 976.07320406343,
        npc_dota_hero_troll_warlord: 978.86847475843,
        npc_dota_hero_pangolier: 980.84624150189,
        npc_dota_hero_razor: 982.61449778435,
        npc_dota_hero_obsidian_destroyer: 982.6526506999,
        npc_dota_hero_nyx_assassin: 983.29645436861,
        npc_dota_hero_muerta: 985.22211715495,
        npc_dota_hero_snapfire: 985.43535567838,
        npc_dota_hero_void_spirit: 986.58125714423,
        npc_dota_hero_silencer: 987.37624944321,
        npc_dota_hero_arc_warden: 988.27643424826,
        npc_dota_hero_batrider: 989.23521245786,
        npc_dota_hero_undying: 989.96594712116,
        npc_dota_hero_rubick: 990.36898884948,
        npc_dota_hero_vengefulspirit: 991.05599904662,
        npc_dota_hero_zuus: 991.27695712084,
        npc_dota_hero_spectre: 995.80041935946,
        npc_dota_hero_tinker: 996.31279959251,
        npc_dota_hero_broodmother: 997.3621595549,
        npc_dota_hero_sand_king: 997.98785236544,
        npc_dota_hero_earthshaker: 999.13824244866,
        npc_dota_hero_bane: 999.19413661982,
        npc_dota_hero_dark_seer: 999.49778249986,
        npc_dota_hero_naga_siren: 999.96082689974,
        npc_dota_hero_magnataur: 1000.0808015887,
        npc_dota_hero_mars: 1002.0578058593,
        npc_dota_hero_abaddon: 1003.0349357822,
        npc_dota_hero_faceless_void: 1003.9625670657,
        npc_dota_hero_bristleback: 1004.0164598577,
        npc_dota_hero_earth_spirit: 1005.4636748316,
        npc_dota_hero_lina: 1008.8089730841,
        npc_dota_hero_dark_willow: 1009.3540599663,
        npc_dota_hero_luna: 1009.5850263885,
        npc_dota_hero_shredder: 1010.15170399,
        npc_dota_hero_queenofpain: 1010.7942664529,
        npc_dota_hero_beastmaster: 1012.4923990601,
        npc_dota_hero_jakiro: 1013.4984078517,
        npc_dota_hero_marci: 1014.3888114227,
        npc_dota_hero_shadow_demon: 1015.9281127051,
        npc_dota_hero_templar_assassin: 1016.870883509,
        npc_dota_hero_brewmaster: 1016.9987359646,
        npc_dota_hero_rattletrap: 1017.5157579325,
        npc_dota_hero_ursa: 1017.5421125572,
        npc_dota_hero_riki: 1017.7385285504,
        npc_dota_hero_viper: 1019.5134081973,
        npc_dota_hero_gyrocopter: 1020.536388227,
        npc_dota_hero_storm_spirit: 1022.9460688225,
        npc_dota_hero_omniknight: 1024.6344818707,
        npc_dota_hero_meepo: 1025.4852870407,
        npc_dota_hero_legion_commander: 1026.3111870456,
        npc_dota_hero_kez: 1027.2687199142,
        npc_dota_hero_elder_titan: 1028.4789567721,
        npc_dota_hero_slardar: 1029.0627562866,
        npc_dota_hero_tidehunter: 1029.3992335132,
        npc_dota_hero_phantom_lancer: 1030.2944904519,
        npc_dota_hero_tiny: 1030.5,
        npc_dota_hero_doom_bringer: 1030.9218699238,
        npc_dota_hero_lycan: 1031.5027611648,
        npc_dota_hero_alchemist: 1034.1881517627,
        npc_dota_hero_monkey_king: 1034.8865617393,
        npc_dota_hero_kunkka: 1036.1663014384,
        npc_dota_hero_dawnbreaker: 1036.725246828,
        npc_dota_hero_medusa: 1036.9705628452,
        npc_dota_hero_shadow_shaman: 1037.461051733,
        npc_dota_hero_sven: 1046.3082080059,
        npc_dota_hero_slark: 1048.1798577879,
        npc_dota_hero_primal_beast: 1048.674247747,
        npc_dota_hero_spirit_breaker: 1049.0015231785,
        npc_dota_hero_dragon_knight: 1049.6600423086,
        npc_dota_hero_phantom_assassin: 1049.7431097385,
        npc_dota_hero_tusk: 1050.7160903332,
        npc_dota_hero_life_stealer: 1050.9691903453,
        npc_dota_hero_axe: 1051.1229144843,
        npc_dota_hero_abyssal_underlord: 1053.1496073942,
        npc_dota_hero_chaos_knight: 1053.7116796555,
        npc_dota_hero_antimage: 1055.0826076454,
        npc_dota_hero_bounty_hunter: 1059.3705876766,
        npc_dota_hero_ember_spirit: 1061.6590632206,
        npc_dota_hero_terrorblade: 1066.7866476415,
        npc_dota_hero_pudge: 1069.3205401955,
        npc_dota_hero_night_stalker: 1070.6375472843,
        npc_dota_hero_bloodseeker: 1071.6548193405,
        npc_dota_hero_skeleton_king: 1071.9866357421,
        npc_dota_hero_centaur: 1072.8491281925,
        npc_dota_hero_treant: 1091.0633522305,
        npc_dota_hero_ogre_magi: 1092.0102880913,
        npc_dota_hero_juggernaut: 1246.3075954192,
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
