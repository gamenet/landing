define(['knockout', 'jquery', 'text!./confirm.html', 'decompose-url'], function(ko, $, template, decomposeUrl) {
    function ViewModel() {
        var self = this;

        self.login = ko.observable('')
            .extend({login: ''})
            .syncWith('login-input', true);
        self.dispose = function() {
            self.login.unsubscribeFrom('login-input')
        };

        self.password = ko.observable('')
            .extend({password: ''});


        self.waitingResponse = ko.observable(false);
        self.useGeneratedPassword = ko.observable(true);
        self.url = decomposeUrl(window.location.href);

        self.canRegister = ko.pureComputed(function(){
            return self.login.valid()
                && self.password.valid()
                && !self.waitingResponse();
        });

        self.vkLogin = ko.postbox.publish.bind(ko, 'vk', 'login');

        self.create = function(){
            if (!self.canRegister()) {
                return;
            }

            self.waitingResponse(true);

            $.post(window.domainData.auth, {
                'guest': 'confirm',
                'userId': window.userData.userId,
                'appKey': window.userData.appKey,
                'login': self.login(),
                'password': self.password()
            }, function(data){
                if (data.response.userId === undefined) {
                    self.login.validationMessage(data.response.error.message);
                    self.login.hasError(true);
                    return;
                }

                if (self.url.query && self.url.query.rp) {
                    window.location.href = decodeURIComponent(self.url.query.rp);
                } else {
                    window.location.href = '/feed/';
                }
            }, 'json').always(function(){
                self.waitingResponse(false);
            });
        };
    }

    return {
        viewModel: ViewModel,
        template: template
    };
});