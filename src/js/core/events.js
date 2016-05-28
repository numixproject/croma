export default class Events {
    constructor() {
        this._callbacks = {};
    }

    on(event, handler) {
        if (!(event in this._callbacks)) {
            this._callbacks[event] = [];
        }

        this._callbacks[event].push(handler);
    }

    off(event, handler) {
        if (!this._callbacks && !this._callbacks[event]) {
            return null;
        }

        if (typeof handler !== 'undefined') {
            delete this._callbacks[event];
            return this;
        }

        const i = this._callbacks[event].indexOf(handler);

        this._callbacks.splice(i, 1);

        return this;
    }

    trigger(event, ...rest) {
        const currentcallbacks = this._callbacks[event];

        if (!currentcallbacks) {
            return;
        }

        for (let i = 0; i < currentcallbacks.length; i++) {
            if (typeof currentcallbacks[i] === 'function') {
                currentcallbacks[i].apply(this, rest);
            }
        }
    }
}
