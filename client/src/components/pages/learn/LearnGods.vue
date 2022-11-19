<script>
export default {

  data: () => ({
    loading: true,
    gods: [],
  }),

  created() {
    fetch(`../../data/gods.json`)
      .then((res) => res.json())
      .then((gods) => {
        this.gods = gods;
        this.loading = false;
      });
  },

  methods: {
  },
};
</script>

<template>
  <div class="container">
    <h1 class="page-title">{{ $t("gods.page_title") }}</h1>
    <div class="gods-container">
      <div v-for="god of gods" :key="god.id">
        <div class="PreSelectedGod">
          <div class="GodCardContainer" :class="{Plus: god.unlock === 'plus'}">
            <!-- TOOD scrape this data :O -->
            <img class="GodComplexity" src="./god_complexity_easy.png">
            <img class="GodCard_Avatar" :src="`/images/gods/${god.id}.png`">
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
            <!-- TODO scrape health -->
            <div class="GodCard_Health">200{{ god.health }}</div>
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
  align: center center;
  flow-children: down;
}

.PreSelectedGod .GodCardContainer {
  margin-top: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 258px;

  align: center center;
  saturation: 0;
  brightness: 0.1;
}

.GodCardContainer.Plus {
  filter: drop-shadow(0 3px 3px rgba(0, 204, 255, .5));
}

.PreSelectedGod .GodCard_Avatar {
  background-color: black;
}

.PreSelectedGod .ButtonsContainer {
  flow-children: right;
}

.PreSelectedGod .ButtonsContainer .Lock {
  margin-top: -30px;
  height: 40px;
  width: 30px;
  align: center top;
}

.PreSelectedGod .ButtonsContainer .FancyButton {
  margin-right: 10px;
}

.GodComplexity {
  height: 55px;
  width: 55px;
  margin: auto;
  align: center top;
  saturation: 0.3;
}

.GodCard_Avatar {
  width: 175px;
  height: 175px;
  margin-left: auto;
  margin-right: auto;
  align: middle top;
  margin-top: 15px;
}

.GodCard_Background {
  width: 258px;
  height: 292px;
  top: 55px;
  position: absolute;
}

.GodCard_BannerContainer {
  position: absolute;
  align: left top;
  top: 79px;
  width: 258px;
}



.GodCard_BannerContent {
  text-align: center;
  align: center center;
  flow-children: right;
}

.GodCard_BannerContent img {
  height: 42px;
  width: 42px;
  margin-top: -10px;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 10px 0px;
  position: absolute;
}

.GodCard_BannerContent span {
  text-align: center;
  font-size: 16px;
  font-family: titleFont;
  color: gradient(linear, 0% 0%, 0% 100%, from(#fad2f8), to(#d677ce));
  text-shadow: black 0px 1px 2px 2;
}

.GodCard_Info {
  height: 18px;
  width: 18px;
  align: left bottom;
  margin: 0 0 32px 36px;
  background-image: url("./info_icon.png");
  background-repeat: no-repeat;
  background-size: cover;
  wash-color: #cfcbff;
  opacity: 0.5;
  position: absolute;
  bottom: 0;
  left: 0;
}

.GodCard_Universe {
  height: 30px;
  width: 30px;
  align: right bottom;
  opacity: 0.5;
  margin: 0 32px 32px 0;
  saturation: 0;
  wash-color: #554f9d;

  filter: saturate(0);

  position: absolute;
  bottom: 0;
  right: 0;
}

.GodCard_Abilities {
  width: fit-children;
  height: fit-children;
  align: middle bottom;
  margin: -10px 4px 47px 0;
  flow-children: right;
  overflow: noclip;

  display: flex;
  justify-content: center;
  position: relative;
}

.GodCard_PowerButton {
  overflow: noclip;
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
  align: middle middle;
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
  align: middle middle;
  margin-bottom: 5px;
  opacity: 1;
  transition: transform 0.1s ease-in-out 0s, brightness 0.1s ease-in-out 0s;

  position: absolute;
}

.PassiveAbility .GodCard_Ability {
  width: 50px;
  height: 50px;
  box-shadow: rgba(0, 0, 0, 0.9254901961) 0px 0px 4px 1px;
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
  text-shadow: black 0px 1px 2px 2;
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

.GodCard_Health {
  align: middle bottom;
  width: 100%;
  margin-bottom: 17px;
  margin-left: 9px;
  text-align: center;
  font-size: 24px;
  font-family: monospaceNumbersFont;
  color: #d9b86b;
  text-shadow: black 0px 1px 2px 2;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>