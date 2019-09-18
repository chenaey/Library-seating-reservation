const app = getApp()
Page({

  data: {
    isFromSearch: false,
    libName: '图书馆二楼',
    hallName: '门口',
    currentTime: "2019-10-01 周四 14：30",
    seatList: undefined, //主区域
    seatListL1: undefined, //次区域-左
    seatListL2: undefined, //次区域-右
    hidden: "hidden",
    selectedSeat: [],
    seatScaleHeight: 35,
    maxSelect: 1,
    timer: null,
    seatTypeList: [{
        "name": "可选",
        "type": "0",
        "seats": 1,
        "icon": "default.png",
        "isShow": "1",
        "position": "up"
      },
      {
        "name": "已选",
        "type": "0-1",
        "seats": 1,
        "icon": "select.png",
        "isShow": "1",
        "position": "up"
      },
      {
        "name": "不可选",
        "type": "0-2",
        "seats": 1,
        "icon": "noSelect.png",
        "isShow": "1",
        "position": "up"
      },
      {
        "name": "未开放",
        "type": "0-3",
        "seats": 1,
        "icon": "fix.png",
        "isShow": "1",
        "position": "up"
      }
    ]
  },

  // 点击每个座位触发的函数
  clickSeat: function(event) {
    let index = event.currentTarget.dataset.index;
    let type = event.currentTarget.dataset.type
    var data = this.data.seatList
    if (type === "L1") {
      data = this.data.seatList
    }
    if (type === "L2") {
      data = this.data.seatListL2
    }
    console.log(data[index])

    if (data[index].canClick) {
      if (data[index].nowIcon === data[index].selectedIcon) {
        this.processSelected(index, type)
      } else {
        this.processUnSelected(index, type)
      }
    }
    if (this.data.selectedSeat.length == 0) {
      this.setData({
        hidden: "hidden"
      });
    }
  },

  // 处理已选的座位
  processSelected: function(index, type = "R") {
    let _selectedSeatList = this.data.selectedSeat
    let seatList = this.data.seatList

    if (type === "L1") {
      seatList = this.data.seatList
    }
    if (type === "L2") {
      seatList = this.data.seatListL2
    }

    // 改变这些座位的图标为初始图标 并 移除id一样的座位
    seatList[index].nowIcon = seatList[index].defautIcon
    for (const key in _selectedSeatList) {
      if (_selectedSeatList[key].id === seatList[index].id) {
        _selectedSeatList.splice(key, 1)
      }
    }

    switch (type) {
      case "R":
        this.setData({
          selectedSeat: _selectedSeatList,
          seatList: seatList,
        })
        break
      case "L1":
        this.setData({
          selectedSeat: _selectedSeatList,
          seatList: seatList,
        })
        break
      case "L2":
        this.setData({
          selectedSeat: _selectedSeatList,
          seatListL2: seatList,
        })
        break
      default:
        break
    }

  },
  // 处理未选择的座位
  processUnSelected: function(index, type = "R") {
    let _selectedSeatList = this.data.selectedSeat
    let seatList = this.data.seatList

    if (type === "L1") {
      seatList = this.data.seatList
    }
    if (type === "L2") {
      seatList = this.data.seatListL2
    }

    // 判断选择个数不大于 maxSelect
    if (_selectedSeatList.length >= this.data.maxSelect) {
      wx.showToast({
        title: '最多只能选择' + this.data.maxSelect + '个座位哦~',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // 改变这些座位的图标为已选择图标
    seatList[index].nowIcon = seatList[index].selectedIcon
    // 记录 orgIndex属性 是原seatList数组中的下标值
    seatList[index].orgIndex = index
    // 把选择的座位放入到已选座位数组中
    let temp = {
      ...seatList[index]
    }
    _selectedSeatList.push(temp)


    switch (type) {
      case "R":
        this.setData({
          selectedSeat: _selectedSeatList,
          seatList: seatList,
          hidden: ""
        })
        break
      case "L1":
        this.setData({
          selectedSeat: _selectedSeatList,
          seatList: seatList,
          hidden: ""
        })
        break
      case "L2":
        this.setData({
          selectedSeat: _selectedSeatList,
          seatListL2: seatList,
          hidden: ""
        })
        break
      default:
        break
    }
  },

  getCurrentTime() {
    var date = new Date()
    var Y = date.getFullYear()
    var M = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1)
    var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    var h = date.getHours() < 10 ? "0" + date.getHours() : date.getDate()
    var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    var week = date.getDay()
    var a = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    var currentWeek = a[week]
    var currentTime = `${Y}-${M}-${D} ${currentWeek} ${h}：${m}`
    return currentTime
  },
  //确定选做
  confirmHandle() {
    var that = this
    var data = this.data.selectedSeat[0]
    data = JSON.stringify(data)
    var campusAndFloor = JSON.stringify(this.data.campusAndFloor)
    wx.redirectTo({
      url: './apply?seat=' + data + '&campusAndFloor=' + campusAndFloor
    })
  },


  async getSeatData(campus = 0, floor = 2) {
    var that = this
    /**
     * campus校区
     * floor楼层
     */
    wx.showNavigationBarLoading()
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 6000
    })
    console.log("START")
    var docName = `ZHKU_${campus}_${floor}F`
    const db = wx.cloud.database()
    const res = await db.collection("seat").doc(docName).get()
    console.log(res.data)
    var seatList = that.prosessSeatList(res.data.L1) //L
    var seatListL2 = that.prosessSeatList(res.data.L2) //R
    // this.initData(that.initJson(2,"L1"), that.initJson(2,"L2"))
    that.setData({
      seatList: seatList,
      seatListL2: seatListL2,
    })
    that.prosessMaxSeat(seatListL2)
    wx.hideNavigationBarLoading()
    wx.hideToast()
    console.log("EEE")
  },
  //初始化数据库座位数据
  initData(L1, L2) {
    const db = wx.cloud.database()
    db.collection("seat").add({
      data: {
        //学校代码+校区0/1 白云/海珠+楼层
        _id: 'ZHKU_0_2F',
        libName: "图书馆二楼",
        R: [],
        L1: L1,
        L2: L2,
        isOpen: true,
      }

    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },
  onLoad: function(option) {
    var that = this
    // this.initData(that.initJson("2", "L1"), that.initJson("2", "L2"))
    // var a = that.initJson("2", "L1")
    // console.log(a)

    if (option.type === "search") {
      /**
       * 来自座位查询
       */
      this.setData({
        isFromSearch: true,
        maxSelect: 3
      })
      that.getSeatData("0", "2")
    } else {
      console.log(option)
      this.setData({
        campusAndFloor: {
          campus: option.campus,
          floor: option.floor
        }
      })
      var a = that.getSeatData(option.campus, option.floor)
      console.log(a)
    }
    var currentTime = that.getCurrentTime()
    that.setData({
      currentTime: currentTime,
      rpxToPx: getApp().globalData.screenWidth / 750,
      seatArea: getApp().globalData.screenHeight - getApp().globalData.statusBarHeight - (500 * getApp().globalData.screenWidth / 750),
    })

  },



  initJson(floor = 2, which) {
    //i 行/gCol j列/gRow
    if (which === "L1") {
      var iLen = 3
      var jLen = 23
      var location = "L1"
    }
    if (which === "L2") {
      var iLen = 3
      var jLen = 33
      var location = "L2"
    }
    var seatList = []
    var num = 0
    //var i =3; i > 1; i--
    for (var i = 1; i < iLen; i++) {
      for (var j = 1; j < jLen; j++) {
        var type = "0"
        var gRow = i
        var gCol = j
        var mult_top = 0.5
        var mult_left = 0.8
        if (which === "L2" && gCol <= 12) {
          type = "0-3"
        }
        if (which === "L1" && gCol <= 2) {
          type = "0-3"
        }

        seatList.push({
          "id": floor + "F-" + location + "-" + gCol + "-" + gRow, //唯一ID
          "gRow": gCol, // 直觉坐标
          "gCol": gRow, // 直觉坐标
          "col": gCol,
          "row": gRow,
          "type": type,
          "flag": "0", //未使用
          "user": [], //使用者 与时间
          "location": location //
        })
        num++
      }
    }
    return seatList;
  },

  prosessSeatList: function(resSeatList) {
    var that = this
    resSeatList.forEach(element => {
      // 获取座位的类型的首字母
      let firstNumber = element.type.substr(0, 1)
      // 加载座位的图标
      let seatType = that.data.seatTypeList;
      for (const key in seatType) {
        // 加载每个座位的初始图标defautIcon 和 当前图标 nowIcon
        if (element.type === seatType[key].type) {
          element.nowIcon = seatType[key].icon
          element.defautIcon = seatType[key].icon
        }
        // 根据首字母找到对应的被选中图标
        if (firstNumber + '-1' === seatType[key].type) {
          element.selectedIcon = seatType[key].icon
        }
        // 根据首字母找到对应的被选中图标
        if (firstNumber + '-2' === seatType[key].type) {
          element.soldedIcon = seatType[key].icon
        }
        // 根据首字母找到对应的被选中图标
        if (firstNumber + '-3' === seatType[key].type) {
          element.fixIcon = seatType[key].icon
        }
      }
      // 如果座位是已经售出 和 维修座位 加入属性canClick 判断座位是否可以点击
      if (element.defautIcon === element.soldedIcon || element.defautIcon === element.fixIcon) {
        element.canClick = false
      } else {
        element.canClick = true
      }
    })
    return resSeatList
  },

  //计算最大座位数,生成影厅图大小
  prosessMaxSeat: function(value) {
    let seatList = value
    let maxY = 0;
    for (let i = 0; i < seatList.length; i++) {
      let tempY = seatList[i].gRow;
      if (parseInt(tempY) > parseInt(maxY)) {
        maxY = tempY;
      }
    }
    let maxX = 0;
    for (var i = 0; i < seatList.length; i++) {
      var tempX = seatList[i].gCol;
      if (parseInt(tempX) > parseInt(maxX)) {
        maxX = tempX;
      }
    }
    let seatRealWidth = parseInt(maxX) * 70 * this.data.rpxToPx
    let seatRealheight = parseInt(maxY) * 70 * this.data.rpxToPx
    let seatScale = 1;
    let seatScaleX = 1;
    let seatScaleY = 1;
    let seatAreaWidth = 630 * this.data.rpxToPx
    let seatAreaHeight = this.data.seatArea - 200 * this.data.rpxToPx
    if (seatRealWidth > seatAreaWidth) {
      seatScaleX = seatAreaWidth / seatRealWidth
    }
    if (seatRealheight > seatAreaHeight) {
      seatScaleY = seatAreaHeight / seatRealheight
    }
    if (seatScaleX < 1 || seatScaleY < 1) {
      seatScale = seatScaleX < seatScaleY ? seatScaleX : seatScaleY
    }

    // console.log(maxY, maxX, seatScale, seatScale * 70 * this.data.rpxToPx, this.data.rpxToPx)
    this.setData({
      maxY: parseInt(maxY) + 3.5,
      maxX: parseInt(maxX) + 10,
      seatScale: seatScale,
      seatScaleHeight: seatScale * 70 * this.data.rpxToPx
    });
  },

  //解决官方bug
  handleScale: function(e) {
    if (this.data.timer) {
      clearTimeout(this.data.timer)
    }
    let timer = setTimeout(() => {
      this.setData({
        seatArea: this.data.seatArea
      });
    }, 200)
  },

  onPullDownRefresh: function() {
    var campus = this.data.campusAndFloor.campus
    var floor = this.data.campusAndFloor.floor
    this.getSeatData(campus, floor)
  }
})