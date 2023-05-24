module.exports = class Cache{

    _cache = {};
    constructor() {


    }

    set(key, value){
        if (key === undefined || value === undefined ) return "Missing Key or Value";
        return this._cache[key] = value
    }

    get(key){
        // console.log("[cache] DEBUG >\n", key, this._cache[key]);
        if( key !== undefined ) return this._cache[key];
        else return "-1";
    }

    delete(key){
        delete this._cache[key];

    }

}