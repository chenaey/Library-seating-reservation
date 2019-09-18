// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const seatCollection = db.collection("seat")
const userCollertion = db.collection("user")

// 云函数入口函数
exports.main = async(event, context) => {
  const {
    doc_id,
    seat_id,
    auth_id,
    location,
    start,
    end,
  } = event
  var res = await seatCollection.doc(doc_id).get()
  var auth = await userCollertion.doc(auth_id).get()
  var seatData = res.data[location]
  var seatIndex = undefined
  var seat = seatData.filter((obj, index) => {
    if (obj.id === seat_id) {
      seatIndex = index
    }
    return obj.id === seat_id
  })[0]
  console.log(seatIndex)
  console.log(start, end)
  if (seat.user.length === 0) {
    seat.user.push({
      start: start,
      end: end,
      auth_id: auth_id,
      userId: auth.data.userId,
      userName: auth.data.userName
    })

    var res = await seatCollection.doc(doc_id).update({
      data: {
        [`${location}.${seatIndex}.${"user"}`]: seat.user
      }
    })

    return res
  }


}