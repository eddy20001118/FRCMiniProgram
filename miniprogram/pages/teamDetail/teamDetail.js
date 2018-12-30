var app = getApp();
// pages/teamDetail/teamDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        eventInfo: Array,
        teamIndex: Object,
        teamYearArray: Array,
        dataBase: Boolean
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

        var that = this;
        var key = "t" + teamInfo.teamNumber;
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
            teamLocation: `${res.city}, ${res.state_prov}, ${res.country}`,
            registedLocation: `${res.city}, ${res.state_prov}, ${res.country}`,
            organization: res.name,
            //TODO: 完善matchCard信息请求
            matchCard: {
                matchType: ["Qual", "11"],
                redAlliance: [6766, 6666, 6566],
                blueAlliance: [6866, 6966, 7066],
                score: [312, 300]
            }
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
            var eventStartDate = res[j].start_date.split("-");
            var eventEndDate = res[j].end_date.split("-");
            var startDate = new Date(eventStartDate[0], eventStartDate[1] - 1, eventStartDate[2]);
            var endDate = new Date(eventEndDate[0], eventEndDate[1] - 1, eventEndDate[2]);
            var startMonth = startDate.toDateString().split(" ")[1]
            var endMonth = endDate.toDateString().split(" ")[1]
            eventInfo[j] = {
                eventTitle: res[j].name,
                eventLocationShort: `${res[j].city}, ${res[j].state_prov}, ${res[j].country}`,
                eventStartDate: startMonth + " " + eventStartDate[2],
                eventEndDate: endMonth + " " + eventEndDate[2],
                eventYear: res[j].year,
                eventCode: res[j].event_code,
                startDateObj: startDate,
                endDateObj: endDate
            }
        }
        eventInfo.sort(app.globalMethod.eventsAtYearSort);
        this.setData({
            eventInfo: eventInfo
        })
    },

    onSaveStatus: function () {
        if (!this.data.dataBase) {
            var data = {
                key: "t" + this.data.teamIndex.teamNumber,
                data: this.data.teamIndex
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
            var key = "t" + this.data.teamIndex.teamNumber;
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
    },

    getTeamYear: function (e) {
        var index = e.detail;
        var eventAtYearApi = `team/frc${this.data.teamIndex.teamNumber}/events/${this.data.teamYearArray[index]}`;
        app.globalMethod.httpsRequest(app, eventAtYearApi, this.onEventatYearCallback);
    }
})