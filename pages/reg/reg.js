String.prototype.trim = function ()  {
          return  this.replace(/(^\s*)|(\s*$)/g, '');
    };   
Page({
  data: {
    usid: 0,
    solutionId: 0,
    solution : null,
    //点击注册后，注册信息存储再reg中，
    regid : null,
    regArea: "",
    regAreaEN: "",
    basePrice: 0,
    govPrice: 0,
    spcPrice: 0,
    days: 0,
    isSpc: false,
    currInputGroupIndex: 0,
    inputGroupStatus: [false, true, true, true],
    linkman_name: "",
    linkman_tele: "",
    linkman_email: "",
    linkman_addr: "",
    linkman_wechat: "",
    comp_name1: "",
    comp_name2: "",
    comp_name3: "",
    comp_addr: "",
    comp_prop: "",
    stockCount: "",
    stockHolder: "",
    stockHolders : [],
    ceoName: "",
    cfoName: "",
    secretor: "",
    //checkCode 是用来同步输入框的值
    checkCode : "",

    //checkCodeValue是存储的成功搜索到的checkCode
    checkCodeVal : "",
    policyId : 0,
    policy : null,
    checkCodeUsed : true,
    disMoney : 0,

    //值和添加股东的值保持一致
    newStockHolder: "",
    linkmanFocus_name: false, 
    linkmanFocus_tele: false, 
    linkmanFocus_email: false, 
    linkmanFocus_addr: false,
    linkmanFocus_wechat: false ,
    compFocus_name1: false, 
    compFocus_name2: false, 
    compFocus_name3: false, 
    compFocus_addr: false, 
    compFocus_prop: false,
    stockCountFocus: false, 
    stockHolderFocus: false, 
    ceoNameFocus: false, 
    cfoNameFocus: false,
    secretorFocus: false,    

    //是否显示添加股东的界面
    showStockInput : false,
    memberText : "",
    leaderText : "",
    memberPlaceHolderText : "",
    leaderPlaceHolderText : "",
    //服务条款同意，默认个数
    agreeCount : 2,
    //跟canvas相关几个变量；
    drawingMode: false,
    pointPath: [],
    context: null,
    userDraw: false,
    agree1 : true,
    agree2 : true
  },

  onShow : function()
  {
    this.setData({ agree1 : getApp().globalData.agree1});
    this.setData({ agree2: getApp().globalData.agree2 });
  },

  onLoad: function (options) {
    getApp().globalData.agree1 = true;
    getApp().globalData.agree2 = true;
    wx.showLoading({
      title: '正在加载',
    });
    this.data.usid = options.usid;
    var that = this;
    wx.request(
      {
        url: getApp().globalData.serverURL + "api/GetUserSolutionByUSId.ashx?usid=" + this.data.usid,
        dataType: "json",
        complete: function (res) {
          wx.hideLoading();
          if (res.statusCode != 200) {
            wx.showModal({
              title: '信息提示',
              content: '网络错误',
              showCancel: false
            });
          }
          else if (res.data.IsError) {
            wx.showModal({
              title: '信息提示',
              content: res.data.Message,
              showCancel: false
            });
          }
          else {
            var s = getApp().globalData.compTypes[parseInt(res.data.SolutionId)];
            that.setData(
              {
                solutionId: res.data.SolutionId,
                solution: getApp().globalData.compTypes[parseInt(res.data.SolutionId)],
                regArea: res.data.AreaName,
                regAreaEN: res.data.AreaNameEN,
                basePrice: res.data.BasePrice,
                govPrice: res.data.GovPrice,
                spcPrice: res.data.SpcPrice,
                isSpc: res.data.IsSpc,
                days: res.data.Days,
                memberText: ((s == 'LLC' || s == 'DLLC')? "成员" : "股东"),
                leaderText: ((s == 'LLC' || s == 'DLLC') ? "经理" : "CEO"),
                memebePlaceHolderText: ((s == 'LLC' || s == 'DLLC') ? "请添加公司成员姓名" : "请添加公司股东姓名"),
                leaderPlaceHolderText: ((s == 'LLC' || s == 'DLLC') ? "请填写公司经理姓名" : "请填写公司CEO姓名")
              }
            );

            console.log(that.data.solution)
          }
        }
      }
    );
  },

  goAgree1 : function(e)
  {
    wx.navigateTo({
      url: '/pages/protocol1/protocol1',
    })
  },

  goAgree2 : function(e)
  {
    wx.navigateTo({
      url: '/pages/protocol2/protocol2',
    })
  },
  showInputGroup: function (groupIndex) {
    var groupStatus = this.data.inputGroupStatus;
    for (var i = 0; i < groupStatus.length; i++) {
      groupStatus[i] = !(i == groupIndex);
    }
    console.log(groupStatus);
    this.setData({ currInputGroupIndex: groupIndex, inputGroupStatus: groupStatus });
  },

  inputHandle: function (e) {
    console.log(e.target.id + ":" + e.detail.value);
    switch (e.target.id) {
      case "nameInput":
        this.setData({
          linkman_name: e.detail.value
        });
        console.log("input:" + e.detail.value);
        break;
      case "teleInput":
        this.setData({
          linkman_tele: e.detail.value
        });
        break;
      case "emailInput":
        this.setData({
          linkman_email: e.detail.value
        });
        break;
      case "addrInput":
        this.setData({
          linkman_addr: e.detail.value
        });
        break;
      case "wechatInput":
        this.setData({
          linkman_wechat: e.detail.value
        });
        break;

      case "comp_name1Input":
        this.setData({ comp_name1: e.detail.value });
        break;

      case "comp_name2Input":
        this.setData({ comp_name2: e.detail.value });
        break;

      case "comp_name3Input":
        this.setData({ comp_name3: e.detail.value });
        break;

      case "comp_addrInput":
        this.setData({ comp_addr: e.detail.value });
        break;

      case "comp_propInput":
        this.setData({ comp_prop: e.detail.value });
        break;

      case "stockCountInput":
        this.setData({ stockCount: e.detail.value });
        break;

      case "stockHolderInput":
        this.setData({ stockHolder: e.detail.value });
        break;

      case "ceoNameInput":
        this.setData({ ceoName: e.detail.value });
        break;

      case "cfoNameInput":
        this.setData({ cfoName: e.detail.value });
        break;

      case "secretorInput":
        this.setData({ secretor: e.detail.value });
        break;

      case "newStockHolderInput":
        this.setData({newStockHolder: e.detail.value});
        break;
    }
  },
  
  //键盘点击完成
  confirmHandle: function (e) {
    switch (e.target.id) {
      case "nameInput":
        this.setData({
          linkmanFocus_tele: true
        });
        break;
      case "teleInput":
        this.setData({
          linkmanFocus_email: true
        });
        break;
      case "emailInput":
        this.setData({
          linkmanFocus_addr: true
        });
        break;
      case "addrInput":
        this.setData({
          linkmanFocus_wechat: true
        });
        break;
      case "wechatInput":
        break;

      case "comp_name1Input":
        this.setData({ compFocus_name2: true});
        break;

      case "comp_name2Input":
        this.setData({ compFocus_name3: true });
        break;

      case "comp_name3Input":
        this.setData({ compFocus_addr: true });
        break;

      case "comp_addrInput":
        this.setData({ compFocus_prop: true });
        break;

      case "comp_propInput":
        break;

      case "stockCountInput":
        //this.setData({ stockHolderFocus: true });
        break;

      case "stockHolderInput":
        break;

      case "ceoNameInput":
        if(this.data.solution == "LLC" || this.data.solution == "DLLC")
        {
          
        }
        else
        {
          this.setData({ cfoNameFocus: true });
        }
        break;

      case "cfoNameInput":
        this.setData({ secretorFocus: true });
        break;

      case "secretorInput":

        break;

      case "newStockHolderInput":
        this.addStockHolderHandle(null);        
        break;
    }
  },

  buttonTap1 : function(e)
  {
    switch(this.data.currInputGroupIndex)
    {
      case 0:
        wx.navigateBack({
          delta : -1
        });

      case 1:
      case 2:
        var currGroupIndex = this.data.currInputGroupIndex;
        this.showInputGroup(currGroupIndex - 1);
      break;
      case 3: 
        this.saveReg(false);
        break;
    }
  },

  buttonTap2: function (e) {
    var that = this;
    switch (this.data.currInputGroupIndex) {
      case 0:
        {
          var reg_email = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/g;
          if (this.data.linkman_name.trim() == "" ) {
            wx.showModal({
              title: '填写提示',
              content: '请填写联系人的姓名',
              showCancel: false,
              success: function (res) {
              }
            });
          }
          else if (this.data.linkman_tele.trim() == "") {
            wx.showModal({
              title: '填写提示',
              content: '请填写联系人电话',
              showCancel: false,
              success: function (res) {
              }
            });
          }
          else if (this.data.linkman_email.trim() == "" || reg_email.test(this.data.linkman_email.trim()) == false) {
            wx.showModal({
              title: '填写提示',
              content: '请正确填写联系人的邮箱',
              showCancel: false,
              success: function (res) {
              }
            });
          }
          else if (this.data.linkman_addr.trim() == "") {
            wx.showModal({
              title: '填写提示',
              content: '请填写联系地址',
              showCancel: false,
              success: function (res) {
              }
            });
          }
          else if (this.data.linkman_wechat.trim() == "") {
            wx.showModal({
              title: '填写提示',
              content: '请填写微信号',
              showCancel: false,
              success: function (res) {
              }
            });
          }
          else
          {
            this.showInputGroup(1);
          }         
        }
        break;

      case 1:
        var reg_comp = /^[a-zA-Z0-9\s\.\,]+$/;
        if (this.data.comp_name1.trim() == "" || reg_comp.test(this.data.comp_name1.trim()) == false) {
          wx.showModal({
            title: '填写提示',
            content: '公司名1要求为必填，同时必须为英文输入',
            showCancel: false,
            success: function (res) {
            }
          });
        }
        else if (this.data.comp_name2.trim() == "" || reg_comp.test(this.data.comp_name2.trim()) == false) {
          wx.showModal({
            title: '填写提示',
            content: '公司名2要求为必填，同时必须为英文输入',
            showCancel: false,
            success: function (res) {
            }
          });
        }
        else if (this.data.comp_name3.trim() == "" || reg_comp.test(this.data.comp_name3.trim()) == false) {
          wx.showModal({
            title: '填写提示',
            content: '公司名3要求为必填，同时必须为英文输入',
            showCancel: false,
            success: function (res) {
            }
          });
        }
        else if (this.data.comp_addr.trim() == "") {
          wx.showModal({
            title: '填写提示',
            content: '请填写公司名注册地址',
            showCancel: false,
            success: function (res) {
            }
          });
        }
        else if (this.data.comp_prop.trim() == "") {
          wx.showModal({
            title: '填写提示',
            content: '请填写公司营业项目',
            showCancel: false,
            success: function (res) {
            }
          });
        }
        else {
          this.showInputGroup(2);
        }

        break;

      case 2:
        {
          var s = this.data.solution;
          if ( (s == "FSC" || s == "DSCC" || s == "FSSC" || s == "SSC") && this.data.stockCount == "") {
            wx.showModal({
              title: '填写提示',
              content: '请填写发行股票数',
              showCancel: false,
              success: function (res) {
              }
            });
          }
          else if (this.data.stockHolders.length  == 0) {
            wx.showModal({
              title: '填写提示',
              content: '请填写' + this.data.memberText,
              showCancel: false,
              success: function (res) {
              }
            });
          }
          else if (this.data.ceoName.trim() == "") {
            wx.showModal({
              title: '填写提示',
              content: '请填写' + this.data.leaderText,
              showCancel: false,
              success: function (res) {
              }
            });
          }
          else if (s != "LLC" && s != "DLLC" && this.data.cfoName.trim() == "") {
            wx.showModal({
              title: '填写提示',
              content: '请填写cfo姓名',
              showCancel: false,
              success: function (res) {
              }
            });
          }
          else if (s != "LLC" && s != "DLLC" &&this.data.secretor.trim() == "") {
            wx.showModal({
              title: '填写提示',
              content: '请填写秘书长姓名',
              showCancel: false,
              success: function (res) {
              }
            });
          }
          else 
          {
            this.showInputGroup(3);
          }
        }
        break;

      case 3:
        this.saveReg(true);
        break;
    }
  },

  addStockHolderHandle : function(e)
  {
    this.setData({ showStockInput: false });
    setTimeout(this.addStockHolder, 300);
  },

  hiddenAddStockHolder : function(e)
  {
    this.setData({ showStockInput: false });
  },

  addStockHolder : function()
  {   
    if(this.data.newStockHolder != "")
    {
      var ths = this.data.stockHolders;
      ths.push(this.data.newStockHolder.replace(/\,/g, "").replace(/ /g, ""));
      this.setData(
        {
          stockHolders: ths
        }
      );
    }
    this.setData({ showStockInput: false});   
  },

  delStockHolder : function()
  {
    this.data.stockHolders.pop();
    this.setData({stockHolders : this.data.stockHolders});
  },

  showStockHolderDialog : function()
  {
    this.setData({ showStockInput: true, newStockHolder: "", stockHolderFocus : true  });
  },

  checkboxchanged : function(e)
  {
    console.log(e.detail.value.length);
    this.setData({agreeCount : e.detail.value.length});
  },
  ////跟canvas相关的几个画图函数

  saveReg : function(pay = false)
  {
    if (this.data.userDraw == false) {
      wx.showModal({
        title: '操作提示',
        content: '请签写您的电子签名',
        showCancel: false
      });
      return;
    }
    console.log(this.data.agreeCount);
    if (this.data.agreeCount < 2) {
      wx.showModal({
        title: '操作提示',
        content: '请确认是否同意服务协议和保密协议',
        showCancel: false
      });
      return;
    }
    wx.showLoading({
      title: "正在保存订单",
    });

    var that = this;
    var si = wx.getStorageSync('session_info');
    var sid = "";
    if (si != null) sid = si.session_id;

    if(this.data.regid == null)
    {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 300,
        height: 150,
        destWidth: 300,
        destHeight: 150,
        canvasId: 'sign_name',
        success: function (res) {
          console.log(res.tempFilePath);
          //保存成功后，上传文件和信息

          wx.uploadFile({
            url: getApp().globalData.serverURL + "api/NewReg.ashx",
            name: "sign_file",
            filePath: res.tempFilePath,
            formData: {
              sessionid: sid,
              usid: that.data.usid,
              linkmanName: that.data.linkman_name.trim(),
              linkmanTel: that.data.linkman_tele.trim(),
              linkmanEmail: that.data.linkman_email.trim(),
              linkmanAddr: that.data.linkman_addr.trim(),
              linkmanWechat: that.data.linkman_wechat.trim(),
              compName1: that.data.comp_name1.trim(),
              compName2: that.data.comp_name2.trim(),
              compName3: that.data.comp_name3.trim(),
              compRegAddr: that.data.comp_addr.trim(),
              compProp: that.data.comp_prop.trim(),
              stockCount: that.data.stockCount,
              stockHolder: that.data.stockHolders.join(","),
              ceoName: that.data.ceoName.trim(),
              cfoName: that.data.cfoName.trim(),
              secretor: that.data.secretor.trim()
            }
            ,
            complete: function (res) {
              wx.hideLoading();
              res.data = JSON.parse(res.data);
              console.log(res.data);
              if (res.statusCode == 200) {
                if (res.data.IsError) {
                  wx.showModal({
                    title: '注册提示',
                    content: res.data.Message,
                    showCancel: false
                  });
                }
                else {
                  that.setData({ regid: res.data.RegId});
                  //如果是保存，保存成功后就转向详情页面
                  if (pay == false) {
                    wx.showModal({
                      title: '注册提示',
                      content: '注册成功',
                      showCancel: false,
                      complete: function () {
                        wx.redirectTo({
                          url: '/pages/reg_detail/reg_detail?regid=' + res.data.RegId,
                        })
                      }
                    });
                  }
                  else
                  {
                    //wx.showLoading({
                    //  title: '正在生成订单',
                    //})
                    //var upid = ((that.data.policy != null) ? that.data.policy.UPId : 0);
                    //如果需要支付，那么先生成订单
                    that.createOrder(sid, res.data.RegId, that.data.checkCodeVal);
                  } // end if(pay == false)
                } // end else
              }
              else {
                wx.showToast({
                  title: '网络错误',
                });
              }
            }
          });
        },
        fail: function (res) {
          console.log(res);
          wx.showModal({
            title: '操作提示',
            content: '电子签文件保存失败',
            showCancel: false
          })
        } //end fail
      }) //end upload
    }// end if(regid == null)
    else
    {
      wx.hideLoading();
      //wx.showLoading({
     //   title: '正在生成订单',
      //});
      //如果注册已经ok,那么别重复生成reg，直接生成订单
      this.createOrder(sid, this.data.regid, this.data.checkCodeVal);
    }
  },

  createOrder : function(sid, regid, checkcode)
  {
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
        else 
        { 
          console.log(res);
          wx.requestPayment({
            appId : res.data.AppId,
            timeStamp: res.data.TimeStamp.toString(),
            nonceStr: res.data.NonceString,
            package: 'prepay_id=' + res.data.PrePayId,
            signType: 'MD5',
            paySign: res.data.PaySign,
            complete : function(payRes)
            {
              if (payRes.errMsg == "requestPayment:ok")
              {
                wx.showModal({
                  title: '操作提示',
                  content: '支付成功',
                  showCancel:false,
                  complete : function()
                  {
                    wx.redirectTo({
                      url: '/pages/reg_detail/reg_detail?regid=' + regid,
                    });
                  }
                })
              }
              else
              {
                wx.showModal({
                  title: '操作提示',
                  content: '支付失败',
                  showCancel: false,
                  complete: function () {
                    wx.redirectTo({
                      url: '/pages/reg_detail/reg_detail?regid=' + regid,
                    });
                  }
                })
              }
            } // end complete
          });
        }
      } // end complete
    }); // end order request
  },

  checkCodeHandle : function(e)
  {
    this.setData({checkCode : e.detail.value});
  },

  searchPolicy : function(e)
  {
    //check checkCode
    if (this.data.checkCode == null || this.data.checkCode.trim() == "" )
    {
      wx.showModal({
        title: '操作提示',
        content: '请输入推广码',
        showCancel:false
      });return;
    }

    var c = this.data.checkCode;

    //清除已有的policy
    this.setData({policy : null, checkCodeVal : ""});
    wx.showLoading({
      title: '正在查询',
    });

    var that = this;
    wx.request({
      url: getApp().globalData.serverURL + "api/GetPolicyInfoByCheckCode.ashx",
      data : {
        checkCode : this.data.checkCode.trim()
      },
      dataType : "json",
      complete : function(res)
      {
        wx.hideLoading();
        if(res.statusCode != 200)
        {
          wx.showModal({
            title: '操作提示',
            content: '网络错误',
            showCancel : false
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
          console.log(res.data.Policy);          
          that.setData({checkCodeVal : c});
          that.setData({ policy: res.data.Policy, checkCodeUsed : true});
        }
        that.refreshDisMoney();
      }
    })
  },

  usePolicyChanged : function(e)
  {
    console.log(e);
    this.setData({checkCodeUsed : e.detail.value});
    this.refreshDisMoney();
  },

  refreshDisMoney : function()
  {
    var disMoney = ((this.data.policy != null && this.data.checkCodeUsed) ? (this.data.policy.IsDisPercent ? Math.floor((this.data.basePrice) * (this.data.policy.DisMoney / 100)) : (this.data.policy.DisMoney)) : 0);
    this.setData({disMoney : disMoney});
  },

  onReady: function () {
    this.setData(
      {
        context: wx.createCanvasContext('sign_name')
      }
    );
  },

  touchstart: function (e) {
    this.data.context.setStrokeStyle("#000000");
    this.data.context.setLineWidth(5);

    this.setData(
      {
        drawingMode: true
      }
    );

    if (e.touches.length) {
      this.data.context.moveTo(e.touches[0].x, e.touches[0].y);
    }
  },

  touchend: function (e) {
    this.setData(
      {
        drawingMode: false
      }
    
    );
    this.data.userDraw = true;
  },

  touchmove: function (e) {
    if (this.data.drawingMode) {
      if (e.touches.length > 0) {
        var x = e.touches[0].x;
        var y = e.touches[0].y;
        this.data.context.lineTo(x, y);
        this.data.context.stroke();
        this.data.context.draw(true);
        this.data.context.moveTo(x, y);
      }
    }
  },

  clearCanvas: function (e) {
    this.data.context.moveTo(0, 0);
    this.data.context.lineTo(0, 0)
    this.data.context.stroke();
    this.data.context.draw();
    this.data.userDraw = false;
  },

  saveCanvas: function (e) {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 300,
      height: 150,
      destWidth: 300,
      destHeight: 150,
      canvasId: 'sign_name',
      success: function (res) {
        console.log(res.tempFilePath)
      }
    })
  }
});