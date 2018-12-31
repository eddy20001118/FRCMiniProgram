
App({
    globalMethod: {
        httpsRequest: function (api, callback) {
            wx.cloud.callFunction({
                name: 'httpsRequest',
                data: {
                    api: api
                },
                success : callback,
                fail: console.error
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

        },
        search: function (type, msg, callback) {
            const db = wx.cloud.database({
                env: "frceven-e04c8c"
            });
            if (type == "team") {
                var teamsInfoCollection = db.collection('teams_info');
                var name = msg.match(/^[A-Za-z][A-Za-z\s]*[A-Za-z]$/gi);
                var num = msg.match(/\d+$/gi);
                if (name != null) {
                    teamsInfoCollection.where({
                        nickname: db.RegExp({
                            regexp: name.toString(),
                            options: "i"
                        })
                    }).get().then(callback)
                }
                if (num != null) {
                    teamsInfoCollection.where({
                        team_number: parseInt(num.toString())
                    }).get().then(callback)
                }
            } else if (type == "event") {
                var eventsInfoCollection = db.collection('events_info');
                eventsInfoCollection.where({
                    name: db.RegExp({
                        regexp: msg,
                        options: "i"
                    })
                }).get().then(callback)
            }
        }
    },

    onLaunch: function () {
        wx.cloud.init({
            env: 'frceven-e04c8c'
        })
    }
})