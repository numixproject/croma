package com.numix.croma;

import android.os.Bundle;
import android.app.Activity;
import android.view.View;
import android.view.KeyEvent;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import static android.webkit.WebSettings.LOAD_DEFAULT;

public class MainActivity extends Activity {

    private WebView webView;

    private class webViewClient extends WebViewClient {
        @Override
        public void onPageFinished(WebView view, String url) {
            findViewById(R.id.imageView1).setVisibility(View.GONE);
            findViewById(R.id.webview).setVisibility(View.VISIBLE);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.main);

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

        webView.addJavascriptInterface(new Storage(this), "androidStorage");

        webView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK) && webView.canGoBack()) {
            webView.goBack();
            return true;
        }

        return super.onKeyDown(keyCode, event);
    }
}
