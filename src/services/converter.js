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

}