package org.numixproject.croma;

import android.content.Context;
import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;

public class Storage {

    Context mContext;

    private SharedPreferences mStorage;

    // Set application context.
    Storage(Context c) {
        mContext = c;
        mStorage = c.getSharedPreferences(c.getResources().getString(R.string.key_file), 0);
    }

    @JavascriptInterface
    public String getItem(String key) {
        return mStorage.getString(key, "");
    }

    @JavascriptInterface
    public void setItem(String key, String value) {
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

    @JavascriptInterface
    public void clear() {
        SharedPreferences.Editor e = mStorage.edit();

        e.clear();
        e.apply();
    }
}