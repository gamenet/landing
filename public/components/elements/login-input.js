define(['knockout', 'text!./login-input.html'], function(ko, template) {
    return {
        viewModel: function(params) {
            var self = this;

            this.login = params.value;
            this.throttledLogin = ko.pureComputed(this.login)
                .extend({rateLimit: {timeout: 1500, method: "notifyWhenChangesStop"}});
            this.formName = params.formName;
            this.isFocused = ko.observable(true);
            this.canShowError = ko.observable(false);

            this.login.subscribe(function(){
                self.canShowError(!self.isFocused());
            });
            this.throttledLogin.subscribe(function(){
                self.canShowError(true);
            });
            this.isFocused.subscribe(function(value){
                if (value) {
                    return;
                }

                self.canShowError(true);
            });

            this.hasErrorOnUnfocused = ko.pureComputed(function(){
                return !self.isFocused() && self.login.hasError();
            });

            this.focusedOrNotEmpty = ko.pureComputed(function(){
                return self.isFocused() || self.login() !== '';
            });

            this.clean = function(){
                self.login(self.login().replace(/[^A-Za-z0-9@._\-]/g, ''));
            };

            this.setFocus = this.isFocused.bind(this, true);
        },
        template: template
    }
});