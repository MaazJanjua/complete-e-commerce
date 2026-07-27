class apiError extends Error {
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        stack = ''
    ) {
        this.statusCode = statusCode,
            this.message = message,
            this.data = null,
            this.errors = errors,
            this.success = false

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export {
    apiError
}