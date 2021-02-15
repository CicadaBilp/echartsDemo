<template>
  <div class="container-wrapper" @dblclick="backChina">
    <div class="chart-wrapper" ref="map"></div>
  </div>
</template>

<script>
import {getProvinceMapInfo} from '../utils/map_utils'
export default {
  data(){
    return {
      chart:null,
      mapData:null,
      provinceData:{}
    }
  },
  methods: {
    async initChart() {
      this.chart = this.$echarts.init(this.$refs.map,'chalk');
      const ret = await this.$http.get('/china')
      this.$echarts.registerMap('china',ret.data)
      
      const option = {
        title:{
          text:'| 商家分布',
          left:20,
          top:20
        },
        geo:{
          type:'map',
          map:'china',
          top:'5%',
          bottom:'5%',
          itemStyle:{
            areaColor:'#2E72BF',
            borderColor:'#333'
          }
        },
        legend:{
          left:'5%',
          bottom:'5%',
          orient:'vertical'  //图例垂直方向
        }
      };
      this.chart.setOption(option);
      //注册地图点击事件
      this.chart.on('click',async (arg) => {
        // console.log(arg);
        const province = getProvinceMapInfo(arg.name)
        if(!this.provinceData[province.key]){
          const ret = await this.$http.get(province.path)
          this.provinceData[province.key] = ret.data
          // this.$echarts.registerMap(province.key,ret.data)
          this.$echarts.registerMap(province.key,ret.data)
        }

        const changeOption = {
          geo:{
            map:province.key
          }
        }
        this.chart.setOption(changeOption)
      })
    },
    getData(ret) {
      // const {data:ret} = await this.$http.get('/map')
      this.mapData = ret
      this.updateChart();
    },
    updateChart() {
      const seriesArr = this.mapData.map((item) => {
        return {
          type:'effectScatter',
          rippleEffect:{
            scale:5,  //涟漪范围
            brushType:'stroke'  //涟漪空心
          },
          name:item.name,
          data:item.children,
          coordinateSystem:'geo'
        }
      })
      const legendArr = this.mapData.map((item) => item.name)
      const dataOption = {
        legend:{
          data:legendArr
        },
        series:seriesArr
      };
      this.chart.setOption(dataOption);
    },
    handleResize() {
      const titleFontSize = this.$refs.map.offsetWidth/100 * 3.6
      const sizeOption = {
        title:{
          textStyle:{
            fontSize:titleFontSize
          }
        },
        legend:{
          itemWidth:titleFontSize/2,
          itemHeight:titleFontSize/2,
          itemGap:titleFontSize/2,
          textStyle:{
            fontSize:titleFontSize/2
          }
        }
      };
      this.chart.setOption(sizeOption);
      this.chart.resize();
    },
    backChina(){
      const backOption = {
        geo:{
          map:'china'
        }
      }
      this.chart.setOption(backOption)
    },
    getChinaData(ret){
      console.log(ret);
      return ret
    },
    getProviceData(ret){
      console.log(ret);
      return ret
    }
  },
  created(){
    this.$socket.registerCallBack('mapData',this.getData)
  },
  mounted() {
    this.$socket.send({
      action:'getData',  //行为
      socketType:'mapData',  //回调函数类型
      chartName:'map',  //想获取的文件名
      value:''
    })
    this.initChart();
    // this.getData();
    
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  destroyed() {
    window.removeEventListener("resize", this.handleResize);
    this.$scoket.unRegisterCallBack('mapData')
  },
};
</script>

<style>
</style>