var app = getApp();
Page({
    data: {
        teamInfo: {
            teamNumber: "6766",
            teamName: "Pharma Atom Storm",
            teamLocation: "Shenzhen, Guangdong, China"
        },
        eventInfo: {
            eventTitle: "Shenzhen Regional",
            eventLocation: "Shenzhen Shi, Guangdong Sheng, China",
            eventStartDate: "Mar 7",
            eventEndDate: "Mar 10",
            eventYear: "2019"
        },
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
        matchCard: {
            matchType: ["Qual", "11"],
            redAlliance: [6766, 6666, 6566],
            blueAlliance: [6866, 6966, 7066],
            score: [312, 300]
        }
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
        wx.navigateTo({
            url: `/pages/eventDetail/eventDetail?eventInfo=${eventInfo}`
        })
    },
    onTeamCardClick: function () {
        var teamInfo = encodeURIComponent(JSON.stringify(this.data.teamInfo));
        wx.navigateTo({
            url: `/pages/teamDetail/teamDetail?teamInfo=${teamInfo}`
        })
    },
    onRequireData: function (options) {
        //TODO: 读取保存到缓存的数据
    }
})
