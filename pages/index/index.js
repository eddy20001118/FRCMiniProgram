Page({
    data : {
        teamInfo: { 
            teamNumber : "6866",
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
        ]
    },
    onEventCardClick:function(){
        wx.navigateTo({
            url: "/pages/eventDetail/eventDetail?eventName="+this.data.eventInfo.eventTitle,
        })
    },
    onTeamCardClick: function () {
        wx.navigateTo({
            url: '/pages/teamDetail/teamDetail?teamNumber='+this.data.teamInfo.teamNumber
        })
    }
})
