define(['knockout', 'yandexShare'], function (ko, Ya) {
    function twitterShareRightText(title, description, shortname) {
        var shareText = title == '' ? description : title;
        //INFO Помните, что в твиттер можно шарить только 140 символов. Мы убираем 22 символа на ссылку, убираем 10 символов
        //на основной хеш тег и ещё немного на пробелы. Получается 100 символов на текст.
        return shareText.length > (103 - shortname.length)
            ? (shareText.substr(0, (100 - shortname.length)) + '... #GameNetRu #' + shortname + ' ')
            : (shareText + ' #GameNetRu #' + shortname);
    }

    /**
     * @see https://tech.yandex.ru/share/doc/dg/api-docpage/
     *
     * @param params
     * @param element
     * @constructor
     */
    function ViewModel(params, element) {
        var description = typeof params.description === 'function' ? params.description() : params.description,
            url = typeof params.url === 'function' ? params.url() : params.url,
            title = typeof params.title === 'function' ? params.title() : params.title;

        description = description.trim().replace(/<[^>]+>/g, '').substr(0, 247);
        vk_description = description;

        (title + description + params.url).length > 250
            ? vk_description = vk_description.substr(0, 247 - 22 - title.length - params.url.length) + '...'
            : vk_description;

        Ya.share2(element, {
            content: {
                url: url,
                title: title,
                description: description + '...',
                image: params.image
            },
            contentByService: {
                twitter: {title: twitterShareRightText(title, description, params.shortname)},
                vkontakte: {description: vk_description}
            },
            theme: ko.utils.extend({
                services: 'vkontakte,odnoklassniki,facebook,moimir,twitter',
                counter: false,
                lang: 'ru',
                size: 'm'
            }, params.theme),
            hooks: {
                onshare: function (name) {
                    if (typeof window['ga'] == 'function') {{
                        ga('send', 'event', 'social_share', name, params.tags);
                    }}
                }
            }
        });
    }

    return {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                return new ViewModel(params, componentInfo.element);
            }
        },
        template: '<div/>'
    }
});