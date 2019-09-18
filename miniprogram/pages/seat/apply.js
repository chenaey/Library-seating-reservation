Page({
  data: {
    showTopTips: false,
    currTime: "08:00",
    dateStart: "2019-09-01",
    dateEnd: "2019-09-01",
    time: "12:01",
    campusCodeIndex: 0,
    campus: ["白云校区图书馆"],
    seat: "点击选择座位",
    campusIndex: 0,
    isAgree: false,

    authData: undefined, //认证数据
    nextDay: undefined, //下一天
    needPunchTime: 0,
    yuyueDay: 0, //预约的天数
    seatData: undefined,
    floors: [
      // {
      //     id: "1F",
      //     name: '一楼',
      //     isClick: false,
      //   },
      {
        id: "2F",
        campus: 0,
        floor: '2',
        name: '二楼',
        isClick: false,
      },
      // {
      //   id: "3F",
      //   name: '三楼',
      //   isClick: false,

      // },
      // {
      //   id: "4F",
      //   name: '四楼',
      //   isClick: false,

      // }
    ],

  },

  clickFloor(e) {
    var id = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    var data = this.data.floors
    for (var i = 0; i < data.length; i++) {
      data[i].isClick = false
    }
    data[id].isClick = true
    this.setData({
      floors: data
    })
  },



  calculatePunchTime() {
    var start = this.data.selectDateStart
    var end = this.data.selectDateEnd
    var date = start.split("-")
    var Y = date[0]
    var M = date[1]
    var D = date[2]
    var date1 = new Date(Y, parseInt(M) - 1, D)
    var date = end.split("-")
    var Y = date[0]
    var M = date[1]
    var D = date[2]
    var date2 = new Date(Y, M - 1, D)
    var d = Math.round((date2.valueOf() - date1.valueOf()) / 86400000)
    if (d >= 4) {
      this.setData({
        needPunchTime: d,
        yuyueDay: d + 1
      })
    } else {
      this.setData({
        needPunchTime: d + 1,
        yuyueDay: d + 1
      })
    }
  },

  bindDateStartChange: function(e) {
    console.log(e.detail.value)
    var start = e.detail.value
    var end = this.data.selectDateEnd
    var date = start.split("-")
    var Y = date[0]
    var M = date[1]
    var D = date[2]
    var date1 = new Date(Y, M - 1, D)
    var date = end.split("-")
    var Y = date[0]
    var M = date[1]
    var D = date[2]
    var date2 = new Date(Y, M - 1, D)

    if (date1 > date2) {
      wx.showToast({
        title: '开始时间不能大于结束时间',
        icon: 'none'
      })
      this.setData({
        selectDateStart: this.data.selectDateStart,
        selectDateEnd: end
      })
      return
    }
    this.setData({
      selectDateStart: e.detail.value
    })
    this.calculatePunchTime()
  },

  bindDateEndChange: function(e) {
    var start = this.data.selectDateStart
    var end = e.detail.value
    var date = start.split("-")
    var Y = date[0]
    var M = date[1]
    var D = date[2]
    var date1 = new Date(Y, parseInt(M) - 1, D)
    var date = end.split("-")
    var Y = date[0]
    var M = date[1]
    var D = date[2]
    var date2 = new Date(Y, M - 1, D)
    if (date2 < date1) {
      wx.showToast({
        title: '结束时间不能小于开始时间',
        icon: 'none'
      })
      this.setData({
        selectDateStart: start,
        selectDateEnd: this.data.selectDateEnd
      })
      return
    }
    console.log(e.detail.value)
    this.setData({
      selectDateEnd: e.detail.value
    })
    this.calculatePunchTime()
  },

  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },

  bindMakeOrder() {
    var that = this
    wx.showToast({
      title: '预约中',
      icon: 'loading'
    })
    if (!that.data.seatData) {
      wx.showToast({
        title: '请选择座位',
        icon: 'none'
      })
      return
    }
    var campus = this.data.campusAndFlorr.campus
    var floor = this.data.campusAndFlorr.floor
    var start = this.parseTimestamp(this.data.selectDateStart)
    var end = this.parseTimestamp(this.data.selectDateEnd)
    var seatData = this.data.seatData
    var authData = this.data.authData
    var location = seatData.location
    if (location === "L") {
      location = "L1"
    }
    if (location === "R") {
      location = "L2"
    }
    var doc_id = 'ZHKU_' + campus + '_' + floor + 'F'
    var seat_id = seatData.id
    wx.cloud.callFunction({
      name: "order",
      data: {
        doc_id: doc_id, //图书馆楼层
        seat_id: seat_id,
        auth_id: authData._id,
        start: start,
        location: location,
        end: end
      }
    })
    console.log(campus, floor, start, end, seatData, authData)
    console.log(doc_id, seat_id, authData._id, start, location, end)
    // wx.navigateTo({
    //   url: '../msg/success?seat=' + data,
    // })
  },

  bindCampusChange: function(e) {
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    this.setData({
      campusCodeIndex: e.detail.value
    })
  },

  bindSelectSeat: function(e) {
    var data = this.data.floors[e.detail.value]
    console.log(data)
    var campus = data.campus
    var floor = data.floor
    wx.navigateTo({
      url: './seat?campus=' + campus + "&floor=" + floor,
    })

  },

  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },

  getMyAuth() {
    var that = this
    wx.showNavigationBarLoading()
    wx.cloud.callFunction({
      name: "login"
    }).then(res => {
      const openid = res.result.openid
      const db = wx.cloud.database()
      db.collection('user').doc(openid).get().then(res => {
        console.log(res.data)
        that.setData({
          authData: res.data
        })
        wx.hideNavigationBarLoading()
      })
    })
  },

  getTime() {
    var that = this
    wx.cloud.callFunction({
      name: "getServeDate"
    }).then(res => {
      var timestamp = res.result.timestamp
      var date = new Date(timestamp);
      console.log(date)

      var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
      var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
      var currTime = h + ":" + m

      var nextDay = new Date(timestamp + 24 * 60 * 60 * 1000).getDate()
      nextDay = nextDay < 10 ? "0" + nextDay : nextDay
      var Y = date.getFullYear()
      var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1)
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
      var currTime = '08:00'
      var dateStart = `${Y}-${M}-${nextDay}`

      var date1 = new Date(timestamp + 7 * 24 * 60 * 60 * 1000)
      var Y = date1.getFullYear()
      var M = (date1.getMonth() + 1 < 10 ? "0" + (date1.getMonth() + 1) : date1.getMonth() + 1)
      var D = date1.getDate() < 10 ? date1.getDate() : date1.getDate()
      var dateEnd = `${Y}-${M}-${D}`
      console.log(dateEnd)
      nextDay = `${Y}-${M}-${nextDay}`

      that.setData({
        dateStart: dateStart,
        selectDateStart: dateStart,
        selectDateEnd: dateEnd,
        dateEnd: dateEnd,
        nextDay: nextDay,
        currTime: currTime
      })

      that.calculatePunchTime()

    })

  },

  parseTimestamp(date, time = '08:40:00') {
    var date = date.split("-")
    var Y = date[0]
    var M = date[1]
    var D = date[2]
    // Y + M + D //年月日 格式 2018/05/17
    var times = `${Y}/${M}/${D}/ ${time}`
    var timestamp = new Date(times).getTime()
    return timestamp
  },

  onLoad(option) {
    var that = this
    wx.getStorage({
      key: 'stu_id',
      success: function(res) {
        var stu_id = res.data
        wx.getStorage({
          key: 'stu_name',
          success: function(res) {
            var stu_name = res.data
            that.setData({
              authData: {
                userName: stu_name,
                userId: stu_id
              }
            })
          },

        })
      },
    })
    if (option.seat) {
      var seatData = JSON.parse(option.seat)
      var campusAndFlorr = JSON.parse(option.campusAndFloor)
      this.setData({
        campusAndFlorr: campusAndFlorr
      })
      var id = seatData.id
      var gCol = seatData.gCol
      var gRow = seatData.gRow
      var campus = campusAndFlorr.campus
      var floor = campusAndFlorr.floor
      if (seatData.location === "L1") {
        seatData.location = "L"
      }
      if (seatData.location === "L2") {
        seatData.location = "R"
      }
      var seat = floor + "F" + "-" + seatData.location + "[" + gRow + "排" + gCol + "座" + "]"
      this.setData({
        seatData: seatData,
        seat: seat
      })
    }
    that.getTime()
    that.getMyAuth()

  },

});