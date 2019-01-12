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
        dataBase: Boolean,
        height: Number,
        fabSubButtons:
            [{
                className: 'share',
                label: 'Share',
                icon: '/res/icons/pin/share.png',
                openType: 'share'
            },
            {
                className: 'pinHome',
                label: 'Pin to home',
                icon: '/res/icons/pin/pin.png'
            }]
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
                })
            }
        })
        try {
            var teamInfo = JSON.parse(decodeURIComponent(options.teamInfo));
            var teamapi = `team/frc${teamInfo.teamNumber}`;

            if (teamInfo.teamNumber != null) {
                wx.setNavigationBarTitle({
                    title: "Team " + teamInfo.teamNumber
                })
            }

            var key = "t" + teamInfo.teamNumber;
            app.get(key, (value) => {
                this.data.fabSubButtons[1].icon = "/res/icons/pin/gou.png"
                this.setData({
                    fabSubButtons: this.data.fabSubButtons,
                    dataBase: true
                })
                console.log("已有收藏")
            }, () => {
                this.data.fabSubButtons[1].icon = "/res/icons/pin/pin.png"
                this.setData({
                    fabSubButtons: this.data.fabSubButtons,
                    dataBase: false
                })
                console.log("无已有收藏")
            })
            app.globalMethod.httpsRequest(teamapi, this.onTeamCallBack);
        } catch (e) { console.log(e) }
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
    onShareAppMessage: function (e) {
        if (this.data.teamIndex != null) {
            try {
                var teamIndex = this.data.teamIndex;
                var encodedTeamIndex = encodeURIComponent(JSON.stringify(teamIndex));
                return {
                    title: `点击查看 Team${teamIndex.teamNumber} 的详细信息`,
                    path: `/pages/teamDetail/teamDetail?teamInfo=${encodedTeamIndex}`
                }
            } catch (e) {
                console.log(e)
            }
        } else {
            wx.showToast({
                title: '请稍候',
                icon: 'none',
                duration: 2000
            })
        }
    },

    onEventCardClick: function (e) {
        var index = e.currentTarget.id;
        var eventInfo = encodeURIComponent(JSON.stringify(this.data.eventInfo[index]));
        var teamIndex = encodeURIComponent(JSON.stringify(this.data.teamIndex));
        wx.navigateTo({
            url: `/pages/teamAtEvent/teamAtEvent?eventIndex=${eventInfo}&team=${teamIndex}&id=team`
        })
    },

    onTeamCallBack: function (res) {
        if (res != null) {
            try { var teamNumber = res.team_number; } catch (error) { }
            try { var teamName = res.nickname; } catch (error) { }
            try { var teamLocation = `${res.city}, ${res.state_prov}, ${res.country}`; } catch (error) { }
            try { var organization = res.name; } catch (error) { }

            var teamIndex = {
                teamNumber: teamNumber,
                teamName: teamName,
                teamLocation: teamLocation,
                registedLocation: teamLocation,
                organization: organization,
            }
            this.setData({
                teamIndex: teamIndex,
            })
            try {
                var eventapi = `team/frc${this.data.teamIndex.teamNumber}/events`
                app.globalMethod.httpsRequest(eventapi, this.onEventCallBack);
            } catch (error) {

            }
        }
    },

    onEventCallBack: function (res) {
        var teamYearArray = new Array();
        var lastyear = (res.length >= 1) ? res[0].year : null;
        if (lastyear != null) {
            teamYearArray.push(lastyear);
            for (var j = 0; j < res.length; j++) {
                try {
                    if (res[j].year != lastyear)
                        teamYearArray.push(res[j].year);
                    lastyear = res[j].year;
                } catch (error) {

                }
            }
            teamYearArray.reverse();
        } else {
            teamYearArray.push("No event info found");
        }
        this.setData({
            teamYearArray: teamYearArray
        })
        this.getTeamYear({
            detail: 0
        })
    },

    onEventatYearCallback: function (res) {
        var eventInfo = new Array(res.length);
        for (var j = 0; j < res.length; j++) {
            try {
                var startDate = new Date(res[j].start_date);
                var endDate = new Date(res[j].end_date);
            } catch (error) { }

            eventInfo[j] = {
                eventTitle: res[j].name,
                eventLocationShort: `${res[j].city}, ${res[j].state_prov}, ${res[j].country}`,
                eventStartDate: startDate.toDateString().split(" ")[1] + " " + startDate.getDate(),
                eventEndDate: endDate.toDateString().split(" ")[1] + " " + endDate.getDate(),
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
            //如果没有收藏
            app.set({
                key: "t" + this.data.teamIndex.teamNumber,
                data: this.data.teamIndex
            }, () => {
                wx.showToast({
                    title: '收藏成功,返回首页即可查看',
                    icon: 'none',
                    duration: 2000
                });
                try {
                    this.data.fabSubButtons[1].icon = "/res/icons/pin/gou.png"
                    this.setData({
                        dataBase: !this.data.dataBase
                    })
                } catch (error) {
                    console.log(e);
                }
            })
        } else {
            var key = "t" + this.data.teamIndex.teamNumber;
            app.remove(key, () => {
                wx.showToast({
                    title: '取消收藏',
                    icon: 'none',
                    duration: 2000
                });
                try {
                    this.data.fabSubButtons[1].icon = "/res/icons/pin/pin.png"
                    this.setData({
                        dataBase: !this.data.dataBase
                    })
                } catch (error) {
                    console.log(e);
                }
            }, () => {
                wx.showToast({
                    title: '无收藏，无法删除',
                    icon: 'none',
                    duration: 2000
                });
            });
        }
    },

    getTeamYear: function (e) {
        var index = e.detail;
        if (this.data.teamYearArray[index] != "No event info found") {
            var eventAtYearApi = `team/frc${this.data.teamIndex.teamNumber}/events/${this.data.teamYearArray[index]}`;
            app.globalMethod.httpsRequest(eventAtYearApi, this.onEventatYearCallback);
        }
    },

    onfabClick: function (e) {
        var clickedButton = e.detail.value.className;
        if (clickedButton == "pinHome") {
            this.onSaveStatus();
        } else if (clickedButton == "share") {
            //这里什么都不用做，因为当选中“分享”标签时会自动触发onShareAppMessage方法
            //留在这里是为了占位，便于理解，程序实际不会执行到这里
        }
    },

    onfabRefresh: function () {
        this.setData({
            fabSubButtons: this.data.fabSubButtons
        })
    }
})