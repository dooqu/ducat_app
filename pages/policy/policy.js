Page({
  data : {},

  goPolicies : function()
  {
    wx.navigateTo({
      url: '/pages/policies/policies',
    });
  },

  myPolicies : function()
  {
    wx.navigateTo({
      url: '/pages/user_policies/user_policies',
    });
  },


  myIncome : function()
  {
    wx.navigateTo({
      url: '/pages/income/income',
    });
  },

  myCash : function()
  {
    wx.navigateTo({
      url: '/pages/cash/cash',
    });
  },

  cashApply : function()
  {
    wx.navigateTo({
      url: '/pages/cash_apply/cash_apply',
    });
  }
});