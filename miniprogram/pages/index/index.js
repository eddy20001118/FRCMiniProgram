var app = getApp();
Page({
    data: {
        teamInfo: Array,
        eventInfo: Array,
        teamAtEvent: Array,
        delete: [{ name: '删除' }],
        DeleteKey: String,
        onLongPressedClick: false,
        height: Number,
        tabsIndex: 0
    },

    onLoad: function (options) {
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

    onReady: function () { },

    onShow: function () {
        this.onRequireData();
    },

    onHide: function () { },

    onUnload: function () { },

    onPullDownRefresh: function () {
        if ((this.data.eventInfo == null || this.data.eventInfo.length == 0) && this.data.tabsIndex == 0) {
            wx.stopPullDownRefresh();
        }
        else if ((this.data.teamInfo == null || this.data.teamInfo.length == 0) && this.data.tabsIndex == 1) {
            wx.stopPullDownRefresh();
        }
        else if ((this.data.teamAtEvent == null || this.data.teamAtEvent.length == 0) && this.data.tabsIndex == 2) {
            wx.stopPullDownRefresh();
        } else {
            setTimeout(() => {
                this.onRequireCurrent(this.data.tabsIndex);
            }, 3000);
        }
    },

    onReachBottom: function () { },

    onShareAppMessage: function () { },

    onEventCardClick: function (e) {
        var index = e.currentTarget.id;
        var eventInfo = encodeURIComponent(
            JSON.stringify(this.data.eventInfo[index])
        );
        wx.navigateTo({
            url: `/pages/eventDetail/eventDetail?eventInfo=${eventInfo}`
        });
    },

    onTeamCardClick: function (e) {
        var index = e.currentTarget.id;
        var teamInfo = encodeURIComponent(
            JSON.stringify(this.data.teamInfo[index])
        );
        wx.navigateTo({
            url: `/pages/teamDetail/teamDetail?teamInfo=${teamInfo}`
        });
    },

    onTeamAtEventCardClick: function (e) {
        var index = e.currentTarget.id;
        var eventIndex = encodeURIComponent(
            JSON.stringify(this.data.teamAtEvent[index].eventIndex)
        );
        var team = encodeURIComponent(
            JSON.stringify(this.data.teamAtEvent[index].team)
        );
        wx.navigateTo({
            url: `/pages/teamAtEvent/teamAtEvent?eventIndex=${eventIndex}&team=${team}`
        });
    },

    onRequireCloudData: function () {
        //读取保存到云端的数据
        //TODO: 处理异步方法
        var that = this;
        var eventInfo = new Array();
        var teamInfo = new Array();
        app.getInfoCloud((res) => {
            var keys = res.keys;
            console.log("keys: " + keys);
            if (keys != null && keys.length != 0) {
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j].substring(0, 1) == "e") {
                        var eventkey = keys[j];
                        //event用e打头x
                        app.getCloud(keys[j], (res) => {
                            console.log("eventkey: " + eventkey);
                            eventInfo.push(res.eventIndex);
                            that.setData({
                                eventInfo: eventInfo
                            });
                        }, () => { });
                    } else if (keys[j].substring(0, 1) == "t") {
                        var teamkey = keys[j];
                        //team用t打头
                        app.getCloud(keys[j], (res) => {
                            console.log("teamkey: " + teamkey);
                            teamInfo.push(res);
                            that.setData({
                                teamInfo: teamInfo
                            });
                        }, () => { });
                    }
                }
            }
        });
        this.setData({
            eventInfo: null,
            teamInfo: null
        })
    },

    onRequireData: function () {
        //读取保存到缓存的数据
        var eventInfo = new Array();
        var teamInfo = new Array();
        var teamAtEvent = new Array();
        var that = this;
        var onSuccess = function (res) {
            var keys = res.keys;
            if (keys != null && keys.length != 0) {
                for (var j = 0; j < keys.length; j++) {
                    if (keys[j].substring(0, 1) == "e") {
                        //event用e打头
                        app.get(keys[j], (res) => {
                            eventInfo.push(res.eventIndex);
                        }, () => { });
                    } else if (keys[j].substring(0, 1) == "t") {
                        //team用t打头
                        app.get(keys[j], (res) => {
                            teamInfo.push(res);
                        }, () => { });
                    } else if (keys[j].substring(0, 1) == "q") {
                        //team at event 用q表示
                        app.get(keys[j], (res) => {
                            teamAtEvent.push(res);
                        })
                    }
                }
            }
            that.setData({
                eventInfo: eventInfo,
                teamInfo: teamInfo,
                teamAtEvent: teamAtEvent
            });
        };
        app.getInfo(onSuccess);
    },

    onRequireCurrent: function (type) { //刷新数据(teamAtEvent的赛事和eventInfo的进度条)
        var eventInfo = this.data.eventInfo;
        var teamAtEvent = this.data.teamAtEvent;
        if (type == 0) {
            eventInfo.forEach((element, index) => {
                try {
                    var matchesApi = `event/${element.eventYear}${element.eventCode}/matches/simple`;
                    app.globalMethod.httpsRequest(matchesApi, (res) => {
                        this.onMatchesCallback(res, index);
                    })
                } catch (e) { console.log(e) }
            });
        }
        else if (type == 2) {
            teamAtEvent.forEach((element, index) => {
                try {
                    var teamMatchesApi = `team/frc${element.team.teamNumber}/event/${element.eventIndex.eventYear}${element.eventIndex.eventCode}/matches/simple`
                    app.globalMethod.httpsRequest(teamMatchesApi, (res) => {
                        this.onTeamMatchesCallback(res, index);
                    })
                } catch (error) { console.log(error) }
            })
        }
    },

    onMatchesCallback: function (res, index) {
        var active = -1;
        if (res != null && res.length != 0) {
            var matchesStepArray = new Array();
            for (var j = 0; j < res.length; j++) {
                if (res[j].comp_level == "qm") {
                    //资格赛
                    matchesStepArray.push("qm");
                } else if (res[j].comp_level == "qf") {
                    //四分之一决赛
                    matchesStepArray.push("qf");
                } else if (res[j].comp_level == "sf") {
                    //二分之一决赛
                    matchesStepArray.push("sf");
                } else if (res[j].comp_level == "f") {
                    //决赛
                    matchesStepArray.push("f");
                }
            }
            var uniqueTemp = app.globalMethod.uniqueArray(matchesStepArray);
            uniqueTemp.sort(app.globalMethod.matchesArrayStringSort);
            var key = uniqueTemp[0];
            if (key == "qm") {
                active = 0;
            } else if (key == "qf") {
                active = 1;
            } else if (key == "sm") {
                active = 2;
            } else if (key == "f") {
                active = 3;
            }
        }
        this.data.eventInfo[index].active = active;
        this.setData({
            eventInfo: this.data.eventInfo
        })
        var localtemp = new Object();
        localtemp.eventIndex = this.data.eventInfo[index]
        app.set({
            key: `e${localtemp.eventIndex.eventYear}${localtemp.eventIndex.eventCode}`,
            data: localtemp
        })
        wx.stopPullDownRefresh();
        console.log("stop event refresh")
    },

    onTeamMatchesCallback: function (res, index) {
        var match = {};
        if (res != null && res.length > 0) {
            match = {
                qual: new Array(),
                quarter: new Array(),
                semi: new Array(),
                final: new Array()
            }

            for (var j = 0; j < res.length; j++) {
                if (res[j].comp_level == "qm") { //资格赛
                    try {
                        var qual = match.qual;
                        qual.push({
                            matchType: ["Qual", res[j].match_number],
                            redAlliance: app.globalMethod.teamFilter(res[j].alliances.red.team_keys),
                            blueAlliance: app.globalMethod.teamFilter(res[j].alliances.blue.team_keys),
                            score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                        })
                        qual.sort(app.globalMethod.matchesArraySort);
                    } catch (e) { }
                } else if (res[j].comp_level == "qf") { //四分之一决赛
                    try {
                        var quarter = match.quarter;
                        quarter.push({
                            matchType: ["Quarter", res[j].match_number],
                            redAlliance: app.globalMethod.teamFilter(res[j].alliances.red.team_keys),
                            blueAlliance: app.globalMethod.teamFilter(res[j].alliances.blue.team_keys),
                            score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                        })
                        quarter.sort(app.globalMethod.matchesArraySort);
                    } catch (e) { }
                } else if (res[j].comp_level == "sf") { //四分之一决赛
                    try {
                        var semi = match.semi;
                        semi.push({
                            matchType: ["Semi", res[j].match_number],
                            redAlliance: app.globalMethod.teamFilter(res[j].alliances.red.team_keys),
                            blueAlliance: app.globalMethod.teamFilter(res[j].alliances.blue.team_keys),
                            score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                        })
                        semi.sort(app.globalMethod.matchesArraySort);
                    } catch (e) { }
                } else if (res[j].comp_level == "f") { //四分之一决赛
                    try {
                        var final = match.final;
                        final.push({
                            matchType: ["Final", res[j].match_number],
                            redAlliance: app.globalMethod.teamFilter(res[j].alliances.red.team_keys),
                            blueAlliance: app.globalMethod.teamFilter(res[j].alliances.blue.team_keys),
                            score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                        })
                        final.sort(app.globalMethod.matchesArraySort);
                    } catch (e) { }
                }
            }
        }
        var lastmatch = app.globalMethod.getLastMatch(match);
        this.data.teamAtEvent[index].lastmatch = lastmatch;
        this.setData({
            teamAtEvent: this.data.teamAtEvent
        })
        var localtemp = this.data.teamAtEvent[index];
        app.set({
            key: `q${localtemp.team.teamNumber}${localtemp.eventIndex.eventYear}${localtemp.eventIndex.eventCode}`,
            data: localtemp
        })
        wx.stopPullDownRefresh();
        console.log("stop teamatevent refresh")
    },

    onLongPressed: function (e) {
        this.setData({
            onLongPressedClick: true,
            DeleteKey: e.currentTarget.dataset.key
        })
    },

    onDelete: function (e) {
        app.remove(this.data.DeleteKey, () => {
            wx.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
            });
            this.setData({
                DeleteKey: null,
                onLongPressedClick: false
            })
        }, () => { })
        this.onRequireData();
    },

    onDeleteCancel: function () {
        this.setData({
            DeleteKey: null,
            onLongPressedClick: false
        })
    },

    onSwitchTaps: function (e) {
        var tag = e.currentTarget.id;
        if (tag == "e") {
            wx.switchTab({
                url: "/pages/eventData/eventData"
            });
        } else if (tag == "t" || tag == "q") {
            wx.switchTab({
                url: "/pages/teamData/teamData"
            });
        }
    },

    onTabsChanged: function (e) {
        this.setData({
            tabsIndex: e.detail.index
        })
    }
});