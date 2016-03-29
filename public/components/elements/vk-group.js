define(['knockout', 'vkApi'], function (ko, VK) {
    function ViewModel(params, element) {
        var id = 'vkGroup' + Math.random();

        $(element).attr('id', id);
        VK.Widgets.Group(id, ko.utils.extend({
            mode: 0,
            width: "200",
            height: "242",
            color1: 'FFFFFF',
            color2: '2B587A',
            color3: '5B7FA6'
        }, params), params.id);
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