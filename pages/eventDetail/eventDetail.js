// pages/eventDetail/eventDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        windowsTitle: String,
        //TODO 在onLoad请求服务器队伍列表
        teamlist: [{
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
            } /*  */
        ],
        eventIndex: {
            /* eventTitle: "Shenzhen Regional",
            eventLocation: "Tuanjie Rd, Longgang Qu, Shenzhen Shi, Guangdong Sheng, China, 518118",
            eventStartDate: "Mar 7",
            eventEndDate: "Mar 10",
            eventYear: "2019" */
        },
        rankCard: {
            rank : 11,
            team: ["Pharma Atom Storm","6766"],
            rankScore: 2.07
        },
        allianceCard: {
            allianceNumber: 1,
            allianceTeam: [6766,6866,6966]
        },
        awardCard: {
            awardTitle: "Regional Finalists",
            awardTeamList: [
            {
                teamNumber : 6766,
                teamName: "Pharma Atom Storm"
            },
            {
                teamNumber: 6766,
                teamName: "Pharma Atom Storm"
            }]
        },
        match :{
            qual :{
                matchlist : [
                    {
                        matchType : ["Qual","11"],
                        redAlliance : [6766,6666,6566],
                        blueAlliance : [6866,6966,7066],
                        score : [312,300]
                    },
                    {
                        matchType : ["Qual","11"],
                        redAlliance : [6766,6666,6566],
                        blueAlliance : [6866,6966,7066],
                        score : [312,300]
                    }
                ]
            },
            quarter :{
                matchlist : [
                    {
                        matchType : ["Qual","11"],
                        redAlliance : [6766,6666,6566],
                        blueAlliance : [6866,6966,7066],
                        score : [312,300]
                    },
                    {
                        matchType : ["Qual","11"],
                        redAlliance : [6766,6666,6566],
                        blueAlliance : [6866,6966,7066],
                        score : [312,300]
                    },
                    {
                        matchType : ["Qual","11"],
                        redAlliance : [6766,6666,6566],
                        blueAlliance : [6866,6966,7066],
                        score : [312,300]
                    }
                ]
            },
            semi :{
                matchlist : [
                    {
                        matchType : ["Qual","11"],
                        redAlliance : [6766,6666,6566],
                        blueAlliance : [6866,6966,7066],
                        score : [312,300]
                    },
                    {
                        matchType : ["Qual","11"],
                        redAlliance : [6766,6666,6566],
                        blueAlliance : [6866,6966,7066],
                        score : [312,300]
                    }
                ]
            },
            final :{
                matchlist : [
                    {
                        matchType : ["Qual","11"],
                        redAlliance : [6766,6666,6566],
                        blueAlliance : [6866,6966,7066],
                        score : [312,300]
                    },
                    {
                        matchType : ["Qual","11"],
                        redAlliance : [6766,6666,6566],
                        blueAlliance : [6866,6966,7066],
                        score : [312,300]
                    }
                ]
            }

        },
        activeNames: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var eventInfo = JSON.parse(decodeURIComponent(options.eventInfo));
        if (eventInfo != null) {
            this.setData({
                eventIndex: eventInfo
            })
            if (this.data.eventIndex.eventTitle != null) {
                wx.setNavigationBarTitle({
                    title: this.data.eventIndex.eventTitle
                })
            }
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    onTeamCardClick: function(e) {
        var index = e.currentTarget.dataset.id;
        var eventIndex = encodeURIComponent(JSON.stringify(this.data.eventIndex));
        var team = encodeURIComponent(JSON.stringify(this.data.teamlist[index]));
        wx.navigateTo({
            url: `/pages/teamAtEvent/teamAtEvent?eventIndex=${eventIndex}&team=${team}`,
        })
    },

    onCollapseChange(event) {
        this.setData({
            activeNames: event.detail
        })
    }
})