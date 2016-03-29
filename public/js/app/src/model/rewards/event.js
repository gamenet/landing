define(['knockout', 'js/app/src/model/rewards/disciple'], function(ko, Disciple) {
    function Event(prop){
        var self = this;

        self.date = prop.date;
        self.type = prop.type;
        self.gameName = prop.gameName;
        self.payment = Number(prop.payment);
        self.paymentDate = prop.paymentDate;
        self.paymentStatus = prop.paymentStatus;
        self.value = prop.value;
        self.userId = prop.userId;
        self.disciple = new Disciple(prop.disciple);
    }

    return Event;
});