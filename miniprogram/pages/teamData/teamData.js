var app = getApp();
Page({
	data: {
		teamInfoCache: new Array(),
		teamInfo: Array,
		height: Number,
		search: String,
		teamLoadIndex: Number,
		loadFinish: false,
		chooseCountry: "China", //默认勾选中国队伍
		filteritems: Array
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
		this.onLoadTeam(0,"Add");
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
		this.onLoadTeam(this.data.teamLoadIndex,"Add");
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
			teamLoadIndex: 0,
			loadFinish: false
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

	onLoadTeam: function (index, loadMethod) {
		var that = this;
		app.getDbTeam(index, {
			country: that.data.chooseCountry
		},
			(res) => {
				if (loadMethod == "Add") {
					var teamInfo = that.data.teamInfoCache;
				} else if (loadMethod == "Refresh") {
					var teamInfo = new Array();
					that.setData({
						teamInfo: null,
						teamInfoCache: null,
						teamLoadIndex: 0,
						loadFinish: false
					})
				}
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
	},

	onFilterChange: function (e) {
		var that = this;
		var checkedItem = e.detail.checkedItems;
		console.log(checkedItem);
		checkedItem.forEach((n) => {
			n.children.forEach((child) => {
				if (child.checked) {
					that.setData({
						chooseCountry: child.value
					})
				}
			})
		})
		this.onLoadTeam(0, "Refresh");
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
			children: [ { label: 'USA', value: 'USA' },
			{ label: 'Canada', value: 'Canada' },
			{ label: 'Brazil', value: 'Brazil' },
			{ label: 'China', value: 'China' , checked:true}, //默认勾选中国队伍
			{ label: 'Greece', value: 'Greece' },
			{ label: 'South Africa', value: 'South Africa' },
			{ label: 'Chinese Taipei', value: 'Chinese Taipei' },
			{ label: 'Turkey', value: 'Turkey' },
			{ label: 'India', value: 'India' },
			{ label: 'Mexico', value: 'Mexico' },
			{ label: 'Libya', value: 'Libya' },
			{ label: 'Tonga', value: 'Tonga' },
			{ label: 'Israel', value: 'Israel' },
			{ label: 'Australia', value: 'Australia' },
			{ label: 'Poland', value: 'Poland' },
			{ label: 'Saint Kitts and Nevis',
			  value: 'Saint Kitts and Nevis' },
			{ label: 'New Zealand', value: 'New Zealand' },
			{ label: 'Switzerland', value: 'Switzerland' },
			{ label: 'Japan', value: 'Japan' },
			{ label: 'Colombia', value: 'Colombia' },
			{ label: 'Armenia', value: 'Armenia' },
			{ label: 'Venezuela', value: 'Venezuela' },
			{ label: 'Dominican Republic', value: 'Dominican Republic' },
			{ label: 'Indonesia', value: 'Indonesia' },
			{ label: 'Vietnam', value: 'Vietnam' },
			{ label: 'Chile', value: 'Chile' },
			{ label: 'Zimbabwe', value: 'Zimbabwe' },
			{ label: 'Ukraine', value: 'Ukraine' },
			{ label: 'Netherlands', value: 'Netherlands' },
			{ label: 'Kingdom', value: 'Kingdom' },
			{ label: 'Singapore', value: 'Singapore' },
			{ label: 'United Arab Emirates', value: 'United Arab Emirates' },
			{ label: 'France', value: 'France' },
			{ label: 'Morocco', value: 'Morocco' },
			{ label: 'Denmark', value: 'Denmark' },
			{ label: 'Sweden', value: 'Sweden' },
			{ label: 'Ethiopia', value: 'Ethiopia' },
			{ label: 'Paraguay', value: 'Paraguay' },
			{ label: 'Spain', value: 'Spain' },
			{ label: 'Germany', value: 'Germany' },
			{ label: 'Italy', value: 'Italy' },
			{ label: 'Croatia', value: 'Croatia' },
			{ label: 'Norway', value: 'Norway' },
			{ label: 'United Kingdom', value: 'United Kingdom' },
			{ label: 'Ecuador', value: 'Ecuador' },
			{ label: 'Philippines', value: 'Philippines' },
			{ label: 'Bosnia-Herzegovina', value: 'Bosnia-Herzegovina' },
			{ label: 'Czech Republic', value: 'Czech Republic' },
			{ label: 'Pakistan', value: 'Pakistan' },
			{ label: 'Kazakhstan', value: 'Kazakhstan' } ],
			groups: ['001'],
		}]
		this.setData({
			filteritems: filteritems
		})
	}
})