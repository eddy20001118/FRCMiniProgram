var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title : String
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        app.getInfo((res)=>{
            var currentSize = res.currentSize.toFixed(2);
            that.setData({
                title : `清除缓存 (${currentSize}KB)`
            })
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

    onFreeCacheClick: function () {
        app.clear(() => wx.showToast({
            title: '清除缓存成功',
            icon: 'none',
            duration: 2000
        }));
        this.setData({
            title : `清除缓存 (0.00KB)`
        })
    }
})