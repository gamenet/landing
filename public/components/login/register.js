define(['knockout', 'jquery', 'text!./register.html', 'decompose-url'], function(ko, $, template, decomposeUrl) {
    function ViewModel() {
        var self = this;

        self.login = ko.observable('')
            .extend({login: ''})
            .syncWith('login-input', true);
        self.login.subscribe(function () {
            self.alreadyExists(false);
            self.commonError('');
        });
        self.dispose = function() {
            self.login.unsubscribeFrom('login-input')
        };

        self.password = ko.observable('')
            .extend({password: ''});
        self.password.subscribe(function () {
            self.commonError('');
        });

        self.alreadyExists = ko.observable(false);
        self.commonError = ko.observable('');
        self.useGeneratedPassword = ko.observable(true);
        self.waitingResponse = ko.observable(false);
        self.referalUserId = window.referalParams ? window.referalParams.userId : undefined;
        self.gameId = window.referalParams ? window.referalParams.gameId : undefined;
        self.mid = window.marketingId ? window.marketingId : undefined;
        self.url = decomposeUrl(window.location.href);

        self.hasCommonError = ko.computed(function(){
            return self.commonError() !== '';
        });

        self.canRegister = ko.pureComputed(function(){
            return self.login.valid()
                && self.password.valid()
                && self.commonError() === ''
                && !self.waitingResponse()
                && !self.alreadyExists();

        });

        self.openAuthForm = ko.postbox.publish.bind(ko, 'login-state', 'auth');
        self.vkLogin = ko.postbox.publish.bind(ko, 'vk', 'login');

        self.create = function(){
            if (!self.canRegister()) {
                return;
            }

            self.waitingResponse(true);

            $.post(window.domainData.auth, {
                'license': 'on',
                'registration': 'submit',
                'login': self.login(),
                'password': self.password(),
                'referalUserId': self.referalUserId,
                'gameId': self.gameId,
                'mid': self.mid,
                'json': 1,
                'dataType': 'json'
            }, function(data){
                if (data.response.result == 'success') {
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
                            'json': 1
                        }
                    }).then(function(data){
                        return $.get('/auth/', {k: data.key}, function(){
                            if (self.url.query && self.url.query.rp) {
                                window.location.href = decodeURIComponent(self.url.query.rp);
                            } else {
                                window.location.reload();
                            }
                        });
                    }).fail(function(){
                        self.waitingResponse(false);
                    });

                    return;
                }

                if (data.response.error.message.login) {
                    if (data.response.error.code == 111) {
                        self.alreadyExists(true);
                        self.waitingResponse(false);
                        return;
                    }

                    self.login.validationMessage(data.response.error.message.login);
                    self.login.hasError(true);
                }
                if (data.response.error.message.password) {
                    self.password.validationMessage(data.response.error.message.password);
                    self.password.hasError(true);
                }

                self.waitingResponse(false);
            }, 'json').fail(function(){
                self.waitingResponse(false);
            });
        };
    }

    return {
        viewModel: ViewModel,
        template: template
    };
});