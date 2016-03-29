define(['knockout', 'jquery', 'text!./unblock.html'], function(ko, $, template) {
    function ViewModel() {
        var self = this;

        self.login = ko.observable('').syncWith('login-input', true);
        self.type = ko.observable();
        self.code = ko.observable('');
        self.sent = ko.observable(false);
        self.error = ko.observable('');
        self.options = ko.observableArray([]);

        self.dispose = function() {
            self.login.unsubscribeFrom('login-input')
        };

        self.canSend = ko.pureComputed(function(){
            return self.options().length > 0;
        });

        self.openAuthForm = ko.postbox.publish.bind(ko, 'login-state', 'auth');
        self.vkLogin = ko.postbox.publish.bind(ko, 'vk', 'login');

        self.send = function(){
            $.get(window.domainData.auth + '/sendCode', {
                'login': self.login(),
                'method': self.type(),
                'dataType': 'json'
            }).then(function(data){
                if (data.response.result !== 1) {
                    self.error(data.response.error.message);
                    return;
                }

                self.error('');
                self.sent(true);
            });
        };

        self.validate = function(){
            $.get(window.domainData.auth + '/unblock', {
                'login': self.login(),
                'code': self.code(),
                'dataType': 'json'
            }).then(function(data){
                if (data.response.result !== 1) {
                    self.error(data.response.error.message);
                    return;
                }

                self.error('');
                self.openAuthForm();
            });
        };

        $.getJSON('/auth/checkUnblockOptions/', function(response){
            if (response.isValidPhone === true) {
                self.options.push({id: 'sms', name: 'Отправить по СМС'});
            }
            if (response.isValidEmail === true) {
                self.options.push({id: 'email', name: 'Послать письмом'});
            }
        });
    }

    return {
        viewModel: ViewModel,
        template: template
    };
});
