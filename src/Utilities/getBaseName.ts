const getBaseName = (pathname: string = window.location.pathname): string => {
  let release = '/';
  const pathName = pathname.split('/');

  pathName.shift();

  if (pathName[0] === 'preview' || pathName[0] === 'beta') {
    release = pathName[0] === 'preview' ? `/preview/` : `/beta/`;
    pathName.shift();
  }

  return `${release}${pathName[0]}/${pathName[1] || ''}`;
};

export default getBaseName;
