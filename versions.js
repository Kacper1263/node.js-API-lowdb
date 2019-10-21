var versions = [
    {
        "version": "v1",
        "routes": [
            "delete", "get", "post","put"
        ]
    },
    {
        "version": "v2",
        "routes": [
            "delete", "deleteAll", "get", "post", "put", "register"
        ]
    }
]

function latestVersion(){
    return versions[versions.length - 1].version
}

function getRoutes(version){
    versions.forEach(ver =>{
        if(ver.version == version) return console.log(ver.routes)
    })
}

module.exports.latestVersion = latestVersion
module.exports.getRoutes = getRoutes