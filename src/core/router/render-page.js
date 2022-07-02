export const renderPage = async (path, match) => {
  const {default: Page} = await import(`../../pages/${path}/index.js`);

  const page = new Page(match);
  const root = document.getElementById('page-content');

  root.innerHTML = '';
  root.append(page.element);

  return page;
};
