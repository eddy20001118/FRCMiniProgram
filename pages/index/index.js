var app = getApp();
Page({
    data: {
        teamInfo: {
            teamNumber: "254",
            teamName: "Pharma Atom Storm",
            teamLocation: "Shenzhen, Guangdong, China"
        },
        eventInfo: Array,

        matchCard: {
            matchType: ["Qual", "11"],
            redAlliance: [6766, 6666, 6566],
            blueAlliance: [6866, 6966, 7066],
            score: [312, 300]
        }
    },

    onLoad: function (options) {
        this.onRequireData();
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
        setTimeout(() => {
            this.onRequireData();
            wx.stopPullDownRefresh();
        }, 3000)
    },

    onReachBottom: function () {

    },

    onShareAppMessage: function () {

    },

    onEventCardClick: function (e) {
        var index = e.currentTarget.id;
        var eventInfo = encodeURIComponent(JSON.stringify(this.data.eventInfo[index]));
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

    onRequireData: function () {
        //读取保存到缓存的数据
        var that = this;
        var onSuccess = function (res) {
            var keys = res.keys;
            console.log(keys);
            if (keys != null && keys.length != 0) {
                var eventInfo = new Array();
                for(var j =0; j<keys.length; j++){
                    if(keys[j].substring(0,1)=='e'){ //event用e打头
                        var onGetSuccess = function(res) {
                            eventInfo.push(res);
                        }
                        var onGetFail = function(){
                        }
                        app.dataBaseMethod.get(keys[j],onGetSuccess,onGetFail);
                    }
                }
                that.setData({
                    eventInfo : eventInfo 
                })    
            }
        }
        app.dataBaseMethod.getInfo(onSuccess);
    },
})
