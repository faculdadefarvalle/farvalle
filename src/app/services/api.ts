const { default: axios } = require("axios");

export const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_FARVALLE_URL}`

})