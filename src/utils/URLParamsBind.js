export function bindParams(address, params) {
  let url = address;

  if (address.length > 0) {
    Object.keys(params).forEach((key) => {
      url = url.replace(new RegExp('\\b/\\:' + key + '\\b'), '/' + params[key]);
    });
  }

  return url;
}
