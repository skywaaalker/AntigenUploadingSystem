// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:"oasis-gwdjp"})

var nodemailer = require('nodemailer')
var config = {
  host: 'smtp.qq.com', //网易163邮箱 smtp.163.com
  port: 465, //网易邮箱端口 25
  auth: {
    user: '904643943@qq.com', //邮箱账号
    pass: 'unotsawcqhzkbcdd' //邮箱的授权码
  }
};
var transporter = nodemailer.createTransport(config);
// 云函数入口函数
exports.main = async(event, context) => {
  console.log("start")
  const db = cloud.database();
  const _ = db.command;
  const $ = _.aggregate;

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
  var stuList = []
  var uploadList = []

  const res1 = await db.collection("stuInfo").aggregate().match({
    root: 0
  }).sort({
    'dom': 1
  }).end()
  for (var t of res1.list){
    stuList.push(t.stuNo)
  }
  console.log("stuList", stuList)
  const res2 = await db.collection('uploadList').aggregate().match({
    dateFormat: _.gte(today_begin).and(_.lte(today_noon))
  }).end()
  console.log("finishlist", res2)
  var d = []
  if (res2.list.length == 0 || res2.list == undefined) {
    console.log("no one upload")
    d = stuList
  } else {
    console.log("some one upload")
    var finishList = []
    for (var t of res2.list) {
      finishList.push(t.stuNo)
    }
    var finishList = [...new Set(finishList)]
    var a = stuList
    var b = finishList
    d = a.filter(function(v){ return b.indexOf(v) == -1 })
  }
  console.log("missing List", d)
  const res3 = await db.collection('stuInfo').aggregate().match({
    stuNo: _.in(d)
  }).end()
  mailList = []
  if (res3.list.length == 0  || res3.list == undefined){
    mailList = []
  } else {
    for (var t of res3.list){
      if (t.email != undefined){
        mailList.push(t.email)
      }
    }
  }
  console.log("mailList", mailList)

  var mail = {
    from: 'skywalker <904643943@qq.com>',
    subject: '抗原提交',
    // to: 'guzhy@shanghaitech.edu.cn',
    to: mailList,
    text: '你好，请提交抗原结果'
  };

  let res = await transporter.sendMail(mail);
  return res;
}