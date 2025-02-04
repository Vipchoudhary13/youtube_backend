// promise method :-
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

// try catch method :-
// const asyncHandler = (fun) => async(req, res, next) => {
//     try {
//         await fun(req, res, next)
//     } catch (err) {
//         res.status(err.code || 500).join({
//             success: false,
//             message: err.message
//         })
//     }
// }

export { asyncHandler };
