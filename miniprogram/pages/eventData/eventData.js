Page({
    data: {
        search: "",
        eventInfo: Array,
    },

    onLoad: function (options) {

	},

	onReady: function () {

	},

	onShow: function () {

	},

	onHide: function () {

	},

	onUnload: function () {

	},

	onPullDownRefresh: function () {

	},

	onReachBottom: function () {

	},

	onShareAppMessage: function () {

    },
    
    onSearch: function (event) {
        var code = event.detail;
        //TODO: 请求服务器模糊搜索函数,返回一个eventInfo数组，以下为假数据
        var eventInfo = [
            {
                eventTitle : "Shenzhen Regional",
                eventLocationShort : "Shenzhen Shi, Guangdong Sheng, China",
                eventStartDate : "Mar 07",
                eventEndDate : "Mar 10",
                eventYear: 2018,
                eventCode: code
            }
            ,
            {
                eventTitle : "Shenzhen Regional",
                eventLocationShort : "Shenzhen Shi, Guangdong Sheng, China",
                eventStartDate : "Mar 07",
                eventEndDate : "Mar 10",
                eventYear: 2017,
                eventCode: code
            }
        ]

        this.setData({
            eventInfo : eventInfo
        })
    },
    onCancel: function () {
        this.setData({
            search: ""
        })
    },
    onEventCardClick: function (e) {
        var index = e.currentTarget.id;
        var curInfo = encodeURIComponent(JSON.stringify(this.data.eventInfo[index]))
        wx.navigateTo({
            url: `/pages/eventDetail/eventDetail?eventInfo=${curInfo}`
        })
    }
})