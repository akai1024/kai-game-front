export default {
    transferFromTimestamp(timestamp) {
        if (!timestamp) {
            return "N/A";
        }

        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    transferToTimestamp(date, time) {
        const dateTimeString = `${date}T${time}:00`;
        const dateObject = new Date(dateTimeString);
        if (isNaN(dateObject.getTime())) {
            throw new Error('Invalid date or time format');
        }
        return dateObject.getTime();
    },

    /**
     * @param {*} timestamp 
     * @returns [0]='2024-08-26', [1]='14:04'
     */
    timestampToDateAndTime(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return [`${year}-${month}-${day}`, `${hours}:${minutes}`];
    },

    timeAgo(timestamp) {
        if (!timestamp) {
            return 'long time ago';
        }

        const now = Date.now();
        const diffInSeconds = Math.floor((now - timestamp) / 1000);

        if (diffInSeconds >= 86400) {
            const days = Math.floor(diffInSeconds / 86400);
            return `over ${days} days ago`;
        } else if (diffInSeconds >= 3600) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `before ${hours} hours ago`;
        } else if (diffInSeconds >= 60) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `before ${minutes} minutes ago`;
        } else {
            return `before ${diffInSeconds} seconds ago`;
        }
    },

    moneyChangeTypeText(changeType) {
        const map = new Map();
        map.set('ADD_ADMIN','Add by Admin');
        map.set('ADD_DEPOSIT','Deposit');
        map.set('ADD_WINNING','Winning');

        map.set('SUB_ADMIN','Deduct by Admin');
        map.set('SUB_BET','Bet');
        map.set('SUB_WITHDRAW','Withdraw');

        return map.get(changeType);
    },

    getFlipCoinResultText(result) {
        return result ? 'Face' : 'Back';
    }

}