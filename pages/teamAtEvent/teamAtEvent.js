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
        statusInfo: Array,
        match: Object,
        activeNames: [], //折叠面板激活
        activeTab: Number
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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

        app.globalMethod.httpsRequest(app, awardsApi, this.onAwardsCallback);
        app.globalMethod.httpsRequest(app, summaryApi, this.onSummaryCallback);
        app.globalMethod.httpsRequest(app, matchesApi, this.onMatchesCallback);
        app.globalMethod.httpsRequest(app, statusApi, this.onStatusCallback);
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
        switch (activeTab) {
            case 1: //matches标签页要加载的内容比较多，所以滑到该页再加载

                break;
        }
    },

    onStatusCallback: function (res) {
        if (res != null) {
            var teamKey = `frc${this.data.team.teamNumber}`
            var statusInfo = new Array(3);
            statusInfo[0] = res.oprs[teamKey].toFixed(2);
            statusInfo[1] = res.dprs[teamKey].toFixed(2);
            statusInfo[2] = res.ccwms[teamKey].toFixed(2);
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
                    var qual = match.qual;
                    qual.push({
                        matchType: ["Qual", res[j].match_number],
                        redAlliance: this.teamFilter(res[j].alliances.red.team_keys),
                        blueAlliance: this.teamFilter(res[j].alliances.blue.team_keys),
                        score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                    })
                    qual.sort(app.globalMethod.matchesArraySort);
                } else if (res[j].comp_level == "qf") { //四分之一决赛
                    var quarter = match.quarter;
                    quarter.push({
                        matchType: ["quarter", res[j].match_number],
                        redAlliance: this.teamFilter(res[j].alliances.red.team_keys),
                        blueAlliance: this.teamFilter(res[j].alliances.blue.team_keys),
                        score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                    })
                    quarter.sort(app.globalMethod.matchesArraySort);
                } else if (res[j].comp_level == "sf") { //四分之一决赛
                    var semi = match.semi;
                    semi.push({
                        matchType: ["semi", res[j].match_number],
                        redAlliance: this.teamFilter(res[j].alliances.red.team_keys),
                        blueAlliance: this.teamFilter(res[j].alliances.blue.team_keys),
                        score: [res[j].alliances.red.score, res[j].alliances.blue.score]
                    })
                    semi.sort(app.globalMethod.matchesArraySort);
                } else if (res[j].comp_level == "f") { //四分之一决赛
                    var final = match.final;
                    final.push({
                        matchType: ["final", res[j].match_number],
                        redAlliance: this.teamFilter(res[j].alliances.red.team_keys),
                        blueAlliance: this.teamFilter(res[j].alliances.blue.team_keys),
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

    onSummaryCallback: function (res) {
        if (res != null) {
            var allianceStatus = this.dataFilter(res.alliance_status_str);
            var status = (res.playoff_status_str == "--") ? this.dataFilter(res.overall_status_str) : this.dataFilter(res.playoff_status_str);
            var award = (this.data.awardCard != null) ? this.data.awardCard.length : null;
            var rank = (res.qual!=null) ? res.qual.ranking.rank : null;
            var qualrecord = (res.qual!=null) ? [res.qual.ranking.record.wins, res.qual.ranking.record.losses, res.qual.ranking.record.ties] : null;
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
        if (res != null && res.length > 0) {
            var awardCard = new Array(res.length);
            for (var j = 0; j < res.length; j++) {
                var awardTeamList = new Array(res[j].recipient_list.length);
                for (var i = 0; i < res[j].recipient_list.length; i++) {
                    var teamNumber = res[j].recipient_list[i].team_key;
                    teamNumber = teamNumber.replace("frc", "");
                    awardTeamList[i] = {
                        teamNumber: teamNumber
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
})