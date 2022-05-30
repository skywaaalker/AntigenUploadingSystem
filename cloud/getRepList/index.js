// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:"oasis-gwdjp"})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  {
    var today_begin = new Date()
    var today_noon = new Date()
    var today_night = new Date()
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
  const db = cloud.database();
  const _ = db.command;
  const $ = _.aggregate;
  if (event.beforeNoon == true) {
    const result = await db.collection('uploadList').aggregate()
      .group({
        _id: '$qrcode',
        num: $.sum(1)
      }).end()
    console.log("qrcode_num", result)
    var repCodes = [];
    for (var t of result){
      if (t.num > 1){
        repCodes.push(t._id)
      }
    }
    console.log("repcodes", repCodes)
    const result1 = await db.collection('uploadList').aggregate().lookup({
      from: 'stuInfo',
      localField: 'stuNo',
      foreignField: 'stuNo',
      as: 'rep'
    }).match({
      qrcode: _.in(repCodes), 
      dateFormat: _.gte(today_begin).and(_.lte(today_noon))
    }).end()
    console.log("agg", result1);
    return{ result1, event}
  } else {
    const result = await db.collection('uploadList').aggregate()
      .group({
        _id: '$qrcode',
        num: $.sum(1)
      }).end()
    console.log("qrcode_num", result.list)
    var repCodes = [];
    for (var t of result.list){
      if (t.num > 1){
        repCodes.push(t._id)
      }
    }
    console.log("repcodes", repCodes)
    const result1 = await db.collection('uploadList').aggregate().lookup({
      from: 'stuInfo',
      localField: 'stuNo',
      foreignField: 'stuNo',
      as: 'rep'
    }).match({
      qrcode: _.in(repCodes), 
      dateFormat: _.gte(today_noon).and(_.lte(today_night))
    }).end()
    console.log("agg", result1);
    return{ result1, event}
  }

}