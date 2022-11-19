<script>
export default {

  data: () => ({
    loading: true,
    gods: [],
    allGods: [],
    godFilter: [],
  }),

  created() {
    this.loadAndFilterGods();
  },

  methods: {
    async loadAndFilterGods() {
      const godReq = fetch(`/data/gods.json`).then((res) => res.json()).then(gods => this.allGods = gods);
      //const filterReq = fetch('/api/gods').then(r => r.json()).then(gods => this.enabledGods = gods.filter(g => g.god_enabled).map(g => g.god_name));
      const filterReq = fetch('/data/godsFilter.json').then(r => r.json()).then(gods => this.godFilter = gods.filter(g => g.god_enabled).map(g => g.god_name));
      await Promise.all([godReq, filterReq])
      this.loading = false;
      this.gods = this.allGods.filter(g => this.godFilter.includes(g.id))
    }
  },
};
</script>

<template>
  <div class="container">
    <h1 class="page-title">{{ $t("gods.page_title") }}</h1>
    <div v-if="loading" class="d-flex justify-content-center mb-3">
      <b-spinner label="Loading..."></b-spinner>
    </div>
    <div class="gods-container">
      <div v-for="god of gods" :key="god.id">
        <div class="PreSelectedGod">
          <img class="GodComplexity" :src="`/images/gods/god_complexity_${god.complexity}.png`">
          <div class="GodCardContainer" :class="{ Plus: god.unlock === 'plus' }">
            <img class="GodCard_Avatar" :src="`/images/gods/images/${god.id}_avatar.png`">
            <img class="GodCard_Background" src="./god_card_frame_blank.png">
            <div class="GodCard_BannerContainer">
              <div class="GodCard_BannerContent">
                <span>{{ god.name }}</span>
                <img v-if="god.unlock === 'plus'" src="./user_bar_plus_icon.png">
              </div>
            </div>
            <img class="GodCard_Universe" v-if="god.universe !== 'none'"
              :src="`/images/logos/${god.universe}_logo.png`">
            <div class="GodCard_Info" :id="`${god.id}_info`" />
            <b-tooltip :target="`${god.id}_info`" custom-class="" placement="left">
              <div class="" style="padding: 10px;">
                {{ god.unlock_text }}
              </div>
            </b-tooltip>
            <div class="GodCard_Abilities">
              <div v-for="power of god.powers" :key="power.id" :id="power.id" class="GodCard_PowerButton"
                :class="{ SmallPowers: god.powers.length > 2, PassiveAbility: power.type === 'passive' }">
                <div class="GodCard_AbilityBackground">
                  <img class="GodCard_Ability" :src="`/images/gods/powers/power_${power.id}.png`">
                  <img class="GodCard_AbilityFrame" v-if="power.type !== 'passive'" src="./active_ability_frame.png">
                </div>
                <b-tooltip :target="power.id" custom-class="PowerTooltipContainer" placement="bottom">
                  <div class="PowerTooltip GenericTooltip">
                    <div class="GenericTooltip__Header">
                      {{ power.name }}
                    </div>
                    <div class="GenericTooltip__Body">
                      <div class="Type">
                        {{ power.type_string }}
                      </div>
                      <div class="Description">
                        {{ power.desc }}
                      </div>
                      <div v-if="power.values.length > 0 && power.values[0].length > 0" class="Values">
                        <div v-for="value in power.values" :key="value" class="ValueContainer">
                          <span class="ValueLabel">{{ value.split(":")[0] }}:</span>
                          <span class="Value">{{ value.split(":")[1] }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </b-tooltip>
              </div>
            </div>
            <div class="GodCard_Health">{{ god.health }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.gods-container {
  display: flex;
  flex-wrap: wrap;
}

.PreSelectedGod {
  display: flex;
  flex-direction: column;
}

.PreSelectedGod .GodCardContainer {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 258px;
}

.GodCardContainer.Plus {
  filter: drop-shadow(0 3px 6px rgba(0, 204, 255, .5));
}

.PreSelectedGod .GodCard_Avatar {
  background-color: black;
}

.GodComplexity {
  height: 55px;
  width: 55px;
  margin: auto;
}

.GodCard_Avatar {
  width: 175px;
  height: 175px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 15px;
}

.GodCard_Background {
  width: 258px;
  height: 292px;
  position: absolute;
}

.GodCard_BannerContainer {
  position: absolute;
  top: 24px;
  width: 258px;
}

.GodCard_BannerContent {
  text-align: center;
}

.GodCard_BannerContent img {
  height: 42px;
  width: 42px;
  margin-top: -10px;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 10px 0px;
  position: absolute;
}

/** TODO: font, gradient text */
.GodCard_BannerContent span {
  text-align: center;
  font-size: 16px;
  color: #fad2f8;
  text-shadow: 0px 1px 2px black;
}

/** TODO wash-color */
.GodCard_Info {
  height: 18px;
  width: 18px;
  margin: 0 0 32px 36px;
  background-image: url("./info_icon.png");
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0.5;
  position: absolute;
  bottom: 0;
  left: 0;
}

/** TODO find some blend mode that let's us do wash-color stuff */
.GodCard_Universe {
  height: 30px;
  width: 30px;
  opacity: 0.5;
  margin: 0 32px 32px 0;

  filter: saturate(0);

  position: absolute;
  bottom: 0;
  right: 0;
}

.GodCard_Abilities {
  margin: -10px 4px 47px 0;

  display: flex;
  justify-content: center;
  position: relative;
}

.GodCard_PowerButton {
  margin: 0 2px;
}

.GodCard_AbilityBackground {
  width: 60px;
  height: 65px;
  background-image: url("./god_card_ability_box.png");
  background-size: 120% 110%;
  background-position: center;
  background-repeat: no-repeat;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.GodCard_Ability {
  width: 55px;
  height: 55px;
  margin-bottom: 5px;
}

.SmallPowers .GodCard_Ability,
.SmallPowers .GodCard_AbilityFrame {
  width: 46px;
  height: 46px;
  margin: 0 1px 6px 0;
}

.SmallPowers .GodCard_Abilities {
  margin-bottom: 58px;
}

.SmallPowers .GodCard_AbilityContainer {
  width: 62px;
  height: 62px;
}

.GodCard_AbilityFrame {
  width: 55px;
  height: 55px;
  margin-bottom: 5px;
  opacity: 1;

  position: absolute;
}

.PassiveAbility .GodCard_Ability {
  width: 50px;
  height: 50px;
  box-shadow: black 0px 0px 4px 1px;
}

.PowerTooltipContainer {
  opacity: 1;
}

.PowerTooltipContainer .Type {
  color: #6548a0;
  font-size: 16px;
  margin-bottom: 5px;
}

.PowerTooltipContainer .Values {
  margin-bottom: 5px;
  font-size: 16px;
}

.PowerTooltipContainer .Notes {
  font-size: 14px;
  font-style: italic;
  color: #665a7f;
}

.GenericTooltip {
  background-color: #1b1331;
  text-align: left;
  max-width: 400px;
}

.GenericTooltip__Header {
  font-size: 22px;
  padding: 10px;
  width: 100%;
  background-color: #231b40;
}

.GenericTooltip__Body {
  padding: 10px;
}

.GenericTooltip .Title {
  font-family: titleFont;
  text-shadow: 0px 1px 2px black;
  text-overflow: shrink;
  color: white;
  font-size: 22px;
  white-space: nowrap;
}

.GenericTooltip .Type {
  color: #6548a0;
  font-size: 16px;
  margin-bottom: 5px;
}

.GenericTooltip .Description {
  font-size: 16px;
  font-weight: thin;
  color: #9a88bd;
  margin-bottom: 5px;
}

.GenericTooltip .Values {
  margin-bottom: 5px;
  font-size: 16px;
}

.Values {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.Values .ValueLabel {
  color: #6548a0;
  text-transform: capitalize;
}

.Values .Value {
  color: #645b77;
  font-weight: thin;
}

.tooltip.b-tooltip {
  opacity: 1;
}

.tooltip-inner {
  max-width: 400px;
}

/* TODO: monospace font (steal from mod), gradient text (meh) */
.GodCard_Health {
  width: 100%;
  margin-bottom: 17px;
  margin-left: 9px;
  text-align: center;
  font-size: 24px;
  color: #d9b86b;
  text-shadow: 0px 1px 2px black;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>