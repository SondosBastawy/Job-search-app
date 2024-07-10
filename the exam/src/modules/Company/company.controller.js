import { Application } from "../../../database/models/application.model.js";
import { Company } from "../../../database/models/company.model.js";
import { Job } from "../../../database/models/job.model.js";
import { User } from "../../../database/models/user.model.js";
import { ErrorHandleClass } from "../../utils/error.class.util.js";

// create company
const createCompany = async (req, res, next) => {
  // get HR id from req.authUser
  const { _id: companyHR } = req.authUser;
  // destruct data from body
  const {
    companyName,
    description,
    industry,
    companyEmail,
    numberOfEmployees,
    address,
  } = req.body;
  // create company
  const newCompany = {
    companyName,
    description,
    industry,
    companyHR,
    companyEmail,
    numberOfEmployees,
    address,
  };
  // save company
  let company = await Company.create(newCompany);
  res.json({ message: "company added successfully", company });
};

// ***********************************************
// Update company data
const updateCompany = async (req, res, next) => {
  // destruct data to update it
  const {
    companyName,
    description,
    industry,
    companyEmail,
    numberOfEmployees,
    address,
  } = req.body;
  const { _id: CompanyHR } = req.authUser;
  const  {_id}= req.params;
  const company = await Company.findById(_id);
  // check if company exist
  if (!company) {
    return next(
      new ErrorHandleClass("Company not found", 404, "company not found")
    );
  }
  // update user
  const newObject = {
    companyName,
    description,
    industry,
    companyEmail,
    numberOfEmployees,
    address,
  };
  // update company data and return the newObject
  const updatedData = await Company.findByIdAndUpdate(_id, newObject, {
    new: true,
  });
  //  if data does not updated
  if (!updatedData)
    return next(
      new ErrorHandleClass("Data not updated", 404, "data not updated")
    );
  res.status(200).json({ massage: "company updated", updatedData });
};
// ****************************************
// delete company data

/**
 * Deletes a company from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object with a success message.
 */
const deleteCompany = async (req, res, next) => {
  // Extract the CompanyHR id from the authenticated user
  const { _id: CompanyHR } = req.authUser;
  const {_id} = req.params
  // Find and delete the company with the given id
  const company = await Company.findByIdAndDelete(_id);
  // Return a success message
  res.status(200).json({ massage: "company deleted" });
};

// **************************************************************8
// Get company data

const getCompanyData = async (req, res, next) => {
  const { _id: CompanyHR } = await req.authUser;
  const { companyId } = req.params;

  const company = await Company.findById(companyId);

  if (!company) {
    return next(
      new ErrorHandleClass("Company not found", 404, "company not found")
    );
  }
  // Find jobs related to the company
  const jobs = await Job.find({ company: companyId });

  res.status(200).json({ company, jobs });
};
// ********************************************************
// search company by name
const searchCompany = async (req, res, next) => {
  // get company name from query
  const { companyName } = req.query;

  if (!companyName) {
    return next(
      new ErrorHandleClass(
        "Company name is not correct",
        400,
        "Company name is not correct"
      )
    );
  }
  const company = await Company.findOne({ companyName });

  if (!company) {
    return next(
      new ErrorHandleClass("Company not found", 404, "company not found")
    );
  }
  res.status(200).json({ company });
};
// ***********************************************************
// get all applications for specific job

const getApplicationsForJob = async (req, res, next) => {
  const { _id: companyHR } = req.authUser;
  const { jobId } = req.params;

  const job = await Job.findById(jobId);

  if (!job) {
    return next(new ErrorHandleClass("Job not found", 404, "job not found"));
  }
  // Find applications related to the job
  const applications = await Application.find({ job: jobId });
  // find the user whose created this job
  const user = await User.findById(job.addedBy);
  if (job.addedBy._id != req.authUser._id) {
    return next(
      new ErrorHandleClass(
        "You are not authorized",
        401,
        "You are not authorized"
      )
    );
  }

  res.status(200).json({ job, applications });
};

export {
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyData,
  searchCompany,
  getApplicationsForJob,
};
