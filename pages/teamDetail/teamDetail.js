// pages/teamDetail/teamDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        windowsTitle : String,
        eventInfo: {
            isEmpty : true
            /* eventTitle: "Shenzhen Regional",
            eventLocation: "Shenzhen Shi, Guangdong Sheng, China",
            eventStartDate: "Mar 7",
            eventEndDate: "Mar 10",
            eventYear: "2019" */
        },
        teamIndex : {
            /* teamNumber : String,
            teamName : "Pharma Atom Storm",
            registedLocation : "Shenzhen, Guangdong, China", 
            organization  :"Atom Creative Town&Atom robot education",
            teamYearArray : ["2019","2018","2017"] */
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            teamIndex: {
                teamNumber: options.teamNumber,
                teamName: "Pharma Atom Storm",
                registedLocation: "Shenzhen, Guangdong, China",
                organization: "Atom Creative Town&Atom robot education",
                teamYearArray: ["2019", "2018", "2017"]
            }
        })
        if (options.teamNumber != null)
            wx.setNavigationBarTitle({
                title: "Team " + options.teamNumber 
            })
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
        wx.navigateTo({
            url: `/pages/teamAtEvent/teamAtEvent?eventName=${this.data.eventInfo.eventTitle}&teamNumber=${this.data.teamIndex.teamNumber}`,
        })
    },

    getTeamYear: function (e){
        this.setData({
            eventInfo: {
                eventTitle: "Shenzhen Regional",
                eventLocation: "Shenzhen Shi, Guangdong Sheng, China",
                eventStartDate: "Mar 7",
                eventEndDate: "Mar 10",
                eventYear: e.detail
            }
        })
    }
})