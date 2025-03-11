import { authguard } from "../Guards/authGuard.js";
import { getTokenUserFromLocalStorage } from "../functions.js";

// fetch get method
export async function getFetchMethod(url) {
  const { token } = getTokenUserFromLocalStorage();
  if (!authguard(token)) {
    console.log("user not authorized");
    return;
  }
  if (!token) console.log("user and token not found");
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        acces_token: `${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("fail to fetch data" || errorData.message);
    }
    const data = await response.json();
    console.log(`successfully fetched data`, data);
    return { data };
  } catch (error) {
    console.error(error.message, "Error");
  }
}
// fetch patch method
export async function patchFetchMethod(url, data, cb) {
  const { token, user } = getTokenUserFromLocalStorage();
  if (!authguard(token)) {
    console.log("user not authorized");
    return;
  }
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        acces_token: `${token}`,

        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      await cb(errorData);
      throw new Error(errorData.message || "failed to update data");
    }
    const serverResponse = await response.json();
    console.log(serverResponse.message);
    return { message: serverResponse.message };
  } catch (error) {
    console.error(error.message);
  }
}

// fetch delete method
export async function deleteFetchMethod(url) {
  const { token } = getTokenUserFromLocalStorage();
  if (!authguard(token)) {
    console.log("user not authorized");
    return;
  }
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        acces_token: `${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      alert(`!Failed : \n "${errorData.message}"`);
      throw new Error(errorData.message || "failed to delete");
    }
    const serverResponse = await response.json();
    return { message: serverResponse.message };
  } catch (error) {
    console.error(error.message);
  }
}
// post fetch method
export async function postFetchmethod(url, data, cb) {
  const { token } = getTokenUserFromLocalStorage();
  if (!authguard(token)) {
    console.log("user not authorized");
    return;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        acces_token: `${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      alert(`!Failed : \n "${errorData.message}"`);
      await cb();
      throw new Error(errorData.message || "failed post request");
    }
    const serverResponse = await response.json();
    return { serverResponse };
  } catch (error) {
    console.error(error.message);
  }
}
