// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no: '',
    name: '',
    uploadList: []
  },
  backToUpload: function(e){
    var that = this
    wx.navigateTo({
      url: '../upload/upload?no='+ that.data.no+ '&name='+that.data.name,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let no = options.no
    let name = options.name
    var that = this
    this.setData({
      no: no,
      name, name
    })
    const db = wx.cloud.database()
    db.collection("uploadList").where({
      stuNo: no
    }).orderBy('dateStr', 'desc').get({
      success(res){
        console.log(res.data)
        // that.data.uploadList = res.data
        that.setData({
          uploadList: res.data
        })
      }
    })
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