const {constants} = require("../constants");
//create a constant error handler
const errorHandler = (err,req,res,next) => {
    const statusCode = res.statusCode ? res.statusCode : 500; //passes a status code if any.else passes staus 500
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({
                title: `Validation Failed`, 
                message: err.message, 
                statckTrace: err.stack
            });
            break;
        case constants.NOT_FOUND:
            res.json({
                title: `Not Found`, 
                message: err.message, 
                statckTrace: err.stack
            });
        case constants.FORBIDDEN:
            res.json({
                title: `Forbidden`, 
                message: err.message, 
                statckTrace: err.stack
            });
        case constants.UNAUTHORIZED:
            res.json({
                title: `Unauthorized`, 
                message: err.message, 
                statckTrace: err.stack
            });
        case constants.SERVER_ERROR:
            res.json({
                title: `Not Found`, 
                message: err.message, 
                statckTrace: err.stack
            });
    
        default:
            console.log(`No error, All good!`);
            break;
    }
    

};

module.exports = errorHandler;