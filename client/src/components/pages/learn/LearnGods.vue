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
        <div class="GodCardContainer" :class="{ plus: god.unlock === 'plus' }">
          <img class="avatar" :src="`/images/gods/${god.id}.png`">
          <img class="card-frame" src="./god_card_frame_blank.png">
          <div class="card-banner">
            <div class="card-banner_title">{{ god.name }}</div>
            <img class="card-banner_plus-icon" :class="{ hidden: god.unlock !== 'plus' }"
              src="./user_bar_plus_icon.png">
          </div>
          <div class="abilities-container">
            <div v-for="power of god.powers" :key="power.id" class="ability-container">
              <div class="ability-background">
                <b-img v-bind:src="`/images/gods/powers/power_${power.id}.png`" class="ability-icon"></b-img>
              </div>
              <img v-if="power.type !== 'passive'" src="./active_ability_frame.png" class="ability-frame">
            </div>
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


/*
.GodCardContainer {
    width: 275px;
    height: 300px;
    padding: 5px 10px 2px 7px;
    opacity: 0;
    margin-top: 45px;
    margin-bottom: 45px;
    transform: rotateY(-90deg);
    brightness: 100;
    overflow: noclip;
    */
.GodCardContainer {
  width: 275px;
  height: 300px;
  padding: 5px 10px 2px 7px;

  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.plus {
  filter: drop-shadow(0px 3px 3px rgba(0, 204, 255, 0.5));
  border-radius: 30px;
}

.card-frame {
  position: absolute;
  width: 258px;
  height: 292px;
}

/*
    BannerContainer {
        align: left top;
        margin-top: 24px;
        width: $cardWidth;
    }
    */
.card-banner {
  position: absolute;
  margin-top: 24px;
  width: 100%;
  text-align: center;
}

/*
    &_BannerContent {
        align: center center;
        flow-children: right;

        Image {
            height: $plusIconSize;
            width: $plusIconSize;
            margin-top: -10px;
            border-radius: 50%;
            visibility: collapse;
            box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 10px 0px;
        }

        Label {
            text-align: center;
            font-size: 14px;
            font-family: titleFont;
            color: gradient(linear, 0% 0%, 0% 100%, from(#fad2f8), to(#d677ce));
            text-shadow: black 0px 1px 2px 2;
        }
    }
*/

.card-banner_title {
  text-align: center;
  font-size: 14px;
  color: #fad2f8;
  text-shadow: 0px 1px 2px black;
}

.card-banner_plus-icon {
  height: 42px;
  width: 42px;
  margin-top: -30px;
  margin-left: 130px;
  border-radius: 50%;
}

/*
&_Avatar {
  width: 175px;
  height: 175px;
  align: middle top;
  margin-top: 15px;
}
*/
.avatar {
  margin-top: 15px;
  width: 175px;
  height: 175px;
}

/*
&_Abilities {
  width: fit-children;
  height: fit-children;
  align: middle bottom;
  margin: 0 4px 47px 0;
  flow-children: right;
  overflow: noclip;
}
*/
.abilities-container {
  margin-top: -10px;
  display: flex;
  z-index: 1;
}

.ability-container {
  position: relative;
  padding-right: 5px;
  padding-left: 5px;
}

/*
    &_AbilityBackground {
        width: 60px;
        height: 65px;
        background-image: url("file://{images}/custom_game/gods/god_card_ability_box.png");
        background-size: 120% 110%;
        background-position: center;
        background-repeat: no-repeat;
    }
*/

.ability-background {
  background-image: url("./god_card_ability_box.png");
  background-size: 120% 110%;
  background-position: center;
  background-repeat: no-repeat;
  width: 60px;
  height: 65px;
}

/*
    &_AbilityFrame {
        width: 55px;
        height: 55px;
        align: middle middle;
        margin-bottom: 5px;
        opacity: 1;
        transition: transform 0.1s ease-in-out 0s, brightness 0.1s ease-in-out 0s;
    }
*/
.ability-frame {
  width: 55px;
  height: 55px;
  position: absolute;
  top: 2px;
  left: 7px;
}

/*
    &_Ability {
        width: 55px;
        height: 55px;
        align: middle middle;
        margin-bottom: 5px;
        transition: transform 0.1s ease-in-out 0s, brightness 0.1s ease-in-out 0s, saturation 0.1s ease-in-out 0s;
    }

    &_Health {
        align: middle bottom;
        width: 50px;
        margin: 0 0 11px 15px;
        text-align: center;
        font-size: 24px;
        font-family: monospaceNumbersFont;
        color: gradient(linear, 0% 0%, 0% 100%, from(#eece83), to(#d9b86b));
        text-shadow: black 0px 1px 2px 2;
    }
*/

.ability-icon {
  height: 55px;
  width: 55px;
  margin-top: 2px;
  margin-left: 2px;
}

/*
&_Universe {
  height: 30px;
  width: 30px;
  align: right bottom;
  opacity: 0.5;
  margin: 0 32px 32px 0;
  saturation: 0;
  wash-color: #554f9d;
}
*/
.universe-logo {
  height: 30px;
  width: 30px;
  opacity: 0.5;
  margin: 0 32px 32px 0;
  filter: saturate(0);
}

.hidden {
  display: none;
}
</style>