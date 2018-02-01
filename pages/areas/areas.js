Page({
  data : {
    areas: new Object(),
    cover_areas: [],
    areaAds : null
  },

  onLoad : function(options)
  {
    wx.showLoading({
      title: '正在加载'
    });
    this.data.areaAds = options.areas.split(',');
    this.loadAreas();
  },

  loadAreas : function()
  {
    var that = this;
    wx.request({
      url: getApp().globalData.serverURL + 'api/GetAreas.ashx',
      dataType : "json",
      complete : function(res)
      {
        wx.hideLoading();
        if(res.statusCode != 200)
        {
          wx.showModal({
            title: '操作提示',
            content: '网络错误',
            showCancel:false
          });
        }
        else if(res.data.IsError)
        {
          wx.showModal({
            title: '操作提示',
            content: res.data.Message,
            showCancel:false
          });
        }
        else
        {
          var areas = res.data.Areas;
          for(var i = 0; i < areas.length; i++)
          {
            var area = areas[i];
            that.data.areas[area.AreaId] = area;
          }
          that.bindAreaList();
        }
      }
    })
  },

  bindAreaList : function()
  { 
    var c_areas = [];
    for(var i = 0; i < this.data.areaAds.length; i++)
    {
      var key = this.data.areaAds[i];
      c_areas.push(this.data.areas[key]);
    }
    this.setData({cover_areas : c_areas});
  }
})