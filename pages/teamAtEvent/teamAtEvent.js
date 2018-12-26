// pages/teamAtEvent/teamAtEvent.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        eventIndex : {},
        team : {},
        awardCard: {
            awardTitle: "Regional Finalists",
            awardTeamList: [
                {
                    teamNumber: 6766,
                    teamName: "Pharma Atom Storm"
                },
                {
                    teamNumber: 6766,
                    teamName: "Pharma Atom Storm"
                }]
        },
        summaryInfo :{
            rank : 11,
            award : 4,
            qualrecord : [10,3,0],
            alliance : {
                allianceMember : "1st Pick",
                allianceNumber : 4
            },
            status : {
                inFinals : true,
                end : "Finals",
                record : [4,3,0]
            }
        },
        statusInfo : [145,35,109],
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
        activeNames: [] //折叠面板激活
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var eventIndex = JSON.parse(decodeURIComponent(options.eventIndex));
        var team = JSON.parse(decodeURIComponent(options.team));
        console.log(team.organization)
        if (eventIndex != null){
            this.setData({
                eventIndex: eventIndex
            })
        }

        if (team != null) {
            this.setData({
                team: team
            })
        }
        
        wx.setNavigationBarTitle({
            title: this.data.eventIndex.eventTitle + " " + this.data.team.teamNumber
        })
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

    onCollapseChange: function(event) {
        this.setData({
            activeNames: event.detail
        })
    }
})