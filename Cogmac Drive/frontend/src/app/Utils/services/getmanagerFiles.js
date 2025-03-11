import { getFetchMethod } from "../methods/fetchMethods.js";

export async function getManagerFilesService(url) {
  const { data } = await getFetchMethod(url);
  return { data };
}

export async function getManagerFilesBasedOnDepartmentsService(url) {
  const { data } = await getFetchMethod(url);
  return { managerFiles: data };
}
