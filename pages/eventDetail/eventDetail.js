// pages/eventDetail/eventDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        windowsTitle : String,
        teamlist: [
            {
            teamNumber: "6766",
            teamName: "Pharma Atom Storm",
            teamLocation: "Shenzhen, Guangdong, China"
            }, 
            {
                teamNumber: "5555",
                teamName: "Pharma Atom Storm",
                teamLocation: "Shenzhen, Guangdong, China"
            }, 
            {
                teamNumber: "4444",
                teamName: "Pharma Atom Storm",
                teamLocation: "Shenzhen, Guangdong, China"
            }, 
            {
                teamNumber: "3333",
                teamName: "Pharma Atom Storm",
                teamLocation: "Shenzhen, Guangdong, China"
            }/*  */],
        eventIndex : {
            eventTitle : "Shenzhen Regional",
            eventLocation : "Tuanjie Rd, Longgang Qu, Shenzhen Shi, Guangdong Sheng, China, 518118",
            eventStartDate : "Mar 7",
            eventEndDate : "Mar 10",
            eventYear : "2019"
        },
        activeNames : ["1"]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.eventName != null)
            wx.setNavigationBarTitle({
                title: options.eventName
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

    }
})