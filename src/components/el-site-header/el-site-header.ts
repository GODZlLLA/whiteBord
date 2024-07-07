import urlParse from 'url-parse';

export default () =>{
  const URL = urlParse(location.href);
  const path = URL.pathname;
  const header = document.querySelector('.el-site-header');
  const headerItems = header.querySelectorAll('.el-site-header__map--item');

  [].forEach.call(headerItems, (item: HTMLElement)=> {
    const link = item.querySelector('a');
    const href = link.getAttribute('href');

    if (~path.indexOf(href)) {
      item.setAttribute('data-current', 'true');
    }
  })
}