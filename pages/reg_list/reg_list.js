Page({
  data: {
    ur: null
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    })
    this.loadUserRegs();
  },

  loadUserRegs: function () {
    var that = this;
    var sid = wx.getStorageSync("session_info").session_id;
    wx.request({
      url: getApp().globalData.serverURL + 'api/GetUserRegs.ashx?sessionid=' + sid,
      dataType: "json",
      complete: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showModal({  
            title: '错误提示',
            content: '网络错误',
            showCancel: false,
            complete: function () {
            }
          });
          return;
        }
        else if (res.data.IsError) {
          wx.showModal({
            title: '错误提示',
            content: res.data.Message,
            showCancel: false,
            complete: function () {
            }
          });
        }
        else {
          console.log(res.data.Items);
          for (var i = 0; i < res.data.Items.length; i++) {
            var item = res.data.Items[i];
            item.type = getApp().globalData.compTypes[parseInt(item.SolutionId)]
          }
          that.setData({ ur: res.data.Items });
        }
      }
    });
  },

  goDetail: function (e) {
    console.log(e.currentTarget.dataset.usid);
    wx.navigateTo({
      url: '/pages/reg_detail/reg_detail?regid=' + e.currentTarget.dataset.regid
    })
  },

  goSearch: function () {

    wx.redirectTo({
      url: '../search/search'
    })
  }
});