define(['knockout','page'], function(ko, page){
    ko.components.register('login-popup', {require: '/components/login/popup.js'});

    function LoginModel(app){
        var self = this;

        self.vkLogin = function(){
            window.GN.login('vk');
        };
        self.openAuthForm = app.openPopup.bind(app, 'login-popup', {page: 'auth', loginModel: self});
        self.openRegForm = app.openPopup.bind(app, 'login-popup', {page: 'register', loginModel: self});
        self.openAmnesiaForm = app.openPopup.bind(app, 'login-popup', {page: 'amnesia', loginModel: self});
        self.openConfirmForm = app.openPopup.bind(app, 'login-popup', {page: 'confirm', loginModel: self});
        self.openChangePasswordForm = app.openPopup.bind(app, 'login-popup', {page: 'change-password', loginModel: self});

        ko.postbox.subscribe('login-popup', function(page){
            app.openPopup('login-popup', {page: page, loginModel: self});
        });

        ko.postbox.subscribe("vk", function (params) {
            var action = params.action || 'login',
                rp = params.rp || '';

            if (action === 'login') {
                window.GN.login('vk', rp);
            }
        });

        self.redirectToWelcome = function(){
            window.location.href = '/welcome/';
        };

        page.stop();
        page.base('/');
        page('auth', self.openAuthForm);
        page('register', self.openRegForm);
        page('register/game/([A-z0-9]+)', self.openRegForm);
        page('register/direct/([A-z0-9]+)/([A-z]+)', self.openRegForm);
        page('register/game/([A-z0-9]+)/(success)', self.redirectToWelcome);
        page('register/success', self.redirectToWelcome);
        page('confirm', self.openConfirmForm);
        page('restore', self.openAmnesiaForm);
        page('register/restore', self.openAmnesiaForm);
        page('register/changepassword', self.openAmnesiaForm);
        page('restore', self.openAmnesiaForm);
        page('restore/changepassword', self.openChangePasswordForm);
        page({hashbang: false});
    }

    return LoginModel;
});
