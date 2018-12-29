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
        topTeamList: Array,
        activeNames: [],
        dataBase: Boolean
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var eventInfo = JSON.parse(decodeURIComponent(options.eventInfo));


        var that = this;
        var key = "e" + eventInfo.eventYear + eventInfo.eventCode;
        var onSuccess = function (value) {
            that.setData({
                dataBase: true
            })
            console.log("已有收藏")
        }
        var onFail = function () {
            that.setData({
                dataBase: false
            })
            console.log("无已有收藏")
        }
        app.dataBaseMethod.get(key, onSuccess, onFail)


        var summaryApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}`;
        app.globalMethod.httpsRequest(app, summaryApi, this.onSummaryCallBack);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    onLoadOtherRequests: function (eventInfo) {
        var alliancesApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}/alliances`; //object
        var awardsApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}/awards` //list
        var matchesApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}/matches/simple`; //list
        var teamListApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}/teams`; //list
        app.globalMethod.httpsRequest(app, teamListApi, this.onTeamsCallBack);
        app.globalMethod.httpsRequest(app, alliancesApi, this.onAlliancesCallBack);
        app.globalMethod.httpsRequest(app, awardsApi, this.onAwardsCallBack);
        app.globalMethod.httpsRequest(app, matchesApi, this.onMatchesCallBack);
    },

    onTabChange: function (e) {
        var activeTab = e.detail.index;
    },

    onAwardsCallBack: function (res) {
        if (res != null && res.length != 0) {
            var awardCard = new Array(res.length);
            for (var j = 0; j < res.length; j++) {
                var awardTeamList = new Array(res[j].recipient_list.length);
                for (var i = 0; i < res[j].recipient_list.length; i++) {
                    var teamNumber = res[j].recipient_list[i].team_key;
                    var awardee = res[j].recipient_list[i].awardee
                    teamNumber = (teamNumber != null) ? teamNumber.replace("frc", "") : null;
                    awardTeamList[i] = {
                        teamNumber: teamNumber,
                        awardee: awardee
                    }
                }

                awardCard[j] = {
                    awardTitle: res[j].name,
                    awardTeamList: awardTeamList
                }
            }
            this.setData({
                awardCard: awardCard
            })
        }
    },

    onSummaryCallBack: function (res) {
        var eventStartDate = res.start_date.split("-");
        var eventEndDate = res.end_date.split("-");
        var startDate = new Date(eventStartDate[0], eventStartDate[1] - 1, eventStartDate[2]);
        var endDate = new Date(eventEndDate[0], eventEndDate[1] - 1, eventEndDate[2]);
        var startMonth = startDate.toDateString().split(" ")[1]
        var endMonth = endDate.toDateString().split(" ")[1]
        var eventIndex = {
            eventTitle: res.name,
            eventLocation: res.address,
            eventStartDate: startMonth + " " + eventStartDate[2],
            eventEndDate: endMonth + " " + eventEndDate[2],
            eventYear: res.year,
            eventCode: res.event_code,
            eventLocationShort: `${res.city}, ${res.state_prov}, ${res.country}`,
            //TODO: 补齐状态信息
            active: 1,
            steps: [
                {
                    text: '资格赛'
                },
                {
                    text: '四分之一决赛'
                },
                {
                    text: '半决赛'
                },
                {
                    text: '决赛'
                }
            ],
        }
        this.setData({
            eventIndex: eventIndex
        })
        if (eventIndex.eventTitle != null)
            wx.setNavigationBarTitle({
                title: eventIndex.eventTitle
            })
        //只有summary加载完了才会完成其他的请求
        this.onLoadOtherRequests(eventIndex);
    },

    onAlliancesCallBack: function (res) {
        if (res != null) {
            var allianceCard = new Array(res.length);
            for (var j = 0; j < res.length; j++) {
                var alliance = res[j].name.split(" ");
                var team = app.globalMethod.teamFilter(res[j].picks);
                allianceCard[j] = {
                    allianceNumber: alliance[1],
                    allianceTeam: team
                }
            }
            this.setData({
                allianceCard: allianceCard
            })
        }
    },

    onMatchesCallBack: function (res) {
        if (res != null && res.length != 0) {
            var match = {
                qual: new Array(),
                quarter: new Array(),
                semi: new Array(),
                final: new Array()
            }

            for (var j = 0; j < res.length; j++) {
                if (res[j].comp_level == "qm") { //资格赛
                    var qual = match.qual;
                    qual.push({
                        matchType: ["Qual", res[j].match_number],
                        redAlliance: app.globalMethod.teamFilter(res[j].alliances.red.team_keys),
                        blueAlliance: app.globalMethod.teamFilter(res[j].alliances.blue.team_keys),
                        score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                    })
                    qual.sort(app.globalMethod.matchesArraySort);
                } else if (res[j].comp_level == "qf") { //四分之一决赛
                    var quarter = match.quarter;
                    quarter.push({
                        matchType: ["Quarter", res[j].match_number],
                        redAlliance: app.globalMethod.teamFilter(res[j].alliances.red.team_keys),
                        blueAlliance: app.globalMethod.teamFilter(res[j].alliances.blue.team_keys),
                        score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                    })
                    quarter.sort(app.globalMethod.matchesArraySort);
                } else if (res[j].comp_level == "sf") { //四分之一决赛
                    var semi = match.semi;
                    semi.push({
                        matchType: ["Semi", res[j].match_number],
                        redAlliance: app.globalMethod.teamFilter(res[j].alliances.red.team_keys),
                        blueAlliance: app.globalMethod.teamFilter(res[j].alliances.blue.team_keys),
                        score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                    })
                    semi.sort(app.globalMethod.matchesArraySort);
                } else if (res[j].comp_level == "f") { //四分之一决赛
                    var final = match.final;
                    final.push({
                        matchType: ["Final", res[j].match_number],
                        redAlliance: app.globalMethod.teamFilter(res[j].alliances.red.team_keys),
                        blueAlliance: app.globalMethod.teamFilter(res[j].alliances.blue.team_keys),
                        score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                    })
                    final.sort(app.globalMethod.matchesArraySort);
                }
            }

            this.setData({
                match: match
            })
        }
    },

    onRankingCallBack: function (res) {
        var teamList = this.data.teamlist;
        var rankCard = new Array();

        for (var j = 0; j < teamList.length; j++) {
            if (res["frc" + teamList[j].teamNumber] != null) {
                if (res["frc" + teamList[j].teamNumber].qual != null) {
                    var sortOrders = res["frc" + teamList[j].teamNumber].qual.ranking.sort_orders;
                    var rankScore = sortOrders[0];
                    var rank = res["frc" + teamList[j].teamNumber].qual.ranking.rank
                    rankCard[j] = {
                        team: [teamList[j].teamName, teamList[j].teamNumber],
                        rank: rank,
                        rankScore: rankScore
                    }
                }
            }
        }
        rankCard.sort(app.globalMethod.ranksArraySort);

        if (rankCard.length < 5) {
            var topTeamList = new Array(rankCard.length);
            for (var j = 0; j < rankCard.length; j++) {
                topTeamList[j] = rankCard[j]
            }
        } else {
            var topTeamList = new Array(5);
            for (var j = 0; j < 5; j++) {
                topTeamList[j] = rankCard[j]
            }
        }
        this.setData({
            rankCard: rankCard,
            topTeamList: topTeamList
        })
    },

    onTeamsCallBack: function (res) {
        if (res != null && res.length != 0) {
            var teamlist = new Array(res.length);
            for (var j = 0; j < res.length; j++) {
                teamlist[j] = {
                    teamNumber: res[j].team_number,
                    teamName: res[j].nickname,
                    teamLocation: `${res[j].city}, ${res[j].state_prov}, ${res[j].country}`
                }
            }
            teamlist.sort(app.globalMethod.teamArraySort);
            this.setData({
                teamlist: teamlist
            })

            //只有teamlist加载完了才去请求rank
            var rankingApi = `event/${this.data.eventIndex.eventYear}${this.data.eventIndex.eventCode}/teams/statuses`;
            app.globalMethod.httpsRequest(app, rankingApi, this.onRankingCallBack);
        }
    },

    onTeamCardClick: function (e) {
        var index = e.currentTarget.dataset.id;
        var eventIndex = encodeURIComponent(JSON.stringify(this.data.eventIndex));
        var team = encodeURIComponent(JSON.stringify(this.data.teamlist[index]));
        wx.navigateTo({
            url: `/pages/teamAtEvent/teamAtEvent?eventIndex=${eventIndex}&team=${team}`,
        })
    },

    onCollapseChange(event) {
        this.setData({
            activeNames: event.detail
        })
    },

    onSaveStatus: function () {
        if (!this.data.dataBase) {
            var data = {
                key: "e" + this.data.eventIndex.eventYear + this.data.eventIndex.eventCode,
                data: this.data.eventIndex
            }
            var onSuccess = function () {
                wx.showToast({
                    title: '收藏成功,返回首页下拉刷新即可查看',
                    icon: 'none',
                    duration: 2000
                });
            }
            app.dataBaseMethod.set(data, onSuccess);
        } else {
            var key = "e" + this.data.eventIndex.eventYear + this.data.eventIndex.eventCode
            var onSuccess = function () {
                wx.showToast({
                    title: '取消收藏',
                    icon: 'none',
                    duration: 2000
                });
            }
            var onFail = function () {
                wx.showToast({
                    title: '无收藏，无法删除',
                    icon: 'none',
                    duration: 2000
                });
            }
            app.dataBaseMethod.remove(key, onSuccess, onFail);
        }
        this.setData({
            dataBase: !this.data.dataBase
        })
    },

    onPinButtonClick: function () {
        this.onSaveStatus();
    }
})