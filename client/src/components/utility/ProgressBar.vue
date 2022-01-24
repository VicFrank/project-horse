<template>
  <div class="progress-bar">
    <div class="percent-container">
      <span class="progress-percent">{{ progress }} / {{ required }}</span>
    </div>
    <div
      class="current-progress"
      :style="`width:${getProgressPercent()}%;`"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    progress: Number,
    required: Number,
  },

  methods: {
    getProgressPercent() {
      const cappedProgress = Math.min(this.progress, this.required);

      const percent = Math.min((cappedProgress * 100) / this.required, 100);
      return percent;
    },
  },
};
</script>

<style>
.progress-bar {
  background-color: rgba(188, 188, 188, 0.3);
  display: block;
}

.percent-container {
  position: relative;
}

.progress-percent {
  position: absolute;
  left: 50%;
  line-height: 20px;
  transform: translateX(-50%);
  width: 100%;
}

.current-progress {
  background-image: linear-gradient(to right, #0b86c4, #42728a);
  height: 20px;
}
</style>