Page({
    data : {
        teamInfo: { 
            teamNumber : "6766",
            teamName : "Pharma Atom Storm",
            teamLocation: "Shenzhen, Guangdong, China"
        },
        eventInfo: {
            eventTitle: "Shenzhen Regional",
            eventLocation: "Shenzhen Shi, Guangdong Sheng, China",
            eventStartDate: "Mar 7",
            eventEndDate: "Mar 10",
            eventYear: "2019"
        },
        active : 1,
        steps: [
            {
                text: '资格赛'
            },
            {
                text: '四分之一决赛'
            },
            {
                text: '半决赛'
            },
            {
                text: '决赛'
            }
        ],
        matchCard : {
            matchType : ["Qual","11"],
            redAlliance : [6766,6666,6566],
            blueAlliance : [6866,6966,7066],
            score : [312,300]
        }
    },
    onEventCardClick:function(){
        var eventInfo = encodeURIComponent(JSON.stringify(this.data.eventInfo));
        wx.navigateTo({
            url: `/pages/eventDetail/eventDetail?eventInfo=${eventInfo}`
        })
    },
    onTeamCardClick: function () {
        var teamInfo = encodeURIComponent(JSON.stringify(this.data.teamInfo));
        wx.navigateTo({
            url: `/pages/teamDetail/teamDetail?teamInfo=${teamInfo}`
        })
    }
})
