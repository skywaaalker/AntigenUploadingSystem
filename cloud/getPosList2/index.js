// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({env:"oasis-gwdjp"})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  const db = cloud.database();
  const _ = db.command;
  // console.log(event.startTime, event.endTime);
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
  if (event.beforeNoon == true){
    const result = await db.collection('uploadList').aggregate().lookup({
      from: 'stuInfo',
      localField: 'stuNo',
      foreignField: 'stuNo',
      as: 'pos'
    }).match({
      dateFormat: _.gte(today_begin).and(_.lte(today_noon)),
      choice: _.gte(2)
    }).end()
    return {
      result,
      event
    }
  } else {
    const result = await db.collection('uploadList').aggregate().lookup({
      from: 'stuInfo',
      localField: 'stuNo',
      foreignField: 'stuNo',
      as: 'pos'
    }).match({
      dateFormat: _.gte(today_noon).and(_.lte(today_night)),
      choice: _.gte(2)
    }).end()
    return {
      result,
      event
    }
  }


}