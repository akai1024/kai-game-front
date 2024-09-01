<template>
    <div class="flip-coin" @click="flipCoin" :class="{ disabled: isDisabled, 'flipping': !isFlipping }">
        <div class="coin-inner">
            <div class="coin-front">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <defs>
                        <clipPath id="circleClip">
                            <circle cx="100" cy="100" r="80" />
                        </clipPath>
                    </defs>
                    <!-- 嵌入的 WebP 圖像 -->
                    <!-- <image width="200" height="200" href="/flipcoin_front.webp" preserveAspectRatio="xMidYMid slice"
                        clip-path="url(#circleClip)" /> -->
                    <image x="-45" y="-33" width="290" height="290" href="/flipcoin_back.webp"
                        preserveAspectRatio="xMidYMid slice" clip-path="url(#circleClip)" />
                </svg>
            </div>
            <div class="coin-back">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <defs>
                        <clipPath id="circleClip">
                            <circle cx="100" cy="100" r="80" />
                        </clipPath>
                    </defs>
                    <!-- 嵌入的 WebP 圖像 -->
                    <image x="-45" y="-33" width="290" height="290" href="/flipcoin_back.webp"
                        preserveAspectRatio="xMidYMid slice" clip-path="url(#circleClip)" />
                    <!-- Value text -->
                    <text x="100" y="150" font-size="20" text-anchor="middle" fill="#E0E0E0"
                        font-family="Arial, sans-serif">This is Back</text>
                </svg>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FlipCoin',
    props: {
        isDisabled: {
            type: Boolean,
            default: false
        },
        initialSide: {
            type: Boolean,
            default: true // true for showing the front side initially, false for the back side
        }
    },
    data() {
        return {
            isFlipping: false
        }
    },
    mounted() {
        // Set the initial side based on the `initialSide` prop
        this.flipTo(this.initialSide);
    },
    methods: {
        flipTo(isFlipping) {
            this.isFlipping = isFlipping;
        },

        flipCoin() {
            if (this.isDisabled) {
                return;
            }

            this.isFlipping = !this.isFlipping;
            this.$emit('flip', this.isFlipping); // emit event and deliver isFlipping value
        },
    },
}
</script>

<style scoped>
.flip-coin {
    width: 200px;
    height: 200px;
    perspective: 1000px;
    cursor: pointer;
}

.coin-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.3s;
    transform-style: preserve-3d;
}

.flipping .coin-inner {
    transform: rotateY(180deg);
}

.coin-front,
.coin-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
}

.coin-back {
    transform: rotateY(180deg);
}
</style>