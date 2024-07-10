import { Router } from "express";

import { authMiddleWare } from "../../middlewares/auth.middleware.js";
import { Authorization } from "../../middlewares/authrize.Middleware.js";
import { errorHandle } from "../../middlewares/errorHandling.middleware.js";
import { roles, systemRoles } from "../../utils/system.roles.js";
import { validationMiddleWare } from "../../middlewares/validation.middleware.js";
import {
  addJob,
  applyToJob,
  deleteJob,
  filterJobs,
  getAllJobs,
  getCompanyJobs,
  updateJob,
} from "./job.controller.js";
import { addJobSchema } from "./job.schema.js";

const jobRouter = Router();

jobRouter.post(
  "/addJob",
  authMiddleWare(),
  errorHandle(Authorization(systemRoles.Company_HR)),
  validationMiddleWare(addJobSchema),
  errorHandle(addJob)
);
jobRouter.patch(
  "/updateData",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(systemRoles.Company_HR)),
  errorHandle(updateJob)
);
jobRouter.delete(
  "/deleteCompany",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(systemRoles.Company_HR)),
  errorHandle(deleteJob)
);
jobRouter.get(
  "/getAllJobs",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(roles.USER_Company_HR)),
  errorHandle(getAllJobs)
);
jobRouter.get(
  "/getCompanyJob",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(roles.USER_Company_HR)),
  errorHandle(getCompanyJobs)
);
jobRouter.get(
  "/fliterJob",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(roles.USER_Company_HR)),
  errorHandle(filterJobs)
);
jobRouter.post(
  "/applyToJob",
  errorHandle(authMiddleWare()),
  errorHandle(Authorization(systemRoles.USER)),
  errorHandle(applyToJob)
);

export default jobRouter;
