const asyncHandler = (requestHandler) => {
    //to catch errors in async functions 
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }


 //The Promise is used in  asyncHandler to handle asynchronous errors in Express route handlers.

// When you use async functions in Express, errors thrown inside them won't be caught by Express's default error handler unless you manually catch them or use a wrapper like this. By wrapping the handler in Promise.resolve(...).catch(...), any error (including rejected promises) is automatically passed to next(err), triggering Express's error middleware.

// This pattern ensures that both synchronous and asynchronous errors are handled consistently, preventing unhandled promise rejections and simplifying error management in your routes.