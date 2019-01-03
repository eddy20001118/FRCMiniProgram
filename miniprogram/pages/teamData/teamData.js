var app = getApp();
Page({
	data: {
		teamInfoCache: new Array(),
		teamInfo: Array,
		height: Number,
		search: String,
		teamLoadIndex: Number,
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
		this.onLoadTeam(0);
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
		this.setData({
			loadFinish: false
		})
		this.onLoadTeam(this.data.teamLoadIndex);
		console.log("reach bottom");
	},

	onShareAppMessage: function () {

	},

	onSearch: function (event) {
		this.setData({
			loadFinish: false
		})
		var that = this;
		app.search("team", event.detail, (res) => {
			var teamInfo = new Array(res.data.length);
			for (var j = 0; j < res.data.length; j++) {
				var info = res.data[j];
				teamInfo[j] = {
					teamNumber: info.team_number,
					teamName: info.nickname,
					teamLocation: `${info.city} ${info.state_prov} ${info.country}`
				}
			}
			teamInfo.sort(app.globalMethod.teamArraySort);
			that.setData({
				teamInfo: teamInfo,
				search: event.detail,
				teamInfoCache: new Array(),
				teamLoadIndex: 0,
				loadFinish: true
			})
		});
	},

	onCancel: function () {
		this.setData({
			search: null,
			teamInfo: null,
			teamInfoCache: new Array(),
			teamLoadIndex: 0
		})
		this.onLoadTeam(this.data.teamLoadIndex);
	},

	onTeamCardClick: function (e) {
		var index = e.currentTarget.id;
		var teamInfo = encodeURIComponent(JSON.stringify(this.data.teamInfo[index]));
		wx.navigateTo({
			url: `/pages/teamDetail/teamDetail?teamInfo=${teamInfo}`
		})
	},

	onLoadTeam: function (index) {
		var that = this;
		app.getDbTeam(index,
			(res) => {
				var teamInfo = that.data.teamInfoCache;
				for (var j = 0; j < res.data.length; j++) {
					var info = res.data[j];
					teamInfo.push({
						teamNumber: info.team_number,
						teamName: info.nickname,
						teamLocation: `${info.city} ${info.state_prov} ${info.country}`
					})
				}
				teamInfo.sort(app.globalMethod.teamArraySort);
				that.setData({
					teamInfoCache: teamInfo,
					teamInfo: teamInfo,
					teamLoadIndex: index + 10,
					loadFinish: true
				})
			},
			() => { })
	}
})