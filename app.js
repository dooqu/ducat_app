//app.js
App({
  onLaunch: function () {
    var app = this; 
      // 登录
    wx.login({
      success: function(res1){
        console.log(res1);   
        wx.request(
          {
            url: getApp().globalData.serverURL + "api/SessionLogin.ashx",
            data : {jscode : res1.code}, 
            success : function(res2) 
            {  
              console.log(res2);  
              if(res2.data.IsError == false)
              { 
                var sessionInfo = { session_id: res2.data.SessionId, jscode: res1.code };
                app.globalData.sessionInfo = sessionInfo;
                wx.setStorage({ 
                  key: 'session_info',  
                  data: sessionInfo  
                })

               // console.log("app:" + wx.getStorageSync('session_info'))
              }
            }
          }
        );
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log( res); 
        if (res.authSetting['scope.userInfo']) 
        {
          console.log("getuser Info");
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback)  
              {
                this.userInfoReadyCallback(res)
              }
            }
          }); //end getUserInfo;
        }
        else
        {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
            }
          })  
          
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    sessionInfo : null,
    compTypes: ["外州股份有限公司（不发行股票）", "本州股份有限公司（不发行股票）", "外州股份有限公司（发行股票）", "本州股份有限公司（发行股票）", "外州股份有限公司（无限责任）", "本州股份有限公司（无限责任）", "外州有限责任公司", "本州有限责任公司"],
    serverURL: "https://xiaochengxu.ducat.vip/",
    agree1 : true,
    agree2 : true
  }
})