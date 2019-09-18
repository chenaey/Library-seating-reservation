// 本地模拟json数据
var json = {
  "errorCode": 0,
  "errorMsg": "",
  "name": "门口", //has
  "movieName": "图书馆三楼", //has
  "showTime": "2019-03-06 周五 16:50",
  "seatList": [{
    "id": "16879097",
    "row": "1",
    "col": "1",
    "gRow": 1,
    "gCol": 1,
    "type": "0",
    "flag": "0",
    "price": "69"
  }, {
    "id": "16879097",
    "row": "1",
    "col": "1",
    "gRow": 3,
    "gCol": 1,
    "type": "0",
    "flag": "0",
    "price": "69"
  }],
  "seatTypeList": [{
      "name": "可选",
      "type": "0",
      "seats": 1,
      "icon": "https://i.postimg.cc/BbbWyY5D/image.png",
      "isShow": "1",
      "position": "up"
    },
    {
      "name": "已选",
      "type": "0-1",
      "seats": 1,
      "icon": "https://i.postimg.cc/1X2dd93h/image.png",
      "isShow": "1",
      "position": "up"
    },
    {
      "name": "不可选",
      "type": "0-2",
      "seats": 1,
      "icon": "https://i.postimg.cc/LXywzkds/image.png",
      "isShow": "1",
      "position": "up"
    },
    {
      "name": "未开放",
      "type": "0-3",
      "seats": 1,
      "icon": "https://i.postimg.cc/BZVRbCcY/image.png",
      "isShow": "1",
      "position": "up"
    }
  ]
}

// 定义数据出口
module.exports = {
  dataList: json
}