import runtimeOptions from './runtimeOptions';

const languagesSettings = {
  dotnetcore: ['dot', 'cs'],
  go: ['golang', 'go'],
  java: ['java', 'java'],
  nodejs: ['javascript', 'js'],
  php: ['php', 'php'],
  python: ['python', 'py'],
  ruby: ['ruby', 'rb'],
};

export default (sls) => {
  const [env, version] = sls.split(':');
  const lb = runtimeOptions.find(({value}) => value === sls).label;
  const [editorCodeLanguage, extension] = languagesSettings[env];
  return {
    data: {env, version},
    lb,
    sls,
    editorCodeLanguage,
    extension,
  };
};
