<template>
    <div>
        <div ref="topElement"></div>
        <slot></slot>
        <div ref="bottomElement"></div>
    </div>
</template>

<script>
export default {
    name: 'ScrollTrigger',
    props: {
        topTriggerMethod: {
            type: Function,
            required: false
        },
        bottomTriggerMethod: {
            type: Function,
            required: false
        },
        debugConsoleLog: {
            type: Boolean,
            required: false
        },
    },
    data() {
        return {
            observer: null
        }
    },
    mounted() {
        this.setupIntersectionObserver();
    },
    beforeUnmount() {
        if (this.observer) {
            this.observer.disconnect();
        }
    },
    methods: {
        setupIntersectionObserver() {
            const options = {
                /**
                 * 當設置為 null 時，它使用瀏覽器視窗作為根元素，
                 * 這意味著我們將檢測目標元素相對於整個瀏覽器視窗的可見性，而不是相對於某個特定的容器元素
                 */
                root: null,
                /** 
                 * rootMargin 類似於 CSS 的 margin 屬性，它可以擴大或縮小根元素的有效範圍。
                 * 值的格式是 CSS 的 margin 格式（上右下左）。
                 * 設置為 '0px' 意味著不改變根元素的範圍。
                 * 你可以使用這個屬性來提前或延後觸發點，例如 '100px' 會使得觀察區域比視窗大 100 像素，可以提前觸發。
                 */
                rootMargin: '0px',
                /**
                 * threshold 定義了目標元素的可見比例達到多少時觸發回調。
                 * 值範圍是 0 到 1。
                 * 0.1 表示當目標元素有 10% 進入根元素（在這個例子中是視窗）時，就會觸發回調。
                 * 你可以設置多個閾值，例如 [0, 0.5, 1]，這將在元素開始出現、一半可見和完全可見時都觸發回調。
                 */
                threshold: 1
            }

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target === this.$refs.topElement) {
                            this.onReachTop();
                        } else if (entry.target === this.$refs.bottomElement) {
                            this.onReachBottom();
                        }
                    }
                })
            }, options)

            this.observer.observe(this.$refs.topElement);
            this.observer.observe(this.$refs.bottomElement);
        },
        onReachTop() {
            if (this.debugConsoleLog) {
                console.log('已經到達頂部！');
            }

            if (this.topTriggerMethod) {
                this.topTriggerMethod();
            }
        },
        onReachBottom() {
            if (this.debugConsoleLog) {
                console.log('已經到達底部！');
            }

            if (this.bottomTriggerMethod) {
                this.bottomTriggerMethod();
            }
        }
    }
}
</script>