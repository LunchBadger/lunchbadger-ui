/**
 * @param storesList {BaseStore[]}
 * @param readyCallback {Function}
 */
export function waitForStores(storesList, readyCallback) {
  let waitingFlag = false;

  if (!waitingFlag) {
    let storesCount = storesList.length;

    waitingFlag = true;

    storesList.forEach((store) => {
      store.addInitListener(() => {
        storesCount--;

        console.log(store, storesCount);

        if (storesCount === 0) {
          readyCallback();
          waitingFlag = false;
        }
      });
    });
  }
}
