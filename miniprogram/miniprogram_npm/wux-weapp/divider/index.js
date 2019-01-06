Component({
	externalClasses: ['wux-class'],
	properties: {
        hidden : Boolean,
        position: {
            type: String,
            value: 'center',
        },
        dashed: {
            type: Boolean,
            value: false,
        },
        text: {
            type: String,
            value: '',
        },
        showText: {
            type: Boolean,
            value: true,
        },
    },
})