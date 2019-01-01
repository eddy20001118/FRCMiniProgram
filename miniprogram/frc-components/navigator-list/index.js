// frc-components/navigator-list/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        url : String,
        title : String,
        icon : String
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        navigate : function(){
            wx.navigateTo({
                url: this.properties.url
            })
        }
    }
})
