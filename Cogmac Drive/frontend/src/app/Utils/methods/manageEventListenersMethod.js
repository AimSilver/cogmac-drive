// not using this method  it just for trial purpose
export function manageEventListeners(element, handler, event, action) {
  if (action === "add") {
    element.addEventListener(event, handler);
  } else if (action === "remove") {
    element.removeEventListener(event, handler);
  }
}
// using this method to add and remove eventlistener
export const eventListener = {
  add(element, event, handler) {
    element.addEventListener(event, handler);
  },
  remove(element, event, handler) {
    element.removeEventListener(event, handler);
  },
};
