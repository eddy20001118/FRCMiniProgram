var app = getApp();
Page({
    data: {
        search: "",
        eventInfoCache: new Array(),
        eventInfo: Array,
        height: Number,
        search: String,
        eventLoadIndex: Number,
        chooseEventYear: new Date().getFullYear(),
        loadFinish: false
    },

    onLoad: function (options) {
        var that = this;
        wx.getSystemInfo({
            success: res => {
                that.setData({
                    height: res.windowHeight - 44
                })
            }
        })
        //this.onLoadEvent(0);
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
        // this.setData({
        //     loadFinish: false
        // })
        // this.onLoadEvent(this.data.eventLoadIndex);
        // console.log("reach bottom");
    },

    onShareAppMessage: function () {

    },

    onSearch: function (event) {
        this.setData({
            loadFinish: false
        })
        var that = this;
        app.search("event", event.detail, (res) => {
            var eventInfo = new Array(res.data.length);
            for (var j = 0; j < res.data.length; j++) {
                var info = res.data[j];
                if (info != null) {
                    try {
                        var eventStartDate = info.start_date.split("-");
                        var eventEndDate = info.end_date.split("-");
                        var startDate = new Date(eventStartDate[0], eventStartDate[1] - 1, eventStartDate[2]);
                        var endDate = new Date(eventEndDate[0], eventEndDate[1] - 1, eventEndDate[2]);
                        var startMonth = startDate.toDateString().split(" ")[1]
                        var endMonth = endDate.toDateString().split(" ")[1]
                    } catch (error) { }

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
            }
            eventInfo.sort(app.globalMethod.eventsAtYearSort);
            that.setData({
                eventInfo: eventInfo,
                search: event.detail,
                eventInfoCache: new Array(),
                eventLoadIndex: 0,
                loadFinish: true
            })
        });
    },
    onCancel: function () {
        this.setData({
            search: null,
            eventInfo: null
        })
    },
    onEventCardClick: function (e) {
        var index = e.currentTarget.id;
        var curInfo = encodeURIComponent(JSON.stringify(this.data.eventInfo[index]))
        wx.navigateTo({
            url: `/pages/eventDetail/eventDetail?eventInfo=${curInfo}`
        })
    },
    onLoadEvent: function (index) {
        var that = this;
        app.getDbEvent(index, that.data.chooseEventYear,
            (res, isEmpty) => {
                if (!isEmpty) {
                    var eventInfo = that.data.eventInfoCache
                    for (var j = 0; j < res.data.length; j++) {
                        var info = res.data[j];
                        if (info != null) {
                            try {
                                var eventStartDate = info.start_date.split("-");
                                var eventEndDate = info.end_date.split("-");
                                var startDate = new Date(eventStartDate[0], eventStartDate[1] - 1, eventStartDate[2]);
                                var endDate = new Date(eventEndDate[0], eventEndDate[1] - 1, eventEndDate[2]);
                                var startMonth = startDate.toDateString().split(" ")[1]
                                var endMonth = endDate.toDateString().split(" ")[1]
                            } catch (error) { }

                            eventInfo.push({
                                eventTitle: info.name,
                                eventLocationShort: `${info.city} ${info.state_prov} ${info.country}`,
                                eventStartDate: startMonth + " " + eventStartDate[2],
                                eventEndDate: endMonth + " " + eventEndDate[2],
                                eventYear: info.year,
                                eventCode: info.event_code,
                                startDateObj: startDate,
                                endDateObj: endDate
                            })
                        }
                    }
                    eventInfo.sort(app.globalMethod.eventsAtYearSort);
                    that.setData({
                        eventInfo: eventInfo,
                        eventInfoCache: eventInfo,
                        eventLoadIndex: index + 10,
                        loadFinish: true
                    })
                } else {
                    console.log("is Empty")
                    that.setData({
                        loadFinish: true
                    })
                }
            },
            () => { })
    }
})