Page({
  data: {
    regid: 0,
    compType: null,
    ri: null,
    delButtonText : "删除注册记录",
    checkCode: "",
    checkCodeVal : "", 
    policyId: 0,
    policy: null,
    checkCodeUsed: true,
    disMoney: 0,
    order : null
  },

  onLoad: function (options) {
    if(options.regid == undefined)
      options.regid = 8;

    if (options.regid != undefined) {
      this.data.regid = options.regid;
    }
    else {
      wx.showModal({
        title: '提示',
        content: '信息未查询到',
        showCancel: false,
        complete: function () {
          wx.navigateBack({
            delta : 1
          })
        }
      });
      return;
    }
    wx.showLoading({
      title: '正在加载...',
    });

    this.loadRegInfoById(this.data.regid);
  },

  loadRegInfoById : function(regid)
  {
    var that = this;
    wx.request({
      url: getApp().globalData.serverURL + "api/GetRegInfoById.ashx?regid=" + regid,
      dataType : "json",
      complete : function(res)
      {
        wx.hideLoading();
        console.log(res);
        if(res.statusCode != 200)
        {
          wx.showModal({
            title: '错误提示',
            content: '网络错误', 
            showCancel : false,
            complete : function()
            {
              wx.navigateBack({ delta: 1});
            }
          })
        }
        else if(res.data.IsError)
        {
          wx.showModal({
            title: '错误提示',
            content: res.data.Message,
            showCancel: false,
            complete: function () {
              wx.navigateBack({ delta: 1 });
            }
          })
        }
        else
        {
          that.setData({ri : res.data});
          that.setData({ compType: getApp().globalData.compTypes[parseInt(res.data.SolutionId)] });

          if(that.data.ri.IsPayed)
          {
            that.loadOrderInfo(that.data.ri.RegId);
          }
        }
      }
    })
  },

  loadOrderInfo : function(regid)
  {
    var that = this;
    wx.request({
      url: getApp().globalData.serverURL + "/api/GetOrderInfoByRegId.ashx",
      data : {regid : regid},
      dataType: "json",
      complete : function(res)
      {
        if(res.statusCode == 200 && res.data.IsError == false)
        {
          res.data.Order.DatePayed = res.data.Order.DatePayed.toString().replace("T", " ").split('.')[0];
          that.setData({order : res.data.Order});
        }
      }
    })
  },

  createOrder: function (sid, regid, checkcode) {
    var that = this;
    wx.request({
      url: getApp().globalData.serverURL + "api/CreateOrder.ashx",
      data: {
        sessionid: sid,
        regid: regid,
        checkcode: checkcode
      },
      dataType: "json",
      complete: function (res) {
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
          });
        }
        else {
          console.log(res);
          wx.requestPayment({
            appId: res.data.AppId,
            timeStamp: res.data.TimeStamp.toString(),
            nonceStr: res.data.NonceString,
            package: 'prepay_id=' + res.data.PrePayId,
            signType: 'MD5',
            paySign: res.data.PaySign,
            complete: function (payRes) {
              if (payRes.errMsg == "requestPayment:ok") {
                wx.showModal({
                  title: '操作提示',
                  content: '支付成功',
                  showCancel: false,
                  complete: function () {
                    wx.redirectTo({
                      url: '/pages/reg_detail/reg_detail?regid=' + regid,
                    });
                  }
                })
              }
              else {
                wx.showModal({
                  title: '操作提示',
                  content: '支付失败',
                  showCancel: false,
                  complete: function () {
                  }
                })
              }
            } // end complete
          });
        }
      } // end complete
    }); // end order request
  },

  goPay : function(e)
  {
    var sid = wx.getStorageSync("session_info").session_id;
    this.createOrder(sid, this.data.ri.RegId, this.data.checkCodeVal);
  },

  delReg : function(e)
  {
    var btn = e.currentTarget;
    if (this.data.delButtonText == "确定要删除该条记录么？")
    {
      var sid = wx.getStorageSync("session_info").session_id
      wx.request({
        url: getApp().globalData.serverURL + "/api/DeleteUserReg.ashx?regid=" + this.data.regid,
        data : {sessionid : sid},
        dataType : "json",
        complete : function(res)
        {
          if(res.statusCode != 200)
          {
            wx.showModal({
              title: '操作提示',
              content: '网络错误',
              showCancel : false
            })
          }
          else if(res.data.IsError)
          {
            wx.showModal({
              title: '操作提示',
              content: res.data.Message,
              showCancel : false
            })
          }
          else
          {
            wx.showModal({
              title: '操作提示',
              content: res.data.Message,
              showCancel: false,
              success: function () {
                wx.navigateBack({
                  delta: 1
                });
              }}); 
          }
        } //end complete
      })
      
    }
    else
    {
      this.setData({ delButtonText : "确定要删除该条记录么？"});
    }
  },

  checkCodeHandle: function (e) {
    this.setData({ checkCode: e.detail.value });
  },

  searchPolicy: function (e) {
    //check checkCode
    if (this.data.checkCode == "" || this.data.checkCode == null) {
      wx.showModal({
        title: '操作提示',
        content: '请输入推广码',
        showCancel: false
      }); return;
    }

    var c = this.data.checkCode;
    //清除已有的policy
    this.setData({ policy: null, checkCodeVal : "" });
    wx.showLoading({
      title: '正在查询',
    });

    var that = this;
    wx.request({
      url: getApp().globalData.serverURL + "api/GetPolicyInfoByCheckCode.ashx",
      data: {
        checkCode: this.data.checkCode
      },
      dataType: "json",
      complete: function (res) {
        wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showModal({
            title: '操作提示',
            content: '网络错误',
            showCancel: false
          });
        }
        else if (res.data.IsError) {
          wx.showModal({
            title: '操作提示',
            content: res.data.Message,
            showCancel: false
          });
        }
        else {
          console.log(res.data.Policy);
          that.setData({ checkCodeVal: c });
          that.setData({ policy: res.data.Policy, checkCodeUsed: true });
        }
        that.refreshDisMoney();
      }
    })
  },

  usePolicyChanged: function (e) {
    console.log(e);
    this.setData({ checkCodeUsed: e.detail.value });
    this.refreshDisMoney();
  },

  refreshDisMoney: function () {
    var disMoney = ((this.data.policy != null && this.data.checkCodeUsed) ? (this.data.policy.IsDisPercent ? Math.floor((this.data.ri.BasePrice) * (this.data.policy.DisMoney / 100)) : (this.data.policy.DisMoney)) : 0);
    this.setData({ disMoney: disMoney });
  }
});