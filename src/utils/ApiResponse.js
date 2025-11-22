class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode<400 
    }
}

// ApiResponse standardizes the format of successful API responses.
// It adds statusCode, data, message, and sets success = statusCode < 400.
// This helps maintain consistency across the entire backend.