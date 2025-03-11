import { getFetchMethod } from "../methods/fetchMethods.js";

export async function getActiveUsersService(url) {
  const { data } = await getFetchMethod(url);
  console.log(data);
  return {
    activeUsers: data.activeUsers,
    userDepartments: data.userDepartments,
  };
}
