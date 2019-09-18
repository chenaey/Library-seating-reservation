Page({


  data: {

  },

  distance: function(la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(2);
    return s;
  },

  /**
   * 判断当前位置是否在图书馆附近
   * return 
   */
  getLocation() {
    wx.showToast({
      title: '打卡中...',
      icon: 'loading',
      duration: 5000
    })
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        //23.36942030164 113.444378 4F
        //23.376624, 113.442394,
        //23.379646  113.436634
        var testdistance = that.distance(latitude, longitude, 23.370269097222224, 113.44757839626736);
        console.log("距离为：", testdistance, "千米")
        wx.hideToast()
        if (testdistance <= 50) {
          wx.navigateTo({
            //0 成功
            url: '/pages/msg/success?type=0',
          })
        } else {
          wx.navigateTo({
            url: '/pages/msg/error?type=2',
          })
        }
        return testdistance
      },
      fail(err) {
        wx.hideToast()
        console.log(err)
        console.log("ERR")
        wx.navigateTo({
          url: '/pages/msg/error?type=1',
        })
      }
    })
  },

  onLoad: function(options) {
    console.log(options)
    //小程序内扫码
    if (options.type === "0") {
      this.getLocation()

    } else {
      //小程序外扫码
      var scene = wx.getLaunchOptionsSync().scene
      console.log(scene)
      if (scene !== 1011) {
        wx.navigateTo({
          url: '/pages/msg/error',
        })
      }
    }

  },

  onShow: function(option) {


  },
})