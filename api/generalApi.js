import API from "./axios";


export const createReport = async (data) => {
  return API.post("/report-issue", data);
};


