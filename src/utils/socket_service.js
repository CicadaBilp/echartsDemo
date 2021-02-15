export default class SocketService {
  //单例
  static instance = null
  static get Instance() {
    if(!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  ws = null
  //存储回调函数的对象,用来存储外界的回调
  callbackMap = {}

  connected = false
  //发送失败时尝试发送的次数
  sendTestCount = 0
  //连接失败时尝试连接的次数
  connectTestCount = 0

  connect() {
    //连接服务器
    if(!window.WebSocket) {
      return console.log('不支持websocket');
    }
    this.ws = new WebSocket('ws://localhost:9998')

    this.ws.onopen = () => {
      console.log('连接成功');
      this.connected = true
      this.connectTestCount = 0
    }
    this.ws.onclose = () => {
      console.log('连接失败');
      this.connected = false
      setTimeout(() => {
        this.connect()
      },500 * this.connectTestCount)
    }
    //接收到服务端返回的数据,找到存储的对应回调执行传入获取的数据
    this.ws.onmessage = (msg) => {
      // console.log('获取到数据');
      // console.log(msg.data);
      const retData = JSON.parse(msg.data)
      const socketType = retData.socketType
      if(this.callbackMap[socketType]){
        const action = retData.action
        if(action === 'getData'){
          //请求的图表数据
          const Data = JSON.parse(retData.data)
          this.callbackMap[socketType].call(null,Data)
        }else if(action === 'fullScreen'){

        }else if(action === 'themeChange'){

        }
      }
    }
  }

  //该方法供外界传入回调,存储在callbackmap中
  registerCallBack(socketType,callBack){
    this.callbackMap[socketType] = callBack
  }
  //清空某类型的回调
  unRegisterCallBack(socketType){
    this.callbackMap[socketType] = null
  }

  //供外界调用发送数据
  send(data){
    if(this.connected){
      this.sendTestCount = 0
      this.ws.send(JSON.stringify(data))
    }else{
      this.sendTestCount++
      setTimeout(() => {
        this.send(data)
      },500 * this.sendTestCount)
    }
  }
}