const minutes = process.env.CACHE_MINUTES ? parseFloat(process.env.CACHE_MINUTES) : 60;
const time = minutes * 60 * 1000;
module.exports = time;