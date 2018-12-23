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
        }
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
