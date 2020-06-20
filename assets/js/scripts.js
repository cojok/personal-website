var menuBtn = document.querySelector('.navigation .c-hamburger'),
    navigation = document.querySelector('.navigation'),
    navigationElem = document.querySelectorAll('.navigation__items li'),
    navigationElemActive = document.querySelector('.navigation__items li.active');

menuBtn.addEventListener('click', function(){
    navigation.classList.toggle('open');
    this.classList.toggle('is-active');

});


navigationElem.forEach(function(value, index){
    value.addEventListener('click', function () {
        document.querySelector('.navigation__items li.active').classList.remove('active');
        this.classList.add('active');
    })
});

var rellax = new Rellax('.rellax');


