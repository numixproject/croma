package org.numixproject.croma;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.webkit.JavascriptInterface;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Utils {

    private Context mContext;

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


    /**
     * Format and encode the string
     * @param s Input
     * @return Formatted URL encoded String.
     */
    public static String getEncodedString(String s) {
        String regex = "(#[0-9a-f]{6})|(#[0-9a-f]{3})|(((rgba?)|(cmyk)|(lab))([\\s+]?\\([\\s+]?(\\d+)[\\s+]?,[\\s+]?(\\d+)[\\s+]?,[\\s+]?(\\d+)[\\s+]?[)]))|(((hsva?)|(hsla?))([\\s+]?\\([\\s+]?(\\d+)[\\s+]?,[\\s+]?(\\d+)[%+]?[\\s+]?,[\\s+]?(\\d+)[%+]?[\\s+]?[)]))";
        Pattern pattern = Pattern.compile(regex);
        StringBuilder sb = new StringBuilder();
        Matcher m = pattern.matcher(s);
        while (m.find()) {
            int si = m.start();
            int ei = m.end();
            sb.append(s.substring(si, ei) + " ");
        }
        String r = "";
        try {
            r = URLEncoder.encode(sb.toString().replaceAll("\\+", "%20")
                    .replaceAll("\\%0A", "%20")
                    .replaceAll("\\+", "%20")
                    .replaceAll("\\%21", "!")
                    .replaceAll("\\%27", "'")
                    .replaceAll("\\%28", "(")
                    .replaceAll("\\%29", ")")
                    .replaceAll("\\%7E", "~"), "UTF-8");
        } catch (UnsupportedEncodingException e) {
            //UTF-8 is supported.
            r = "";
        }
        return r;
    }
}
