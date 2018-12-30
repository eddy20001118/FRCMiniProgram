//app.js
App({
    globalData: {
        tbaApi: "https://www.thebluealliance.com/api/v3/",
        tbaKey: "kbxvOnS2csBH6fzQ8zijLw2f1k135fWp8NgTEfPRg1n8hYqh7SSUo9VJ3JEBlnIg"
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
        matchesArraySort: function (x, y) {
            return x.matchType[1] - y.matchType[1];
        },
        eventsAtYearSort: function (x, y) {
            return x.startDateObj - y.startDateObj;
        },
        ranksArraySort: function (x, y) {
            return x.rank - y.rank;
        },
        teamArraySort: function (x, y) {
            return x.teamNumber - y.teamNumber;
        },
        dataFilter: function (str) {
            var temp = str;
            temp = temp.replace(/<b>/g, "");
            temp = temp.replace(/<\/b>/g, "");
            return temp;
        },
        teamFilter: function (array) {
            var temp = array;
            for (var j = 0; j < temp.length; j++) {
                temp[j] = array[j].replace("frc", "")
            }
            return temp
        }
    },
    dataBaseMethod: {
        set: function (data, onSuccess) {
            try {
                wx.setStorageSync(data.key, data.data);
                onSuccess();
            } catch (error) {

            }
        },
        remove: function (key, onSuccess, onFail) {
            try {
                wx.removeStorageSync(key);
                onSuccess();
            } catch (error) {
                onFail();
            }
        },
        get: function (key, onSuccess, onFail) {
            try {
                const value = wx.getStorageSync(key);
                if (value != null && value.length != 0) {
                    onSuccess(value)
                } else {
                    onFail()
                }
            } catch (error) {
                onFail();
            }
        },
        getInfo: function (onSuccess) {
            try {
                const res = wx.getStorageInfoSync();
                onSuccess(res)
            } catch (error) {

            }

        }
    },

    onLaunch : function(){
        wx.cloud.init({
            env: 'frceven-e04c8c'
          })
    }
})