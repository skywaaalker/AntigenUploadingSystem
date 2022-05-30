// pages/master/master.js
var utils= require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beforeNoon: true,
    missList1: [],
    missList2: [],
    stuList: [],
    finishList1: [],
    finishList2: [],
    today: [],
    posList: [],
    repList: []
  },
  freshPage: function(e){
    wx.showLoading()
    this.onLoad()
    wx.hideLoading()
  },
  previewPosImg: function(e){
    var urls = []
    urls.push(e.currentTarget.dataset['url'])
    wx.previewImage({
      urls: urls
    })
  },
  queryMissList: function (e){
    var that = this
    var today = new Date()
    this.setData({today: utils.formatDay(today)})
    var today_begin = new Date()
    var today_noon = new Date()
    var today_night = new Date()
    {
      today_begin.setHours(0);
      today_begin.setMinutes(0);
      today_begin.setSeconds(0);
  
      today_noon.setHours(12);
      today_noon.setMinutes(0);
      today_noon.setSeconds(0);
  
      today_night.setHours(23);
      today_night.setMinutes(0);
      today_night.setSeconds(0);
    }
    var hour = today.getHours()

    const db = wx.cloud.database()
    const _ = db.command
    console.log("hour", today.getHours())
    var stuList = []

    db.collection("stuInfo").where({
      root: 0
    }).orderBy('dom', 'asc').get({
      success(res){
        for (var t of res.data){
          stuList.push(t.stuNo)
        }
        that.setData({stuList: stuList})
        console.log("stulist", stuList)
      }
    })
    if ( today.getHours() >= 9 && today.getHours() < 18) {
      that.setData({beforeNoon: true})
      db.collection('uploadList').where({
        dateFormat: _.gte(today_begin).and(_.lte(today_noon))
      }).get({
        success(res){
          console.log(res.data)
          var d = []
          if (res.data.length == 0){
            d = stuList
            that.setData({
              finishList1: []
            })
          } else {
            var finishList1 = []
            for (var t of res.data) {
              finishList1.push(t.stuNo)
            }
            var finishList1 = [...new Set(finishList1)] //去掉重复元素(理论上不会有重复)
            that.setData({finishList1: finishList1})
            var a = that.data.stuList
            var b = finishList1
            d = a.filter(function(v){ return b.indexOf(v) == -1 })
            console.log("finishlist1", finishList1)
          }
          const _ = db.command
          console.log("d", d)
          db.collection("stuInfo").where({
            stuNo: _.in(d)
          }).get({
            success(res){
              console.log(res.data)
              that.setData({missList1: res.data})
            }
          })
        }
      })
      wx.cloud.callFunction({
        name: 'getPosList2',
        data: {
         beforeNoon: true
        },
        success(res){
          console.log("getPoslist",res.result)
          // var l = res.result.result.list
          if (res.result.result == undefined ||res.result.result.list.length == 0) {
            that.setData({posList: []})
          } else {
            var l = res.result.result.list
            that.setData({posList: l})
          }
        }
      })
      wx.cloud.callFunction({
        name: "getRepList",
        data: {
          beforeNoon: true
        },
        success(res){
          console.log("getReplist",res.result)
          // var l = res.result.result1.list
          if (res.result.result1 == undefined || res.result.result1.list.length == 0){
            that.setData({repList: []})
          } else {
            var l = res.result.result1.list
            that.setData({repList: l})
          }
        }
      })
    } else if (today.getHours() >= 18){
      that.setData({beforeNoon: false})
      db.collection('uploadList').where({
        dateFormat: _.gte(today_noon).and(_.lte(today_night))
      }).get({
        success(res){
          console.log(res.data)
          var d = []
          if (res.data.length == 0){
            d = stuList
            that.setData({finishList2: []})
          } else {
            var finishList2 = []
            for (var t of res.data) {
              finishList2.push(t.stuNo)
            }
            var finishList2 = [...new Set(finishList2)] //去掉重复元素(理论上不会有重复)
            that.setData({finishList2: finishList2})
            var a = that.data.stuList
            var b = finishList2
            d = a.filter(function(v){ return b.indexOf(v) == -1 })
            // that.setData({missList2: d})
            console.log("finishlist2", finishList2)
            // console.log("missList2",missList2 )
          }
          const _ = db.command
          console.log("d", d)
          db.collection("stuInfo").where({
            stuNo: _.in(d)
          }).get({
            success(res){
              console.log(res.data)
              that.setData({missList2: res.data})
            }
          })
        }
      })
      wx.cloud.callFunction({
        name: 'getPosList2',
        data: {
          beforeNoon: false
        },
        success(res){
          console.log("getPoslist",res.result)
          // var l = res.result.result.list
          if (res.result.result == undefined ||res.result.result.list.length == 0) {
            that.setData({posList: []})
          } else {
            var l = res.result.result.list
            that.setData({posList: l})
          }
        }
      })
      wx.cloud.callFunction({
        name: "getRepList",
        data: {
          beforeNoon: false
        },
        success(res){
          console.log("getReplist afternoon",res.result)
          // var l = res.result.result1.list
          if (res.result.result1 == undefined || res.result.result1.list.length == 0){
            that.setData({repList: []})
          } else {
            var l = res.result.result1.list
            that.setData({repList: l})
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.queryMissList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})