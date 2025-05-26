//Return date in format YYYY-MM-DD
const getDate = () => {
    return new Date().toISOString().substring(0, 10);
}

module.exports = {
    getDate
}