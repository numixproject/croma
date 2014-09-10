package com.numix.croma;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import me.croma.image.Color;
import me.croma.image.KMeansColorPicker;

import static android.webkit.WebSettings.LOAD_DEFAULT;

public class MainActivity extends Activity {

    public WebView webView;

    // Start page
    private final String INDEX = "file:///android_asset/www/index.html";

    // Arbitrary integer to check request code
    private final int SELECT_PHOTO = 1;


    private class webViewClient extends WebViewClient {
        // Show a splash screen until the WebView is ready
        @Override
        public void onPageFinished(WebView view, String url) {
            findViewById(R.id.imageView1).setVisibility(View.GONE);
            findViewById(R.id.webview).setVisibility(View.VISIBLE);
        }
    }


    // Handle back button press
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK) && webView.canGoBack()) {
            webView.goBack();

            return true;
        }

        return super.onKeyDown(keyCode, event);
    }


    // Get color palette from image
    private String getPalette(Uri imageUri) {
        String url = "#/show-palette?palette=";

        try {
            final InputStream imageStream = getContentResolver().openInputStream(imageUri);
            final Bitmap selectedImage = BitmapFactory.decodeStream(imageStream);

            BitMapImage b = new BitMapImage(selectedImage);

            KMeansColorPicker k = new KMeansColorPicker();

            try {
                List<Color> l = k.getUsefulColors(b, 6);

                for (Color c: l) {
                    url += c.getRed() + "," + c.getGreen() + "," + c.getBlue() + "|";
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        return url;
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

        // Expose Java methods as JavaScript interfaces
        webView.addJavascriptInterface(new Storage(this), "androidStorage");
        webView.addJavascriptInterface(new CromaImage(this), "cromaImage");

        // Check if called from share menu
        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        String action = intent.getAction();

        if (Intent.ACTION_SEND.equals(action)) {
            if (extras.containsKey(Intent.EXTRA_STREAM)) {
                // Get resource path
                final Uri imageUri = extras.getParcelable(Intent.EXTRA_STREAM);

                String url = INDEX;

                url += getPalette(imageUri);

                webView.loadUrl(url);
            }
        } else {
            // Load the start page
            webView.loadUrl(INDEX);
        }
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent imageReturnedIntent) {

        final String SAVE_AS = imageReturnedIntent.getStringExtra("saveas");

        super.onActivityResult(requestCode, resultCode, imageReturnedIntent);

        switch(requestCode) {
            case SELECT_PHOTO:
                if (resultCode == RESULT_OK) {

                    final Uri imageUri = imageReturnedIntent.getData();

                    String url = INDEX;

                    url += getPalette(imageUri);

                    webView.loadUrl(url);
                }
        }
    }


    public class CromaImage extends MainActivity {

        Context mContext;

        // Set application context.
        CromaImage(Context c) {
            mContext = c;
        }

        @JavascriptInterface
        public void getColors(String saveas) {
            Intent photoPickerIntent = new Intent(Intent.ACTION_PICK);

            photoPickerIntent.setType("image/*");
            photoPickerIntent.putExtra("saveas", saveas);

            ((Activity) mContext).startActivityForResult(photoPickerIntent, SELECT_PHOTO);
        }
    }

}
