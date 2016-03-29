define(['knockout', 'text!./captcha-input.html'], function(ko, template) {
    return {
        viewModel: function(params) {
            var self = this;

            this.captcha = params.value;
            this.throttledCaptcha = ko.pureComputed(this.captcha)
                .extend({rateLimit: {timeout: 1500, method: "notifyWhenChangesStop"}});
            this.formName = params.formName;
            this.isFocused = ko.observable(false);
            this.canShowError = ko.observable(false);

            this.captcha.subscribe(function(){
                self.canShowError(!self.isFocused());
            });
            this.throttledCaptcha.subscribe(function(){
                self.canShowError(true);
            });
            this.isFocused.subscribe(function(value){
                if (value) {
                    return;
                }

                self.canShowError(true);
            });

            this.hasErrorOnUnfocused = ko.pureComputed(function(){
                return !self.isFocused() && self.captcha.hasError();
            });

            this.focusedOrNotEmpty = ko.pureComputed(function(){
                return self.isFocused() || self.captcha() !== '';
            });

            this.clean = function(){
                self.captcha(self.captcha().replace(/[^A-Za-z0-9]/g, ''));
            };

            this.setFocus = function(){
                self.isFocused(true);
                self.captcha('');
            };
        },
        template: template
    }
});