var app = getApp();
// pages/eventDetail/eventDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        teamlist: Array,
        eventIndex: Object,
        rankCard: Object,
        allianceCard: Object,
        awardCard: Object,
        match: Object,
        activeNames: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var eventInfo = JSON.parse(decodeURIComponent(options.eventInfo));

        var summaryApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}`;


        if (eventInfo.eventTitle != null)
            wx.setNavigationBarTitle({
                title: eventInfo.eventTitle
            })

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
        var alliancesApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}/alliances`;
        var awardsApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}/awards`
        var matchesApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}/matches/simple`;
        var teamListApi = `event/${eventInfo.eventYear}${eventInfo.eventCode}/teams`;
        app.globalMethod.httpsRequest(app, teamListApi, this.onTeamsCallBack);
        app.globalMethod.httpsRequest(app, alliancesApi, this.onAlliancesCallBack);
        app.globalMethod.httpsRequest(app, awardsApi, this.onAwardsCallBack);
        app.globalMethod.httpsRequest(app, matchesApi, this.onMatchesCallBack);
    },

    onTabChange: function (e) {
        var activeTab = e.detail.index;
    },

    onAwardsCallBack: function (res) {
        var awardCard = new Array(res.length);
        for (var j = 0; j < res.length; j++) {
            var awardTeamList = new Array(res[j].recipient_list.length);
            for (var i = 0; i < res[j].recipient_list.length; i++) {
                var teamNumber = res[j].recipient_list[i].team_key;
                var awardee = res[j].recipient_list[i].awardee
                teamNumber = (teamNumber != null) ? teamNumber.replace("frc", "") : null;
                awardTeamList[i] = {
                    teamNumber: teamNumber,
                    awardee : awardee
                }
            }

            awardCard[j] = {
                awardTitle: res[j].name,
                awardTeamList: awardTeamList
            }
        }
        this.setData({
            awardCard : awardCard
        })
    },

    onSummaryCallBack: function (res) {
        var eventStartDate = res.start_date.split("-");
        var eventEndDate = res.end_date.split("-");
        var startDate = new Date(eventStartDate[0], eventStartDate[1] - 1, eventStartDate[2]);
        var endDate = new Date(eventEndDate[0], eventEndDate[1] - 1, eventEndDate[2]);
        var startMonth = startDate.toLocaleString('en-us', { month: 'short' });
        var endMonth = endDate.toLocaleString('en-us', { month: 'short' })
        var eventIndex = {
            eventTitle: res.name,
            eventLocation: res.address,
            eventStartDate: startMonth + " " + eventStartDate[2],
            eventEndDate: endMonth + " " + eventEndDate[2],
            eventYear: res.year,
            eventCode: res.event_code,
        }
        this.setData({
            eventIndex: eventIndex
        })

        //只有summary加载完了才会完成其他的请求
        this.onLoadOtherRequests(eventIndex);
    },

    onAlliancesCallBack: function (res) {
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
    },

    onMatchesCallBack: function (res) {
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
    },

    onRankingCallBack: function (res) {
        var teamList = this.data.teamlist;
        var rankCard = new Array(teamList.length);
        for (var j = 0; j < teamList.length; j++) {
            var sortOrders = res["frc" + teamList[j].teamNumber].qual.ranking.sort_orders;
            var rankScore = sortOrders[0];
            rankCard[j] = {
                team: [teamList[j].teamName, teamList[j].teamNumber],
                rank: res["frc" + teamList[j].teamNumber].qual.ranking.rank,
                rankScore: rankScore
            }
        }
        rankCard.sort(app.globalMethod.ranksArraySort);
        this.setData({
            rankCard: rankCard
        })
    },

    onTeamsCallBack: function (res) {
        var teamlist = new Array(res.length);
        for (var j = 0; j < res.length; j++) {
            teamlist[j] = {
                teamNumber: res[j].team_number,
                teamName: res[j].nickname,
                teamLocation: `${res[j].city}, ${res[j].state_prov}, ${res[j].country}`
            }
        }
        this.setData({
            teamlist: teamlist
        })
        
        //只有teamlist加载完了才去请求rank
        var rankingApi = `event/${this.data.eventIndex.eventYear}${this.data.eventIndex.eventCode}/teams/statuses`;
        app.globalMethod.httpsRequest(app, rankingApi, this.onRankingCallBack);
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
    }
})