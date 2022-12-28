const HttpService = require('./http.service');

class HttpController {
    constructor()
    getPageDetail = async (req, res, next) => {try{}
    catch(err){
        next(err)
    }}
}

module.exports = HttpController;
