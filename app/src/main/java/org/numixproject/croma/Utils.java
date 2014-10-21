package org.numixproject.croma;

import java.net.URLEncoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Utils {

    /**
     * Format and encode the string
     * @param text Input
     * @return Formatted URL encoded query parameter.
     */

    public static String getEncodedString(String text) {
        String regex = "((#([0-9a-f]{6}))|(#([0-9a-f]{3})))|(((rgba?)|(cmyk)|(lab))([\\s+]?\\([\\s+]?(\\d+)[\\s+]?,[\\s+]?(\\d+)[\\s+]?,[\\s+]?(\\d+)[\\s+]?[)]))|((l[\\*]?a[\\*]?b[\\*]?)([\\s+]?\\([\\s+]?(\\d+)[\\s+]?,[\\s+]?[-]?[\\s+]?(\\d+)[\\s+]?,[\\s+]?[-]?[\\s+]?(\\d+)[\\s+]?[)]))|(((hsva?)|(hsba?)|(hsla?))([\\s+]?\\([\\s+]?(\\d+)[\\s+]?,[\\s+]?(\\d+)[%]?[\\s+]?,[\\s+]?(\\d+)[%]?[\\s+]?[)]))";
        Pattern pattern = Pattern.compile(regex);
        StringBuilder sb = new StringBuilder();
        Matcher m = pattern.matcher(text);

        while (m.find()) {
            int si = m.start();
            int ei = m.end();

            sb.append(text.substring(si, ei)).append(" ");
        }

        String query = "";

        try {
            // Ember crashes if there are percentage signs in decoded URL, so let's strip them
            query = URLEncoder.encode(sb.toString().replaceAll("%", ""), "UTF-8")
                    .replaceAll("\\%0A", "%20")
                    .replaceAll("\\+", "%20");

        } catch (Exception e) {
            e.printStackTrace();
        }

        return query;
    }
}
