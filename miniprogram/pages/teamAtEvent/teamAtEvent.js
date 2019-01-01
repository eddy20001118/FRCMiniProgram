var app = getApp();
// pages/teamAtEvent/teamAtEvent.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        eventIndex: Object,
        team: Object,
        awardCard: null,
        summaryInfo: Object,
        statusInfo: Object,
        match: Object,
        activeNames: [], //折叠面板激活
        activeTab: Number,
        height : Number
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
		wx.getSystemInfo({
            success : res =>{
                that.setData({
                    height : res.windowHeight-44
                })
            }
        })
        var eventIndex = JSON.parse(decodeURIComponent(options.eventIndex));
        var team = JSON.parse(decodeURIComponent(options.team));
        var summaryApi = `team/frc${team.teamNumber}/event/${eventIndex.eventYear}${eventIndex.eventCode}/status`;
        var awardsApi = `team/frc${team.teamNumber}/event/${eventIndex.eventYear}${eventIndex.eventCode}/awards`
        var statusApi = `event/${eventIndex.eventYear}${eventIndex.eventCode}/oprs`;
        var matchesApi = `team/frc${team.teamNumber}/event/${eventIndex.eventYear}${eventIndex.eventCode}/matches/simple`;
        if (eventIndex != null) {
            this.setData({
                eventIndex: eventIndex
            })
        }

        if (team != null) {
            this.setData({
                team: team
            })
        }

        wx.setNavigationBarTitle({
            title: this.data.eventIndex.eventTitle + " " + this.data.team.teamNumber
        });

        app.globalMethod.httpsRequest(awardsApi, this.onAwardsCallback);
        app.globalMethod.httpsRequest(summaryApi, this.onSummaryCallback);
        app.globalMethod.httpsRequest(matchesApi, this.onMatchesCallback);
        app.globalMethod.httpsRequest(statusApi, this.onStatusCallback);
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

    onCollapseChange: function (event) {
        this.setData({
            activeNames: event.detail
        })
    },

    onTabChange: function (e) {
        var activeTab = e.detail.index;
    },

    onStatusCallback: function (res) {
        if (res != null) {
            var teamKey = `frc${this.data.team.teamNumber}`
            try { var opr = res.oprs[teamKey].toFixed(2); } catch (e) { }
            try { var dpr = res.dprs[teamKey].toFixed(2); } catch (e) { }
            try { var ccwm = res.ccwms[teamKey].toFixed(2); } catch (e) { }
            var statusInfo = {
                opr: opr,
                dpr: dpr,
                ccwm: ccwm
            }

            this.setData({
                statusInfo: statusInfo
            })
        }
    },

    onMatchesCallback: function (res) {
        if (res != null && res.length > 0) {
            var match = {
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

            this.setData({
                match: match
            })
        }
    },

    onSummaryCallback: function (res) {
        if (res != null) {
            try { var qualrecord = [res.qual.ranking.record.wins, res.qual.ranking.record.losses, res.qual.ranking.record.ties] } catch (e) { }
            try { var allianceStatus = app.globalMethod.dataFilter(res.alliance_status_str); } catch (e) { }
            try { var status = (res.playoff_status_str == "--") ? app.globalMethod.dataFilter(res.overall_status_str) : app.globalMethod.dataFilter(res.playoff_status_str); } catch (e) { }
            try { var award = this.data.awardCard.length; } catch (e) { }
            try { var rank = res.qual.ranking.rank; } catch (e) { }
            var summaryInfo = {
                rank: rank,
                award: award,
                qualrecord: qualrecord,
                alliance: allianceStatus,
                status: status
            }
            this.setData({
                summaryInfo: summaryInfo
            })
        }
    },

    onAwardsCallback: function (res) {
        if (res != null && res.length != 0) {
            var awardCard = new Array(res.length);
            for (var j = 0; j < res.length; j++) {
                if (res[j].recipient_list != null) {
                    var awardTeamList = new Array(res[j].recipient_list.length);
                    for (var i = 0; i < res[j].recipient_list.length; i++) {
                        try { var teamNumber = res[j].recipient_list[i].team_key; } catch (e) { }
                        try { var awardee = res[j].recipient_list[i].awardee } catch (e) { }
                        teamNumber = (teamNumber != null) ? teamNumber.replace("frc", "") : null;
                        awardTeamList[i] = {
                            teamNumber: teamNumber,
                            awardee: awardee
                        }
                    }

                    try {
                        var awardTitle = res[j].name
                    } catch (error) {

                    }
                    awardCard[j] = {
                        awardTitle: awardTitle,
                        awardTeamList: awardTeamList
                    }
                }
            }
            this.data.summaryInfo.award = res.length;
            this.setData({
                awardCard: awardCard,
                summaryInfo: this.data.summaryInfo
            })
        }
    },
})