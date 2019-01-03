var app = getApp();
// pages/eventDetail/eventDetail.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        teamlist: Array,
        eventIndex: Object,
        rankCard: Array,
        allianceCard: Array,
        awardCard: Array,
        match: Object,
        topTeamList: null,
        activeNames: [],
        dataBase: Boolean,
        height: Number
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.getSystemInfo({
            success: res => {
                that.setData({
                    height: res.windowHeight - 44
                });
            }
        });
        try {
            var eventInfo = JSON.parse(decodeURIComponent(options.eventInfo));
            var summaryApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}`;
            app.globalMethod.httpsRequest(summaryApi, this.onSummaryCallBack);
            var key = "e" + eventInfo.eventYear + eventInfo.eventCode;
            app.get(
                key,
                value => {
                    this.setData({
                        dataBase: true,
                        topTeamList: value.topTeamList,
                        eventIndex: value.eventIndex
                    });
                    console.log("已有收藏");
                },
                () => {
                    this.setData({
                        dataBase: false
                    });
                    console.log("无已有收藏");
                }
            );

        } catch (e) {
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () { },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () { },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () { },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () { },

    onLoadOtherRequests: function (eventInfo) {
        var alliancesApi = `event/${eventInfo.eventYear}${
            eventInfo.eventCode
            }/alliances`; //object
        var awardsApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}/awards`; //list
        var matchesApi = `event/${eventInfo.eventYear}${
            eventInfo.eventCode
            }/matches/simple`; //list
        var teamListApi = `event/${eventInfo.eventYear}${
            eventInfo.eventCode
            }/teams`; //list
        app.globalMethod.httpsRequest(teamListApi, this.onTeamsCallBack);
        app.globalMethod.httpsRequest(alliancesApi, this.onAlliancesCallBack);
        app.globalMethod.httpsRequest(awardsApi, this.onAwardsCallBack);
        app.globalMethod.httpsRequest(matchesApi, this.onMatchesCallBack);
    },

    onTabChange: function (e) {
        var activeTab = e.detail.index;
    },

    onAwardsCallBack: function (res) {
        if (res != null && res.length != 0) {
            var awardCard = new Array(res.length);
            for (var j = 0; j < res.length; j++) {
                if (res[j].recipient_list != null) {
                    var awardTeamList = new Array(res[j].recipient_list.length);
                    for (var i = 0; i < res[j].recipient_list.length; i++) {
                        try {
                            var teamNumber = res[j].recipient_list[i].team_key;
                        } catch (e) { }
                        try {
                            var awardee = res[j].recipient_list[i].awardee;
                        } catch (e) { }
                        teamNumber =
                            teamNumber != null ? teamNumber.replace("frc", "") : null;
                        awardTeamList[i] = {
                            teamNumber: teamNumber,
                            awardee: awardee
                        };
                    }

                    try {
                        var awardTitle = res[j].name;
                    } catch (error) { }
                    awardCard[j] = {
                        awardTitle: awardTitle,
                        awardTeamList: awardTeamList
                    };
                }
            }
            this.setData({
                awardCard: awardCard
            });
        }
    },

    onSummaryCallBack: function (res) {
        //只有对获取的value进行操作时才需要trycatch来捕获异常，否则如果value不存在，对应属性会被赋值null，不会抛出异常
        try {
            var startDate = new Date(res.start_date);
            var endDate = new Date(res.start_date);
        } catch (error) { }

        var eventIndex = {
            eventTitle: res.name,
            eventLocation: res.address,
            eventStartDate: startDate.toDateString().split(" ")[1] + " " + startDate.getDate(),
            eventEndDate: endDate.toDateString().split(" ")[1] + " " + endDate.getDate(),
            eventYear: res.year,
            eventCode: res.event_code,
            eventLocationShort: `${res.city}, ${res.state_prov}, ${res.country}`,
            active: 0,
            steps: [{
                text: "资格赛"
            },
            {
                text: "四分之一决赛"
            },
            {
                text: "半决赛"
            },
            {
                text: "决赛"
            }
            ]
        };
        this.setData({
            eventIndex: eventIndex
        });
        if (eventIndex.eventTitle != null)
            wx.setNavigationBarTitle({
                title: eventIndex.eventTitle
            });
        //只有summary加载完了才会完成其他的请求
        this.onLoadOtherRequests(eventIndex);
    },

    onAlliancesCallBack: function (res) {
        if (res != null) {
            var allianceCard = new Array(res.length);
            for (var j = 0; j < res.length; j++) {
                try {
                    var alliance = res[j].name.split(" ");
                    var choice = alliance[1];
                } catch (e) { }
                try {
                    var team = app.globalMethod.teamFilter(res[j].picks);
                } catch (e) { }
                allianceCard[j] = {
                    allianceNumber: choice,
                    allianceTeam: team
                };
            }
            this.setData({
                allianceCard: allianceCard
            });
        }
    },

    onMatchesCallBack: function (res) {
        if (res != null && res.length != 0) {
            var match = {
                qual: new Array(),
                quarter: new Array(),
                semi: new Array(),
                final: new Array()
            };
            for (var j = 0; j < res.length; j++) {
                if (res[j].comp_level == "qm") {
                    //资格赛
                    try {
                        var qual = match.qual;
                        qual.push({
                            matchType: ["Qual", res[j].match_number],
                            redAlliance: app.globalMethod.teamFilter(
                                res[j].alliances.red.team_keys
                            ),
                            blueAlliance: app.globalMethod.teamFilter(
                                res[j].alliances.blue.team_keys
                            ),
                            score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                        });
                        qual.sort(app.globalMethod.matchesArraySort);
                    } catch (e) { }
                } else if (res[j].comp_level == "qf") {
                    //四分之一决赛
                    try {
                        var quarter = match.quarter;
                        quarter.push({
                            matchType: ["Quarter", res[j].match_number],
                            redAlliance: app.globalMethod.teamFilter(
                                res[j].alliances.red.team_keys
                            ),
                            blueAlliance: app.globalMethod.teamFilter(
                                res[j].alliances.blue.team_keys
                            ),
                            score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                        });
                        quarter.sort(app.globalMethod.matchesArraySort);
                    } catch (e) { }
                } else if (res[j].comp_level == "sf") {
                    //二分之一决赛
                    try {
                        var semi = match.semi;
                        semi.push({
                            matchType: ["Semi", res[j].match_number],
                            redAlliance: app.globalMethod.teamFilter(
                                res[j].alliances.red.team_keys
                            ),
                            blueAlliance: app.globalMethod.teamFilter(
                                res[j].alliances.blue.team_keys
                            ),
                            score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                        });
                        semi.sort(app.globalMethod.matchesArraySort);
                    } catch (e) { }
                } else if (res[j].comp_level == "f") {
                    //决赛
                    try {
                        var final = match.final;
                        final.push({
                            matchType: ["Final", res[j].match_number],
                            redAlliance: app.globalMethod.teamFilter(
                                res[j].alliances.red.team_keys
                            ),
                            blueAlliance: app.globalMethod.teamFilter(
                                res[j].alliances.blue.team_keys
                            ),
                            score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                        });
                        final.sort(app.globalMethod.matchesArraySort);
                    } catch (e) { console.log(e) }
                }
            }
            var active;
            Object.keys(match).forEach(function (key) {
                if (key == "qual") {
                    active = 0;
                } else if (key == "quarter") {
                    active = 1;
                } else if (key == "semi") {
                    active = 2;
                } else if (key == "final") {
                    active = 3;
                }
            });
            this.data.eventIndex.active = active;
            this.setData({
                match: match,
                eventIndex: this.data.eventIndex
            })
        }
    },

    onRankingCallBack: function (res) {
        var teamList = this.data.teamlist;
        var rankCard = new Array();

        for (var j = 0; j < teamList.length; j++) {
            if (res["frc" + teamList[j].teamNumber] != null) {
                if (res["frc" + teamList[j].teamNumber].qual != null) {
                    try {
                        var sortOrders =
                            res["frc" + teamList[j].teamNumber].qual.ranking.sort_orders;
                        var rankScore = sortOrders[0];
                    } catch (e) { }
                    try {
                        var rank = res["frc" + teamList[j].teamNumber].qual.ranking.rank;
                    } catch (e) { }
                    if (rank != null && rankScore != null) {
                        rankCard.push({
                            team: [teamList[j].teamName, teamList[j].teamNumber],
                            rank: rank,
                            rankScore: rankScore
                        });
                    }
                }
            }
        }
        rankCard.sort(app.globalMethod.ranksArraySort);
        if (rankCard.length < 5) {
            var topTeamList = new Array(rankCard.length);
            for (var j = 0; j < rankCard.length; j++) {
                topTeamList[j] = rankCard[j];
            }
        } else {
            var topTeamList = new Array(5);
            for (var j = 0; j < 5; j++) {
                topTeamList[j] = rankCard[j];
            }
        }

        this.setData({
            topTeamList: topTeamList,
            rankCard: rankCard
        });
    },

    onTeamsCallBack: function (res) {
        if (res != null && res.length != 0) {
            var teamlist = new Array(res.length);
            for (var j = 0; j < res.length; j++) {
                try {
                    teamlist[j] = {
                        teamNumber: res[j].team_number,
                        teamName: res[j].nickname,
                        teamLocation: `${res[j].city}, ${res[j].state_prov}, ${
                            res[j].country
                            }`
                    };
                } catch (e) { }
            }
            teamlist.sort(app.globalMethod.teamArraySort);
            this.setData({
                teamlist: teamlist
            });

            //只有teamlist加载完了才去请求rank
            var rankingApi = `event/${this.data.eventIndex.eventYear}${
                this.data.eventIndex.eventCode
                }/teams/statuses`;
            app.globalMethod.httpsRequest(rankingApi, this.onRankingCallBack);
        }
    },

    onTeamCardClick: function (e) {
        var index = e.currentTarget.dataset.id;
        var eventIndex = encodeURIComponent(JSON.stringify(this.data.eventIndex));
        var team = encodeURIComponent(JSON.stringify(this.data.teamlist[index]));
        wx.navigateTo({
            url: `/pages/teamAtEvent/teamAtEvent?eventIndex=${eventIndex}&team=${team}`
        });
    },

    onCollapseChange(event) {
        this.setData({
            activeNames: event.detail
        });
    },

    onSaveStatus: function () {
        if (!this.data.dataBase) {
            app.set({
                key: "e" +
                    this.data.eventIndex.eventYear +
                    this.data.eventIndex.eventCode,
                data: {
                    eventIndex: this.data.eventIndex,
                    topTeamList: this.data.topTeamList
                }
            },
                () => {
                    wx.showToast({
                        title: "收藏成功,返回首页即可查看",
                        icon: "none",
                        duration: 2000
                    });

                    this.setData({
                        dataBase: !this.data.dataBase
                    });
                }
            );
        } else {
            var key =
                "e" + this.data.eventIndex.eventYear + this.data.eventIndex.eventCode;
            app.remove(
                key,
                () => {
                    wx.showToast({
                        title: "取消收藏",
                        icon: "none",
                        duration: 2000
                    });

                    this.setData({
                        dataBase: !this.data.dataBase
                    });
                },
                () => {
                    wx.showToast({
                        title: "无收藏，无法删除",
                        icon: "none",
                        duration: 2000
                    });
                }
            );
        }
    },

    onPinButtonClick: function () {
        this.onSaveStatus();
    }
});