//app.js
App({
    globalData: {
        tbaApi: "https://www.thebluealliance.com/api/v3/",
        tbaKey: ""
    },
    globalMethod: {
        httpsRequest: function (app, api, callback) {
            var url = app.globalData.tbaApi + api + `?X-TBA-Auth-Key=${app.globalData.tbaKey}`;
            console.log(url);
            wx.request({
                url: url,
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    callback(res.data);
                }
            })
        },
        matchesArraySort: function(x,y) {
            return x.matchType[1]-y.matchType[1];
        },
        eventsAtYearSort: function(x,y) {
            return x.startDateObj - y.startDateObj;
        }
    }
})