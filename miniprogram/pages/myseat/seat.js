const app = getApp()
Page({

  data: {
    leftNum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    rightNum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,15,16],

    movieName: '图书馆三楼',
    currentTime: "2019-10-01 周四 14：30",
    seatList: undefined, //主区域
    seatListL1: undefined, //次区域-左
    seatListL2: undefined, //次区域-右
    hidden: "hidden",
    selectedSeat: [],
    seatScaleHeight: 35,
    maxSelect: 10,
    timer: null,
    seatTypeList: [{
        "name": "可选",
        "type": "0",
        "seats": 1,
        "icon": "https://i.postimg.cc/BbbWyY5D/image.png",
        "isShow": "1",
        "position": "up"
      },
      {
        "name": "已选",
        "type": "0-1",
        "seats": 1,
        "icon": "https://i.postimg.cc/1X2dd93h/image.png",
        "isShow": "1",
        "position": "up"
      },
      {
        "name": "不可选",
        "type": "0-2",
        "seats": 1,
        "icon": "https://i.postimg.cc/LXywzkds/image.png",
        "isShow": "1",
        "position": "up"
      },
      {
        "name": "未开放",
        "type": "0-3",
        "seats": 1,
        "icon": "https://i.postimg.cc/BZVRbCcY/image.png",
        "isShow": "1",
        "position": "up"
      }
    ]
  },

  // 点击每个座位触发的函数
  clickSeat: function(event) {
    console.log(event)
    console.log(event.currentTarget.dataset.type)
    let index = event.currentTarget.dataset.index;
    let type = event.currentTarget.dataset.type
    var data = this.data.seatList
    if (type === "L") {
      data = this.data.seatListL1
    }
    if (type === "R") {
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

    if (type === "L") {
      seatList = this.data.seatListL1
    }
    if (type === "R") {
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
      // case "R":
      //   this.setData({
      //     selectedSeat: _selectedSeatList,
      //     seatList: seatList,
      //   })
      //   break
      case "L":
        this.setData({
          selectedSeat: _selectedSeatList,
          seatListL1: seatList,
        })
        break
      case "R":
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

    if (type === "L") {
      seatList = this.data.seatListL1
    }
    if (type === "R") {
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
      // case "R":
      //   this.setData({
      //     selectedSeat: _selectedSeatList,
      //     seatList: seatList,
      //     hidden: ""
      //   })
      //   break
      case "L":
        this.setData({
          selectedSeat: _selectedSeatList,
          seatListL1: seatList,
          hidden: ""
        })
        break
      case "R":
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
    var h = date.getHours()
    var m = date.getMinutes()
    var week = date.getDay()
    var a = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    var currentWeek = a[week]
    var currentTime = `${Y}-${M}-${D} ${currentWeek} ${h}：${m}`
    return currentTime
  },

  onLoad: function() {
    let that = this;
    var currentTime = that.getCurrentTime()
    that.setData({
      currentTime: currentTime
    })
    that.setData({

      seatArea: getApp().globalData.screenHeight - getApp().globalData.statusBarHeight - (500 * getApp().globalData.screenWidth / 750),
    });

    var dataList = that.prosessSeatList(that.initJson())
    var seatListL1 = that.prosessSeatList(that.initseatListL1())
    var seatListL2 = that.prosessSeatList(that.initRightData())
    that.setData({
      seatList: dataList,
      seatListL1: seatListL1,
      seatListL2: seatListL2,
      rpxToPx: getApp().globalData.screenWidth / 750
    })
    that.prosessMaxSeat(seatListL2)
  },
  //左边
  initseatListL1() {
    var seatList = []
    var num = 0

    for (var i = 1; i < 23; i++) {
      for (var j = 1; j < 3; j++) {
        var gRow = i
        var gCol = j
        var left = 0
        var top = 0
        var mult_top = 0.2
        var mult_left = 0.8
 
        seatList.push({
          "id": num,
          "gRow": gCol, //元素旋转-90度后 直觉坐标
          "gCol": gRow, //元素旋转-90度后 直觉坐标
          "col": gCol,
          "row": gRow,
          "left": left, //偏移
          "top": top,
          "type": "0",
          "flag": "0",
          "location": "L",

        })
        num++
      }
    }
    console.log(seatList)
    return seatList;
  },

  initRightData() {
    //i 行/gCol j列/gRow
    var seatList = []
    var num = 0
    //var i =3; i > 1; i--
    for (var i = 1; i < 33; i++) {
      for (var j = 1; j < 3; j++) {
        var gRow = i
        var gCol = j
        var left = 0
        var top = 0
        var mult_top = 0.5
        var mult_left = 0.8
        seatList.push({
          "id": num,
          "gRow": gCol, //元素旋转-90度后 直觉坐标
          "gCol": gRow, //元素旋转-90度后 直觉坐标
          "col": gCol,
          "row": gRow,
          "left": left, //偏移
          "top": top,
          "type": "0",
          "flag": "0",
          "location": "R",
        })
        num++
      }
    }
    return seatList;
  },

  initJson() {
    //i 行/gCol j列/gRow
    var seatList = []
    var num = 0
    //var i =3; i > 1; i--
    for (var i = 1; i < 13; i++) {
      for (var j = 1; j < 16; j++) {
        var gRow = i
        var gCol = j
        var left = 0
        var top = 0
        var mult_top = 0.5
        var mult_left = 0.8

        if (gCol >= 3) {
          left = 1 * mult_top
        }
        if (gCol >= 5) {
          left = 2 * mult_top
        }
        if (gCol >= 7) {
          left = 3 * mult_top
        }
        if (gCol >= 9) {
          left = 4 * mult_top
        }
        if (gCol >= 11) {
          left = 5 * mult_top
        }
        if (gCol >= 13) {
          left = 6 * mult_top
        }
        if (gCol >= 15) {
          left = 7 * mult_top
        }
        // top
        if (gRow >= 3) {
          top = 1 * mult_left
        }

        if (gRow >= 7) {
          top = 2 * mult_left
        }

        if (gRow >= 11) {
          top = 3 * mult_left
        }


        seatList.push({
          "id": num,
          "gRow": gCol, //元素旋转-90度后 直觉坐标
          "gCol": gRow, //元素旋转-90度后 直觉坐标
          "col": gCol,
          "row": gRow,
          "left": left, //偏移
          "top": top,
          "type": "0",
          "flag": "0",
          "location": "R"
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
})