Page({
  q1_rows: [],
  q2_rows: [],
  q3_rows: [],
  q4_rows: [],
  q5_rows: [],
  q6_rows: [],
  asIndex: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "G"],
  data:
  {
    pageData: null,
    currQIndex: 0,
    qstatus: [false, true, true, true, true, true, true, true],
    q1_options: [],
    q2_options: [],
    q3_options: [],
    q4_options: [],
    q5_options: [],
    q6_options: [],
    q7_option: null,
    metrix: [],
    q0_selected_index: -1,
    q1_selected_index: -1,
    q2_selected_index: -1,
    q3_selected_index: -1,
    q4selected_index: -1,
    q5_selected_index: -1,
    q6_selected_index: -1,
    q0_options: null,
    companyTypes: ["外州股份有限公司（不发行股票）", "本州股份有限公司（不发行股票）", "外州股份有限公司（发行股票）", "本州股份有限公司（发行股票）", "外州股份有限公司（无限责任）", "本州股份有限公司（无限责任）", "外州有限责任公司", "本州有限责任公司"],
    buttonText: "<上一步",
    firstButtonText : "取消注册"
  },

  onLoad : function(options)
  {
    wx.showLoading({
      title: '正在数据',
    });

    this.loadAreas();
  },

  loadAreas: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.serverURL + 'api/GetAreas.ashx',
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
          var areas = res.data.Areas;
          var o1 = [];
          for(var i = 0; i < areas.length; i++)
          {
            o1.push(areas[i].AreaName + " (" + areas[i].AreaNameEN + ")");
          }
          that.setData({ q0_options : o1});
        }
      }
    })
  },

  getMetrixValue: function (rowIndex, cellIndex) {
    return this.data.metrix[rowIndex * 29 + cellIndex];
  },

  getAvaiableRowBySelectedOption: function (selectedOptionIdx, availableRowsArr) {
    var availableRows = [];
    for (var i = 0; i < availableRowsArr.length; i++) {
      if (this.getMetrixValue(availableRowsArr[i], selectedOptionIdx)) {
        availableRows.push(availableRowsArr[i]);
      }
    }
    return availableRows;
  },

  getAvailableOptionsBySelectedRows: function (cellIdxStart, cellIdxEnd, availableRowArr) {
    var options = [];
    for (var currCell = cellIdxStart; currCell < cellIdxEnd; currCell++) {
      for (var j = 0; j < availableRowArr.length; j++) {
        if (this.getMetrixValue(availableRowArr[j], currCell)) {
          options.push(currCell);
          break;
        }
      }
    }
    return options;
  },

  showIndexQ: function (qIndex) {
    var qs = this.data.qstatus;
    for (var i = 0; i < qs.length; i++) {
      qs[i] = (((i == qIndex) ? false : true));
    }
    this.setData({ currQIndex: qIndex, qstatus: qs });
  },

  showIndexQWithLoadding : function(qIndex)
  {
    wx.showLoading({
      title: '正在加载',
    })
    var that = this;
    setTimeout(function () {
      that.showIndexQ(qIndex);
      wx.hideLoading();
    }, 500);   
  },

  q0_selected: function (e) {
    var idx = e.currentTarget.dataset.index;
    this.setData(
      {
        q0_selected_index: idx
      }
    );

    var sessionInfo = getApp().globalData.sessionInfo;
    var sessionId = (sessionInfo != null) ? sessionInfo.session_id : "";
    var that = this;
    wx.showLoading({
      title: '数据加载',
      mask: true
    });
    wx.request({
      url: getApp().globalData.serverURL + "api/LoadOptions.ashx?sessionid=" + sessionId + "&areaid=" + idx, dataType: "json", complete: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showToast({
            title: '网络错误',
            duration: 2000
          });
          return;
        }

        if (res.data.IsError) {
          wx.showToast({
            title: '数据错误',
            duration: 2000
          });
          return;
        }

        if (res.statusCode == 200 && res.data.IsError == false) {
          for (var i = 0; i < res.data.Titles.length; i++) {
            res.data.Titles[i] = decodeURIComponent(res.data.Titles[i]);
          }
          that.setData(
            {
              pageData: res.data,
              metrix: res.data.Metrix
            });

          /*
          var q1_options = [];
          for (var i = 0; i < 10; i++) {
            q1_options[i] = { idx: i, title: res.data.Titles[i] };
          }
          */
          var q1_options = [];
          that.q1_rows = that.getAvailableOptionsBySelectedRows(0, 10, [0, 1, 2, 3, 4, 5, 6, 7]);
          for(var i = 0; i < that.q1_rows.length; i++)
          {
            q1_options[i] = { idx: that.q1_rows[i], title : res.data.Titles[that.q1_rows[i]]};
          }


          that.setData({ q1_options: q1_options });
          that.showIndexQ(1);
        }
      }
    });
  },

  q1_selected: function (e) {
    var dataIndex = e.currentTarget.dataset.index;
    console.log(dataIndex);

    this.setData({ q1_selected_index: dataIndex });
    this.q2_rows = this.getAvaiableRowBySelectedOption(this.data.q1_selected_index, [0, 1, 2, 3, 4, 5, 6, 7]);

    console.log(this.q2_rows);

    if (this.q2_rows.length) {
      var idx = this.getAvailableOptionsBySelectedRows(10, 20, this.q2_rows);
      var q2_options = [];
      for (var i = 0; i < idx.length; i++) {
        q2_options.push({ idx: idx[i], title: this.data.pageData.Titles[idx[i]], asIdx: this.asIndex[i] });
      }
      this.setData({ q2_options: q2_options });

      this.showIndexQWithLoadding(2);     
    }
  },

  q2_selected: function (e) {
    this.setData({ q2_selected_index: (e.currentTarget.dataset.index) });
    this.q3_rows = this.getAvaiableRowBySelectedOption(this.data.q2_selected_index, this.q2_rows);
    if (this.q3_rows.length) {
      var idx = this.getAvailableOptionsBySelectedRows(20, 23, this.q3_rows);
      var q3_options = [];
      for (var i = 0; i < idx.length; i++) {
        q3_options.push({ idx: idx[i], title: this.data.pageData.Titles[idx[i]] });
      }
      this.setData({ q3_options, q3_options });
      this.showIndexQWithLoadding(3);
    }
  },

  q3_selected: function (e) {
    this.setData({ q3_selected_index: (e.currentTarget.dataset.index) });
    this.q4_rows = this.getAvaiableRowBySelectedOption(this.data.q3_selected_index, this.q3_rows);
    if (this.q4_rows.length) {
      var idx = this.getAvailableOptionsBySelectedRows(23, 26, this.q4_rows);
      var q4_options = [];
      for (var i = 0; i < idx.length; i++) {
        q4_options.push({ idx: idx[i], title: this.data.pageData.Titles[idx[i]] });
      }
      this.setData({ q4_options, q4_options });
      this.showIndexQWithLoadding(4);
    }
  },

  q4_selected: function (e) {
    this.setData({ q4_selected_index: (e.currentTarget.dataset.index) });
    this.q5_rows = this.getAvaiableRowBySelectedOption(this.data.q4_selected_index, this.q4_rows);
    if (this.q5_rows.length) {
      var idx = this.getAvailableOptionsBySelectedRows(26, 29, this.q5_rows);
      var q5_options = [];
      for (var i = 0; i < idx.length; i++) {
        q5_options.push({ idx: idx[i], title: this.data.pageData.Titles[idx[i]] });
      }
      this.setData({ q5_options, q5_options });
      this.showIndexQWithLoadding(5);
    }
  },

  q5_selected: function (e) {
    this.setData({ q5_selected_index: (e.currentTarget.dataset.index) });
    this.q6_rows = this.getAvaiableRowBySelectedOption(this.data.q5_selected_index, this.q5_rows);

    var q6_options = [];
    if (this.q6_rows.length > 0) {
      for (var i = 0; i < this.q6_rows.length; i++) {
        var currSolutionId = this.q6_rows[i];
        var startIndex = currSolutionId * 5;
        var baseCost = this.data.pageData.Prices[startIndex];
        var govCost = this.data.pageData.Prices[startIndex + 1];
        var spcCost = this.data.pageData.Prices[startIndex + 2];
        var days = this.data.pageData.Prices[startIndex + 3];
        var spcDays = this.data.pageData.Prices[startIndex + 4];
        var comment = decodeURIComponent(this.data.pageData.Comments[currSolutionId])  ;

        q6_options.push({ sid: currSolutionId, title: this.data.companyTypes[currSolutionId], baseCost: baseCost, govCost: govCost, spcCost: spcCost, days: days, spcDays : spcDays, addr: this.data.q0_options[this.data.q0_selected_index], isSpc: false, comment : comment });
      }
      this.setData({ q6_options, q6_options });
      this.showIndexQWithLoadding(6);
    }
  },

  //方案结果选择
  q6_selected: function (e) {
    console.log("q6_selected");
    console.log(e);
    this.setData({ q6_selected_index: e.currentTarget.dataset.index });
    var solu = this.data.q6_options[e.currentTarget.dataset.index];
    console.log(this.data.q6_options);
    console.log(e.currentTarget.dataset.index);
    console.log(solu.comment);
    //最后确认项的数据重新填充
    var q7_option = { addr: solu.addr, title: solu.title, price: solu.baseCost + solu.govCost + ((solu.isSpc) ? solu.spcCost : 0), days : solu.days, spcDays : solu.spcDays, isSpc : solu.isSpc, comment : solu.comment};
    console.log(solu);
    this.setData({ q7_option, q7_option });
    this.setData({ buttonText: "去注册" , firstButtonText : "保存查询"});
    this.showIndexQ(7);
  },

  setSoluSpecial: function (e) {
    var switch_in_q_index = e.currentTarget.dataset.index;
    var q6_options = this.data.q6_options;
    q6_options[switch_in_q_index].isSpc = e.detail.value;
    this.setData({ q6_options, q6_options });
  },

  button1Evt : function(e)
  {
    if(this.data.currQIndex < 7)
    {
      wx.navigateBack({
        delta: 1
      });
    }
    else
    {
      this.newSolution(false);
    }
  },
  
  newSolution : function(goReg)
  {
    var solu = this.data.q6_options[this.data.q6_selected_index];
    wx.showLoading({
      title: '数据载入中',
      mask: true
    });
    wx.request({
      url: getApp().globalData.serverURL + "api/NewUserAreaSolution.ashx",
      data: {
        sessionid: getApp().globalData.sessionInfo.session_id,
        areaId: this.data.q0_selected_index,
        solutionId: solu.sid,
        isSpc: solu.isSpc
      },
      dataType: "json",
      complete: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showToast({
            title: '网络错误',
          });
          return;
        }
        if (res.data.IsError) {
          wx.showToast({
            title: res.data.Message
          })
          return;
        }

        var rUrl = (goReg == false) ? ("/pages/search_detail/search_detail?usid=" + res.data.NewUSId) : ("/pages/reg/reg?usid=" + res.data.NewUSId);
        wx.redirectTo({ url: rUrl })
      }
    });//end request
  },

  button2Evt: function (e) {
    //空
    if (this.data.currQIndex == 0) {
      return;
    }
    //注册
    if (this.data.currQIndex == 7) {
      this.newSolution(true);
      return;
    }

    //向前
    switch (this.data.currQIndex) {
      case 5:
        this.setData({ q5_selected_index: -1 });
        break;
      case 4:
        this.setData({ q4_selected_index: -1 });
        break;
      case 3:
        this.setData({ q3_selected_index: -1 });
        break;
      case 2:
        this.setData({ q2_selected_index: -1 });
        break;
      case 1:
        this.setData({ q1_selected_index: -1 });
        break;
      case 0:
        this.setData({ q0_selected_index: -1 });
        break;
    }
    this.showIndexQ(this.data.currQIndex - 1);
  }
});