// pages/msg/success.js
Page({

  data: {
    seatData: undefined,
    msg: {
      type: 'warn',
      title: '预约成功',
      tip1: "预约时间：2019-09-17",
      tip2: '座位：2F-R[3排四座]',
      operatorText: '我知道了',
      tip_bottom: '如需取消此预约，请前往首页-我的预约 取消',
      url: '/pages/index/index'
    }
  },
  goHme() {
    wx.navigateTo({
      url: '../index/index',
    })
  },

  onLoad: function(options) {
    console.log(options)
    //签到
    if (options.type === "0") {
      this.setData({
        msg: {
          type: 'warn',
          title: '签到成功',
          operatorText: '返回首页',
          url: '/pages/index/index'
        }
      })
    }
    if (options.seat) {
      var data = JSON.parse(options.seat)
      this.setData({
        seatData: data
      })
    }
  },

})