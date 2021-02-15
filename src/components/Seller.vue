<template>
  <div class="container-wrapper">
    <div class="chart-wrapper" ref="seller"></div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      chart:null,  //echarts实例
      sellerData:null,  //请求的数据数组
      currentPage:1,  //当前显示第几分页
      totalPage:0  //总页数
    }
  },
  methods:{
    initChart(){
      this.chart = this.$echarts.init(this.$refs.seller,'chalk')
      const option = {
        title:{
          text:'| 商家销售统计',
          left:20,
          top:20
        },
        grid:{
          top:'20%',
          left:'3%',
          right:'6%',
          bottom:'3%',
          containLabel:true  //距离包含坐标轴上的文字
        },
        xAxis:{
          type:'value'
        },
        yAxis:{
          type:'category'
        },
        tooltip:{  //工具提示:移入显示数值和背景
          trigger:'axis',
          axisPointer:{
            type:'line',
            z:0,
            lineStyle:{
              color:'#203443'
            }
          }
        },
        series:[
          {
            type:'bar',
            label:{
              show:true,
              position:'right',
              textStyle:{
                color:'white'
              }
            },
            itemStyle:{
              color:new this.$echarts.graphic.LinearGradient(0,0,1,0,[
                {
                  offset:0,
                  color:'green'
                },
                {
                  offset:1,
                  color:'yellow'
                }
              ])
            }
          }
        ]
      }
      this.chart.setOption(option)
      this.chart.on('mouseover',() => {
        clearInterval(this.timer)
      })
      this.chart.on('mouseout',() => {
        this.startInterval()
      })
    },
    async getData(ret){
      // const {data:ret} = await this.$http.get('/seller')
      console.log(ret);
      this.sellerData = ret
      //根据value排序
      this.sellerData.sort((a,b) => {
        return a.value - b.value  //小到大
      })
      //分页显示,一页5个,先得到总页数
      this.totalPage = this.sellerData.length%5 === 0 ? this.sellerData.length/5 : this.sellerData.length/5 + 1
      this.updateChart()
      //开启定时更新
      this.startInterval()
    },
    //更新图表设置
    updateChart(){
      const start = (this.currentPage - 1) * 5
      const end = this.currentPage * 5
      const showData = this.sellerData.slice(start,end)
      const sellerName = showData.map(item => item.name)
      const sellerValue = showData.map(item => item.value)
      //处理数据后整合更新option
      const dataOption = {
        yAxis:{
          data:sellerName
        },
        series:[
          {
            data:sellerValue
          }
        ]
      }

      this.chart.setOption(dataOption)
    },
    //定时更新展示图表
    startInterval(){
      if(this.timer){
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.currentPage++
        if(this.currentPage > this.totalPage){
          this.currentPage = 1
        }
        this.updateChart()
      },2000)
    },
    handleResize(){
      const titleFontSize = this.$refs.seller.offsetWidth / 100 * 3.6
      const sizeOption = {
        title:{
          textStyle:{
            fontSize:titleFontSize
          }
        },
        tooltip:{  //工具提示:移入显示数值和背景
          axisPointer:{
            lineStyle:{
              width:titleFontSize
            }
          }
        },
        series:[
          {
            barWidth:titleFontSize,
            itemStyle:{
              barBorderRadius:[0,titleFontSize/2,titleFontSize/2,0],
            }
          }
        ]
      }
      this.chart.setOption(sizeOption)
      this.chart.resize()
    }
  },
  created(){
    this.$socket.registerCallBack('sellerData',this.getData)
  },
  mounted(){
    this.initChart()
    // this.getData()
    this.$socket.send({
      action:'getData',  //行为
      socketType:'sellerData',  //回调函数类型
      chartName:'seller',  //想获取的文件名
      value:''
    })
    window.addEventListener('resize',this.handleResize)
    this.handleResize()
  },
  destroyed(){
    clearInterval(this.timer)
    window.removeEventListener('resize',this.handleResize)
    this.$scoket.unRegisterCallBack('sellerData')
  }
}
</script>

<style>

</style>