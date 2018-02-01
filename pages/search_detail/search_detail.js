Page({
  data: {
    usid: 0,
    compType : null,
    ri: null
  },

  onLoad: function (options) {
    
    if (options.usid == undefined)
      options.usid = 4;

    if (options.usid != undefined) {
      this.data.usid = options.usid;
    }
    else {
      wx.showModal({
        title: '提示',
        content: '信息未查询到',
        showCancel: false,
        complete: function () {
          wx.navigateBack({
            delta: 1
          })
        }
      });
      return;
    }

    this.loadUserSolutionByUSId(this.data.usid);
  },

  goReg : function()
  {
    wx.navigateTo({
      url: '/pages/reg/reg?usid=' + this.data.usid,
    })
  },

  loadUserSolutionByUSId: function (usid) {
    wx.showLoading({
      title: '正在加载...',
    });
    var that = this;
    wx.request({
      url: getApp().globalData.serverURL + "api/GetUserSolutionByUSId.ashx?usid=" + usid,
      dataType: "json",
      complete: function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.statusCode != 200) {
          wx.showModal({
            title: '错误提示',
            content: '网络错误',
            showCancel: false,
            complete: function () {
              wx.navigateBack({ delta: 1 });
            }
          })
        }
        else if (res.data.IsError) {
          wx.showModal({
            title: '错误提示',
            content: res.data.Message,
            showCancel: false,
            complete: function () {
              wx.navigateBack({ delta: 1 });
            }
          })
        }
        else {
          that.setData({ ri: res.data });
          that.setData({ compType: getApp().globalData.compTypes[parseInt(res.data.SolutionId)] });
        }
      }
    })
  }
});