var app = getApp();
Page({
    data: {
        teamInfo: Array,
        eventInfo: Array,
        height: Number
    },

    onLoad: function(options) {
        var that = this;
        wx.getSystemInfo({
            success: res => {
                that.setData({
                    height: res.windowHeight - 44
                });
            }
        });
        this.onRequireData();
        //this.onRequireData();
    },

    onReady: function() {},

    onShow: function() {},

    onHide: function() {},

    onUnload: function() {},

    onPullDownRefresh: function() {
        setTimeout(() => {
            this.onRequireData();
            wx.stopPullDownRefresh();
        }, 2500);
    },

    onReachBottom: function() {},

    onShareAppMessage: function() {},

    onEventCardClick: function(e) {
        var index = e.currentTarget.id;
        var eventInfo = encodeURIComponent(
            JSON.stringify(this.data.eventInfo[index])
        );
        wx.navigateTo({
            url: `/pages/eventDetail/eventDetail?eventInfo=${eventInfo}`
        });
    },

    onTeamCardClick: function(e) {
        var index = e.currentTarget.id;
        var teamInfo = encodeURIComponent(
            JSON.stringify(this.data.teamInfo[index])
        );
        wx.navigateTo({
            url: `/pages/teamDetail/teamDetail?teamInfo=${teamInfo}`
        });
    },

    onRequireCloudData: function() {
        //读取保存到云端的数据
        var that = this;
        var eventInfo = new Array();
        var teamInfo = new Array();
        app.getInfoCloud((res)=>{
            var keys = res.keys;
            console.log("keys: " + keys);
            if (keys != null && keys.length != 0) {
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j].substring(0, 1) == "e") {
                        var eventkey = keys[j];
                        //event用e打头x
                        var onGetSuccess = function(res) {
                            console.log("eventkey: " + eventkey);
                            eventInfo.push(res.eventIndex);
                            that.setData({
                                eventInfo: eventInfo
                            });
                        };
                        app.getCloud(keys[j], onGetSuccess, () => {});
                    } else if (keys[j].substring(0, 1) == "t") {
                        var teamkey = keys[j];
                        //team用t打头
                        var onGetSuccess = function(res) {
                            console.log("teamkey: " + teamkey);
                            teamInfo.push(res);
                            that.setData({
                                teamInfo: teamInfo
                            });
                        };
                        app.getCloud(keys[j], onGetSuccess, () => {});
                    }
                }
            }
        });
        this.setData({
            eventInfo : null,
            teamInfo : null
        })
    },

    onRequireData: function() {
        //读取保存到缓存的数据
        var eventInfo = new Array();
        var teamInfo = new Array();
        var onSuccess = function(res) {
            var keys = res.keys;
            if (keys != null && keys.length != 0) {
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j].substring(0, 1) == "e") {
                        //event用e打头
                        var onGetSuccess = function(res) {
                            console.log(res);
                            eventInfo.push(res.eventIndex);
                        };
                        var onGetFail = function() {};
                        app.get(keys[j], onGetSuccess, onGetFail);
                    } else if (keys[j].substring(0, 1) == "t") {
                        //team用t打头
                        var onGetSuccess = function(res) {
                            teamInfo.push(res);
                        };
                        var onGetFail = function() {};
                        app.get(keys[j], onGetSuccess, onGetFail);
                    }
                }
            }
        };
        app.getInfo(onSuccess);
        this.setData({
            eventInfo: eventInfo,
            teamInfo: teamInfo
        });
    }
});