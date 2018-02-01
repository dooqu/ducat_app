// pages/user_policies/user_policies.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_policies : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    });
    this.loadUserPolicies();
  },

  loadUserPolicies : function()
  {
    var that = this;
    var sessionid = wx.getStorageSync("session_info").session_id;
    wx.request({
      url: getApp().globalData.serverURL + "api/GetUserPolicies.ashx",
      data: {sessionid : sessionid},
      dataType : "json",
      complete : function(res)
      {
        console.log(res);        
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
            showCancel : false
          });
        }
        else
        {
          that.setData({ user_policies : res.data.UserPolicies});
        }
      }
    }); //end request
  },

  goAreas: function (e) {
    var areas = (e.currentTarget.dataset.areaids.join(','));
    wx.navigateTo({
      url: '/pages/areas/areas?areas=' + areas,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})