// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request')
cloud.init()
const db = cloud.database({
    env: 'frceven-e04c8c'
})
const collection = db.collection("tba")
// 云函数入口函数
exports.main = async (event, context) => {
    var tba = await collection.get();
    var tbaKey = await tba.data[0].tba_key;
    var tbaHead = await tba.data[1].tba_head;
    return new Promise((resolve, reject) => {
        var url = `${tbaHead}${event.api}?X-TBA-Auth-Key=${tbaKey}`;
        request(url,function (error, response, data) {
            resolve({
                url : url,
                data : JSON.parse(data),
                error : error,
                response : response
            });
        });
    })
}