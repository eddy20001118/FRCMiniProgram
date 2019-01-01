var app = getApp();
Page({
	data: {
		teamInfo : Array,
		height : Number,
		search : String
	},

	onLoad: function (options) {
		var that = this;
		wx.getSystemInfo({
            success : res =>{
                that.setData({
                    height : res.windowHeight-44
                })
            }
        })
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
		var callback = function(res){
			var teamInfo = new Array(res.data.length);
			for(var j =0; j<res.data.length; j++){
				var info = res.data[j];
				teamInfo[j] = {
					teamNumber : info.team_number,
					teamName : info.nickname,
					teamLocation : `${info.city} ${info.state_prov} ${info.country}`
				}
			}
			teamInfo.sort(app.globalMethod.teamArraySort);
			that.setData({
				teamInfo : teamInfo,
				search : event.detail
			})
		}
		var data = app.dataBaseMethod.search("team",event.detail,callback);
		
		// var code = event.detail
		// //TODO: 请求服务器模糊搜索函数,返回一个teamInfo数组，以下为假数据
		// var teamInfo = [
		// 	{
		// 		teamNumber : code,
		// 		teamName :  "Pharma Atom Storm",
		// 		teamLocation : "Shenzhen, Guangdong, China"
		// 	}
		// 	,
		// 	{
		// 		teamNumber : code-1,
		// 		teamName :  "Pharma Atom Storm",
		// 		teamLocation : "Shenzhen, Guangdong, China"
		// 	}
		// ]
		// this.setData({
		// 	teamInfo : teamInfo
		// });
	},

	onCancel: function () {
		this.setData({
			search: null
		})
	},

	onTeamCardClick: function (e) {
		var index = e.currentTarget.id;
		var teamInfo = encodeURIComponent(JSON.stringify(this.data.teamInfo[index]));
		wx.navigateTo({
			url: `/pages/teamDetail/teamDetail?teamInfo=${teamInfo}`
		})
	},
})