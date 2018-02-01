// pages/protocol1/protocol1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pro_text: "",
    is_focus : false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://xiaochengxu.ducat.vip/p1.html',
      complete : function(res)
      {
        console.log(res.data);
        //that.setData({pro_text : res.data});
      }
    })
  },

  blur : function()
{
  this.setData({is_focus : false});
},

  agree: function () {
    getApp().globalData.agree1 = true;
    wx.navigateBack({
      delta: 1
    })
  },


  notagree: function () {
    getApp().globalData.agree1 = false;
    wx.navigateBack({
      delta : 1
    })
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