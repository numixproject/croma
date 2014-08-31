package com.numix.croma;

import android.content.Context;
import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;
import android.app.backup.BackupManager;

public class Storage {
    private Context mContext;
    private SharedPreferences mStorage;

    BackupManager mBackupManager = new BackupManager(mContext);

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
        mBackupManager.dataChanged();
    }

    @JavascriptInterface
    public void removeItem(String key) {
        SharedPreferences.Editor e = mStorage.edit();

        e.remove(key);
        e.apply();
        mBackupManager.dataChanged();
    }
}
