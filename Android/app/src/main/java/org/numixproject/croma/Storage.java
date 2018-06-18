package org.numixproject.croma;

import android.content.Context;
import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;

public class Storage {

    private SharedPreferences storage;

    // Set application context.
    Storage(Context c) {
        storage = c.getSharedPreferences(c.getResources().getString(R.string.key_file), 0);
    }

    @JavascriptInterface
    public String getItem(String key) {
        return storage.getString(key, "");
    }

    @JavascriptInterface
    public void setItem(String key, String value) {
        SharedPreferences.Editor e = storage.edit();

        e.putString(key, value);
        e.apply();
    }

    @JavascriptInterface
    public void removeItem(String key) {
        SharedPreferences.Editor e = storage.edit();

        e.remove(key);
        e.apply();
    }

    @JavascriptInterface
    public void clear() {
        SharedPreferences.Editor e = storage.edit();

        e.clear();
        e.apply();
    }
}