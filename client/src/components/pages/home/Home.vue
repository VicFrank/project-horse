<template>
  <div>
    <h1 class="page-title text-center" v-t="'home.page_title'"></h1>
    <div class="row">
      <div class="trailer">
        <b-embed
          type="iframe"
          src="https://www.youtube.com/embed/xhj96SqA2wE"
          allowfullscreen
        ></b-embed>
      </div>
    </div>

    <div class="row text-center mx-auto" style="max-width: 600px">
      <p v-t="'home.row1-1'"></p>
    </div>

    <div class="row">
      <b-button
        class="mx-auto"
        href="#"
        target="_blank"
        variant="primary"
        v-t="'navigation.play_now'"
      ></b-button>
    </div>

    <div class="row">
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/image1.png" alt="General" />
      </div>
      <div class="col-sm my-auto">
        <h2 v-t="'home.row2-1'"></h2>
        <ul>
          <li v-t="'home.row2-2'"></li>
          <li v-t="'home.row2-3'"></li>
          <li v-t="'home.row2-4'"></li>
          <li v-t="'home.row2-5'"></li>
          <li v-t="'home.row2-6'"></li>
        </ul>
      </div>
    </div>

    <div class="row">
      <div class="col-sm my-auto">
        <h2 v-t="'home.row8-1'"></h2>
        <ul>
          <li v-t="'home.row8-2'"></li>
          <li v-t="'home.row8-3'"></li>
          <li v-t="'home.row8-4'"></li>
          <li v-t="'home.row8-5'"></li>
          <li v-t="'home.row8-6'"></li>
        </ul>
      </div>
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/image2.png" alt="General" />
      </div>
    </div>

    <div class="row">
      <div class="col-sm my-auto">
        <img
          class="img-fluid"
          src="./images/image3.png"
          alt="Upgrade your spells"
        />
      </div>
      <div class="col-sm my-auto">
        <h2 v-t="'home.row3-1'"></h2>
        <ul>
          <li v-t="'home.row3-2'"></li>
          <li v-t="'home.row3-3'"></li>
          <li v-t="'home.row3-4'"></li>
        </ul>
      </div>
    </div>

    <div class="row">
      <div class="col-sm my-auto">
        <h2 v-t="'home.row4-1'"></h2>
        <ul>
          <li v-t="'home.row4-2'"></li>
          <li v-t="'home.row4-3'"></li>
          <li v-t="'home.row4-4'"></li>
          <li v-t="'home.row4-5'"></li>
          <li v-t="'home.row4-6'"></li>
        </ul>
      </div>
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/image4.png" alt="Shopkeeper God" />
      </div>
    </div>

    <div class="row">
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/image5.png" alt="Select a Hero" />
      </div>
      <div class="col-sm my-auto">
        <h2 v-t="'home.row5-1'"></h2>
        <ul>
          <li v-t="'home.row5-2'"></li>
          <li v-t="'home.row5-3'"></li>
          <li v-t="'home.row5-4'"></li>
          <li v-t="'home.row5-5'"></li>
          <li v-t="'home.row5-6'"></li>
        </ul>
      </div>
    </div>

    <div class="row">
      <div class="col-sm my-auto">
        <h2 v-t="'home.row6-1'"></h2>
        <ul>
          <li v-t="'home.row6-2'"></li>
          <li v-t="'home.row6-3'"></li>
          <li v-t="'home.row6-4'"></li>
          <li v-t="'home.row6-5'"></li>
          <li v-t="'home.row6-6'"></li>
        </ul>
      </div>
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/image6.png" alt="Plus" />
      </div>
    </div>

    <div class="row">
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/image6.png" alt="Leaderboard" />
      </div>
      <div class="col-sm my-auto">
        <h2 v-t="'home.row7-1'"></h2>
        <ul>
          <li v-t="'home.row7-2'"></li>
          <li v-t="'home.row7-3'"></li>
          <li v-t="'home.row7-4'"></li>
          <li v-t="'home.row7-5'"></li>
          <li v-t="'home.row7-6'"></li>
        </ul>
      </div>
    </div>

    <div class="row">
      <div class="col-sm my-auto">
        <h2 v-t="'home.row7-1'"></h2>
        <ul>
          <li v-t="'home.row7-2'"></li>
          <li v-t="'home.row7-3'"></li>
          <li v-t="'home.row7-4'"></li>
          <li v-t="'home.row7-5'"></li>
          <li v-t="'home.row7-6'"></li>
        </ul>
      </div>
      <div class="col-sm my-auto">
        <img class="img-fluid" src="./images/image7.png" alt="Plus" />
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
h1,
h2,
h3 {
  text-transform: uppercase;
}

h3 {
  letter-spacing: 2px;
  font-weight: 800px;
  font-size: 1.5rem;
}

.title {
  text-align: center;
  font-weight: 1000;
  letter-spacing: 4px;
  color: #0b86c4;
}

.row {
  margin-top: 1rem;
}

p {
  line-height: 1.2rem;
}

ul {
  padding-left: 20px;
}

li {
  padding-bottom: 3px;
}

.trailer {
  width: 400px;
  margin: auto;
}
</style>