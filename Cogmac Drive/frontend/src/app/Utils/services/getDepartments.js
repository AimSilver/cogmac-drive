import { getFetchMethod } from "../methods/fetchMethods.js";

export async function getDepartmentsService(url) {
  const { data: departments } = await getFetchMethod(url);
  if (!departments) {
    console.log("failed to fetch departmemts");
  }
  return { departments };
}
