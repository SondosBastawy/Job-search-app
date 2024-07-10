import { Job } from "../../../database/models/job.model.js";
import { Company } from "../../../database/models/company.model.js";
import { ErrorHandleClass } from "../../utils/error.class.util.js";
import { Application } from "../../../database/models/application.model.js";

// create job
const addJob = async (req, res, next) => {
  // get HR id from req.authUser
  const { _id: companyHR } = req.authUser;
  // destruct data from body
  const {
    jobTitle,
    jobDescription,
    jobLocation,
    workingTime,
    seniorityLevel,
    technicalSkills,
    softSkills,
    companyId
  } = req.body;
  // create job
  const newJob = {
    jobTitle,
    jobDescription,
    jobLocation,
    workingTime,
    seniorityLevel,
    technicalSkills,
    softSkills,
    companyId,
    addedBy: companyHR,
  };
  // save job
  let job = await Job.create(newJob);
  res.json({ message: "job added successfully", job });
};

// *****************************************
// Update job data
const updateJob = async (req, res, next) => {
  // destruct data to update it
  const {
    jobTitle,
    jobDescription,
    jobLocation,
    workingTime,
    seniorityLevel,
    technicalSkills,
    softSkills,
    companyId
  } = req.body;
  const { _id: CompanyHR } = req.authUser;
  const { jobId } = req.params;
  const job = await Job.findById(jobId);
  // check if job exist
  if (!job) {
    return next(new ErrorHandleClass("job not found", 404, "job not found"));
  }
  // update job
  const newObject = {
    jobTitle,
    jobDescription,
    jobLocation,
    workingTime,
    seniorityLevel,
    technicalSkills,
    softSkills,
  };
  // update job data and return the newObject
  const updatedJob = await Company.findByIdAndUpdate(jobId, newObject, {
    new: true,
  });
  //  if data does not updated
  if (!updatedJob)
    return next(
      new ErrorHandleClass("Data not updated", 404, "data not updated")
    );
  res.status(200).json({ massage: "job updated", updatedJob });
};

// **************************************************
/**
 * Deletes a job from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object with a success message.
 */
const deleteJob = async (req, res, next) => {
  // Extract the jobId from the request parameters
  const { jobId } = req.params;
  // Get the CompanyHR id from the authenticated user
  const { _id: CompanyHR } = req.authUser;

  // Find and delete the job with the given jobId
  const job = await Job.findByIdAndDelete(jobId);

  // Return a success message
  res.status(200).json({ massage: "job deleted" });
};

// ************************************************
// Get all Jobs with their company’s information.
/**
 * Retrieves all jobs with their associated company information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object with the jobs data.
 */
const getAllJobs = async (req, res, next) => {
  // Extract the CompanyHR id from the authenticated user
  const { _Id: CompanyHR } = await req.authUser;

  // Find all jobs and populate the company information for each job
  const jobs = await Job.find().populate("companyId");

  // Return the jobs data as a success response
  res.status(200).json({ jobs });
};

// ************************************************
// Get all Jobs for a specific company.
/** *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The response object with the company and jobs data.
 */
const getCompanyJobs = async (req, res, next) => {
  // Extract the company id from the request parameters
  const { _id: CompanyHR } = await req.authUser;
  const { companyName } = req.query;

  // Find the company with the given id
  const company = await Company.findOne({ companyName });

  // If the company is not found, return an error response
  if (!company) {
    return next(
      new ErrorHandleClass("Company not found", 404, "company not found")
    );
  }
  // Find jobs related to the company
  const jobs = await Job.find({ company: company._id });

  // Return the company and jobs data as a success response
  res.status(200).json({ company, jobs });
};
// ***********************************************************
// Get all Jobs that match the following filters
const filterJobs = async (req, res) => {
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;
  // Build the filter object dynamically based on provided query parameters
  const filter = {};
  if (workingTime) filter.workingTime = workingTime;
  if (jobLocation) filter.jobLocation = jobLocation;
  if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
  if (jobTitle) filter.jobTitle = { $regex: new RegExp(jobTitle, "i") };
  if (technicalSkills && technicalSkills.length > 0) {
    filter.technicalSkills = { $in: technicalSkills }; // Match jobs that have at least one of the provided skills
  }
  // Find jobs that match the filter criteria
  const jobs = await Job.find(filter).populate("company");

  res.status(200).json({ jobs });
};
/******************************************************
 * Apply to a job.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - The response object with a success message.
 */
const applyToJob = async (req, res) => {
  // Extract the data from the request body
  const { jobId, userId, userTechSkills, userSoftSkills, userResume } =
    req.body;

  // Find the job with the given id
  const job = await Job.findById(jobId);
  // If the job is not found, return an error response
  if (!job) {
    return next(new ErrorHandleClass("Job not found", 404, "job not found"));
  }
  // Add the user to the list of applied users for the job
  Application.appliedUsers.push(userId);
  // Save the changes to the application
  await Application.save();
  // Return a success response
  res.status(200).json({ message: "Applied successfully" });
};

export {
  addJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getCompanyJobs,
  filterJobs,
  applyToJob,
};
