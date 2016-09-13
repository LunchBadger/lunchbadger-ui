/**
 * @param storesList {BaseStore[]}
 * @param readyCallback {Function}
 */
export function waitForStores(storesList) {
  return new Promise(resolve => {
    let storesCount = storesList.length;

    storesList.forEach(store => {
      store.addInitListener(() => {
        storesCount--;

        if (storesCount === 0) {
          resolve();
        }
      });
    });
  });
}
