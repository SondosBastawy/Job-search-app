import { Router } from "express";
import { authMiddleWare } from "../../middlewares/auth.middleware.js";
import { Authorization } from "../../middlewares/authrize.Middleware.js";
import { errorHandle } from "../../middlewares/errorHandling.middleware.js";
import { roles, systemRoles } from "../../utils/system.roles.js";
import { validationMiddleWare } from "../../middlewares/validation.middleware.js";
import {
  createCompany,
  deleteCompany,
  getApplicationsForJob,
  getCompanyData,
  searchCompany,
  updateCompany,
} from "../Company/company.controller.js";
import { createComSchema } from "./company.schema.js";
createComSchema;

const companyRouter = Router();

companyRouter.post(
  "/create",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(systemRoles.Company_HR)),
  validationMiddleWare(createComSchema),
  errorHandle(createCompany)
);
companyRouter.patch(
  "/updateData/:_id",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(systemRoles.Company_HR)),
  errorHandle(updateCompany)
);
companyRouter.delete(
  "/deleteCompany/:_id",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(systemRoles.Company_HR)),
  errorHandle(deleteCompany)
);
companyRouter.get(
  "/getCompanyData",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(systemRoles.Company_HR)),
  errorHandle(getCompanyData)
);
companyRouter.post(
  "/SearchCompany",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(roles.USER_Company_HR)),
  errorHandle(searchCompany)
);
companyRouter.get(
  "/getAllApp",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(systemRoles.Company_HR)),
  errorHandle(getApplicationsForJob)
);

export default companyRouter;
