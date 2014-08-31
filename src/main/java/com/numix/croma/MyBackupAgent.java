package com.numix.croma;
import android.app.backup.BackupAgentHelper;
import android.app.backup.SharedPreferencesBackupHelper;

public class MyBackupAgent extends BackupAgentHelper {
    // The names of the SharedPreferences groups that the application maintains.  These
    // are the same strings that are passed to getSharedPreferences(String, int).
    static final String STORAGE = "Storage";

    // An arbitrary string used within the BackupAgentHelper implementation to
    // identify the SharedPreferencesBackupHelper's data.
    static final String MY_PREFS_BACKUP_KEY = "mystorage";

    // Simply allocate a helper and install it
    @Override
    public void onCreate() {
        SharedPreferencesBackupHelper helper =
                new SharedPreferencesBackupHelper(this, STORAGE);
        addHelper(MY_PREFS_BACKUP_KEY, helper);
    }
}