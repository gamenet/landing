require(['/js/app/config.js'], function() {
    require([
        'knockout',
        'js/app/src/model/login',
        'knockout-postbox',
        'js/app/src/ko/extender/login',
        'js/app/src/ko/extender/password',
        'js/app/src/ko/extender/captcha',
        'js/app/src/ko/handlers/ga',
        'js/app/src/ko/handlers/selected',
        'js/app/src/ko/handlers/copyright',
        'popupTemplate'
    ], function(ko, Login) {
        // HACK Нужен в глобальной видимости для кастомного биндинга элементов шаринга, подгружаемых через ajax напрямую в html
        window.ko = ko;

        //HACK При использовании c tinyMCE иногда на IE ko падает на обработке виратуального биндинга. Это происходит
        //потому, что при обработки ноды движек tinyMCE добавлят "детей" в процессе обработки биндинга (он то теперь
        //отложенный). В качестве временного решения https://jira.gamenet.ru/browse/GN-10436 используется ручной контроль
        //нисходящего биндинга ko (вот как тут http://www.knockmeout.net/2012/05/quick-tip-skip-binding.html).
        ko.bindingHandlers.stopBinding  = {
            init: function() {
                return { controlsDescendantBindings: true };
            }
        };
        ko.virtualElements.allowedBindings.stopBinding = true;

        // INFO Since ko 3.4, http://knockoutjs.com/documentation/deferred-updates.html
        ko.options.deferUpdates = true;

        //INFO Register custom elements
        var elements = ['login-input', 'password-input', 'captcha-input', 'share', 'vk-group'];

        elements.forEach(function(name){
            ko.components.register(name, {require: '/components/elements/' + name + '.js'});
        });

        //INFO Register generic resolver
        ko.components.loaders.unshift({
            getConfig: function(name, callback) {
                var parts = name.split('/');
                if (parts.length && ~['widget', 'page'].indexOf(parts[0])) {
                    callback({ require: '/components/' + parts[0] + '/' +  parts[1] + '/' + parts[1] + '.js'});
                } else {
                    callback(null);
                }
            }
        });

        function Page(){
            var self = this,
                path = window.location.pathname;

            self.mainModel = ko.observable('page/landing');
            self.upBlock = ko.observableArray(window.Layout.upBlock || []);
            self.rightBlock = ko.observableArray(window.Layout.rightBlock || []);
            self.leftBlock = ko.observableArray(window.Layout.leftBlock || []);
            self.leftTopBlock = ko.observableArray(window.Layout.leftTopBlock || []);

            self.popupName = ko.observable('');
            self.popupParams = ko.observable('');

            self.popupName.subscribe(function(value){
                //HACK https://jira.gamenet.ru/browse/GN-10626 Now in site used 2 separated system of popups - the
                // first one is legacy throw `eclipse` object in script.js. The second is newly described in this file.
                // And this hack allow us to choose realization of `eclipse` hide/show behaviour.
                if (window.eclipse) {
                    if (value) {
                        window.eclipse.show()
                    } else {
                        window.eclipse.hide();
                    }
                }
            });

            ko.postbox.subscribe("popup", function(params) {
                if (params.action === 'close') {
                    self.closePopup();
                } else if (params.action === 'open') {
                    self.openPopup(params.name, params.opts)
                }
            });

            self.openPopup = function(name, params) {
                self.popupParams(params);
                self.popupName(name);

                if (typeof window['ga'] == 'function'){
                    ga('send', 'event', 'popup', 'open', name);
                }
            };

            self.closePopup = function() {
                if (typeof window['ga'] == 'function'){
                    ga('send', 'event', 'popup', 'close', self.popupName());
                }

                self.popupParams('');
                self.popupName('');
            };

            self.loginModel = new Login(self);

            self.isUserAuth = function(){
                return window.userData.userId !== '';
            };

            self.isLoginConfirmed = function(){
                return self.isUserAuth() && window.userData.loginConfirmed !== '';
            };

            if (!window.Layout) {
                window.Layout = {};
            }
            window.Layout.model = self;
        }

        ko.applyBindings(new Page());
    });
});
