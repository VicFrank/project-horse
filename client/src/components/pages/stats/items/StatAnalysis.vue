<template>
  <b-container fluid class="py-4">
    <!-- ── Controls row ─────────────────────────────────────────── -->
    <b-row class="mb-4 px-3">
      <b-col>
        <div
          class="p-3"
          style="
            background: #1a1640;
            border: 1px solid #403652;
            border-radius: 6px;
          "
        >
          <h6 class="text-white mb-3">Hero Context &amp; Gold Values</h6>
          <div class="d-flex flex-wrap" style="gap: 24px">
            <div
              v-for="ctrl in controls"
              :key="ctrl.key"
              style="min-width: 140px"
            >
              <label class="text-muted small mb-1 d-block">{{
                ctrl.label
              }}</label>
              <b-form-input
                v-model.number="ctx[ctrl.key]"
                type="number"
                :min="ctrl.min"
                :max="ctrl.max"
                :step="ctrl.step"
                size="sm"
                style="
                  width: 120px;
                  background: #13102e;
                  color: #fff;
                  border-color: #403652;
                "
                @input="scheduleRebuild"
              />
            </div>
          </div>
        </div>
      </b-col>
    </b-row>

    <!-- ── DPS Surface ──────────────────────────────────────────── -->
    <b-row class="mb-2">
      <b-col>
        <b-card
          style="background: #13102e; border-color: #403652"
          header-bg-variant="dark"
        >
          <template #header>
            <div>
              <span class="text-white font-weight-bold">DPS Surface</span>
              <span class="text-muted small ml-3">
                DPS = (baseDmg + ΔDmg) × (100 + ΔIAS) / (100 × BAT)
              </span>
            </div>
            <div class="text-muted small mt-1">
              x = Bonus Attack Speed &nbsp;·&nbsp; y = Bonus Damage
              &nbsp;·&nbsp; z = DPS &nbsp;·&nbsp;
              <span style="color: #fff; font-weight: 600"
                >white line = optimal ratio</span
              >
            </div>
          </template>
          <div ref="chartDps" style="height: 520px; width: 100%"></div>
          <div
            class="mt-3 p-3"
            style="
              background: #1a1640;
              border-radius: 4px;
              border: 1px solid #403652;
            "
          >
            <div class="text-white font-weight-bold mb-1">
              Optimal Ratio — Attack Speed : Damage
            </div>
            <div class="text-muted small mb-2">
              Equal-marginal-efficiency:&nbsp;
              <code
                style="
                  background: #13102e;
                  padding: 2px 6px;
                  border-radius: 3px;
                  color: #8edc9a;
                "
              >
                ΔIAS = (baseDmg + ΔDmg) × (g<sub>Dmg</sub> / g<sub>IAS</sub>) −
                100
              </code>
            </div>
            <div v-if="ratios.dps" class="d-flex flex-wrap" style="gap: 24px">
              <div>
                <div class="text-muted small">
                  IAS per 1 bonus Damage (line slope)
                </div>
                <span
                  style="color: #42b983; font-size: 1.2em; font-weight: bold"
                  >{{ ratios.dps.iasPerDmg.toFixed(2) }}</span
                >
                <span class="text-muted small ml-1">attack speed / damage</span>
              </div>
              <div>
                <div class="text-muted small">Line equation</div>
                <span style="color: #f0a500"
                  >ΔIAS = {{ ratios.dps.iasPerDmg.toFixed(2) }} × ΔDmg +
                  {{ ratios.dps.iasIntercept.toFixed(1) }}</span
                >
              </div>
              <div>
                <div class="text-muted small">Gold split interpretation</div>
                <span class="text-white small"
                  >For every {{ ctx.goldPerDmg }}g on Damage, spend
                  {{ ctx.goldPerIAS }}g on Attack Speed (1 : 1 gold)</span
                >
              </div>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- ── Physical EHP Surface ─────────────────────────────────── -->
    <b-row class="mb-2 mt-4">
      <b-col>
        <b-card
          style="background: #13102e; border-color: #403652"
          header-bg-variant="dark"
        >
          <template #header>
            <div>
              <span class="text-white font-weight-bold"
                >Physical EHP Surface</span
              >
              <span class="text-muted small ml-3">
                EHP<sub>phys</sub> = (baseHP + ΔHP) × (1 + 0.06 × (baseArmor +
                ΔArmor))
              </span>
            </div>
            <div class="text-muted small mt-1">
              x = Bonus HP &nbsp;·&nbsp; y = Bonus Armor &nbsp;·&nbsp; z =
              Physical EHP &nbsp;·&nbsp;
              <span style="color: #fff; font-weight: 600"
                >white line = optimal ratio</span
              >
            </div>
          </template>
          <div ref="chartPhys" style="height: 520px; width: 100%"></div>
          <div
            class="mt-3 p-3"
            style="
              background: #1a1640;
              border-radius: 4px;
              border: 1px solid #403652;
            "
          >
            <div class="text-white font-weight-bold mb-1">
              Optimal Ratio — HP : Armor
            </div>
            <div class="text-muted small mb-2">
              Equal-marginal-efficiency:&nbsp;
              <code
                style="
                  background: #13102e;
                  padding: 2px 6px;
                  border-radius: 3px;
                  color: #8edc9a;
                "
              >
                ΔHP = g<sub>Armor</sub> × (1 + 0.06 × totalArmor) / (0.06 ×
                g<sub>HP</sub>) − baseHP
              </code>
            </div>
            <div v-if="ratios.phys" class="d-flex flex-wrap" style="gap: 24px">
              <div>
                <div class="text-muted small">
                  HP per 1 bonus Armor (line slope)
                </div>
                <span
                  style="color: #42b983; font-size: 1.2em; font-weight: bold"
                  >{{ ratios.phys.hpPerArmor.toFixed(1) }}</span
                >
                <span class="text-muted small ml-1">HP / armor</span>
              </div>
              <div>
                <div class="text-muted small">
                  Line equation (baseArmor = {{ ctx.baseArmor }})
                </div>
                <span style="color: #f0a500"
                  >ΔHP ≈ {{ ratios.phys.hpPerArmor.toFixed(1) }} × ΔArmor +
                  {{ ratios.phys.hpIntercept.toFixed(0) }}</span
                >
              </div>
              <div>
                <div class="text-muted small">Gold split interpretation</div>
                <span class="text-white small"
                  >For every {{ ctx.goldPerArmor }}g on Armor →
                  {{ ratios.phys.hpPerArmor.toFixed(0) }} HP worth
                  {{
                    (ctx.goldPerHP * ratios.phys.hpPerArmor).toFixed(0)
                  }}g</span
                >
              </div>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- ── Magic EHP Surface ──────────────────────────────────────── -->
    <b-row class="mb-2 mt-4">
      <b-col>
        <b-card
          style="background: #13102e; border-color: #403652"
          header-bg-variant="dark"
        >
          <template #header>
            <div>
              <span class="text-white font-weight-bold">Magic EHP Surface</span>
              <span class="text-muted small ml-3">
                EHP<sub>magic</sub> = (baseHP + ΔHP) / (0.75 × (1 − bonusMR% /
                100)) &nbsp; [stacks with 25% base resist]
              </span>
            </div>
            <div class="text-muted small mt-1">
              x = Bonus HP &nbsp;·&nbsp; y = Bonus Magic Resist % &nbsp;·&nbsp;
              z = Magic EHP &nbsp;·&nbsp;
              <span style="color: #fff; font-weight: 600"
                >white line = optimal ratio</span
              >
            </div>
          </template>
          <div ref="chartMagic" style="height: 520px; width: 100%"></div>
          <div
            class="mt-3 p-3"
            style="
              background: #1a1640;
              border-radius: 4px;
              border: 1px solid #403652;
            "
          >
            <div class="text-white font-weight-bold mb-1">
              Optimal Ratio — HP : Magic Resist
            </div>
            <div class="text-muted small mb-2">
              Equal-marginal-efficiency:&nbsp;
              <code
                style="
                  background: #13102e;
                  padding: 2px 6px;
                  border-radius: 3px;
                  color: #8edc9a;
                "
              >
                ΔHP = 100 × g<sub>MR</sub> × (1 − bonusMR% / 100) / g<sub
                  >HP</sub
                >
                − baseHP
              </code>
            </div>
            <div v-if="ratios.magic" class="d-flex flex-wrap" style="gap: 24px">
              <div>
                <div class="text-muted small">
                  ΔHP at 0% bonus MR (line intercept)
                </div>
                <span
                  :style="{
                    color: ratios.magic.hpAtZeroMR >= 0 ? '#42b983' : '#e05252',
                    fontSize: '1.2em',
                    fontWeight: 'bold',
                  }"
                >
                  {{ ratios.magic.hpAtZeroMR.toFixed(0) }}
                </span>
                <span class="text-muted small ml-1">HP</span>
              </div>
              <div>
                <div class="text-muted small">
                  HP decrease per 1% bonus MR (line slope)
                </div>
                <span style="color: #f0a500"
                  >−{{ (ctx.goldPerMR / ctx.goldPerHP).toFixed(1) }} HP per 1%
                  MR</span
                >
              </div>
              <div>
                <div class="text-muted small">Interpretation</div>
                <span class="text-white small">
                  <template v-if="ratios.magic.hpAtZeroMR > 0">
                    MR matches HP efficiency when you already have
                    {{ ratios.magic.hpAtZeroMR.toFixed(0) }}+ bonus HP
                  </template>
                  <template v-else
                    >HP is more efficient than MR at all values — raise g<sub
                      >MR</sub
                    >
                    to see the line</template
                  >
                </span>
              </div>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- ── Apply Panel ──────────────────────────────────────────── -->
    <b-row class="mb-4 mt-4 px-3">
      <b-col>
        <div
          class="p-3"
          style="
            background: #1a1640;
            border: 1px solid #403652;
            border-radius: 6px;
          "
        >
          <div class="d-flex align-items-center mb-2">
            <h6 class="text-white mb-0 mr-3">
              Apply Gold Values to Efficiency Tab
            </h6>
            <span class="text-muted small mr-auto"
              >Pushes g<sub>Dmg</sub>, g<sub>IAS</sub>, g<sub>HP</sub>, g<sub
                >Armor</sub
              >
              to the Efficiency tab's stat weights</span
            >
            <b-button size="sm" variant="outline-success" @click="applyDerived"
              >Apply to Efficiency Tab</b-button
            >
          </div>
          <div class="text-muted small">
            Magic Resist (g<sub>MR</sub>) is not currently tracked in the
            Efficiency tab.
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {
  calcDPS,
  calcEHPPhys,
  calcEHPMagic,
  BASE_VALUES,
} from "../../../../services/itemStats";

// ── ECharts lazy-load ─────────────────────────────────────────────
let echartsReady = null;
async function getECharts() {
  if (!echartsReady) {
    echartsReady = import("echarts").then(async (ec) => {
      await import("echarts-gl");
      return ec;
    });
  }
  return echartsReady;
}

// ── Axis ranges ───────────────────────────────────────────────────
const IAS_STEPS = 31; // 0..300  step 10
const DMG_STEPS = 31; // 0..300  step 10
const HP_STEPS = 21; // 0..2000 step 100
const ARMOR_STEPS = 31; // 0..30   step 1
const MR_STEPS = 31; // 0..60   step 2

function linspace(from, to, steps) {
  return Array.from(
    { length: steps },
    (_, i) => from + (i / (steps - 1)) * (to - from),
  );
}

const IAS_RANGE = linspace(0, 300, IAS_STEPS);
const DMG_RANGE = linspace(0, 300, DMG_STEPS);
const HP_RANGE = linspace(0, 2000, HP_STEPS);
const ARMOR_RANGE = linspace(0, 30, ARMOR_STEPS);
const MR_RANGE = linspace(0, 60, MR_STEPS);

// ── Surface data (actual axis values, not indices) ────────────────
function buildDpsSurface(bat, baseDamage) {
  const data = [];
  for (let xi = 0; xi < IAS_STEPS; xi++)
    for (let yi = 0; yi < DMG_STEPS; yi++)
      data.push([
        IAS_RANGE[xi],
        DMG_RANGE[yi],
        calcDPS(IAS_RANGE[xi], DMG_RANGE[yi], bat, baseDamage),
      ]);
  return data;
}

function buildPhysSurface(baseHP, baseArmor) {
  const data = [];
  for (let xi = 0; xi < HP_STEPS; xi++)
    for (let yi = 0; yi < ARMOR_STEPS; yi++)
      data.push([
        HP_RANGE[xi],
        ARMOR_RANGE[yi],
        calcEHPPhys(HP_RANGE[xi], ARMOR_RANGE[yi], baseHP, baseArmor),
      ]);
  return data;
}

function buildMagicSurface(baseHP) {
  const data = [];
  for (let xi = 0; xi < HP_STEPS; xi++)
    for (let yi = 0; yi < MR_STEPS; yi++)
      data.push([
        HP_RANGE[xi],
        MR_RANGE[yi],
        calcEHPMagic(HP_RANGE[xi], MR_RANGE[yi], baseHP),
      ]);
  return data;
}

// ── Optimal ratio lines ───────────────────────────────────────────
// DPS: equal-marginal condition → ΔIAS = (baseDmg + ΔDmg) × gDmg/gIAS − 100
// Parametrize by ΔDmg; find the ΔIAS that makes ∂DPS/∂Dmg / gDmg = ∂DPS/∂IAS / gIAS
function buildDpsOptLine(bat, baseDamage, goldPerDmg, goldPerIAS) {
  const slope = goldPerDmg / goldPerIAS;
  const coords = [];
  for (let yi = 0; yi < DMG_STEPS; yi++) {
    const bonusDmg = DMG_RANGE[yi];
    const bonusIAS = (baseDamage + bonusDmg) * slope - 100;
    if (bonusIAS < 0 || bonusIAS > IAS_RANGE[IAS_STEPS - 1]) continue;
    coords.push([
      bonusIAS,
      bonusDmg,
      calcDPS(bonusIAS, bonusDmg, bat, baseDamage),
    ]);
  }
  return coords.length >= 2 ? coords : [];
}

// Phys EHP: equal-marginal → ΔHP = gArmor × (1 + 0.06 × totalArmor) / (0.06 × gHP) − baseHP
// Parametrize by ΔArmor
function buildPhysOptLine(baseHP, baseArmor, goldPerHP, goldPerArmor) {
  const coords = [];
  for (let yi = 0; yi < ARMOR_STEPS; yi++) {
    const bonusArmor = ARMOR_RANGE[yi];
    const bonusHP =
      (goldPerArmor * (1 + 0.06 * (baseArmor + bonusArmor))) /
        (0.06 * goldPerHP) -
      baseHP;
    if (bonusHP < 0 || bonusHP > HP_RANGE[HP_STEPS - 1]) continue;
    coords.push([
      bonusHP,
      bonusArmor,
      calcEHPPhys(bonusHP, bonusArmor, baseHP, baseArmor),
    ]);
  }
  return coords.length >= 2 ? coords : [];
}

// Magic EHP: equal-marginal → ΔHP = 100 × gMR × (1 − mr/100) / gHP − baseHP
// Parametrize by bonus MR %
function buildMagicOptLine(baseHP, goldPerHP, goldPerMR) {
  const coords = [];
  for (let yi = 0; yi < MR_STEPS; yi++) {
    const mr = MR_RANGE[yi];
    const bonusHP = (100 * goldPerMR * (1 - mr / 100)) / goldPerHP - baseHP;
    if (bonusHP < 0 || bonusHP > HP_RANGE[HP_STEPS - 1]) continue;
    coords.push([bonusHP, mr, calcEHPMagic(bonusHP, mr, baseHP)]);
  }
  return coords.length >= 2 ? coords : [];
}

// ── Chart option factory ──────────────────────────────────────────
function surfaceOption({
  xAxis,
  yAxis,
  zAxis,
  data,
  xSteps,
  ySteps,
  lineData,
}) {
  const zVals = data.map((d) => d[2]);
  const series = [
    {
      type: "surface",
      wireframe: { show: false },
      data,
      dataShape: [xSteps, ySteps],
      itemStyle: { opacity: 0.85 },
    },
  ];
  if (lineData && lineData.length > 0) {
    series.push({
      type: "scatter3D",
      coordinateSystem: "cartesian3D",
      data: lineData,
      symbolSize: 6,
      itemStyle: { color: "#ffffff", opacity: 1 },
      emphasis: { itemStyle: { color: "#ffffff" } },
    });
  }
  return {
    backgroundColor: "#13102e",
    tooltip: {
      formatter: (params) => {
        const [x, y, z] = params.data;
        const seriesLabel =
          params.seriesIndex === 0 ? "Surface" : "Optimal Ratio";
        return [
          `<b>${seriesLabel}</b>`,
          `${xAxis.name}: ${Number(x).toFixed(1)}`,
          `${yAxis.name}: ${Number(y).toFixed(1)}`,
          `${zAxis.name}: <b>${Number(z).toFixed(1)}</b>`,
        ].join("<br/>");
      },
    },
    visualMap: {
      show: true,
      dimension: 2,
      min: Math.min(...zVals),
      max: Math.max(...zVals),
      inRange: {
        color: [
          "#313695",
          "#4575b4",
          "#74add1",
          "#abd9e9",
          "#e0f3f8",
          "#ffffbf",
          "#fee090",
          "#fdae61",
          "#f46d43",
          "#d73027",
          "#a50026",
        ],
      },
      textStyle: { color: "#ccc" },
    },
    xAxis3D: {
      type: "value",
      name: xAxis.name,
      nameTextStyle: { color: "#ccc" },
      axisLabel: { color: "#ccc" },
      axisLine: { lineStyle: { color: "#403652" } },
    },
    yAxis3D: {
      type: "value",
      name: yAxis.name,
      nameTextStyle: { color: "#ccc" },
      axisLabel: { color: "#ccc" },
      axisLine: { lineStyle: { color: "#403652" } },
    },
    zAxis3D: {
      type: "value",
      name: zAxis.name,
      nameTextStyle: { color: "#ccc" },
      axisLabel: { color: "#ccc" },
      axisLine: { lineStyle: { color: "#403652" } },
    },
    grid3D: {
      boxWidth: 200,
      boxDepth: 80,
      boxHeight: 80,
      viewControl: {
        autoRotate: false,
        rotateSensitivity: 1,
        zoomSensitivity: 1,
      },
      light: {
        main: { intensity: 1.2, shadow: false },
        ambient: { intensity: 0.3 },
      },
      axisLine: { lineStyle: { color: "#403652" } },
      splitLine: { lineStyle: { color: "#2a2450" } },
    },
    series,
  };
}

export default {
  name: "StatAnalysis",
  props: {
    // Passed from parent so Apply can mutate parent's customStatValues
    customStatValues: { type: Object, required: true },
    baseStatValues: { type: Object, required: true },
  },
  data() {
    return {
      ctx: {
        bat: 1.7,
        baseDamage: 50,
        baseHP: 200,
        baseArmor: 0,
        goldPerDmg: 50,
        goldPerIAS: 25,
        goldPerHP: 2,
        goldPerArmor: 100,
        goldPerMR: 50,
      },
      controls: [
        {
          key: "bat",
          label: "BAT (Base Attack Time)",
          min: 0.5,
          max: 3.0,
          step: 0.05,
        },
        { key: "baseDamage", label: "Base Damage", min: 1, max: 200, step: 1 },
        { key: "baseHP", label: "Base HP", min: 100, max: 1000, step: 50 },
        { key: "baseArmor", label: "Base Armor", min: -5, max: 20, step: 1 },
        {
          key: "goldPerDmg",
          label: "g per Damage (gDmg)",
          min: 1,
          max: 500,
          step: 1,
        },
        {
          key: "goldPerIAS",
          label: "g per Attack Speed (gIAS)",
          min: 1,
          max: 200,
          step: 1,
        },
        {
          key: "goldPerHP",
          label: "g per HP (gHP)",
          min: 0.5,
          max: 20,
          step: 0.5,
        },
        {
          key: "goldPerArmor",
          label: "g per Armor (gArmor)",
          min: 1,
          max: 500,
          step: 5,
        },
        {
          key: "goldPerMR",
          label: "g per MR% (gMR)",
          min: 1,
          max: 500,
          step: 5,
        },
      ],
      ratios: { dps: null, phys: null, magic: null },
      chartDps: null,
      chartPhys: null,
      chartMagic: null,
      rebuildTimer: null,
    };
  },
  computed: {},
  async mounted() {
    const ec = await getECharts();
    this.chartDps = ec.init(this.$refs.chartDps, "dark");
    this.chartPhys = ec.init(this.$refs.chartPhys, "dark");
    this.chartMagic = ec.init(this.$refs.chartMagic, "dark");
    window.addEventListener("resize", this.handleResize);
    this.buildAll();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    [this.chartDps, this.chartPhys, this.chartMagic].forEach(
      (c) => c && c.dispose(),
    );
  },
  methods: {
    handleResize() {
      [this.chartDps, this.chartPhys, this.chartMagic].forEach(
        (c) => c && c.resize(),
      );
    },
    scheduleRebuild() {
      clearTimeout(this.rebuildTimer);
      this.rebuildTimer = setTimeout(() => this.buildAll(), 300);
    },
    buildAll() {
      this.buildDps();
      this.buildPhys();
      this.buildMagic();
      this.computeRatios();
    },
    buildDps() {
      if (!this.chartDps) return;
      const { bat, baseDamage, goldPerDmg, goldPerIAS } = this.ctx;
      const data = buildDpsSurface(bat, baseDamage);
      const lineData = buildDpsOptLine(bat, baseDamage, goldPerDmg, goldPerIAS);
      this.chartDps.setOption(
        surfaceOption({
          xAxis: { name: "Bonus Attack Speed" },
          yAxis: { name: "Bonus Damage" },
          zAxis: { name: "DPS" },
          data,
          xSteps: IAS_STEPS,
          ySteps: DMG_STEPS,
          lineData,
        }),
        true,
      );
    },
    buildPhys() {
      if (!this.chartPhys) return;
      const { baseHP, baseArmor, goldPerHP, goldPerArmor } = this.ctx;
      const data = buildPhysSurface(baseHP, baseArmor);
      const lineData = buildPhysOptLine(
        baseHP,
        baseArmor,
        goldPerHP,
        goldPerArmor,
      );
      this.chartPhys.setOption(
        surfaceOption({
          xAxis: { name: "Bonus HP" },
          yAxis: { name: "Bonus Armor" },
          zAxis: { name: "Phys EHP" },
          data,
          xSteps: HP_STEPS,
          ySteps: ARMOR_STEPS,
          lineData,
        }),
        true,
      );
    },
    buildMagic() {
      if (!this.chartMagic) return;
      const { baseHP, goldPerHP, goldPerMR } = this.ctx;
      const data = buildMagicSurface(baseHP);
      const lineData = buildMagicOptLine(baseHP, goldPerHP, goldPerMR);
      this.chartMagic.setOption(
        surfaceOption({
          xAxis: { name: "Bonus HP" },
          yAxis: { name: "Magic Resist %" },
          zAxis: { name: "Magic EHP" },
          data,
          xSteps: HP_STEPS,
          ySteps: MR_STEPS,
          lineData,
        }),
        true,
      );
    },
    computeRatios() {
      const {
        baseDamage,
        baseHP,
        baseArmor,
        goldPerDmg,
        goldPerIAS,
        goldPerHP,
        goldPerArmor,
        goldPerMR,
      } = this.ctx;
      const slope_dps = goldPerDmg / goldPerIAS;
      // DPS line: ΔIAS = slope × ΔDmg + (baseDmg × slope − 100)
      const dpsIntercept = baseDamage * slope_dps - 100;
      // Phys line: ΔHP = (gArmor/gHP) × ΔArmor + (gArmor×(1+0.06×baseArmor)/(0.06×gHP) − baseHP)
      const hpPerArmor = goldPerArmor / goldPerHP;
      const hpIntercept =
        (goldPerArmor * (1 + 0.06 * baseArmor)) / (0.06 * goldPerHP) - baseHP;
      // Magic line: ΔHP = 100×gMR/gHP − baseHP − (gMR/gHP)×mr  (at mr=0: intercept)
      const hpAtZeroMR = (100 * goldPerMR) / goldPerHP - baseHP;
      this.ratios = {
        dps: { iasPerDmg: slope_dps, iasIntercept: dpsIntercept },
        phys: { hpPerArmor, hpIntercept },
        magic: { hpAtZeroMR },
      };
    },
    applyDerived() {
      const MAP = {
        bonus_damage: this.ctx.goldPerDmg,
        bonus_attack_speed: this.ctx.goldPerIAS,
        bonus_health: this.ctx.goldPerHP,
        bonus_armor: this.ctx.goldPerArmor,
      };
      Object.entries(MAP).forEach(([stat, val]) => {
        if (stat in BASE_VALUES) this.$set(this.customStatValues, stat, val);
      });
      this.$emit("applied");
    },
  },
};
</script>

<style scoped>
canvas {
  background-color: #13102e;
  border-radius: 4px;
}
</style>
