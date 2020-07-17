(function() {
  "use strict"; // Start of use strict

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.configure({
        languages: ['css', 'html', 'javascript', 'python']
      });
      hljs.highlightBlock(block);
    });
  });

  var formLabelGroup = document.querySelectorAll('.floating-label-form-group');

  for (var i = 0; i < formLabelGroup.length; i++) {
    formLabelGroup[i].addEventListener('input', function(e) {
      if(e.target.value.length > 0) {
        this.classList.add('floating-label-form-group-with-value');
      } else {
        this.classList.remove('floating-label-form-group-with-value');
      }
    }, true);
    formLabelGroup[i].addEventListener('focus', function(e) {
      this.classList.add('floating-label-form-group-with-focus');
    }, true);
    formLabelGroup[i].addEventListener('blur', function() {
      this.classList.remove('floating-label-form-group-with-focus');
    }, true);
  }

})(); // End of use strict
