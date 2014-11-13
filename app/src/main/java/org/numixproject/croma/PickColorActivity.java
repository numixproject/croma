package org.numixproject.croma;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.util.ArrayList;
import java.util.List;

import me.croma.image.Color;

import static android.webkit.WebSettings.LOAD_DEFAULT;


public class PickColorActivity extends Activity {
    private static final int REQ_CODE_COLOR_PICKER = 346732;

    private WebView webView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        Intent it = new Intent(this, PickColorActivity.class);
        it.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        webView = (WebView) findViewById(R.id.webview);
        webView = (WebView) findViewById(R.id.webview);

        WebSettings webSettings = webView.getSettings();

        String appCachePath = getApplicationContext().getCacheDir().getAbsolutePath();

        webSettings.setJavaScriptEnabled(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setSupportZoom(false);
        webSettings.setSaveFormData(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAppCacheEnabled(true);
        webSettings.setAppCachePath(appCachePath);
        webSettings.setAllowFileAccess(true);
        webSettings.setCacheMode(LOAD_DEFAULT);

        webView.setWebViewClient(new webViewClient());

        // Enable debugging in webview
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        }

        // Expose Java methods as JavaScript interfaces
        webView.addJavascriptInterface(new Storage(this), "androidStorage");
        webView.addJavascriptInterface(new Tools(this), "androidTools");
        Intent intent = new Intent(this, ColorPickerActivity.class);
        startActivityForResult(intent, PickColorActivity.REQ_CODE_COLOR_PICKER);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        if (resultCode == Activity.RESULT_OK && requestCode == PickColorActivity.REQ_CODE_COLOR_PICKER) {
            final ArrayList<Integer> colors = intent.getIntegerArrayListExtra("colors");

            this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    List<Color> list = new ArrayList<Color>();

                    for (Integer c : colors) {
                        list.add(new Color(c));
                    }
                    webView.loadUrl(Utils.makePaletteUrl(Utils.makePaletteQuery(list)));
                }
            });

        } else if (Activity.RESULT_CANCELED == resultCode) {
            finish();
        }
    }

    private class webViewClient extends WebViewClient {
        // Show a splash screen until the WebView is ready
        @Override
        public void onPageFinished(WebView view, String url) {
            findViewById(R.id.imageview).setVisibility(View.GONE);
            findViewById(R.id.webview).setVisibility(View.VISIBLE);
        }
    }
}
