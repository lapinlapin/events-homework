/**
 * Конструктор класса обмена сообщениями
 * @constructor
 */
function PubSub() {
    this.events = [];
}

/**
 * Функция подписки на событие
 * @param  {string} eventName имя события
 * @param  {function} handler функция которая будет вызвана при возникновении события
 * @return {function}         ссылка на handler
 */
PubSub.prototype.subscribe = function(eventName, handler) {
     if (eventName === undefined || typeof handler !== 'function') {
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
     if (eventName === undefined || typeof handler !== 'function') {
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
      if (eventName === undefined) {
         return false;
    }

    this.events[eventName].forEach(function(fn) {
        setTimeout(fn(data), 10);
    });
    return true;
};

/**
 * Функция отписывающая все функции от определённого события
 * @param  {string} eventName имя события
 * @return {bool}             удачен ли результат операции
 */
PubSub.prototype.off = function(eventName) {
    if (eventName === undefined) {
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

Function.prototype.pubSub = new PubSub();

Function.prototype.subscribe = function(eventName) {
    return this.pubSub.subscribe.call(this.pubSub, eventName, this);
 };

 Function.prototype.unsubscribe = function(eventName) {
    return this.pubSub.unsubscribe.call(this.pubSub, eventName, this);
 };