<template>
  <div class="container-wrapper">
    <div class="chart-wrapper" ref="stock"></div>
  </div>
</template>

<script>
const centerArr = [
  ['10%','40%'],
  ['50%','40%'],
  ['82%','40%'],
  ['34%','75%'],
  ['66%','75%']
]
const colorArr = [
  ['#4FF778','#0BA82C'],
  ['#E5DD45','#E8B11C'],
  ['#E8821C','#E55445'],
  ['#5052EE','#AB6EE5'],
  ['#23E5E5','#2E72BF']
]
export default {
  data(){
    return {
      stockData:null,
      currentindex:0
    }
  },
  methods:{
    initChart(){
      this.chart = this.$echarts.init(this.$refs.stock,'chalk')
      const option = {
        title:{
          text:'| 库存和销量分析',
          top:20,
          left:20
        }
      }
      this.chart.setOption(option)
      this.chart.on('mousemove',() => {
        clearInterval(this.timer)
      })
      this.chart.on('mouseout',() => {
        this.startInterval()
      })
    },
    async getData(ret){
      // const {data:ret} = await this.$http.get('/stock')
      this.stockData = ret
      this.updateChart()
      this.startInterval()
    },
    updateChart(){
      const start = this.currentindex * 5
      const end = (this.currentindex+1) * 5
      const showData = this.stockData.slice(start,end)
      const seriesArr = showData.map((item,index) => {
        return {
          type:'pie',
          radius:[110,100], //圆环
          center:centerArr[index], //中心点
          hoverAnimation:false,  //hover时变动取消
          labelLine:{
            show:false  //显示标题
          },
          label:{
            position:'center' , //标题显示在圆环中心
            color:colorArr[index][0]
          },
          data:[
            {
              name:item.name + '\n' + item.sales,
              value:item.sales,
              itemStyle:{
                color:new this.$echarts.graphic.LinearGradient(0,1,0,0,[
                  {offset:0, color:colorArr[index][0]},
                  {offset:1, color:colorArr[index][1]}
                ])
              }
            },
            {
              value:item.stock,
              itemStyle:{
                color:'#333843'
              }
            }
          ]
        }
      })
      const dataOption = {
        series:seriesArr
      }
      this.chart.setOption(dataOption)
    },
    //定时切换展示的数据
    startInterval(){
      if(this.timer){
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.currentindex ++
        if(this.currentindex > 1){
          this.currentindex = 0
        }
        this.updateChart()
      },5000)
    },
    handleResize(){
      const titleFontSize = this.$refs.stock.offsetWidth / 100 *3.6
      const innerRadius = titleFontSize *2 
      const outRadius = innerRadius * 1.125
      const sizeOption = {
        title:{
          textStyle:{
            fontSize:titleFontSize
          }
        },
        series:[
          {
            type:'pie',
            radius:[outRadius,innerRadius], //类型为饼图基础的圆环图,两个圆的半径
            label:{
              fontSize:titleFontSize/2
            }
          },
          {
            type:'pie',
            radius:[outRadius,innerRadius],
            label:{
              fontSize:titleFontSize/2
            }
          },
          {
            type:'pie',
            radius:[outRadius,innerRadius],
            label:{
              fontSize:titleFontSize/2
            }
          },
          {
            type:'pie',
            radius:[outRadius,innerRadius],
            label:{
              fontSize:titleFontSize/2
            }
          },
          {
            type:'pie',
            radius:[outRadius,innerRadius],
            label:{
              fontSize:titleFontSize/2
            }
          }
        ]
      }
      this.chart.setOption(sizeOption)
      this.chart.resize()
    }
  },
  created(){
    this.$socket.registerCallBack('stockData',this.getData)
  },
  mounted(){
    this.initChart()
    // this.getData()
    this.$socket.send({
      action:'getData',  //行为
      socketType:'stockData',  //回调函数类型
      chartName:'stock',  //想获取的文件名
      value:''
    })
    window.addEventListener('resize',this.handleResize)
    this.handleResize()
  },
  destroyed(){
    window.removeEventListener('resize',this.handleResize)
    clearInterval(this.timer)
    this.$scoket.unRegisterCallBack('stockData')
  }
}
</script>

<style>
</style>