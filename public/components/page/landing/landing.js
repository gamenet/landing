define(['knockout','text!./landing.html','css!./landing.css','js/app/src/ko/handlers/copyright'],function(ko, template) {

        function ViewModel() {
            var self = this;
            self.emailLogin = ko.observable('');
            self.isStep1 = ko.observable(false);
            self.isStep2 = ko.observable(false);
            self.error = ko.observable(false);
            self.errorText = ko.observable('');

            self.showForm = function() {
                self.isStep1(true);
            };

            self.sendEmail = function() {
            };
        }

        return {
            viewModel: ViewModel,
            template: template
        };
    }
);