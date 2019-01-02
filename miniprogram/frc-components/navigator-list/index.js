// frc-components/navigator-list/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type : String,
        url : String,
        title : String,
        icon : String,
        hidden : Boolean,
        smallText: String
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
            if(this.properties.type == "navi"){
                wx.navigateTo({
                    url: this.properties.url
                })
            } else if(this.properties.type == "click"){
                this.triggerEvent('onclick');
            }
        }
    }
})
