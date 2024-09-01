<template>
    <div class="flip-coin" @click="flipCoin" :class="{ disabled: isDisabled }">
        <div class="coin-inner" :style="coinStyle">
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
                    <image x="17" y="19" width="164" height="164" href="/coin_back_6.jpeg"
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
        },
        isRandomFlip: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            isFlipping: false,
            rotations: 0
        }
    },
    computed: {
        coinStyle() {
            return {
                transform: `rotateY(${this.rotations * 180}deg)`,
                transition: this.rotations ? 'transform 0.6s' : 'none'
            }
        }
    },
    mounted() {
        // Set the initial side based on the `initialSide` prop
        this.isFlipping = !this.initialSide;
        this.rotations = this.isFlipping ? 1 : 0;
    },
    methods: {
        flipCoin() {
            if (this.isDisabled) {
                return;
            }

            let newIsFlipping;
            if (this.isRandomFlip) {
                // Randomly decide the result (true for front, false for back)
                newIsFlipping = Math.random() < 0.5;
            } else {
                // Original behavior: just flip the coin
                newIsFlipping = !this.isFlipping;
            }

            // Determine the number of rotations needed
            let rotationsNeeded = newIsFlipping === this.isFlipping ? 2 : 1;
            // Add 2 rotations when it is random to make it more insteresting
            if (this.isRandomFlip) {
                rotationsNeeded += 2;
            }
            this.rotations += rotationsNeeded;

            // Update isFlipping after a short delay to allow the animation to start
            setTimeout(() => {
                this.isFlipping = newIsFlipping;
            }, 50);

            // Emit the result (true for front, false for back)
            this.$emit('flip', !newIsFlipping);
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
    transform-style: preserve-3d;
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