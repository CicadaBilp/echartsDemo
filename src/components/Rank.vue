<template>
  <div class="container-wrapper">
    <div class="chart-wrapper" ref="rank"></div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      chart:null,
      rankData:null,
      startVal:0,
      endVal:9
    }
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$refs.rank,'chalk');
      const option = {
        title:{
          text:'| 地区销售排行',
          left:20,
          top:20
        },
        grid:{
          top:'40%',
          left:'5%',
          right:'5%',
          bottom:'5%',
          containLabel:true
        },
        tolltip:{
          show:true  //移入条目显示数据提示
        },
        xAxis:{
          type:'category'
        },
        yAxis:{
          type:'value'
        },
        series:[
          {
            type:'bar'
          }
        ]
      };
      this.chart.setOption(option);
      this.chart.on('mouseover',() => {
        clearInterval(this.timer)
      })
      this.chart.on('mouseout',() => {
        this.srartInterval()
      })
    },
    async getData(ret) {
      // const {data:ret} = await this.$http.get('/rank')
      this.rankData = ret
      this.rankData.sort((a,b) => {
        return b.value - a.value
      })
      this.updateChart();
      //调用定时平移方法
      this.startInterval()
    },
    updateChart() {
      const provinceArr = this.rankData.map((item) => item.name)
      const provinceValueArr = this.rankData.map((item) => item.value)
      const dataOption = {
        xAxis:{
          data:provinceArr
        },
        dataZoom:{
          show:false,
          startValue:this.startVal,
          endValue:this.endVal
        },
        series:[
          {
            data:provinceValueArr,
            itemStyle:{
              color:(arg) => {
                if(arg.value > 300){
                  return new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                    {offset:0, color:'gold'},
                    {offset:1, color:'purple'}
                  ])
                }else if(arg.value > 200){
                   return new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                    {offset:0, color:'yellow'},
                    {offset:1, color:'green'}
                  ])
                }else{
                   return new this.$echarts.graphic.LinearGradient(0,0,0,1,[
                    {offset:0, color:'orange'},
                    {offset:1, color:'blue'}
                  ])
                }
              } 
            }
          }
        ]
      };
      this.chart.setOption(dataOption);
    },
    handleResize() {
      const titleFontSize = this.$refs.rank.offsetWidth/100 * 3.6
      const sizeOption = {
        title:{
          textStyle:{
            fontSize:titleFontSize
          }
        },
        series:[
          {
            barWidth:titleFontSize,
            itemStyle:{
              barBorderRadius:[titleFontSize/2,titleFontSize/2,0,0]
            }
          }
        ]
      };
      this.chart.setOption(sizeOption);
      this.chart.resize();
    },
    //利用区域缩放,定时平移展示固定数据
    startInterval(){
      if(this.timer){
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.startVal++
        this.endVal++
        if(this.endVal > this.rankData.length -1){
          this.startVal = 0
          this.endVal = 9
        }
        this.updateChart()
      },2000)
    }
  },
  created(){
    this.$socket.registerCallBack('rankData',this.getData)
  },
  mounted() {
    this.initChart();
    // this.getData();
    this.$socket.send({
      action:'getData',  //行为
      socketType:'rankData',  //回调函数类型
      chartName:'rank',  //想获取的文件名
      value:''
    })
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
    clearInterval(this.timer)
    this.$scoket.unRegisterCallBack('rankData')

  },
};
</script>

<style>
</style>