var app = getApp();
Page({
    data: {
        teamInfo: Array,
        eventInfo: Array,
    },

    onLoad: function (options) {
        this.onRequireData();
    },

    onReady: function () {

    },

    onShow: function () {

    },

    onHide: function () {

    },

    onUnload: function () {

    },

    onPullDownRefresh: function () {
        setTimeout(() => {
            this.onRequireData();
            wx.stopPullDownRefresh();
        }, 2500)
    },

    onReachBottom: function () {

    },

    onShareAppMessage: function () {

    },

    onEventCardClick: function (e) {
        var index = e.currentTarget.id;
        var eventInfo = encodeURIComponent(JSON.stringify(this.data.eventInfo[index]));
        wx.navigateTo({
            url: `/pages/eventDetail/eventDetail?eventInfo=${eventInfo}`
        })
    },

    onTeamCardClick: function (e) {
        var index = e.currentTarget.id;
        var teamInfo = encodeURIComponent(JSON.stringify(this.data.teamInfo[index]));
        wx.navigateTo({
            url: `/pages/teamDetail/teamDetail?teamInfo=${teamInfo}`
        })
    },

    onRequireData: function () {
        //读取保存到缓存的数据
        var eventInfo = new Array();
        var teamInfo = new Array();
        var onSuccess = function (res) {
            var keys = res.keys;
            if (keys != null && keys.length != 0) {
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j].substring(0, 1) == 'e') { //event用e打头
                        var onGetSuccess = function (res) {
                            eventInfo.push(res);
                        }
                        var onGetFail = function () {
                        }
                        app.dataBaseMethod.get(keys[j], onGetSuccess, onGetFail);
                    } else if (keys[j].substring(0, 1) == 't') { //team用t打头
                        var onGetSuccess = function (res) {
                            teamInfo.push(res);
                        }
                        var onGetFail = function () {
                        }
                        app.dataBaseMethod.get(keys[j], onGetSuccess, onGetFail);
                    }
                }
            }
        }
        app.dataBaseMethod.getInfo(onSuccess);
        this.setData({
            eventInfo: eventInfo,
            teamInfo : teamInfo
        })
    },
})
