define(['knockout', 'moment'], function (ko, moment) {
    function dateDiff(date) {
        var diff = moment().diff(date),
            minutes = Math.floor(diff / 60000),
            hours = Math.floor(minutes / 60),
            days = Math.floor(hours / 24),
            months = Math.floor(days / 30),
            years = Math.floor(months / 12);

        if (years > 0) {
            return years + ' ' + declOfNum(years, ['год', 'года', 'лет']);
        } else if (months > 0) {
            return months + ' ' + declOfNum(months, ['месяц', 'месяца', 'месяцев']);
        } else if (days > 0) {
            return days + ' ' + declOfNum(days, ['день', 'дня', 'дней']);
        } else if (hours > 0) {
            return hours + ' ' + declOfNum(hours, ['час', 'часа', 'часов']);
        } else {
            return minutes + ' ' + declOfNum(minutes, ['минуту', 'минуты', 'минут']);
        }
    }

    function declOfNum(number, titles) {
        var cases = [2, 0, 1, 1, 1, 2];

        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }

    function Disciple(prop) {
        var self = this;

        self.id = prop.userId;
        self.nickname = prop.nickname;
        self.profileUrl = prop.profileUrl;
        self.lastOnline = moment(prop.lastOnline * 1000);
        self.online = prop.online;
        self.registerDate = moment(prop.registerDate, 'DD.MM.YYYY');
        self.isLoginNotFill = prop.isLoginConfirmed == 0;
        self.isLoginConfirmed = prop.isLoginConfirmed == 1;
        self.isLoginBroken = prop.isLoginConfirmed == 2;
        self.isVkNotFill = prop.vkStatus == 0;
        self.isVkLinked = prop.vkStatus == 1;
        self.isVkBroken = prop.vkStatus == 2;
        self.isPhoneNotFill = prop.phoneStatus == 0;
        self.isPhoneLinked = prop.phoneStatus == 1;
        self.isPhoneBroken = prop.phoneStatus == 2;
        self.isHwidNotFill = prop.hwidStatus == 0;
        self.isHwidValid = prop.hwidStatus == 1;
        self.isHwidBroken = prop.hwidStatus == 2;

        self.lastOnlineTime = self.online || !prop.lastOnline ? '' : 'Онлайн ' + dateDiff(self.lastOnline) + ' назад';
        self.registeredAt = moment().diff(self.registerDate, 'days') < 1 ? 'Сегодня' : dateDiff(self.registerDate) + ' назад';

        self.isVkOrPhoneValid = (self.isVkLinked || self.isPhoneLinked) && !self.isVkBroken && !self.isPhoneBroken;
        self.isVkOrPhoneBroken = self.isVkBroken || self.isPhoneBroken;
        self.isValid = self.isLoginConfirmed && self.isHwidValid && self.isVkOrPhoneValid;
        self.isBroken = self.isLoginBroken || self.isVkBroken || self.isPhoneBroken || self.isHwidBroken;
        self.isNotChecked = !self.isValid && !self.isBroken;
        self.hasEmptyStatus = self.isLoginNotFill || self.isVkNotFill || self.isPhoneNotFill || self.isHwidNotFill;
    }

    return Disciple;
});