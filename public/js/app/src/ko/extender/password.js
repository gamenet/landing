define(['knockout'], function (ko) {
    ko.extenders.password = function(target) {
        target.hasError = ko.observable(false);
        target.validationMessage = ko.observable('');
        target.needClean = ko.observable(false);

        target.valid = ko.pureComputed(function(){
            return target() !== '' && !target.hasError();
        });

        function validate(value) {
            var lenMin = 6,
                lenMax = 32;

            target.needClean(false);

            if (value === '') {
                target.validationMessage('');
            } else if (value.match(/[^A-Za-zА-Яа-я0-9=`~!@#$%^&*()_+?,.;<>:"'|{}\[\]\-\/\\]/) !== null) {
                target.validationMessage('Недопустимые символы в пароле');
                target.needClean(true);
            } else if (value.length < lenMin) {
                target.validationMessage('Добавьте в пароль еще ' + (lenMin - value.length) + ' символов');
            } else if (value.length > lenMax) {
                target.validationMessage('Удалите из пароля ' + (value.length - lenMax) + ' символов');
            } else {
                target.validationMessage('');
            }

            target.hasError(target.validationMessage() !== '');

            return !target.hasError();
        }

        target.subscribe(validate);

        return target;
    };
});