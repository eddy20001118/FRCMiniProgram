// frc-components/pin-button/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        status: Object
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
        isClicked: function () {
            this.triggerEvent('onclick');
        }
    }
})
