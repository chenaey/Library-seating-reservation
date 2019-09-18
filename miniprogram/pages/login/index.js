const app = getApp()
Page({
  data: {
    imgcodesrc: ' ',
    username: '',
    password: '',
    prizeShow: false,
    userInfo: undefined
  },

  formSubmit: function(e) {
    if (!this.data.userInfo) {
      wx.showToast({
        title: '请先授权',
        icon: 'none',
      })
      return
    }
    if (!e.detail.value.username || !e.detail.value.password) {
      wx.showToast({
        title: '学号/密码不能为空',
        icon: 'none',
      })
    } else {
      var that = this
      wx.showToast({
        title: "正在认证",
        icon: "loading",
        duration: 8000
      })
      wx.request({
        url: 'https://i7code.cn/autolib',
        method: 'POST',
        data: {
          username: e.detail.value.username,
          password: e.detail.value.password,
        },
        success: function(res) {
          wx.hideToast()
          console.log(res)
          if (res.statusCode !== 200) {
            wx.showToast({
              title: '无法访问教务网，请稍后重试',
              icon: 'none'
            })
            return
          }
          if (res.data.code === 200) {
            console.log(res.data)
            var userName = res.data.result.name
            var userId = res.data.result.id
            wx.cloud.callFunction({
              name: "login"
            }).then(res => {
              const openid = res.result.openid
              const db = wx.cloud.database()
              db.collection("user").add({
                data: {
                  _id: openid,
                  userName: userName,
                  userId: userId,
                  userInfo: that.data.userInfo,
                  phone: "",
                  campus: "",
                  outData: [],
                  applys: []
                }
              }).then(res => {
                wx.showToast({
                  title: "认证成功",
                  icon: "success",
                  duration: 4000
                })
                setTimeout(function() {
                  wx.navigateTo({
                    url: "/pages/index/index",
                  })
                }, 800);
                // 保存登录状态
                try {
                  wx.setStorageSync('stu_id', userId)
                } catch (e) {}
                try {
                  wx.setStorageSync('stu_name', userName)
                } catch (e) {}

                console.log(res)
              }).catch(err => {
                wx.showToast({
                  title: err.errMsg,
                  icon: "none",
                  duration: 4000
                })
                console.log(err)
              })
            })


          }
          //登陆失败并返回提示消息
          else {
            wx.showToast({
              title: res.data.message,
              icon: "none",
              duration: 2000
            })
          }
        },
        fail(err) {
          wx.hideToast()
          console.log(err)
          wx.showToast({
            title: err.errMsg,
            icon: "none",
            duration: 2000
          })
        }
      })
    }
  },

  showPrize() {
    var that = this
    this.setData({
      prizeShow: true
    });
  },

  closePrize() {
    this.setData({
      prizeShow: false
    });
  },

  getUserInfo: function(e) {
    this.setData({
      userInfo: e.detail.userInfo,
    })
  },

  onLoad: function(options) {
    var that = this
    wx.getUserInfo({
      success: function(res) {
        console.log(res.userInfo)
        that.setData({
          userInfo: res.userInfo,
        })
      }
    })
  },


})