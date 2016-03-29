define(['knockout', 'jquery', 'text!./change-password.html', 'decompose-url'], function(ko, $, template, decomposeUrl) {
    function ViewModel() {
        var self = this,
            url = decomposeUrl(window.location.href);

        self.login = ko.observable(window.recoveryLogin)
            .syncWith('login-input', true);
        self.dispose = function() {
            self.login.unsubscribeFrom('login-input')
        };

        self.password = ko.observable('')
            .extend({password: ''});

        self.code = '';
        self.useGeneratedPassword = ko.observable(true);
        self.saveSuccess = ko.observable(false);
        self.waitingResponse = ko.observable(false);

        self.hasLogin = ko.pureComputed(function(){
            return self.login() != '' && self.login() != 0;
        });

        self.canChange = ko.pureComputed(function(){
            return self.password.valid()
                && !self.waitingResponse();
        });

        self.openAuthForm = ko.postbox.publish.bind(ko, 'login-state', 'auth');

        self.change = function(){
            if (!self.canChange()) {
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
                    'restorepassword': 1,
                    'code': self.code,
                    'password': self.password(),
                    'password_ext': self.password(),
                    'json': 1
                }
            }).then(function(data){
                if (data.result !== 'success') {
                    self.password.validationMessage(data.message);
                    self.password.hasError(true);
                    return;
                }

                self.saveSuccess(true);
            }).always(function(){
                self.waitingResponse(false);
            });
        };

        self.code = (url.query && url.query.code) ? url.query.code : '';
    }

    return {
        viewModel: ViewModel,
        template: template
    };
});