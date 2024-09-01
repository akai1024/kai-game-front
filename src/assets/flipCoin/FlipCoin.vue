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
                    <image x="18" y="18" width="164" height="164" href="/coin_front_1.jpeg"
                        preserveAspectRatio="xMidYMid slice" clip-path="url(#circleClip)" />
                    <!-- <image x="10" y="10" width="180" height="180" href="/coin_front_2.jpeg"
                        preserveAspectRatio="xMidYMid slice" clip-path="url(#circleClip)" /> -->
                    <circle cx="100" cy="100" r="80" fill="yellow" opacity="0.09" />
                </svg>
            </div>
            <div class="coin-back">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <defs>
                        <clipPath id="circleClip">
                            <circle cx="100" cy="100" r="80" />
                        </clipPath>
                    </defs>
                    <!-- <image x="10" y="10" width="180" height="180" href="/coin_back_1.jpeg"
                        preserveAspectRatio="xMidYMid slice" clip-path="url(#circleClip)" /> -->
                    <!-- <image x="0" y="0" width="200" height="200" href="/coin_back_2.jpeg"
                        preserveAspectRatio="xMidYMid slice" clip-path="url(#circleClip)" /> -->
                    <!-- <image width="200" height="200" href="/coin_back_3.jpeg" preserveAspectRatio="xMidYMid slice"
                        clip-path="url(#circleClip)" /> -->
                    <!-- <image x="13" y="13" width="172" height="172" href="/coin_back_4.jpeg"
                        preserveAspectRatio="xMidYMid slice" clip-path="url(#circleClip)" /> -->
                    <!-- <image x="3" y="4" width="194" height="194" href="/coin_back_5.jpeg"
                        preserveAspectRatio="xMidYMid slice" clip-path="url(#circleClip)" /> -->
                    <image x="17" y="17" width="165" height="165" href="/coin_back_6.jpeg"
                        preserveAspectRatio="xMidYMid slice" clip-path="url(#circleClip)" />

                    <circle cx="100" cy="100" r="80" fill="grey" opacity="0.14" />
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