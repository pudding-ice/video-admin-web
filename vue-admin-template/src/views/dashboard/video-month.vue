<template>
  <div class="chart-container">
    <chart height="100%" width="100%"/>
  </div>
</template>

<script>
import Chart from '@/components/Charts/MixChart'

export default {
  name: 'VideoMonth',
  components: {Chart}
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 696px;
}
</style>

