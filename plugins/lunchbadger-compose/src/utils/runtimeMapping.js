const editorCodeLanguages = {
  Node: 'javascript',
  Python: 'python',
  // java: 'java',
  // 'c#': 'csharp',
};

export default (runtime, reverse = false) => {
  let arr;
  let mapping;
  if (!reverse) {
    arr = runtime.replace(/(\d)/, ' $1').split(' ');
    mapping = {
      nodejs: 'Node',
      python: 'Python',
    };

  } else {
    arr = runtime.toLowerCase().split(' ');
    mapping = {
      node: 'nodejs',
      python: 'python',
    }
  }
  const env = mapping[arr[0]];
  const version = arr[1];
  return {
    data: {env, version},
    lb: `${env} ${version}`,
    sls: `${env}${version}`,
    editorCodeLanguage: editorCodeLanguages[env],
  };
};
