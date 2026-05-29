const urlParams = new URLSearchParams(window.location.search)
const dasPathRun = urlParams.get('DasPathRun') || ''

window.webConfig = {
  staticResourceUrl: 'http://112.30.143.166:8007/yyzMedia', // Nginx代理静态资源
  // staticResourceUrl: 'http://localhost:8081/jiuhua', // 静态资源(本地IIS服务器)
  htmlResourceUrl: 'http://localhost:5173/infoHtml', // 地图弹窗 html资源
  signalServerUrl: 'ws://10.100.5.11:6543', // 推流
  mapMarkerUrl: dasPathRun, // 地图marker图标根路径，从路径参数 DasPathRun 获取
  screenWidth: 1920, // 设计稿宽度
  isElectron: false // 是否为electron模式，用推流调试时配置为false
}
