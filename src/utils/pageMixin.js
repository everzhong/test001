import { EventBus } from "./eventBus"
export const pageMixin = {
    data() {
        return {
            showShearch: true,
            topValue: '20px',
            topHeight: 20
        }
    },
    mounted() {
        this.setTopValue()
        EventBus.$on('menue-toggle', () => {
            window.clearTimeout()
            setTimeout(() => {
                this.setTopValue()
            }, 300);
        })
    },
    methods: {
        setTopValue(cb) {
            this.$nextTick(() => {
                if (this.$refs.containerTop) {
                    this.topHeight = this.$refs.containerTop.offsetHeight
                }
                this.topValue = this.showShearch ? `${this.topHeight}px` : '20px'
                typeof cb === 'function' && cb(this.topValue)

            })
        },
        toggleShearch(cb) {
            this.showShearch = !this.showShearch
            this.setTopValue(cb)
        }
    }
}