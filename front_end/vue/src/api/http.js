import axios from 'axios'

const http = axios.create({
    baseURL: 'http://127.0.0.1:6080',
    timeout: 5000
})

export async function sendGet(api, config={}) {
    try {
        const response = await http.get(api, config)
        console.log('Get 成功：', response)
        return response.data
    } catch (err) {
        console.error('Get 错误：', err)
    }
}

export async function sendPost(api, body, config) {
    try {
        const response = await http.post(api, body, config)
        console.log('POST 成功：', response)
        return response.data
    } catch (err) {
        console.error('POST 错误：', err)
    }
}

export async function sendPut(api, body, config) {
    try {
        const response = await http.put(api, body, config)
        console.log('PUT 成功：', response)
        return response.data
        // 更新 data 或提示用户成功
    } catch (err) {
        console.error('PUT 错误：', err)
    }
}

export default http
