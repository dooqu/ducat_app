//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    condition: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    iconType: [
      'success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear'
    ],
    imgUrls: [ ]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }, 

  goSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },

  mySearch: function () {
    wx.navigateTo({
      url: '/pages/search_list/search_list'
    })
  },

  myReg: function () {
    wx.navigateTo({
      url: '/pages/reg_list/reg_list'
    })
  },

  myPolicy : function()
  {
    wx.navigateTo({
      url: '/pages/policy/policy'
    })
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    this.loadAds();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  loadAds()
  {
    var that = this;
    wx.request({
      url: getApp().globalData.serverURL + '/api/GetAds.ashx',
      dataType : "json",
      complete : function(res)
      {
        console.log(res);
        if(res.statusCode == 200 && res.data.IsError == false)
        {
          var imgs = []; 
          var ads = res.data.Ads;
          for (var i = 0; i < ads.length; i++)
          {
            imgs.push(getApp().globalData.serverURL + "/ads/" + ads[i].ImagePath);
          }
          that.setData({imgUrls :  imgs});  
        }
      }
    });
  }
}) 
