define(['knockout', 'js/app/src/model/rewards/event', 'moment'], function (ko, Event, moment) {
    function getPeriodName(date) {
        var date = moment(date),
            months = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'];

        return months[date.month()] + ' ' + date.year();
    }

    function Period(params){
        var self = this;

        self.events = [];
        self.date = params.date;
        self.name = getPeriodName(params.date);
        self.isLastPeriod = params.isLastPeriod;
        self.totalLevelUpCount = Number(params.successLevelUpCount);
        self.totalPaymentCount = Number(params.successPaymentCount);
        self.waitingLevelUpCount = Number(params.waitingLevelUpCount);
        self.waitingPaymentCount = Number(params.waitingPaymentCount);
        self.totalDividendsForLevelUp = Number(params.successDividendsForLevelUp > 3000 ? 3000 : params.successDividendsForLevelUp);
        self.totalDividendsForPayments = Number(params.successDividendsForPayments > 1000 ? 1000 : params.successDividendsForPayments);
        self.waitingDividendsForLevelUp = Number(params.waitingDividendsForLevelUp > 3000 ? 3000 : params.waitingDividendsForLevelUp);
        self.waitingDividendsForPayments = Number(params.waitingDividendsForPayments > 1000 ? 1000 : params.waitingDividendsForPayments);

        self.nextEventCount = self.totalLevelUpCount - params.events.length;
        self.nextWaitingEventCount = self.waitingLevelUpCount - params.events.length;
        self.totalDividends = self.totalDividendsForLevelUp + self.totalDividendsForPayments;
        self.totalWaitingDividends = self.waitingDividendsForLevelUp + self.waitingDividendsForPayments;

        params.events.forEach(function(event){
            self.events.push(new Event(event));
        });
    }

    return Period;
});