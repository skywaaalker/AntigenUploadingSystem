// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:"oasis-gwdjp"})

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const db = cloud.database();
  date = new Date();
  cloud.database().collection("uploadList").add({
    data:{
      stuNo: event.stuNo,
      fileID: event.fileID,
      dateFormat: date,
      dateStr: event.dateStr,
      choice: event.choice,
      qrcode: event.qrcode
    },success(res){
      console.log(res, event)
    },fail(res) {
      console.log(res, event)
    }
  })
}