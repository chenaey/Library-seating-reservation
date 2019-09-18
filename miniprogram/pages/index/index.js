Page({
  data: {
    userInfo: undefined,
    hasUserInfo: false,
    authData: undefined, //已认证用户数据
    menus: [{
        id: 0,
        name: '座位预约',
        tip: '仅支持考研/考公座位预约',
        img: '/images/apply.png',
      },
      {
        id: 2,
        name: '座位查询',
        tip: '仅支持查询考研/考公座位',
        img: '/images/search.png',
      },
      {
        id: 3,
        name: '申请记录',
        tip: '月违规次数达3次将禁止使用座位预约一周',
        img: '/images/cancle.png',
      }
    ]
  },

  getUserInfo: function(e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getMyAuth() {
    var that = this
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
      }).catch(err => {
        wx.showToast({
          title: 'error：未认证',
          icon: 'none'
        })
      })
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '../login/index',
    })
  },

  bindPunchCard() {
    if (!this.data.authData) {
      wx.showModal({
        title: '提示',
        content: '当前未认证学生身份是否立即认证',
        cancelText: '暂不认证',
        confirmText: '去认证',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/index',
            })
          }

        }
      })
    } else {
      wx.scanCode({
        onlyFromCamera: true,
        scanType: ['qrCode'],
        success(res) {
          console.log(res)
          wx.navigateTo({
            url: '/pages/punchCard/index?type=0',
          })
        }
      })
    }


  },
  bindNavigator(e) {
    console.log(e.currentTarget.dataset.id)
    var authData = this.data.authData
    var id = e.currentTarget.dataset.id
    switch (id) {
      case 0:
        if (!authData) {
          wx.showModal({
            title: '提示',
            content: '当前未认证学生身份是否立即认证',
            cancelText: '暂不认证',
            confirmText: '去认证',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../login/index',
                })
              }

            }
          })
        } else {
          wx.navigateTo({
            url: '/pages/seat/apply',
          })
        }

        break

      case 2:
        wx.navigateTo({
          url: '/pages/seat/seat?type=search',
        })
        break
      case 3:
        wx.showToast({
          title: '查询中...',
          icon: 'loading'
        })
        setTimeout(() => {
          wx.hideToast()
          wx.showToast({
            title: '暂无记录',
            icon: "none"
          })
        }, 1500)

        break
      default:
        break
    }
  },


  onLoad() {
    var that = this
    wx.getStorage({
      key: 'stu_id',
      success: function(res) {
        console.log(res)
        var stu_id = res.data
        wx.getStorage({
          key: 'stu_name',
          success: function(res) {
            var stu_name = res.data
            that.setData({
              authData: {
                "userId": stu_id,
                "username": stu_name
              }
            })
          },
        })
      },
    })



    that.getMyAuth()

    wx.getUserInfo({
      success: function(res) {
        console.log(res.userInfo)
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
    // wx.startBeaconDiscovery({
    //   uuids: ['fda50693-a4e2-4fb1-afcf-c6eb07647825', 'fda50693-a4e2-4fb1-afcf-c6eb07647825'],
    //   success(res) {
    //     console.log(res)
    //   }
    // })
    // wx.onBeaconUpdate((res) => {
    //   console.log(res)
    // })

  }

});