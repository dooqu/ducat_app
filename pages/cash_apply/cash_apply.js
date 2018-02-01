Page({
  data: {
    incomeTotal: 0,
    cashMoneyTotal: 0,
    cashMoneyTotalPending: 0,
    cashMoneyLeft: 0,
    wechatId: "",
    mobile: "",

    cashMoney : ""

  },

  onLoad: function () {
    wx.showLoading({
      title: '正在加载',
    });
    this.loadUserCashStatus();
  },

  loadUserCashStatus: function () {
    var that = this;
    var sid = wx.getStorageSync("session_info").session_id;
    wx.request({
      url: getApp().globalData.serverURL + "api/GetUserCashStatus.ashx",
      data: { sessionid: sid },
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
          that.setData({
            incomeTotal: res.data.IncomeTotal,
            cashMoneyTotal: res.data.CashMoneyTotal,
            cashMoneyTotalPending: res.data.CashMoneyTotalPending,
            cashMoneyLeft: res.data.CashMoneyLeft,
            wechatId : res.data.WechatId,
            mobile : res.data.Mobile
          });
        }
      }
    })
  },

  newCash : function()
  {
    var that = this;
    if(/^\d+$/g.test(this.data.cashMoney) == false)
    {
      wx.showModal({
        title: '操作提示',
        content: '请正确输入提现金额',
        showCancel:false
      });
    }
    else if(this.data.wechatId == "")
    {
      wx.showModal({
        title: '操作提示',
        content: '请正确输入收款的微信号',
        showCancel:false
      })
    }
    else if(this.data.mobile == "")
    {
      wx.showModal({
        title: '操作提示',
        content: '请正确输入收款人的联系电话',
        showCancel : false
      })
    }
    else
    {
      var sid = wx.getStorageSync("session_info").session_id;
      wx.request({
        url: getApp().globalData.serverURL + "api/newCash.ashx",
        data : {
          sessionid : sid,
          cashMoney : this.data.cashMoney,
          wechatid : this.data.wechatId,
          mobile : this.data.mobile
        },
        complete : function(res)
        {
          if(res.statusCode != 200)
          {
            wx.showModal({
              title: '操作提示',
              content: '网络错误',
              showCancel:false
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
            wx.showModal({
              title: '操作提示',
              content: '提现申请成功，我们将尽快安排转账',
              showCancel: false,
              complete : function()
              {
                that.loadUserCashStatus();
              }
            })
          }
        }  // end complete
      })
    }

  },

  input_handle : function(e)
  {
    switch(e.target.id)
    {
      case "moneyInput":
        this.setData({cashMoney : e.detail.value});
      break;

      case "wechatIdInput":
        this.setData({ wechatId: e.detail.value });
      break;

      case "mobileInput":
        this.setData({ mobile: e.detail.value });
      break;
    }
  }
});