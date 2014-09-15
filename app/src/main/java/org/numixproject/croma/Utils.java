package org.numixproject.croma;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;

public class Utils {

    Context mContext;

    private SharedPreferences mStorage;

    // Set application context.
    Utils(Context c) {
        mContext = c;
    }

    @JavascriptInterface
    public void shareItem(String title, String content) {
        Intent sharingIntent = new Intent(Intent.ACTION_SEND);

        sharingIntent.setType("text/plain");
        sharingIntent.putExtra(android.content.Intent.EXTRA_TEXT, content);

        mContext.startActivity(Intent.createChooser(sharingIntent, title));
    }

    @JavascriptInterface
    public void shareWithLink(String title, String content, String path) {
        String url = "http://" + mContext.getString(R.string.app_host) + "/" + path;

        shareItem(title, content + "\n" + url);
    }
}
