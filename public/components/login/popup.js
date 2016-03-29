define(['knockout', 'text!./popup.html', 'css!./popup.css'], function (ko, template) {
    ko.components.register('auth', {require: '/components/login/auth.js'});
    ko.components.register('register', {require: '/components/login/register.js'});
    ko.components.register('amnesia', {require: '/components/login/amnesia.js'});
    ko.components.register('unblock', {require: '/components/login/unblock.js'});
    ko.components.register('confirm', {require: '/components/login/confirm.js'});
    ko.components.register('change-password', {require: '/components/login/change-password.js'});

    function LoginPopup(opts) {
        var self = this;

        self.state = ko.observable(opts.page).syncWith("login-state");
        self.state.subscribe(function (value) {
            if (typeof window['ga'] == 'function') {
                ga('send', 'event', 'login-popup', 'open', value);
            }
        });

        ko.postbox.subscribe("vk", function (action) {
            if (action === 'login') {
                window.GN.login('vk');
            }
        });
    }

    return {
        viewModel: LoginPopup,
        template: template
    }
});
