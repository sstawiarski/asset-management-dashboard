const servers = [
    {
        url: `http://localhost:${process.env.PORT || "4000"}`,
        description: 'Local server'
    }, 
    {
        url: process.env.PRODUCTION_URL || 'http://future_api_url',
        description: 'Production server'
    }
]

module.exports = servers;