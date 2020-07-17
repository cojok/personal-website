(function () {
  'use strict';

  const createSearchString = function (searchObject) {
    let string = '?';
    for(let i in searchObject) {
      string += `${i}=${searchObject[i]}&`;
    }
    return string.slice(0, -1);
  }

  const posts = document.querySelectorAll('.post-preview');
  const chunk = 5;
  const delta = Math.ceil(posts.length / chunk);
  const searchString = location.search.substring(1);
  let page = 1;
  let searchObject = {
    page,
  };

  if (searchString.length > 0) {
    searchObject = JSON.parse('{"' + decodeURI(searchString).replace(/"/g, '\\"')
      .replace(/&/g, '","').replace(/=/g, '":"') + '"}');
  }
  if (Object.keys(searchObject).indexOf('page') !== -1) {
    if (parseInt(searchObject.page) > delta) {
      searchObject.page = 1;
      const searchQuery = createSearchString(searchObject);
      location.search = searchQuery;
      page = 1;
    } else {
      page = parseInt(searchObject.page);
    }
  }

  const pageElements = document.querySelectorAll('.page-' + page);
  const oldPosts = document.querySelector('.old-posts');
  const newPosts = document.querySelector('.new-posts');

  for (let i = 0; i < pageElements.length; i++) {

    if (page < delta) {
      oldPosts.getAttributeNode('href').value = '?page=' + (page + 1);
      oldPosts.style.display = 'block';
    }

    if (page > 1) {
      newPosts.getAttributeNode('href').value = '?page=' + (page - 1);
      newPosts.style.display = 'block';
    }

    pageElements[i].style.display = 'block';
  }

  // const tags = document.querySelectorAll('.post-preview .badge');
  // if(Object.keys(searchObject).indexOf('tag') !== -1) {
  //  for (let i = 0; i < tags.length; i++) {
  //     tags[i].addEventListener('click', function () {
  //       searchObject.tag = this.innerText;
  //       location.search = createSearchString(searchObject);
  //     })
  //   }
  // }

})()