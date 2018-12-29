var app = getApp();
// pages/teamDetail/teamDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        eventInfo: Array,
        teamIndex: Object,
        teamYearArray: Array
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var teamInfo = JSON.parse(decodeURIComponent(options.teamInfo));
        var teamapi = `team/frc${teamInfo.teamNumber}`;
        var eventapi = `team/frc${teamInfo.teamNumber}/events`
        if (teamInfo.teamNumber != null)
            wx.setNavigationBarTitle({
                title: "Team " + teamInfo.teamNumber
            })
        app.globalMethod.httpsRequest(app, teamapi, this.onTeamCallBack);
        app.globalMethod.httpsRequest(app, eventapi, this.onEventCallBack);
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

    onEventCardClick: function (e) {
        var index = e.currentTarget.id;
        var eventInfo = encodeURIComponent(JSON.stringify(this.data.eventInfo[index]));
        var teamIndex = encodeURIComponent(JSON.stringify(this.data.teamIndex));
        wx.navigateTo({
            url: `/pages/teamAtEvent/teamAtEvent?eventIndex=${eventInfo}&team=${teamIndex}`
        })
    },

    onTeamCallBack: function (res) {
        var teamIndex = {
            teamNumber: res.team_number,
            teamName: res.nickname,
            registedLocation: `${res.city}, ${res.state_prov}, ${res.country}`,
            organization: res.name,
        }
        this.setData({
            teamIndex: teamIndex,
        })
    },

    onEventCallBack: function (res) {
        var eventIndex = new Array(res.length);
        var teamYearArray = new Array();
        var lastyear = (res.length >= 1) ? res[0].year : null;
        if (lastyear != null) teamYearArray.push(lastyear);
        for (var j = 0; j < res.length; j++) {
            if (res[j].year != lastyear)
                teamYearArray.push(res[j].year);
            lastyear = res[j].year;
        }
        teamYearArray.reverse();
        this.setData({
            teamYearArray: teamYearArray
        })
    },

    onEventatYearCallback: function (res) {
        var eventInfo = new Array(res.length);
        for (var j = 0; j < res.length; j++) {
            var eventStartDate =res[j].start_date.split("-");
            var eventEndDate = res[j].end_date.split("-");
            var startDate = new Date(eventStartDate[0],eventStartDate[1]-1,eventStartDate[2]);
            var endDate = new Date(eventEndDate[0],eventEndDate[1]-1,eventEndDate[2]);
            var startMonth = startDate.toDateString().split(" ")[1]
            var endMonth = endDate.toDateString().split(" ")[1]
            eventInfo[j] = {
                eventTitle: res[j].name,
                eventLocationShort: `${res[j].city}, ${res[j].state_prov}, ${res[j].country}`,
                eventStartDate: startMonth + " " + eventStartDate[2],
                eventEndDate: endMonth + " " + eventEndDate[2],
                eventYear: res[j].year,
                eventCode: res[j].event_code,
                startDateObj : startDate,
                endDateObj : endDate
            }
        }
        eventInfo.sort(app.globalMethod.eventsAtYearSort);
        this.setData({
            eventInfo: eventInfo
        })
    },

    getTeamYear: function (e) {
        var index = e.detail;
        var eventAtYearApi = `team/frc${this.data.teamIndex.teamNumber}/events/${this.data.teamYearArray[index]}`;
        app.globalMethod.httpsRequest(app, eventAtYearApi, this.onEventatYearCallback);
    }
})