var app = getApp();
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
        var that = this;
        var callback = function (res) {
            var eventInfo = new Array(res.data.length);
            for (var j = 0; j < res.data.length; j++) {
                var info = res.data[j];
                var eventStartDate = info.start_date.split("-");
                var eventEndDate = info.end_date.split("-");
                var startDate = new Date(eventStartDate[0], eventStartDate[1] - 1, eventStartDate[2]);
                var endDate = new Date(eventEndDate[0], eventEndDate[1] - 1, eventEndDate[2]);
                var startMonth = startDate.toDateString().split(" ")[1]
                var endMonth = endDate.toDateString().split(" ")[1]
                eventInfo[j] = {
                    eventTitle: info.name,
                    eventLocationShort: `${info.city} ${info.state_prov} ${info.country}`,
                    eventStartDate: startMonth + " " + eventStartDate[2],
                    eventEndDate: endMonth + " " + eventEndDate[2],
                    eventYear: info.year,
                    eventCode: info.event_code,
                    startDateObj: startDate,
                    endDateObj: endDate
                }
            }
            eventInfo.sort(app.globalMethod.eventsAtYearSort);
            that.setData({
                eventInfo : eventInfo
            })
        }
        var data = app.dataBaseMethod.search("event", event.detail, callback);
        //TODO: 请求服务器模糊搜索函数,返回一个eventInfo数组，以下为假数据
        // var eventInfo = [
        //     {
        //         eventTitle : "Shenzhen Regional",
        //         eventLocationShort : "Shenzhen Shi, Guangdong Sheng, China",
        //         eventStartDate : "Mar 07",
        //         eventEndDate : "Mar 10",
        //         eventYear: 2018,
        //         eventCode: code
        //     }
        //     ,
        //     {
        //         eventTitle : "Shenzhen Regional",
        //         eventLocationShort : "Shenzhen Shi, Guangdong Sheng, China",
        //         eventStartDate : "Mar 07",
        //         eventEndDate : "Mar 10",
        //         eventYear: 2017,
        //         eventCode: code
        //     }
        // ]
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