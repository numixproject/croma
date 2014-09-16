package com.numix.croma;


import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;

import com.anjlab.android.iab.v3.BillingProcessor;
import com.anjlab.android.iab.v3.TransactionDetails;

public class InAppBilling extends MainActivity implements BillingProcessor.IBillingHandler {
    BillingProcessor bp;

    // PLEASE SEE https://github.com/anjlab/android-inapp-billing-v3 FOR MORE INFORMATION.

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bp = new BillingProcessor(this, null, this);
    }

    // IBillingHandler implementation
    @Override
    public void onBillingInitialized() {
        /*
         * Called then BillingProcessor was initialized and its ready to purchase
         */
    }

    @Override
    public void onProductPurchased(String productId, TransactionDetails details) {
        /*
         * Called then requested PRODUCT ID was successfully purchased
         */
    }

    @Override
    public void onBillingError(int errorCode, Throwable error) {
        /*
         * Called then some error occured. See Constants class for more details
         */
    }

    @Override
    public void onPurchaseHistoryRestored() {
        /*
         * Called then purchase history was restored and the list of all owned PRODUCT ID's
         * was loaded from Google Play
         */
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (!bp.handleActivityResult(requestCode, resultCode, data))
            super.onActivityResult(requestCode, resultCode, data);
    }

    // Purchase an Item.
    @JavascriptInterface
    public void purchaseItem(String product_id) {
        bp.purchase(product_id);
    }

    @JavascriptInterface
    public void getItemDetails(String product_id) {
        bp.getPurchaseListingDetails(product_id);
        //  Will return:
        //  public final String productId;
        //  public final String title;
        //  public final String description;
        //  public final boolean isSubscription;
        //  public final String currency;
        //  public final Double priceValue;
        //  public final String priceText;
    }

    @JavascriptInterface
    public void getTransactionDetails(String product_id) {
        bp.getPurchaseTransactionDetails(product_id);
    }

    // Unbind IInAppBilling on close
    @Override
    public void onDestroy() {
        if (bp != null)
            bp.release();

        super.onDestroy();
    }
}
