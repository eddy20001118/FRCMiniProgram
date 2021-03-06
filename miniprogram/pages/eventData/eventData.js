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
        chooseMonth: "",
        chooseCountry: "",
        loadFinish: false,
        isSearch: Boolean,
        filteritems: Array,
        currentScrollPosition: 0
    },

    onLoad: function (options) {
        var that = this;
        wx.getSystemInfo({
            success: res => {
                that.setData({
                    height: res.windowHeight - 84
                })
            }
        })
        this.initFilterItems();
        this.onLoadEvent(0, "Add");
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
        //不是搜索状态且上一次加载完成了才进行下一次加载
		if (!this.data.isSearch && this.data.loadFinish) {
            this.setData({
                loadFinish: false
            })
            this.onLoadEvent(this.data.eventLoadIndex, "Add");
        }
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
                        var startDate = new Date(info.start_date);
                        var endDate = new Date(info.end_date);
                    } catch (error) { }

                    eventInfo[j] = {
                        eventTitle: info.name,
                        eventLocationShort: `${info.city} ${info.state_prov} ${info.country}`,
                        eventStartDate: startDate.toDateString().split(" ")[1] + " " + startDate.getDate(),
                        eventEndDate: endDate.toDateString().split(" ")[1] + " " + endDate.getDate(),
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
                isSearch: true,
                loadFinish: true
            })
        });
    },
    onCancel: function () {
        this.setData({
            search: null,
            eventInfo: null,
            eventInfoCache: null,
            eventLoadIndex: 0,
            loadFinish: false,
            isSearch: false
        })
        this.onLoadEvent(0, "Refresh")
    },
    onEventCardClick: function (e) {
        var index = e.currentTarget.id;
        var curInfo = encodeURIComponent(JSON.stringify(this.data.eventInfo[index]))
        wx.navigateTo({
            url: `/pages/eventDetail/eventDetail?eventInfo=${curInfo}`
        })
    },
    onLoadEvent: function (index, loadMethod) {
        var that = this;
        app.getDbEvent(index, {
            eventYear: that.data.chooseEventYear,
            eventMonth: that.data.chooseMonth,
            country: that.data.chooseCountry
        },
            (res) => {
                if (loadMethod == "Add") {
                    var eventInfo = that.data.eventInfoCache
                } else if (loadMethod == "Refresh") {
                    var eventInfo = new Array();
                    that.setData({
                        eventInfo: null,
                        eventInfoCache: null,
                        eventLoadIndex: 0,
                        loadFinish: false,

                    })
                }
                for (var j = 0; j < res.data.length; j++) {
                    var info = res.data[j];
                    if (info != null) {
                        try {
                            var startDate = new Date(info.start_date);
                            var endDate = new Date(info.end_date);
                        } catch (error) { }

                        eventInfo.push({
                            eventTitle: info.name,
                            eventLocationShort: `${info.city} ${info.state_prov} ${info.country}`,
                            eventStartDate: startDate.toDateString().split(" ")[1] + " " + startDate.getDate(),
                            eventEndDate: endDate.toDateString().split(" ")[1] + " " + endDate.getDate(),
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
                    eventLoadIndex: index + 20,
                    loadFinish: true,
                    isSearch: false
                })

            },
            () => { })
    },
    onFilterChange: function (e) {
        var that = this;
        var checkedItem = e.detail.checkedItems;
        console.log(checkedItem);
        checkedItem.forEach((n) => {
            if (n.value == "Country") {
                n.children.forEach((child) => {
                    if (child.checked) {
                        that.setData({
                            chooseCountry: child.value
                        })
                    }
                })
            } else if (n.value == "Year") {
                n.children.forEach((child) => {
                    if (child.checked) {
                        that.setData({
                            chooseEventYear: child.value
                        })
                    }
                })
            } else if (n.value == "Month") {
                n.children.forEach((child) => {
                    if (child.checked) {
                        that.setData({
                            chooseMonth: child.value
                        })
                    }
                })
            }
        })
        this.onLoadEvent(0, "Refresh");
    },
    initFilterItems: function () {
        var yearArray = new Array();
        for (var year = 1992; year <= new Date().getFullYear(); year++) {
            if (year == new Date().getFullYear()) {
                yearArray.push({
                    label: year.toString(),
                    value: year.toString(),
                    checked: true
                })
            } else {
                yearArray.push({
                    label: year.toString(),
                    value: year.toString()
                })
            }
        }
        yearArray.reverse();
        var filteritems = [{
            type: 'radio',
            label: 'Country',
            value: 'Country',
            children: [
                { label: 'No selected', value: '', },
                { label: 'USA', value: 'USA' },
                { label: 'Israel', value: 'Israel' },
                { label: 'Canada', value: 'Canada' },
                { label: 'Australia', value: 'Australia' },
                { label: 'China', value: 'China' },
                { label: 'Mexico', value: 'Mexico' },
                { label: 'United States', value: 'United States' },
                { label: 'Turkey', value: 'Turkey' },
                { label: 'Brazil', value: 'Brazil' },
                { label: 'Northern Israel', value: 'Northern Israel' }],
            groups: ['001'],
        },
        {
            type: 'radio',
            label: 'Year',
            value: 'Year',
            children: yearArray,
            groups: ['001'],
        },
        {
            type: 'radio',
            label: 'Month',
            value: 'Month',
            children: [
                {
                    label: 'No selected',
                    value: '',
                },
                {
                    label: 'Jan',
                    value: '01',
                },
                {
                    label: 'Feb',
                    value: '02',
                },
                {
                    label: 'Mar',
                    value: '03',
                },
                {
                    label: 'Apr',
                    value: '04',
                },
                {
                    label: 'May',
                    value: '05',
                },
                {
                    label: 'Jun',
                    value: '06',
                },
                {
                    label: 'Jul',
                    value: '07',
                },
                {
                    label: 'Aug',
                    value: '08',
                },
                {
                    label: 'Sept',
                    value: '09',
                },
                {
                    label: 'Oct',
                    value: '10',
                },
                {
                    label: 'Nov',
                    value: '11',
                },
                {
                    label: 'Dec',
                    value: '12',
                }
            ],
            groups: ['001'],
        }]
        this.setData({
            filteritems: filteritems
        })
    },
    onScrolltoTop: function () {
		wx.pageScrollTo({
			scrollTop: 0,
			duration: 0
		});
		this.setData({
			currentScrollPosition: 0
		});
	},
	onPageScroll: function (e) { // 获取滚动条当前位置
		this.setData({
			currentScrollPosition: e.scrollTop
		})
	}
})