/**
 * Конструктор класса обмена сообщениями
 * @constructor
 */
function PubSub() {
    this.events = [];
}

PubSub.prototype.checkEvent = function(params) {
    var warnings = [],
        args = Object.keys(params),
        errorHandlers = {
            event: function(event) {
                if (!event) {
                    warnings.push('Имя события не передано');
                }
            },
            handler: function(handler) {
                if (!handler) {
                    warnings.push('Обработчик не передан');
                }
            }
        };

    args.forEach(function(arg) {
        errorHandlers[arg](params[arg]);
    });

    if (warnings.length > 0) {
        warnings.forEach(function(warn) {
            console.log(warn);
        });
        return false;
    } else {
        return true;
    }
};

/**
 * Функция подписки на событие
 * @param  {string} eventName имя события
 * @param  {function} handler функция которая будет вызвана при возникновении события
 * @return {function}         ссылка на handler
 */
PubSub.prototype.subscribe = function(eventName, handler) {
    if (!this.checkEvent({event: eventName, handler: handler})) {
        return false;
    }

    if (!this.events[eventName]) {
        this.events[eventName] = [];
    }

    this.events[eventName].push(handler);
    return handler;
};

/**
 * Функция отписки от события
 * @param  {string} eventName имя события
 * @param  {function} handler функция которая будет отписана
 * @return {function}         ссылка на handler
 */
PubSub.prototype.unsubscribe = function(eventName, handler) {
    if (!this.checkEvent({event: eventName, handler: handler})) {
        return false;
    }
    
    if (this.events[eventName]) {
        var pos = this.events[eventName].indexOf(handler);

        if (pos !== -1) {
            this.events[eventName].splice(pos, 1);
        }
    }

    return handler;
};

/**
 * Функция генерирующая событие
 * @param  {string} eventName имя события
 * @param  {object} data      данные для обработки соответствующими функциями
 * @return {bool}             удачен ли результат операции
 */
PubSub.prototype.publish = function(eventName, data) {
    if (!this.checkEvent({event: eventName})) {
        return false;
    }

    this.events[eventName].forEach(function(fn) {
        fn(data);
    });
    return true;
};

/**
 * Функция отписывающая все функции от определённого события
 * @param  {string} eventName имя события
 * @return {bool}             удачен ли результат операции
 */
PubSub.prototype.off = function(eventName) {
    if (!this.checkEvent({event: eventName})) {
        return false;
    }

    this.events[eventName] = undefined;
    return true;
};

/**
 * @example
 *
 * PubSub.subscribe('click', function(event, data) { console.log(data) });
 * var second = PubSub.subscribe('click', function(event, data) { console.log(data) });
 *
 * //Отписать одну функцию от события 'click':
 * PubSub.unsubscribe('click', second);
 *
 * //Отписать группу функций от события 'click'
 * PubSub.off('click');
 */

/*
    Дополнительный вариант — без явного использования глобального объекта
    нужно заставить работать методы верно у любой функции
 */

Function.prototype.initial = new PubSub();

Function.prototype.subscribe = function(eventName) {
    return this.initial.subscribe.call(this.initial, eventName, this);
 };

 Function.prototype.unsubscribe = function(eventName) {
    return this.initial.unsubscribe.call(this.initial, eventName, this);
 };