define(['knockout', 'text!./password-input.html', 'css!./password-input'], function(ko, template) {
    return {
        viewModel: function(params) {
            var self = this;

            this.password = params.value;
            this.generatedPassword = params.generatedPassword;
            this.generatedText = params.generatedText || 'Ваш пароль';
            this.formName = params.formName;

            this.throttledPassword = ko.pureComputed(this.password)
                .extend({rateLimit: {timeout: 1500, method: "notifyWhenChangesStop"}});
            this.formName = params.formName;
            this.isFocused = ko.observable(false);
            this.isOpenedFocused = ko.observable(false);
            this.canShowError = ko.observable(false);
            this.decryptedPassword = ko.observable(false);

            this.password.subscribe(function(){
                self.canShowError(!self.hasInputFocus());
            });
            this.throttledPassword.subscribe(function(){
                self.canShowError(true);
            });
            this.isFocused.subscribe(function(value){
                if (value) {
                    return;
                }

                self.canShowError(true);
            });

            this.clean = function(){
                self.password(self.password().replace(/[^A-Za-zА-Яа-я0-9=`~!@#$%^&*()_+?,.;<>:"'|{}\[\]\-\/\\]/g, ''));
            };

            this.switchPasswordView = function() {
                self.decryptedPassword(!self.decryptedPassword());
            };

            this.startEdit = function() {
                self.generatedPassword(false);
                self.password('');
            };

            self.generatePassword = function(){
                var sym = 'ABCDEFGHIJKLMNOPQRSTUWXYZabcdefghijklmnopqrstuwxyz0123456789=`~!@#$%^&*()_+?,.;:"\'|{}[]-/\\',
                    string = sym.split('').sort(function(){return 0.5-Math.random()}).join('');

                self.password(string.substr(0, 10));
            };

            this.state = ko.pureComputed(function(){
                if (!params.generatedPassword) {
                    return false;
                }
                return self.generatedPassword();
            });

            this.hasInputFocus = ko.pureComputed(function(){
                return self.isFocused() || self.isOpenedFocused();
            });

            this.hasErrorOnUnfocused = ko.pureComputed(function(){
                return !self.hasInputFocus() && self.password.hasError();
            });

            this.focusedOrNotEmpty = ko.pureComputed(function(){
                return self.hasInputFocus() || self.password() !== '';
            });

            this.setFocus = this.isFocused.bind(this, true);
            this.setOpenedFocus = this.isOpenedFocused.bind(this, true);

            if (params.generatedPassword && params.generatedPassword()) {
                self.generatePassword();
            }
        },
        template: template
    }
});