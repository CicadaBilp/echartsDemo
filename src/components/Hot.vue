<template>
  <div class="container-wrapper">
    <div class="chart-wrapper" ref="hot"></div>
    <i class="iconfont left" @click="toLeft" :style="titleStyle">&#xe6ef;</i>
    <i class="iconfont right" @click="toRight" :style="titleStyle">&#xe6ed;</i>
    <span class="category-name" :style="titleStyle">{{catName}}</span>
  </div>
</template>

<script>
export default {
  data(){
    return{
      chart:null,
      hotData:null,
      currindex:0,
      titleFontSize:0
    }
  },
  computed:{
    catName(){
      if(!this.hotData){
        return ''
      }else{
        return this.hotData[this.currindex].name
      }
    },
    titleStyle(){
      return {
        fontSize:this.titleFontSize + 'px'
      }
    }
  },
  methods:{
    initChart(){
      this.chart = this.$echarts.init(this.$refs.hot,'chalk')
      const option = {
        title:{
          text:'| 热销商品占比统计',
          top:20,
          left:20
        },
        legend:{
          top:'15%',
          icon:'circle'
        },
        tooltip:{
          show:true,
          formatter:arg => {
            const thirdCat = arg.data.children
            let total = 0
            let retStr = '';
            thirdCat.forEach((item) => {
              total += item.value
            })
            thirdCat.forEach((item) => {
              retStr += `${item.name} : ${parseInt((item.value)/total * 100)}% </br>`
            })
            return retStr
          }
        },
        series:[
          {
            type:'pie',
            label:false,
            emphasis:{  //条目高亮状态下
              label:{
                show:true
              }
            }
          }
        ]
      }
      this.chart.setOption(option)
    },
    async getData(ret){
      // const {data:ret} = await this.$http.get('/hotproduct')
      this.hotData = ret
      this.updateChart()
    },
    updateChart(){
      const seriesData = this.hotData[this.currindex].children.map((item) => {
        return {
          name:item.name,
          value:item.value,
          children:item.children
        }
      })
      const legendData = this.hotData[this.currindex].children.map((item) => item.name)
      const dataOption = {
        series:[
          {
            data:seriesData
          }
        ],
        legend:{
          data:legendData
        }
      }
      this.chart.setOption(dataOption)
    },
    handleResize(){
      const titleFontSize = this.$refs.hot.offsetWidth/100 * 3.6
      this.titleFontSize = titleFontSize
      const sizeOption = {
        title:{
          textStyle:{
            fontSize:this.titleFontSize
          }
        },
        legend:{
          itemWidth:this.titleFontSize/2,
          itemHeight:this.titleFontSize/2,
          itemGap:this.titleFontSize/2,
          textStyle:{
            fontSize:this.titleFontSize/2
          }
        },
        series:[
          {
            radius:this.titleFontSize * 4.5,
            center:['50%','60%']
          }
        ]
      }
      this.chart.setOption(sizeOption)
      this.chart.resize()
    },
    toLeft(){
      this.currindex--
      if(this.currindex < 0){
        this.currindex = this.hotData.length - 1
      }
      this.updateChart()
    },
    toRight(){
      this.currindex++
      if(this.currindex > this.hotData.length - 1){
        this.currindex = 0
      }
      this.updateChart()
    }
  },
  created(){
    this.$socket.registerCallBack('hotData',this.getData)
  },
  mounted(){
    this.initChart()
    // this.getData()
    this.$socket.send({
      action:'getData',  //行为
      socketType:'hotData',  //回调函数类型
      chartName:'hotproduct',  //想获取的文件名
      value:''
    })
    window.addEventListener('resize',this.handleResize)
    this.handleResize()
  },
  destroyed(){
    window.removeEventListener('resize',this.handleResize)
    this.$scoket.unRegisterCallBack('hotData')
  }
}
</script>

<style scoped lang="scss">
.left{
  position: absolute;
  left: 10%;
  top:50%;
  transform: translate3d(0,-50%,0);
  cursor: pointer;
  color: #fff;
}
.right{
  position: absolute;
  right: 10%;
  top:50%;
  transform: translate3d(0,-50%,0);
  cursor: pointer;
  color: #fff;
}
.category-name{
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: #fff;
}
</style>