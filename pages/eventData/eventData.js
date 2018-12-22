Page({
    data: {
        search: ""
    },
    onSearch: function(event) {
        this.setData({
            search: event.detail
        });
    },
    onCancel: function() {
        this.setData({
            search: ""
        })
    }
})