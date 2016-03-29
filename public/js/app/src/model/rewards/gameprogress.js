define(['knockout', 'moment', 'js/app/src/model/rewards/disciple'], function (ko, moment, Disciple) {
    function GameProgress(prop) {
        var self = this;

        self.gameName = prop.gameName;
        self.gameImage = prop.gameImage;
        self.charLevel = prop.charLevel;
        self.nextPayment = prop.nextPayment;
        self.nextPaymentWithPremium = prop.nextPaymentWithPremium;
        self.nextThreshold = prop.nextThreshold;
        self.paymentDate = moment(prop.paymentDate, 'YYYY-MM-DD HH:mm:ss');
        self.paymentSuccess = prop.paymentStatus == 1;
        self.paymentDeny = prop.paymentStatus == 2;
        self.eventDate = moment(prop.eventDate, 'YYYY-MM-DD HH:mm:ss');
        self.viewThreshold = ko.observable(false);
        self.disciple = new Disciple(prop.disciple);

        self.isStartPlaying = prop.charLevel > 0;
        self.hasMaxThreshold = self.charLevel >= self.nextThreshold;
        self.fullyCompleted = self.hasMaxThreshold && self.paymentSuccess;
        self.progressWidth = self.hasMaxThreshold ? 100 : 100 / (self.nextThreshold / self.charLevel);
        self.levelMessage = self.hasMaxThreshold ? 'цель достигнута' : self.charLevel;
        self.sortProgressWeight = self.fullyCompleted || self.disciple.isBroken
            ? -100
            : (self.charLevel ? self.progressWidth : (self.disciple.isValid ? 0 : self.disciple.registerDate.unix() - moment().unix()));

        self.isPlayingAndNotBroken = self.isStartPlaying && !self.disciple.isBroken;
        self.isPlayingAndNotChecked = self.isStartPlaying && !self.disciple.isBroken && self.disciple.hasEmptyStatus;
        self.isNotPlayingAndNotBroken = !self.isStartPlaying && !self.disciple.isBroken;
        self.isProgressTransparent = self.hasMaxThreshold || (self.isStartPlaying && !self.disciple.isValid && !self.disciple.isBroken);

        self.showThreshold = self.viewThreshold.bind(self, true);
        self.hideThreshold = self.viewThreshold.bind(self, false);
    }

    return GameProgress;
});