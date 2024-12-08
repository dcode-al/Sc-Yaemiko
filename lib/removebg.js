const formData = require('form-data')
const apii = await axios.create({
    baseURL: 'https://api4g.iloveimg.com'
})

const getTaskId = async () => {
    const {
        data: html
    } = await axios.get('https://www.iloveimg.com/id/hapus-latar-belakang')
    apii.defaults.headers.post['authorization'] = `Bearer ${html.match(/ey[a-zA-Z0-9?%-_/]+/g)[1]}`
    return html.match(/taskId = '(\w+)/)[1]
}

const uploadImageToServer = async (imageBuffer) => {
    const taskId = await getTaskId()

    const fileName = Math.random().toString(36).slice(2) + '.jpg'
    const form = new formData()
    form.append('name', fileName)
    form.append('chunk', '0')
    form.append('chunks', '1')
    form.append('task', taskId)
    form.append('preview', '1')
    form.append('pdfinfo', '0')
    form.append('pdfforms', '0')
    form.append('pdfresetforms', '0')
    form.append('v', 'web.0')
    form.append('file', imageBuffer, fileName)

    const reqUpload = await apii.post('/v1/upload', form, {
            headers: form.getHeaders()
        })
        .catch(e => e.response)
    if (reqUpload.status !== 200) throw reqUpload.data || reqUpload.statusText

    return {
        serverFilename: reqUpload.data.server_filename,
        taskId
    }
}

const removeBg = async (imageBuffer, responseType = 'arraybuffer') => {
    const {
        serverFilename,
        taskId
    } = await uploadImageToServer(imageBuffer)

    const form = new formData()
    form.append('task', taskId)
    form.append('server_filename', serverFilename)

    const reqRmbg = await apii.post('/v1/removebackground', form, {
        headers: form.getHeaders(),
        responseType
    }).catch(e => e.response)
    const type = reqRmbg.headers['content-type']
    if (reqRmbg.status !== 200 || !/image/.test(type))
        throw JSON.parse(reqRmbg.data?.toString() || '{"error":{"message":"An error occurred"}}')

    return reqRmbg.data
}