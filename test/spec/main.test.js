'use strict'

describe('DOM', function () {
  describe('login page', function () {
    before(function () {
      if (window.__karma__) {
        $('body').append('<div class="profileContainer"></div>');
        $('body').append('<div class="matchesContainer"></div>');
        $('body').append('<div class="undecidedContainer"></div>');
        $('body').append('<form class="loginForm"></form>');
        $('body').append('<form class="registerForm"></form>');
        $('body').append('<button id="loginRevealBtn">Login</button>');
        $('body').append('<button id="registerRevealBtn">Register</button>');
      }
    });

    beforeEach(function () {
      $('.profileContainer').hide();
      $('.matchesContainer').hide();
      $('.undecidedContainer').hide();
      $('.loginForm').hide();
      $('.registerForm').hide();
    });

    describe('toggleForms', function () {
      it('should toggle visibility of login form', function () {
        // initially login form is hidden
        $('.loginForm').is(':hidden').should.be.true;

        // click loginRevealBtn
        $('#loginRevealBtn').click();

        // login form is no longer hidden
        $('.loginForm').is(':hidden').should.be.false;
      });
      it('should toggle visibility of register form', function () {
        // initially login form is hidden
        $('.registerForm').is(':hidden').should.be.true;

        // click loginRevealBtn
        $('#registerRevealBtn').click();

        // login form is no longer hidden
        $('.registerForm').is(':hidden').should.be.false;
      });
    });

    describe('addProfileInfo', function() {
      it('should append profile info to profileContainer', function() {
        var data = {name: "myName", gender: "male", desc: "I enjoy movies"};
        var uuid = "abc123";

        // initially profilecontainer is empty
        $('.profileContainer').is(':empty').should.be.true;

        addProfileInfo(data, uuid);

        $('.profileContainer').is(':empty').should.be.false;


      });
    });

  });
});
