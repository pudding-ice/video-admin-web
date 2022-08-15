<template>
  <div class="chart-container">
    <chart height="50%" width="50%"/>
  </div>
</template>

<script>
import Chart from '@/components/Charts/Resource'

export default {
  name: 'ResourcesTotal',
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

