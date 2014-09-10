package com.numix.croma;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import me.croma.image.Color;
import me.croma.image.KMeansColorPicker;

import static android.webkit.WebSettings.LOAD_DEFAULT;

public class MainActivity extends Activity {

    private final String index = "file:///android_asset/www/index.html";

    public WebView webView;

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

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.main);

        // Check if you're opening Croma or you come from the Share menu

        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        String action = intent.getAction();

        // If you opened Croma from the share menù...
        if (Intent.ACTION_SEND.equals(action)) {
            if (extras.containsKey(Intent.EXTRA_STREAM)) {
                // Get resource path
                Uri uri = (Uri) extras.getParcelable(Intent.EXTRA_STREAM);

                // what to do here

                String URL = index;
                String SAVE_AS = parseUriToFilename(uri);

                try {
                    final InputStream imageStream = getContentResolver().openInputStream(uri);
                    final Bitmap selectedImage = BitmapFactory.decodeStream(imageStream);

                    BitMapImage b = new BitMapImage(selectedImage);

                    KMeansColorPicker k = new KMeansColorPicker();

                    URL = index + "#/show-palette?saveas=" + SAVE_AS + "&palette=";

                    try {
                        List<Color> l = k.getUsefulColors(b, 6);

                        for (Color c : l) {
                            URL += c.getRed() + "," + c.getGreen() + "," + c.getBlue() + "|";
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                }
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
                webView.loadUrl(URL);
            }
        } else {
            // What if you opened Croma from the drawer?
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

            // Load the page to import the colors!
            webView.loadUrl(index);
        }
    }

    // Convert URI to String to get full image path
    public String parseUriToFilename(Uri uri) {
        String selectedImagePath = null;
        String filemanagerPath = uri.getPath();

        String[] projection = { MediaStore.Images.Media.DATA };
        Cursor cursor = managedQuery(uri, projection, null, null, null);

        if (cursor != null) {
            int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            cursor.moveToFirst();
            selectedImagePath = cursor.getString(column_index);
        }

        if (selectedImagePath != null) {
            return selectedImagePath;
        }
        else if (filemanagerPath != null) {
            return filemanagerPath;
        }
        return null;
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


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent imageReturnedIntent) {

        String URL = index;
        String SAVE_AS = imageReturnedIntent.getStringExtra("saveas");

        super.onActivityResult(requestCode, resultCode, imageReturnedIntent);

        switch(requestCode) {
            case SELECT_PHOTO:
                if (resultCode == RESULT_OK) {

                    try {
                        final Uri imageUri = imageReturnedIntent.getData();
                        final InputStream imageStream = getContentResolver().openInputStream(imageUri);
                        final Bitmap selectedImage = BitmapFactory.decodeStream(imageStream);

                        BitMapImage b = new BitMapImage(selectedImage);

                        KMeansColorPicker k = new KMeansColorPicker();

                        URL = index + "#/show-palette?saveas=" + SAVE_AS + "&palette=";

                        try {
                            List<Color> l = k.getUsefulColors(b, 6);

                            for (Color c: l) {
                                URL += c.getRed() + "," + c.getGreen() + "," + c.getBlue() + "|";
                            }
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    }
                }

                webView.loadUrl(URL);
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
