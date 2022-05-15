// pages/upload/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    no: '',
    index: '',
    btn1checked: false,
    btn2checked: false,
    btn3checked: false,
    fileID: ,
    buttonList:[
      {status:"阴性", code:"1", checked:"false", style:"btn1"},
      {status:"阳性", code:"2", checked:"false", style:"btn2"},
      {status:"异常", code:"3", checked:"false", style:"btn3"}
    ]
  },
  click1: function(options){
    var that = this
    var temp = that.data.btn1checked
    this.setData({
      btn1checked : !temp,
      index: 1
    })
    if (this.data.btn1checked) {
      this.setData({
        btn2checked : false,
        btn3checked : false
      })
    }
  },
  click2: function(options){
    var that = this
    var temp = that.data.btn2checked
    this.setData({
      btn2checked : !temp,
      index: 2
    })
    if (this.data.btn2checked) {
      this.setData({
        btn1checked : false,
        btn3checked : false
      })
    }
  },
  click3: function(options){
    var that = this
    var temp = that.data.btn3checked
    this.setData({
      btn3checked : !temp,
      index: 3
    })
    if (this.data.btn3checked) {
      this.setData({
        btn1checked : false,
        btn2checked : false
      })
    }
  },
  uploadImg: function(options){
    let a = this;
    wx.showActionSheet({
        itemList: [ "从相册中选择", "拍照" ],
        itemColor: "#f7982a",
        success: function(e) {
        //album:相册   //camera拍照
            e.cancel || (0 == e.tapIndex ? a.chooseWxImageShop("album") : 1 == e.tapIndex && a.chooseWxImageShop("camera"));
        }
    });
  },
  chooseWxImageShop: function(a){
    var e = this;
    wx.chooseImage({
        sizeType: [ "original", "compressed" ],
        sourceType: [ a ],//类型
        count:1,
        success: function(a) {
            if(a.tempFiles[0].size> 2097152){
                wx.showModal({
                    title: "提示",
                    content: "选择的图片过大，请上传不超过2M的图片",
                    showCancel: !1,
                    success: function(a) {
                        a.confirm;
                    }
                })
            }else{
                //把图片上传到服务器
                e.upload_file(a.tempFilePaths[0])
            }
        }
    });
  },
  upload_file: function(e) {
    wx.showLoading({
        title: "上传中"
    });
    wx.uploadFile({
        cloudPath: 'images/',
        filePath: e,//图片路径
        name: "antigen_img",
        formData: {
            token: a.globalData.token,
            antigen_img: "filePath"
        },
        header: {
            "Content-Type": "multipart/form-data"
        },
        success: function(a) {
            wx.hideLoading();
            wx.showToast({
                title: "上传成功",
                icon: "success",
                duration: 3000
            });
            var temp = a.fileID 
            this.setData({
              fileID: temp
            })
            wx.cloud.database.collectio
        },
        fail: function(a) {
            wx.hideLoading();
            wx.showToast({
                title: "上传失败",
                icon: "none",
                duration: 3000
            });
        }
    });
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let name = options.name
    let no = options.no
    this.setData({
      name: name,
      no: no
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