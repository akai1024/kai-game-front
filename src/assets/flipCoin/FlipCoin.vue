<template>
    <div class="flip-coin" @click="flipCoin" :class="{ disabled: isDisabled, 'flipping': !isFlipping }">
        <div class="coin-inner">
            <div class="coin-front">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <defs>
                        <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#ffaa00;stop-opacity:1" />
                        </linearGradient>
                        <filter id="coinShadow">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="2" dy="2" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.5" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <!-- Coin body -->
                    <circle cx="100" cy="100" r="90" fill="url(#coinGradient)" filter="url(#coinShadow)" />

                    <!-- Inner circle -->
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#ffcc00" stroke-width="2" />

                    <!-- Clover symbol -->
                    <path
                        d="M100 60 Q80 40 100 20 Q120 40 100 60 M100 60 Q120 40 140 60 Q120 80 100 60 M100 60 Q80 80 60 60 Q80 40 100 60 M100 60 Q100 80 80 100 Q60 80 100 60 M100 60 Q120 80 100 100 Q80 80 100 60"
                        fill="#fff" />

                    <!-- Value text -->
                    <text x="100" y="140" font-size="36" text-anchor="middle" fill="#fff"
                        font-family="Arial, sans-serif">FACE</text>

                    <!-- Edge details -->
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#ffd700" stroke-width="4"
                        stroke-dasharray="10 5" />
                </svg>
            </div>
            <div class="coin-back">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <defs>
                        <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#ffaa00;stop-opacity:1" />
                        </linearGradient>
                        <filter id="coinShadow">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                            <feOffset dx="2" dy="2" result="offsetblur" />
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.5" />
                            </feComponentTransfer>
                            <feMerge>
                                <feMergeNode />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <!-- Coin body -->
                    <circle cx="100" cy="100" r="90" fill="url(#coinGradient)" filter="url(#coinShadow)" />

                    <!-- Inner circle -->
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#ffcc00" stroke-width="2" />

                    <!-- Star symbol -->
                    <path d="M100 30 L110 70 H152 L118 90 L130 130 L100 110 L70 130 L82 90 L48 70 H90 Z" fill="#fff" />

                    <!-- Text -->
                    <text x="100" y="160" font-size="24" text-anchor="middle" fill="#fff"
                        font-family="Arial, sans-serif">BACK</text>

                    <!-- Edge details -->
                    <circle cx="100" cy="100" r="90" fill="none" stroke="#ffd700" stroke-width="4"
                        stroke-dasharray="10 5" />
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