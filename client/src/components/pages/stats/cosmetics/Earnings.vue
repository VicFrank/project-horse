<template>
  <div>
    <template v-if="loading">
      <div class="d-flex justify-content-center my-3">
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </template>
    <template v-else>
      <!-- Total Earnings for both paypal and stripe -->
      <div class="my-3 d-flex">
        <div class="payments-card">
          <div class="payments-card-header">Total Paypal</div>
          <div class="payments-card-body">
            ${{ Number(data.paypalTotal).toLocaleString() }}
          </div>
        </div>
        <div class="payments-card ml-3">
          <div class="payments-card-header">Total Stripe</div>
          <div class="payments-card-body">
            ${{ Number(data.stripeTotal).toLocaleString() }}
          </div>
        </div>
      </div>

      <h2>Paypal</h2>
      <EarningsGraph
        v-if="paypalEarnings"
        :data="paypalEarnings"
      ></EarningsGraph>

      <h2>Stripe</h2>
      <EarningsGraph
        v-if="paypalEarnings"
        :data="stripeEarnings"
      ></EarningsGraph>
    </template>
  </div>
</template>

<script>
import EarningsGraph from "./EarningsGraph.vue";
export default {
  components: {
    EarningsGraph,
  },
  props: {
    data: {
      type: Object,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    paymentsData: [],
  }),
  created() {
    this.$emit("created");
  },
  methods: {
    getDayOfYear(date) {
      const start = new Date(date.getFullYear(), 0, 0);
      const diff =
        date -
        start +
        (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
      const oneDay = 1000 * 60 * 60 * 24;
      const day = Math.floor(diff / oneDay);
      return day;
    },
    getEarningsPerDay(parsedPayments) {
      // calculate earnings per day
      const firstDay = parsedPayments[parsedPayments.length - 1].date;
      const lastDay = parsedPayments[0].date;

      const firstDayYear = firstDay.getFullYear();
      const lastDayYear = lastDay.getFullYear();

      // get every day/year combo between first and last day
      const days = [];
      for (let year = firstDayYear; year <= lastDayYear; year++) {
        for (let day = 1; day <= 365; day++) {
          if (year === firstDayYear && day < this.getDayOfYear(firstDay))
            continue;
          if (year === lastDayYear && day > this.getDayOfYear(lastDay))
            continue;
          days.push({ dayOfYear: day, year: year });
        }
      }

      console.log(firstDayYear, lastDayYear);

      // calculate earnings per day
      const earningsPerDay = days.map((day) => {
        const payments = parsedPayments.filter(
          (payment) =>
            payment.dayOfYear === day.dayOfYear && payment.year === day.year
        );
        const total = payments.reduce((acc, payment) => {
          return acc + Number(payment.amount);
        }, 0);

        return {
          date: new Date(day.year, 0, day.dayOfYear),
          total: total,
        };
      });

      return earningsPerDay;
    },
  },
  computed: {
    paypalEarnings() {
      if (!this.data) return;
      const parsedPayments = this.data.paypalPayments.map((payment) => {
        return {
          date: new Date(payment.log_time),
          dayOfYear: this.getDayOfYear(new Date(payment.log_time)),
          year: new Date(payment.log_time).getFullYear(),
          amount: payment.net_amount,
        };
      });

      return this.getEarningsPerDay(parsedPayments);
    },
    stripeEarnings() {
      if (!this.data) return;
      const parsedPayments = this.data.stripePayments.map((payment) => {
        return {
          date: new Date(payment.log_time),
          dayOfYear: this.getDayOfYear(new Date(payment.log_time)),
          year: new Date(payment.log_time).getFullYear(),
          amount: Number(payment.amount) / 100,
        };
      });

      return this.getEarningsPerDay(parsedPayments);
    },
  },
};
</script>

<style scoped>
.payments-card {
  background-color: #1e1e1e;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
  height: 100%;
  color: #fff;
  padding: 1rem;
}

.payments-card-header {
  padding-bottom: 1rem;
}

.payments-card-body {
  font-size: 2rem;
  font-weight: 500;
}
</style>