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
      <div v-for="god of gods" :key="god.god_name">
        <div class="GodCardContainer" :class="{ plus: god.plus_exclusive }">
          <img class="avatar" :src="`/images/gods/${god.god_name}.png`">
          <img class="card-frame" src="./god_card_frame_blank.png">
          <div class="card-banner">
            <div class="card-banner_title">{{ $t(`gods.${god.god_name}`) }}</div>
            <img class="card-banner_plus-icon" :class="{hidden: !god.plus_exclusive}" src="./user_bar_plus_icon.png">
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
  margin: 0 4px 47px 0;
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
  ;
  margin: 0 32px 32px 0;
  filter: saturate(0);
}
.hidden {
  display: none;
}
</style>