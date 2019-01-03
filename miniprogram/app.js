const dbObj = { env: "frceven-e04c8c" };

App({
	data: {
		dataBase: null,
		userFavorCollection: null,
		userOpenid: null
	},
	globalMethod: {
		httpsRequest: function (api, callback) {
			var url = `https://www.thebluealliance.com/api/v3/${api}?X-TBA-Auth-Key=kbxvOnS2csBH6fzQ8zijLw2f1k135fWp8NgTEfPRg1n8hYqh7SSUo9VJ3JEBlnIg`;
			console.log(url);
			wx.request({
				url: url,
				header: {
					"content-type": "application/json" // 默认值
				},
				success: function (res) {
					callback(res.data);
				}
			});
		},
		// httpsRequest: function (api, callback) {
		//     wx.cloud.callFunction({
		//         name: 'httpsRequest',
		//         data: {
		//             api: api
		//         },
		//         success : (res)=>{
		//             callback(res.result.data);
		//         },
		//         fail: console.error
		//     })
		// },
		matchesArraySort: function (x, y) {
			return x.matchType[1] - y.matchType[1];
		},
		eventsAtYearSort: function (x, y) {
			return x.startDateObj - y.startDateObj;
		},
		ranksArraySort: function (x, y) {
			return x.rank - y.rank;
		},
		teamArraySort: function (x, y) {
			return x.teamNumber - y.teamNumber;
		},
		dataFilter: function (str) {
			var temp = str;
			temp = temp.replace(/<b>/g, "");
			temp = temp.replace(/<\/b>/g, "");
			return temp;
		},
		teamFilter: function (array) {
			var temp = array;
			for (var j = 0; j < temp.length; j++) {
				temp[j] = array[j].replace("frc", "");
			}
			return temp;
		}
	},

	set: function (data, onSuccess) {
		try {
			console.log(data);
			wx.setStorageSync(data.key, data.data);
			onSuccess();
		} catch (error) { }
	},
	remove: function (key, onSuccess, onFail) {
		try {
			wx.removeStorageSync(key);
			onSuccess();
		} catch (error) {
			onFail();
		}
	},
	get: function (key, onSuccess, onFail) {
		try {
			const value = wx.getStorageSync(key);
			if (value != null && value.length != 0) {
				onSuccess(value);
			} else {
				onFail();
			}
		} catch (error) {
			onFail();
		}
	},
	getInfo: function (onSuccess) {
		try {
			const res = wx.getStorageInfoSync();
			onSuccess(res);
		} catch (error) { }
	},
	clear: function (onSuccess) {
		try {
			wx.clearStorageSync();
			onSuccess();
		} catch (error) { }
	},

	//以下是云端数据库操作
	setCloud: function (data, onSuccess) {
		var collection = this.data.userFavorCollection;
		collection.add({
			data: data,
			success: onSuccess
		});
	},

	removeCloud: function (key, onSuccess, onFail) {
		var collection = this.data.userFavorCollection;
		collection
			.where({
				_openid: this.data.userOpenid,
				key: key
			})
			.get({
				success(res) {
					try {
						collection.doc(res.data[0]._id).remove({
							success: onSuccess,
							fail: onFail
						});
					} catch (error) { }
				}
			});
	},
	getCloud: function (key, onSuccess, onFail) {
		var collection = this.data.userFavorCollection;
		collection
			.where({
				_openid: this.data.userOpenid,
				key: key
			})
			.get({
				success: res => {
					try {
						onSuccess(res.data[0].data);
					} catch (error) { }
				},
				fail: onFail
			});
	},
	getInfoCloud: function (onSuccess) {
		var collection = this.data.userFavorCollection;
		collection
			.where({
				_openid: this.data.userOpenid
			})
			.get({
				success: res => {
					var keys = new Array();
					for (var j = 0; j < res.data.length; j++) {
						keys.push(res.data[j].key);
					}
					onSuccess({
						keys: keys
					});
				}
			});
	},
	search: function (type, msg, callback) {
		const db = wx.cloud.database(dbObj);
		if (type == "team") {
			var teamsInfoCollection = db.collection("teams_info");
			var name = msg.match(/^[A-Za-z][A-Za-z\s]*[A-Za-z]$/gi);
			var num = msg.match(/\d+$/gi);
			if (name != null) {
				teamsInfoCollection
					.where({
						nickname: db.RegExp({
							regexp: name.toString(),
							options: "i"
						})
					})
					.get()
					.then(callback);
			}
			if (num != null) {
				teamsInfoCollection
					.where({
						team_number: parseInt(num.toString())
					})
					.get()
					.then(callback);
			}
		} else if (type == "event") {
			var eventsInfoCollection = db.collection("events_info");
			eventsInfoCollection
				.where({
					name: db.RegExp({
						regexp: msg,
						options: "i"
					})
				})
				.get()
				.then(callback);
		}
	},

	getDbTeam: function (index, onSuccess, onFail) {
		const db = this.data.dataBase;
		const teamsInfoCollection = db.collection("teams_info");
		teamsInfoCollection
			.skip(index)
			.limit(10)
			.get()
			.then(res => {
				onSuccess(res)
			})
			.catch(err => {
				onFail(err)
			})
	},

	getDbEvent: function (index, eventYear, onSuccess, onFail) {
		const db = this.data.dataBase;
		const eventsInfoCollection = db.collection("events_info");
		eventsInfoCollection
			.where({
				year: eventYear
			}).count().then(res => {
				var count = res.total;
				if(index <= count-10){
					eventsInfoCollection
					.where({
						year: eventYear
					})
					.skip(index)
					.limit(10)
					.get()
					.then(res => {
						onSuccess(res)
					})
					.catch(err => {
						onFail(err)
					})
				} else {
					onSuccess(null,true)
				}
			})

	},

	onLaunch: function () {
		wx.cloud.init({
			env: "frceven-e04c8c"
		});
		this.data.dataBase = wx.cloud.database(dbObj);
		this.data.userFavorCollection = this.data.dataBase.collection(
			"user_favorite"
		);
		var that = this;
		wx.cloud.callFunction({
			name: "getUserInfo",
			success: res => {
				that.data.userOpenid = res.result.openid;
			}
		});
	}
});
