(function () {
  "use strict"; // Start of use strict

  // document.addEventListener('DOMContentLoaded', () => {
  //   document.querySelectorAll('pre code').forEach((block) => {
  //     hljs.configure({
  //       languages: ['css', 'html', 'javascript', 'python']
  //     });
  //     hljs.highlightBlock(block);
  //   });
  // });

  const createSearchString = function (searchObject) {
    let string = '?';
    for (let i in searchObject) {
      string += `${i}=${searchObject[i]}&`;
    }
    return string.slice(0, -1);
  }

  const home = document.querySelector('.home');
  const posts = document.querySelectorAll('.post-preview');
  const chunk = 5;
  const delta = Math.ceil(posts.length / chunk);
  const searchString = location.search.substring(1);
  let page = 1;
  let searchObject = {
    page,
  };
  if (home) {
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
  }

  var formLabelGroup = document.querySelectorAll('.floating-label-form-group');
  var form = document.querySelector('#contactForm');
  var validateEmail = function (elm) {
    var emailRegex = /^(([^<>()\[\]\.,;:\s@\']+(\.[^<>()\[\]\.,;:\s@\']+)*)|(\'.+\'))@(([^<>()[\]\.,;:\s@\']+\.)+[^<>()[\]\.,;:\s@\']{2,})$/i;
    if (!emailRegex.test(elm.value)) {
      var errText = elm.getAttribute('data-validation-required-message');
      document.querySelector(`#${elm.id} + .text-danger`).innerHTML = errText || 'Not a valid email';
      elm.classList.add('text-danger');
      return false;
    }
    document.querySelector(`#${elm.id} + .text-danger`).innerHTML = '';
    elm.classList.remove('text-danger');
    return true;
  }

  var validateName = function (elm) {
    if (elm.value.length < 3) {
      var errText = elm.getAttribute('data-validation-required-message');
      document.querySelector(`#${elm.id} + .text-danger`).innerHTML = errText || 'Not a valid email';
      elm.classList.add('text-danger');
      return false;
    }
    document.querySelector(`#${elm.id} + .text-danger`).innerHTML = '';
    elm.classList.remove('text-danger');
    return true;
  }
  var validateMessage = function (elm) {
    if (elm.value.length < 3) {
      var errText = elm.getAttribute('data-validation-required-message');
      document.querySelector(`#${elm.id} + .text-danger`).innerHTML = errText || 'Not a valid email';
      elm.classList.add('text-danger');
      return false;
    }
    document.querySelector(`#${elm.id} + .text-danger`).innerHTML = '';
    elm.classList.remove('text-danger');
    return true;
  }
  if (form) {
    for (var i = 0; i < formLabelGroup.length; i++) {
      formLabelGroup[i].addEventListener('input', function (e) {
        if (e.target.value.length > 0) {
          this.classList.add('floating-label-form-group-with-value');
        } else {
          this.classList.remove('floating-label-form-group-with-value');
        }
      }, true);
      formLabelGroup[i].addEventListener('focus', function (e) {
        this.classList.add('floating-label-form-group-with-focus');
      }, true);
      formLabelGroup[i].addEventListener('blur', function () {
        this.classList.remove('floating-label-form-group-with-focus');
      }, true);
    }


    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameValidation = validateName(this.name);
      var emailValidation = validateEmail(this.email);
      var messageValidation = validateMessage(this.message);

      if (emailValidation || nameValidation || messageValidation) {      
        var body = {
          name: this.name.value,
          email: this.email.value,
          message: this.message.value,
        };
        var alert = document.querySelector('.alert');
        var alertHeading = document.querySelector('.alert .alert-heading');
        var alertBody = document.querySelector('.alert .alert-body')
        var oReq = new XMLHttpRequest();
        var self = this;
        oReq.open('POST', 'https://api.flaviuscojocariu.com/v1/contact');
        oReq.setRequestHeader('Access-Control-Allow-Origin', 'https://www.flaviuscojocariu.com');
        oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        oReq.send(JSON.stringify(body));
        oReq.addEventListener('load', function () {
          if(this.status >= 200 && this.status < 300) {
            self.name.value = '';
            self.email.value = '';
            self.message.value = '';
            alert.classList.add('alert-success');
            alertHeading.innerHTML = 'Contact sent successful!';
            alertBody = 'An email with the contact details like name, email and message was sent successful to my inbox. I will try to get in touch soon. <br> Thanks.'
          } else {
            alert.classList.add('alert-danger');
            alertHeading.innerHTML = 'Something went wrong!';
            alertBody.innerHTML = 'looks like something went wrong while you tried to contact me. If this is a permanent error you can send me an email at: <a href="mailto: cojokk@gmail.com">cojokka@gmail.com</a>. <br> Thanks.';
          }
          alert.classList.remove('hidden');
          setTimeout(function () {
            alert.classList.add('hidden');
          }, 10000);
        });
        oReq.addEventListener('error', function() {
          alert.classList.add('alert-danger');
          alertHeading.innerHTML = 'Something went wrong!';
          alertBody.innerHTML = 'Looks like something went wrong while you tried to contact me. If this is a permanent error you can send me an email at: <a href="mailto: cojokk@gmail.com">cojokka@gmail.com</a>. <br> Thanks.';
          alert.classList.remove('hidden');
          setTimeout(function () {
            alert.classList.add('hidden');
          }, 10000);
        });
      }
    }, true);
  }

})(); // End of use strict
