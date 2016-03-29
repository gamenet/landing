define(['knockout', 'jquery', 'text!./amnesia.html', 'decompose-url'], function(ko, $, template, decomposeUrl) {
    function ViewModel(){
        var self = this,
            url = decomposeUrl(window.location.href);

        self.login = ko.observable((url.query && url.query.login) ? url.query.login : '')
            .extend({login: ''})
            .syncWith('login-input', true);
        self.dispose = function() {
            self.login.unsubscribeFrom('login-input')
        };

        self.captcha = ko.observable('')
            .extend({captcha: ''});

        self.captchaImageSrc = ko.observable('');
        self.restoreSent = ko.observable(false);
        self.waitingResponse = ko.observable(false);

        self.canSend = ko.pureComputed(function(){
            return self.login.valid()
                && self.captcha.valid()
                && !self.waitingResponse();
        });

        self.openAuthForm = ko.postbox.publish.bind(ko, 'login-state', 'auth');
        self.close = ko.postbox.publish.bind(ko, 'popup', {action: 'close'});

        self.reloadCaptcha = function(){
            self.captchaImageSrc(window.domainData.auth + '/?captcha&type=login&' + Math.random());
        };

        self.restore = function(){
            if (!self.canSend()) {
                return false;
            }

            self.waitingResponse(true);

            $.post('/restore/send/', {
                'login': self.login(),
                'captcha': self.captcha()
            }, function(data){
                if (data.result === true) {
                    self.restoreSent(true);
                    return;
                }

                if (data.message.login) {
                    self.login.validationMessage(data.message.login);
                    self.login.hasError(true);
                }
                if (data.message.captcha) {
                    self.captcha.validationMessage(data.message.captcha);
                    self.captcha.hasError(true);
                }
            }, 'json').always(function(){
                self.waitingResponse(false);
            });
        };

        self.reloadCaptcha();
    }

    return {
        viewModel: ViewModel,
        template: template
    };
});
