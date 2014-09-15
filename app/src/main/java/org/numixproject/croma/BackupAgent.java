package org.numixproject.croma;

import android.app.backup.BackupAgentHelper;
import android.app.backup.SharedPreferencesBackupHelper;

public class BackupAgent extends BackupAgentHelper {
    // An arbitrary string used within the BackupAgentHelper implementation to
    // identify the SharedPreferencesBackupHelper's data.
    static final String PREFS_BACKUP_KEY = "cromastorage";

    @Override
    public void onCreate() {
        SharedPreferencesBackupHelper helper =
                new SharedPreferencesBackupHelper(this, getResources().getString(R.string.key_file));

        addHelper(PREFS_BACKUP_KEY, helper);
    }
}