// // pages/upload/upload.js
var utils= require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    no: '',
    index: 0,    //阳性1,阴性2,异常3
    btn1checked: false,
    btn2checked: false,
    btn3checked: false,
    fileID: '',   //上传到云之后返回的ID
    filePath: '', //上传图片后的本地路径,
    hasUploadedImg: false,
    showDelIcon: true,
    cloudURL: '', //云函数转http url
    qrcodeURL: '', //二维码对应的网址
    hasScanQRcode: '',
    scanFinished: false
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
    console.log("path test2 "+ e);
    var that = this
    wx.showLoading({
        title: "上传中"
    });
    wx.cloud.uploadFile({
        cloudPath: 'images/'+ new Date().getTime()+".jpg",
        filePath: e,
        success: function(a) {
            var temp = a.fileID ;
            console.log("fileID" + temp);
            wx.hideLoading();
            that.setData({
              fileID: temp,
              filePath: e,
              hasUploadedImg: true,
              showDelIcon: true
            })
            console.log("hasUploadedImg", that.data.hasUploadedImg);
            that.getURL(that)
        },
        fail: function(a) {
            console.log("upload fail", a.errMsg)
            wx.hideLoading();
            wx.showToast({
                title: "上传失败",
                icon: "none",
                duration: 3000
            });
        }
    });
  },
  getURL: function(e){
    var that = this
    wx.cloud.getTempFileURL({
      // name: "getImgURL",
      fileList: [{
        fileID : that.data.fileID
      }]
    }).then(res =>{
      console.log(res.fileList[0].tempFileURL)
      that.setData({
        cloudURL: res.fileList[0].tempFileURL
      })
      wx.cloud.callFunction({
        name: "scanQRcode",
        data: {
          fileURL : that.data.cloudURL
        },success(res){
          console.log(res)
          // res.result.codeResults == undefined
          if (res.result.codeResults == undefined || res.result.codeResults.length == 0) {
            that.setData({
              scanFinished: true,
              hasScanQRcode: false
            })
          } else {
            var temp = res.result.codeResults[0].data
            var code = temp.substring(temp.length - 11);
            that.setData({
              hasScanQRcode: true,
              qrcodeURL: code,
              scanFinished: true
            })
          }
        },fail(res){
          console.log(res.errMsg)
          that.setData({
            scanFinished: true,
            hasScanQRcode: false
          })
        }
      })
    }).catch(error =>{
      wx.showToast({
        title: '上传失败，请重新上传',
        icon: "error",
        duration: 2000
      })
    })
  },
  formatTime: function(date){
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return year+'/'+month+'/'+day+' '+hour+':'+ minute+':'+second
  },
  upload_info: function(e) {
    var today = new Date()
    var hour = today.getHours()
    if (hour < 12) {
      if (hour < 9) {
        wx.showToast({
          title: '请在9:00-11:59提交',
          icon: 'none',
          duration: 2000
        })
        return
      }
    } else {
      if (hour < 20 || hour > 23) {
        wx.showToast({
          title: '请在20:00-22:59提交',
          icon: 'none',
          duration: 2000
        })
        return
      }
    }
    var that = this
    if (that.data.index == 0) {
      wx.showToast({
        title: '请选择抗原检测结果！',
        duration: 2000,
        icon: 'error'
      })
      return
    }
    if (that.data.hasUploadedImg == false){
      wx.showToast({
        title: '请上传图片！',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (that.data.hasScanQRcode == false) {
      wx.showToast({
        title: '请等待扫描完成',
        icon: 'none',
        duration: 2000
      })
      return
    }
    // var time = utils.formatTime(today);
    var time = that.formatTime(today)
    console.log(time)
    wx.cloud.callFunction({
      name: "add",
      data: {
        stuNo: that.data.no,
        fileID: that.data.cloudURL,
        choice: that.data.index,
        dateFormat: today,
        dateStr: time,
        qrcode: that.data.qrcodeURL
      },
      success(res){
        wx.showToast({
          title: '提交成功',
          duration: 2000
        })
        wx.navigateTo({
          url: '../history/history?no='+ that.data.no+ '&name='+that.data.name,
        })
        console.log("success ",res)
      },fail(res){
        console.log("fail " ,res)
      }
    })
  },
  del_img: function(e){
    var that = this
    that.setData({
      showDelIcon: false,
      hasUploadedImg: false,
      fileID: '',
      filePath: '',
      cloudURL: '',
      qrcodeURL: '',
      hasScanQRcode: false,
      scanFinished: false
    })
  },
  previewImg(e){
    var urls = []
    urls.push(this.data.filePath)
    wx.previewImage({
      urls: urls
    })
  },
  queryList:function(e){
    var that = this
    wx.navigateTo({
      url: '../history/history?no='+ that.data.no+ '&name='+that.data.name,
    })
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
    console.log(utils)
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