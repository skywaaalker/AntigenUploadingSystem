// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    stuNo: '',
    stuName: '',
    students: [
      's1','s2','s3','s4','s5','s6','s7','s8','s9','s10',
      's11','s12','s13','s14','s15','s16','s17','s18','s19','s20',
      's21','s22','s23','s24','s25','s26','s27','s28','s29','s30'
    ],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  formSubmit(e) {
    // 在这里访问数据库/API处理信息？
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },
  getStuNo(e){
    // var stuNo = e.detail.value;
    console.log('获取输入学号', e.detail.value)
    this.setData({
      stuNo: e.detail.value
    })
  },
  getStuName(e){
    this.setData({
      stuName: e.detail.value
    })
  },
  login(){
    let no = this.data.stuNo
    let name = this.data.stuName
    console.log('登录中', no, name)

    wx.cloud.database().collection('stuInfo').where({
      stuNo: no,
    }).get({
      success(res) {
        let stuInfo = res.data[0]
        console.log("stuInfo", stuInfo)
        if (name == stuInfo.stuName) {
          console.log('登陆成功')
          wx.showToast({
            title: '登陆成功',
          })
          wx.navigateTo({
            url: '../upload/upload?name=' + stuInfo.stuName + '&no='+ stuInfo.stuNo,
          })
          //保存用户登陆状态
          wx.setStorageSync('stuInfo', stuInfo)
        } else {
          console.log('登陆失败')
          wx.showToast({
            icon: 'none',
            title: '学号或姓名不正确',
          })
        }
      },
      fail(res) {
        console.log("获取数据失败", res)
      }
    })
  }
})
