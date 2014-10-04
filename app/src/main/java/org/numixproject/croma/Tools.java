package org.numixproject.croma;

import android.content.Context;
import android.content.Intent;
import android.webkit.JavascriptInterface;

public class Tools {

    private Context context;

    // Set application context.
    Tools(Context c) {
        context = c;
    }

    @JavascriptInterface
    public void shareItem(String title, String content) {
        Intent sharingIntent = new Intent(Intent.ACTION_SEND);

        sharingIntent.setType("text/plain");
        sharingIntent.putExtra(android.content.Intent.EXTRA_TEXT, content);

        context.startActivity(Intent.createChooser(sharingIntent, title));
    }

    @JavascriptInterface
    public void shareWithLink(String title, String content, String path) {
        String url = "http://" + context.getString(R.string.app_host) + "/" + path;

        shareItem(title, content + "\n" + url);
    }
}
