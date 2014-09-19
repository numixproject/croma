package org.numixproject.croma;


import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;

import com.anjlab.android.iab.v3.BillingProcessor;
import com.anjlab.android.iab.v3.TransactionDetails;

public class InAppBilling {

    Context mContext;


    // Set application context.
    InAppBilling(Context c) {
        mContext = c;
    }

    BillingProcessor bp;


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
}


