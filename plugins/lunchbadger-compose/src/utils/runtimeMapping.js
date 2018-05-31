import {
  javascriptReservedWords,
  pythonReservedWords
} from './';

const editorCodeLanguages = {
  Node: 'javascript',
  Python: 'python',
  // java: 'java',
  // 'c#': 'csharp',
};

export default (runtime, reverse = false) => {
  let arr;
  let mapping;
  let language;
  let reservedWords;
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
  if (env === 'nodejs') {
    language = 'JavaScript';
    reservedWords = javascriptReservedWords;
  } else if (env === 'python') {
    language = 'Python';
    reservedWords = pythonReservedWords;
  }
  return {
    data: {env, version, language, reservedWords},
    lb: `${env} ${version}`,
    sls: `${env}${version}`,
    editorCodeLanguage: editorCodeLanguages[env],
  };
};
