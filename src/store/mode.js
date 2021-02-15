/*methods:{
  initChart(){
    this.chart = this.$echarts.init(this.$refs.trend)
    const option = {}
    this.chart.setOption(option)
  },
  getData(){
    this.updateChart()
  },
  updateChart(){
    const dataOption = {}
    this.chart.setOption(dataOption)
  },
  handleResize(){
    const sizeOption = {}
    this.chart.setOption(sizeOption)
    this.chart.resize()
  }
},
mounted(){
  this.initChart()
  this.getData()
  window.addEventListener('resize',this.handleResize)
  this.handleResize()
},
destroyed(){
  window.removeEventListener('resize',this.handleResize)
}*/