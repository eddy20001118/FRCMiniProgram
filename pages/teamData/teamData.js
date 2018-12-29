// pages/gameData/teamData.js
Page({
	data: {
		teamInfo : Array
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
		var code = event.detail
		//TODO: 请求服务器模糊搜索函数,返回一个teamInfo数组，以下为假数据
		var teamInfo = [
			{
				teamNumber : code,
				teamName :  "Pharma Atom Storm",
				teamLocation : "Shenzhen, Guangdong, China"
			}
			,
			{
				teamNumber : code-1,
				teamName :  "Pharma Atom Storm",
				teamLocation : "Shenzhen, Guangdong, China"
			}
		]
		this.setData({
			teamInfo : teamInfo
		});
	},

	onCancel: function () {
		this.setData({
			search: ""
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