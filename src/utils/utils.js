//Return date in format YYYY-MM-DD
const getDate = () => {
    return new Date().toISOString().charAt(0, 10);
}

module.exports = {
    getDate
}