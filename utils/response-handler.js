exports.success_function = function (api_data) {

    let response = {
        success: true,
        statusCode: api_data.statusCode,
        data: api_data.data ? api_data.data : null,
        user_type: api_data.user_type ? api_data.user_type : null,
        user_id: api_data.user_id? api_data.user_id :null,
        message: api_data.message ? api_data.message : null
    }
    return response;
}

exports.error_function = function (api_data) {

    let response = {
        success: false,
        statusCode: api_data.statusCode,
        data: api_data.data ? api_data.data : null,
        user_type: api_data.user_type ? api_data.user_type : null,
        user_id: api_data.user_id ? api_data.user_id : null,
        message: api_data.message ? api_data.message : null,
    }
    return response;
}

