Page({

  data: {
    msg: {
      type: 'warn',
      text: '扫码失败',
      tip: "请直接使用摄像头完成扫码验证",
      operator: '返回首页',
      url: '/pages/index/index'
    }
  },
  goAgree() {
    wx.openSetting({
      success(res) {
        console.log(res)
        console.log(res.authSetting['scope.userLocation'])
        if (res.authSetting['scope.userLocation']) {
          wx.navigateTo({
            url: '/pages/punchCard/index',
          })
        }
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      },
      fail() {
        wx.navigateTo({
          url: '/pages/msg/error?type=1',
        })
      }
    })
  },

  goHome() {
    wx.navigateTo({
      url: this.data.msg.url,
    })
  },

  onLoad(option) {
    console.log("LOAD")
    console.log(option)
    var type = option.type
    if (type === "1") {
      this.setData({
        type: "1",
        msg: {
          type: 'warn',
          text: '授权失败',
          tip: "请授权小程序获取您的位置信息",
          operator: '返回首页',
          url: '/pages/index/index'
        }
      })
    }
    if (type === "2") {
      this.setData({
        type: "2",
        msg: {
          type: 'warn',
          text: '打卡失败',
          tip: "当前位置不在图书馆内，请到馆后再进行打卡",
          operator: '返回首页',
          url: '/pages/index/index'
        }
      })
    }
  },
})