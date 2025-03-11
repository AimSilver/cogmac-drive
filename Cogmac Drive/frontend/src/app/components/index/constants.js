export const welcomBtn = document.querySelector(".welcome-btn");
export const loginModal = document.getElementById("login-modal");
export const closeLoginBtn = document.querySelector(".close-login-modal");

export const googleSigninBtn = document.getElementById("google-signin-btn");
// for login process
export const loginForm = document.getElementById("login-form");
export const Email = document.getElementById("email");
export const Password = document.getElementById("password");

// functions for auth process
export function sanitizeInput(input) {
  return input.trim().replace(/[<>"'/]/g, "");
}
export function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
export function validatePassword(password) {
  return password.length >= 8;
}
