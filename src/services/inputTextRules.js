export default {

    accountRules: [
        value => {
            if (value?.length >= 3) return true
            return 'account must be at least 3 characters.'
        },
    ],

    passwordRules: [
        value => {
            if (/^[a-zA-Z0-9]{6,32}$/.test(value)) return true
            return 'invalid password.'
        },
    ],

}