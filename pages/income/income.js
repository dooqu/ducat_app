Page({
  data: {
    shareOrders: null,
    totalIncome : 0
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载'
    });

    this.loadShareOrders();
  },

  loadShareOrders: function () {
    var that = this;
    var sid = wx.getStorageSync("session_info").session_id;
    wx.request({
      url: getApp().globalData.serverURL + "/api/GetUserShareOrders.ashx",
      data: {
        sessionid: sid
      },
      dataType: "json",
      complete: function (res) {
        wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showModal({
            title: '操作提示',
            content: '网络错误',
            showCancel: false
          })
        }
        else if (res.data.IsError) {
          wx.showModal({
            title: '操作提示',
            content: res.data.Message,
            showCancel: false
          })
        }
        else {
          
          var orders = res.data.ShareOrders;
          var income_t = 0;
          for(var i = 0; i < orders.length; i++)
          {
            income_t += orders[i].OrderShareMoney;
            orders[i].DatePayed = orders[i].DatePayed.toString().replace("T", " ").split('.')[0]
          }
          that.setData({ totalIncome : income_t});
          that.setData({ shareOrders: res.data.ShareOrders });
        }
      } // end complete
    }); //end request
  }// end function
});