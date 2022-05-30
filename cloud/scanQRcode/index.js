// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:"oasis-gwdjp"})

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  fileURL = event.fileURL
  try{
    const result = await cloud.openapi.img.scanQRCode({
      imgUrl: fileURL
    })
    return result
  } catch (err){
    throw err
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}