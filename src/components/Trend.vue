<template>
  <div class="container-wrapper">
    <div class="title" :style="resizeStyle">
      <span class="title-text">{{showTitle}}</span>
      <i class="iconfont" @click="showSelect = !showSelect" :style="resizeStyle">&#xe6eb;</i>
      <ul class="select-title" v-show="showSelect">
        <li class="select-item" 
            v-for="(item,index) in selectType"
            :key="index"
            @click="handleSelect(item.key)"
        >{{item.text}}</li>
      </ul>
    </div>
    <div class="chart-wrapper" ref="trend"></div>
  </div>
</template>

<script>
const colorArr = [
        'rgba(11,168,44,0.5)',
        'rgba(44,110,255,0.5)',
        'rgba(22,242,217,0.5)',
        'rgba(254,33,30,0.5)',
        'rgba(250,105,0,0.5)'
      ]
const colorArr2 = [
  'rgba(11,168,44,0)',
  'rgba(44,110,255,0)',
  'rgba(22,242,217,0)',
  'rgba(254,33,30,0)',
  'rgba(250,105,0,0)'
]
export default {
  data(){
    return {
      trendData:null,
      chart:null,
      showSelect:false,
      currentType:'map',
      titleFontSize:0
    }
  },
  computed:{
    selectType(){
      if(!this.trendData){
        return []
      }else{
        return this.trendData.type.filter(item => {
          return item.key !== this.currentType
        })
      }
    },
    showTitle(){
      if(!this.trendData){
        return ''
      }else{
        return this.trendData[this.currentType].title
      }
    },
    resizeStyle(){
      return {
        fontSize:this.titleFontSize + 'px'
      }
    }
  },
  methods:{
    initChart(){
      this.chart = this.$echarts.init(this.$refs.trend,'chalk')
      const option = {
        grid:{
          left:'3%',
          right:'4%',
          top:'35%',
          bottom:'1%',
          containLabel:true  
        },
        tooltip:{
          trigger:'axis'  //hover时显示工具提示
        },
        legend:{
          right:20,
          top:'15%',
          icon:'circle'
        },
        xAxis:{
          type:'category',
          boundaryGap:false  //x轴线是否有间隙,设置false紧挨y轴
        },
        yAxis:{
          type:'value'
        }
      }
      this.chart.setOption(option)
    },
    async getData(ret){
      //axios下发送http请求
      // const {data:ret} = await this.$http.get('/trend')
      this.trendData = ret
      this.updateChart()
    },
    updateChart(){
      
      //获取x轴的月份数据
      const timeArr = this.trendData.common.month
      //某类型的销量数据数组
      const valueArr = this.trendData[this.currentType].data
      //几个地区的销量数据组成series数组
      const seriesArr = valueArr.map((item,index) => {
        return {
          name:item.name,
          type:'line',
          data:item.data,
          stack:'map',
          areaStyle:{
            color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[
              {
                offset:0,
                color:colorArr[index]
              },
              {
                offset:1,
                color:colorArr2[index]
              }
            ])
          }
        }
      })
      //图例数组
      const legendArr = valueArr.map(item => item.name)

      const dataOption = {
        xAxis:{
          data:timeArr
        },
        legend:{
          data:legendArr
        },
        series:seriesArr
      }
      this.chart.setOption(dataOption)
    },
    handleResize(){
      this.titleFontSize = this.$refs.trend.offsetWidth/100 * 3.6
      const sizeOption = {
        legend:{
          itemWidth:this.titleFontSize,
          itemHeigt:this.titleFontSize,
          itemGap:this.titleFontSize,
          textStyle:{
            fontSize:this.titleFontSize/2
          }
        }
      }
      this.chart.setOption(sizeOption)
      this.chart.resize()
    },
    //处理点击标题切换图表
    handleSelect(key){
      this.currentType = key
      this.updateChart()
      this.showSelect = false
    }
  },
  created(){
    this.$socket.registerCallBack('trendData',this.getData)
  },
  mounted(){
    this.initChart()
    //axios方式下,在mounted时发送请求获取数据
    // this.getData()
    //websocket方式下,mounted时调用实例对象中的send方法给服务端发送数据
    this.$socket.send({
      action:'getData',  //行为
      socketType:'trendData',  //回调函数类型
      chartName:'trend',  //想获取的文件名
      value:''
    })
    window.addEventListener('resize',this.handleResize)
    this.handleResize()
  },
  destroyed(){
    window.removeEventListener('resize',this.handleResize)
    this.$scoket.unRegisterCallBack('trendData')
  }
}
</script>

<style scoped lang="scss">
.title{
  position: absolute;
  left:30px;
  top:30px;
  z-index:10;
  color:#fff;
  .title-text{
    margin-right: 10px;
  }
  i:hover{
    cursor: pointer;
  }
  .select-title{
    margin:0;
    list-style: none;
  }
  .select-item{
    margin: 7px;
    &:hover{
      cursor: pointer;
    }
  }
}

</style>