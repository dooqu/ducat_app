Page({
  data : {
    cashlist : null,
    incomeTotal : 0,
    cashMoneyTotal : 0,
    cashMoneyTotalPending : 0,
    cashMoneyLeft : 0
  },

  onLoad : function()
  {
    wx.showLoading({
      title: '正在加载',
    });
    this.loadUserCashStatus();
  },

  loadUserCashStatus : function()
  {
    var that = this;
    var sid = wx.getStorageSync("session_info").session_id;
    wx.request({
      url: getApp().globalData.serverURL + "api/GetUserCashStatus.ashx",
      data : {sessionid : sid},
      dataType : "json",
      complete : function(res)
      {
        wx.hideLoading();
        if(res.statusCode != 200)
        {
          wx.showModal({
            title: '操作提示',
            content: '网络错误',
            showCancel: false
          })
        }
        else if(res.data.IsError)
        {
          wx.showModal({
            title: '操作提示',
            content: res.data.Message,
            showCancel:false
          })
        }
        else
        {
          that.setData({
            incomeTotal: res.data.IncomeTotal,
            cashMoneyTotal: res.data.CashMoneyTotal,
            cashMoneyTotalPending: res.data.CashMoneyTotalPending,
            cashMoneyLeft: res.data.CashMoneyLeft});

            wx.showLoading({
              title: '加载列表',
            });
            that.loadUserCashList();
        }
      }
    })
  },

  loadUserCashList : function()
  {
    var that = this;
    var sid = wx.getStorageSync("session_info").session_id;
    wx.request({
      url: getApp().globalData.serverURL + "/api/GetUserCashList.ashx",
      data : {sessionid : sid},
      dataType : "json",
      complete : function(res)
      {
        wx.hideLoading();
        if(res.statusCode != 200)
        {
          wx.showModal({
            title: '操作提示',
            content: '网络错误',
            showCancel: false
          })
        }
        else if(res.data.IsError)
        {
          wx.showModal({
            title: '操作提示',
            content: res.data.Message,
            showCancel:false
          })
        }
        else
        {
          for(var i = 0; i < res.data.CashList.length; i++)
          {
            res.data.CashList[i].DateCreated = res.data.CashList[i].DateCreated.toString().replace("T", " ").split('.')[0];
          }
          that.setData({cashlist : res.data.CashList});
        }
      }// end complete
    })
  }
})