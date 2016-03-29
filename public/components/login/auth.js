define(['knockout', 'jquery', 'text!./auth.html', 'decompose-url'], function (ko, $, template, decomposeUrl) {
    function ViewModel() {
        var self = this;

        self.login = ko.observable('')
            .extend({login: ''})
            .syncWith('login-input', true);
        self.login.subscribe(function () {
            self.canCreateAccount(false);
        });
        self.dispose = function() {
            self.login.unsubscribeFrom('login-input')
        };

        self.password = ko.observable('')
            .extend({password: ''});

        self.captcha = ko.observable('')
            .extend({captcha: ''});

        self.captchaImageSrc = ko.observable('');
        self.isCaptchaNeed = ko.observable(false);
        self.useGeneratedPassword = ko.observable(false);
        self.canCreateAccount = ko.observable(false);
        self.waitingResponse = ko.observable(false);
        self.url = decomposeUrl(window.location.href);

        self.canAuth = ko.pureComputed(function () {
            return self.login.valid()
                && self.password.valid()
                && (!self.isCaptchaNeed() || self.isCaptchaNeed() && self.captcha.valid())
                && !self.canCreateAccount()
                && !self.waitingResponse();
        });

        self.openRegForm = ko.postbox.publish.bind(ko, 'login-state', 'register');
        self.openUnblockForm = ko.postbox.publish.bind(ko, 'login-state', 'unblock');
        self.openAmnesiaForm = ko.postbox.publish.bind(ko, 'login-state', 'amnesia');
        self.vkLogin = ko.postbox.publish.bind(ko, 'vk', 'login');

        self.reloadCaptcha = function () {
            self.captchaImageSrc(window.domainData.auth + '/?captcha&type=login&login=' + self.login() + '&' + Math.random());
        };

        self.auth = function () {
            if (!self.canAuth()) {
                return;
            }

            self.waitingResponse(true);

            $.ajax({
                url: window.domainData.auth,
                type: 'POST',
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                dataType: "json",
                data: {
                    'login': self.login(),
                    'password': encodeURIComponent(self.password()),
                    'captcha': self.captcha(),
                    'json': 1
                }
            })
            .then(function (data) {
                if (data.result !== true) {
                    if (data.code === -1) {
                        if (self.isCaptchaNeed()) {
                            self.captcha.validationMessage('');
                        } else {
                            self.captcha.validationMessage('Введите код изображения');
                        }

                        self.reloadCaptcha();
                        self.isCaptchaNeed(true);
                        self.captcha.hasError(true);
                    } else if (data.code == 1) {
                        self.password.validationMessage('Проверьте правильность пароля');
                        self.password.hasError(true);
                        self.reloadCaptcha();
                    } else if (data.code == 3) {
                        self.login.hasError(true);
                        self.canCreateAccount(true);
                    } else if (data.code == -2) {
                        window.location.href = '/auth/blocked/';
                    } else if (data.code == -3) {
                        self.openUnblockForm();
                    }

                    self.waitingResponse(false);
                    return;
                }

                return $.get('/auth/', {k: data.key}, function () {
                    if (self.url.query && self.url.query.rp) {
                        window.location.href = self.url.query.rp;
                    } else {
                        window.location.reload();
                    }
                });
            }).fail(function(){
                self.waitingResponse(false);
            });
        };
    }

    return {
        viewModel: ViewModel,
        template: template
    };
});
