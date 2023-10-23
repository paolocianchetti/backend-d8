import axios from "axios";
import config from "bootstrap/js/src/util/config";

class AxiosClient {

    constructor() {
        const baseUrl = `${process.env.REACT_APP_SERVER_BASE_URL}`

        this.axiosInstance = axios.create({
            baseURL: baseUrl,
        })
    }

    async get(url, config) {
        const response = await this.axiosInstance.get(url, config)
        return response.data
    }

    async post(url, body, config) {
        const response = await this.axiosInstance.post(url, body, config)
        return response.data
    }

    // e via dicendo
}

export default AxiosClient;