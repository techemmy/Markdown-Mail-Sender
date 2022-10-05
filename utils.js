async function getMailInfo(requestObject) {
    return new Promise((resolve, reject) => {
        let mailInfo = []
        requestObject.on('data', chunk => {
            mailInfo.push(chunk);
        })
        requestObject.on('end', () => {
            const parsedMailInfo = JSON.parse(Buffer.concat(mailInfo).toString('utf-8'));
            resolve(parsedMailInfo);
        })
    })
}

export { getMailInfo };