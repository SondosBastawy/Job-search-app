import { ErrorHandleClass } from "../utils/error.class.util.js";

export const errorHandle = (API) => {
  return (req, res, next) => {
      API(req, res, next).catch((err) => {
        console.log("Error in async handler scope", err);
        next(new ErrorHandleClass("Internal Server error", 500, err.message));
      })
  
  };
};

export const globalResponse = (err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      message: "Fail response",
      err_msg: err.message,
      err_location: err.location,
      err_data: err.data,
    });
  }
};
