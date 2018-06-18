package org.numixproject.croma;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Parcelable;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.anjlab.android.iab.v3.BillingProcessor;
import com.anjlab.android.iab.v3.TransactionDetails;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import me.croma.image.Color;
import me.croma.image.KMeansColorPicker;

import static android.webkit.WebSettings.LOAD_DEFAULT;

public class MainActivity extends Activity implements BillingProcessor.IBillingHandler {

    // Start page
    private final String INDEX = "file:///android_asset/www/index.html";

    // Arbitrary integer to check request code
    private final int SELECT_PHOTO = 1;

    private WebView webView;
    private BillingProcessor bp;

    // Handle back button press
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {

        if (keyCode == KeyEvent.KEYCODE_BACK) {
            final String URL = webView.getUrl().replaceAll("(#/|#|/)$", "");

            if (URL.equals(INDEX) || !webView.canGoBack()) {
                finish();
            } else if (webView.canGoBack()) {
                webView.goBack();
            }

            return true;
        }

        return super.onKeyDown(keyCode, event);
    }

    // Get bitmap from Uri
    private Bitmap getBitmap(Uri uri) {
        try {
            final InputStream stream = getContentResolver().openInputStream(uri);

            return BitmapFactory.decodeStream(stream);
        } catch (FileNotFoundException e) {
            Toast.makeText(this, R.string.io_error, Toast.LENGTH_LONG).show();

            e.printStackTrace();
        }

        return null;
    }

    // Get color palette from image
    private String getColors(Bitmap bitmap) {
        String url = INDEX;

        BitmapImage b = new BitmapImage(bitmap);

        KMeansColorPicker k = new KMeansColorPicker();

        try {
            List<Color> colors = k.getUsefulColors(b, 6);

            url = INDEX + Utils.makePaletteUrl(Utils.makePaletteQuery(colors));
        } catch (IOException e) {
            Toast.makeText(this, R.string.generic_error, Toast.LENGTH_LONG).show();

            e.printStackTrace();
        }

        return url;
    }

    // Show a progress dialog when processing image
    private void processImage(final Bitmap bitmap) {
        final ProgressDialog progress = ProgressDialog.show(
                MainActivity.this, null, getString(R.string.wait_label), true);

        // Process the image in a new thread
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    final String URL = getColors(bitmap);

                    // Return to the UI thread
                    MainActivity.this.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            webView.loadUrl(URL);
                        }
                    });
                } catch (Exception e) {
                    e.printStackTrace();
                }

                progress.dismiss();
            }
        }).start();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Initialize billing processor
        bp = new BillingProcessor(this, getString(R.string.license_key), this);

        // Restore purchases
        bp.loadOwnedPurchasesFromGoogle();

        // Set webview options
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

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
            String databasePath = getApplicationContext().getDir("databases", Context.MODE_PRIVATE).getPath();

            webSettings.setDatabaseEnabled(true);
            webSettings.setDatabasePath(databasePath);
        }

        webView.setWebViewClient(new webViewClient());

        // Enable debugging in webview
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            if (0 != (getApplicationInfo().flags &= ApplicationInfo.FLAG_DEBUGGABLE)) {
                WebView.setWebContentsDebuggingEnabled(true);
            }
        }

        // Expose Java methods as JavaScript interfaces
        webView.addJavascriptInterface(new Storage(this), "androidStorage");
        webView.addJavascriptInterface(new Tools(this), "androidTools");
        webView.addJavascriptInterface(new ImageUtils(), "imageUtils");
        webView.addJavascriptInterface(new InAppBilling(), "inAppBilling");

        // Check if called from share menu
        Intent intent = getIntent();
        String type = intent.getType();
        String action = intent.getAction();
        Bundle extras = intent.getExtras();
        Uri uri = intent.getData();

        if (Intent.ACTION_SEND.equals(action) && type != null) {
            if ("text/plain".equals(type) && extras.containsKey(Intent.EXTRA_TEXT)) {
                // Handle text being sent
                final String query = intent.getStringExtra(Intent.EXTRA_TEXT);

                webView.loadUrl(INDEX + Utils.makePaletteUrl(Utils.getEncodedString(query)));
            } else if (type.startsWith("image/") && extras.containsKey(Intent.EXTRA_STREAM)) {
                // Get resource path
                final Uri imageUri = extras.getParcelable(Intent.EXTRA_STREAM);
                final Bitmap bitmap = getBitmap(imageUri);

                processImage(bitmap);
            } else {
                Toast.makeText(this, R.string.parse_error, Toast.LENGTH_SHORT).show();
            }
        } else if (Intent.ACTION_VIEW.equals(action) && uri != null) {
            final String URL = uri.toString().replaceAll("(^https?://" + getString(R.string.app_host) + "/|^croma://)", INDEX);

            webView.loadUrl(URL);
        } else {
            // Load the start page
            webView.loadUrl(INDEX);
        }
    }

    // PLEASE SEE https://github.com/anjlab/android-inapp-billing-v3 FOR MORE INFORMATION.

    // IBillingHandler implementation
    @Override
    public void onBillingInitialized() {
        // Called when BillingProcessor was initialized and its ready to purchase
    }

    @Override
    public void onProductPurchased(String productId, TransactionDetails details) {
        // Called when requested PRODUCT ID was successfully purchased
        Toast.makeText(this, R.string.purchase_success, Toast.LENGTH_SHORT).show();

        // Refresh webview
        webView.loadUrl(webView.getUrl());
    }

    @Override
    public void onBillingError(int errorCode, Throwable error) {
        // Called when some error occured. See Constants class for more details
        Toast.makeText(this, R.string.purchase_fail, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onPurchaseHistoryRestored() {
        // Called when purchase history was restored and the list of all owned PRODUCT IDs
        // was loaded from Google Play
    }

    // Unbind IInAppBilling on close
    @Override
    public void onDestroy() {
        if (bp != null) {
            bp.release();
        }

        super.onDestroy();
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent intent) {

        super.onActivityResult(requestCode, resultCode, intent);

        switch (requestCode) {
            case SELECT_PHOTO:

                if (resultCode == RESULT_OK) {
                    Bitmap bitmap;

                    Uri uri = intent.getData();

                    if (uri != null) {
                        bitmap = getBitmap(uri);

                        processImage(bitmap);

                    } else if (intent.hasExtra("colors")){
                        final ArrayList<Integer> colors = intent.getIntegerArrayListExtra("colors");

                        MainActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                List<Color> list = new ArrayList<Color>();

                                for (Integer c : colors) {
                                    list.add(new Color(c));
                                }

                                webView.loadUrl(INDEX + Utils.makePaletteUrl(Utils.makePaletteQuery(list)));
                            }
                        });
                    } else if (intent.hasExtra("data")) {
                        bitmap = (Bitmap) intent.getExtras().get("data");
                        processImage(bitmap);
                    } else {
                        Toast.makeText(this, R.string.parse_error, Toast.LENGTH_LONG).show();
                    }
                }
        }

    }


    private class webViewClient extends WebViewClient {
        // Show a splash screen until the WebView is ready
        @Override
        public void onPageFinished(WebView view, String url) {
            findViewById(R.id.imageview).setVisibility(View.GONE);
            findViewById(R.id.webview).setVisibility(View.VISIBLE);
        }

        // Enable debugging below KitKat
        public boolean onConsoleMessage(ConsoleMessage cm) {
            Log.d(getString(R.string.app_name), cm.message() + " -- From line "
                    + cm.lineNumber() + " of "
                    + cm.sourceId());

            return true;
        }
    }

    public class InAppBilling {
        @JavascriptInterface
        public void purchase(String productId) {
            bp.purchase(MainActivity.this, productId);
        }

        @JavascriptInterface
        public String isPurchased(String productId) {
            return bp.isPurchased(productId) ? "true": "false";
        }
    }

    private class ImageUtils {
        @JavascriptInterface
        public void getPalette() {
            boolean hasCamera = Utils.checkCameraHardware(MainActivity.this);

            final List<Intent> cameraIntents = new ArrayList<Intent>();
            final Intent captureIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
            final PackageManager packageManager = MainActivity.this.getPackageManager();
            final List<ResolveInfo> listCam = packageManager.queryIntentActivities(captureIntent, 0);

            if (hasCamera) {
                cameraIntents.add(new Intent(MainActivity.this, ColorPickerActivity.class));
            }

            for (ResolveInfo res : listCam) {
                final String packageName = res.activityInfo.packageName;
                final Intent intent = new Intent(captureIntent);

                intent.setComponent(new ComponentName(res.activityInfo.packageName, res.activityInfo.name));
                intent.setPackage(packageName);

                cameraIntents.add(intent);
            }

            // Filesystem.
            final Intent galleryIntent = new Intent(Intent.ACTION_PICK);

            galleryIntent.setType("image/*");

            // Chooser of filesystem options.
            final Intent chooserIntent = Intent.createChooser(galleryIntent,
                    MainActivity.this.getString(R.string.select_label));

            // Add the camera options.
            chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, cameraIntents.toArray(new Parcelable[]{}));

            MainActivity.this.startActivityForResult(chooserIntent, SELECT_PHOTO);
        }
    }

}
