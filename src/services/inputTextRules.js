export default {

    accountRules: [
        value => {
            if (value?.length >= 3 && value?.length <= 32) return true
            return 'account must be 3-32 characters.'
        },
    ],

    passwordRules: [
        value => {
            if (/^[a-zA-Z0-9]{6,32}$/.test(value)) return true
            return 'password must be 3-32 characters.'
        },
    ],

}