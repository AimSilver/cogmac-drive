export function managerGuard(user) {
  if (!user.isManager) {
    console.log("user not manager", user);
    return false;
  }

  return true;
}
