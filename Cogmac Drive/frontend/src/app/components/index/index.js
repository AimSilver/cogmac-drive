import {
  welcomBtn,
  loginModal,
  closeLoginBtn,
  googleSigninBtn,
} from "./constants.js";
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    welcomBtn.classList.add("fade-in");
  }, 500);
});

welcomBtn.addEventListener("click", () => {
  loginModal.style.display = "block";
  window.location.hash = "#login";
});

closeLoginBtn.addEventListener("click", () => {
  loginModal.style.display = "none";
  window.location.hash = "";
});

googleSigninBtn.addEventListener("click", async () => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=859185920528-30fbnqd6c0f2cg4k6kkrm83epfmq2bs4.apps.googleusercontent.com&redirect_uri=http://localhost:3000/src/app/components/auth/auth.html&scope=openid%20profile%20email`;
  window.location.href = authUrl;
});
