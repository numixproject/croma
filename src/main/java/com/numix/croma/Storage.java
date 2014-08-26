package com.numix.croma;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.webkit.JavascriptInterface;

public class Storage {
    private Context mContext;
    private SharedPreferences mStorage;

    Storage(Context c) {
        mContext = c;
        mStorage = c.getSharedPreferences("Storage", 0);
    }

    @JavascriptInterface
    public String getItem(String key) {
        return mStorage.getString(key, null);
    }

    @JavascriptInterface
    public void setItem(String key, String value){
        SharedPreferences.Editor e = mStorage.edit();

        e.putString(key, value);
        e.apply();
    }

    @JavascriptInterface
    public void removeItem(String key) {
        SharedPreferences.Editor e = mStorage.edit();

        e.remove(key);
        e.apply();
    }
}
