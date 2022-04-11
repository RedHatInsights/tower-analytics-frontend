const getBaseName = (pathname: string = window.location.pathname): string => {
  let release = '/';
  const pathName = pathname.split('/');

  pathName.shift();

  if (pathName[0] === 'beta') {
    pathName.shift();
    release = `/beta/`;
  }

  return `${release}${pathName[0]}/${pathName[1] || ''}`;
};

export default getBaseName;
