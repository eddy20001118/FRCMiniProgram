// pages/teamDetail/teamDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        windowsTitle: String,
        eventInfo: Object,
        teamIndex: Object
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.onRequireData(options);
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

    onEventCardClick: function () {
        var eventInfo = encodeURIComponent(JSON.stringify(this.data.eventInfo));
        var teamIndex = encodeURIComponent(JSON.stringify(this.data.teamIndex));
        wx.navigateTo({
            url: `/pages/teamAtEvent/teamAtEvent?eventIndex=${eventInfo}&team=${teamIndex}`
        })
    },

    onRequireData: function (options) {
        //TODO: 换成从服务器请求来的数据
        var teamInfo = JSON.parse(decodeURIComponent(options.teamInfo));
        this.setData({
            teamIndex: {
                teamNumber: teamInfo.teamNumber,
                teamName: teamInfo.teamName,
                teamLocation: teamInfo.teamLocation,
                registedLocation: "Shenzhen, Guangdong, China",
                organization: "Atom Creative Town&Atom robot education",
                teamYearArray: ["2019", "2018", "2017"]
            },
            eventInfo: {
                eventTitle: "Shenzhen Regional",
                eventLocation: "Shenzhen Shi, Guangdong Sheng, China",
                eventStartDate: "Mar 7",
                eventEndDate: "Mar 10"
            }
        })
        if (teamInfo.teamNumber != null)
            wx.setNavigationBarTitle({
                title: "Team " + teamInfo.teamNumber
            })
    },
    onCallBack: function () {

    },

    getTeamYear: function (e) {
        this.data.eventInfo.eventYear = e.detail;
        this.setData({
            eventInfo: this.data.eventInfo
        })
    }
})