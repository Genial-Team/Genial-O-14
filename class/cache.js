module.exports = class Cache{

    _cache = {};
    constructor() {


    }

    set(key, value){
        if (key === undefined || value === undefined ) return "Missing Key or Value";
        return this._cache[key] = value
    }

    get(key){
        if( key !== undefined ) return this._cache[key];
        else return this._cache;
    }

    delete(key){
        delete this._cache[key];
    }

}