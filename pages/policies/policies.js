Page(
  {
    data : {
      focusIndex : -1,
      policies : [],
      checkCodes : new Object()
    },

    onLoad : function()
    {
      wx.showLoading({
        title: '正在加载'
      });
      this.loadPolicies();
    },

    loadPolicies : function()
    {
      var that = this;
      wx.request({
        url: getApp().globalData.serverURL + "/api/GetPolicies.ashx",
        dataType: "json",
        complete: function (res) {
          wx.hideLoading();
          if (res.statusCode != 200) {
            wx.showModal({
              title: '操作提示',
              content: '网络错误',
              showCancel : false
            });return;
          }
          else if(res.data.IsError)
          {
            wx.showModal({
              title: '操作提示',
              content: res.data.Message,
              showCancel : false
            });return;
          }
          else
          {
            that.setData({policies : res.data.Policies});
          }
        }
      });
    },

    inputHandle : function(e)
    {
      var checkCodes = this.data.checkCodes;
      checkCodes[e.currentTarget.dataset.policyid] = e.detail.value;
      this.setData({checkCodes : checkCodes});
    },

    newUserPolicy : function(e)
    {
      var policyid = e.currentTarget.dataset.policyid;
      var checkCodeVal = this.data.checkCodes[e.currentTarget.dataset.policyid];
      if (checkCodeVal == undefined || /^[0-9a-zA-Z]{4,}$/.test(checkCodeVal) == false || checkCodeVal.length > 10) {
        wx.showModal({
          title: '操作提示',
          content: '推广码为4-10位数字和字母',
          showCancel: false
        });return;
      }
      else
      {
        var sessionid = wx.getStorageSync("session_info").session_id;
        wx.request({
          url: getApp().globalData.serverURL + 'api/NewUserPolicy.ashx',
          data : {
            policyid : policyid,
            sessionid : sessionid,
            checkcode : checkCodeVal
          },
          dataType : "json",
          complete : function(res)
          {
            console.log(res);
            if(res.statusCode != 200)
            {
              wx.showModal({
                title: '操作提示',
                content: '网络错误',
                showCancel: fase
              });
            }
            else if(res.data.IsError)
            {
              wx.showModal({
                title: '操作提示',
                content: res.data.Message,
                showCancel: false
              })
            }
            else
            {
              wx.showModal({
                title: '操作提示',
                content: '推广码创建成功，请在我的推广码中查看详细',
                showCancel: false
              });
            }
          }
        })
      }
    },

    goAreas : function(e)
    {
      var areas = (e.currentTarget.dataset.areaids.join(','));
      wx.navigateTo({
        url: '/pages/areas/areas?areas=' + areas,
      });
    }
  }
);