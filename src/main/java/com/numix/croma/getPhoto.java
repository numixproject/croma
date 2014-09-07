package com.numix.croma;

import java.io.*;

import android.app.Activity;
import android.app.AlertDialog;
import android.net.Uri;
import android.content.Intent;
import android.content.DialogInterface;
import android.provider.MediaStore;
import android.webkit.JavascriptInterface;

public class getPhoto extends Activity {

    private static final int REQUEST_CAMERA = 1000;
    private static final int SELECT_FILE = 2000;

    private void selectImage() {

        final CharSequence[] items = {
                "Capture a photo",
                "Choose from library",
                "Cancel"
        };

        AlertDialog.Builder builder = new AlertDialog.Builder(getPhoto.this);

        builder.setTitle("Get palette from photo!");

        builder.setItems(items, new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int item) {

                if (items[item].equals("Capture a photo")) {

                    Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

                    File f = new File(android.os.Environment
                            .getExternalStorageDirectory(), "temp.jpg");

                    intent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(f));
                    startActivityForResult(intent, REQUEST_CAMERA);

                } else if (items[item].equals("Choose from library")) {

                    Intent intent = new Intent(
                            Intent.ACTION_PICK,
                            android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);

                    intent.setType("image/*");

                    startActivityForResult(
                            Intent.createChooser(intent, "Select File"),
                            SELECT_FILE);

                } else if (items[item].equals("Cancel")) {
                    dialog.dismiss();
                }
            }
        });

        builder.show();
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data) {

        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == RESULT_OK) {

            if (requestCode == REQUEST_CAMERA) {

            } else if (requestCode == SELECT_FILE) {

            }
        }
    }


    @JavascriptInterface
    public void getColorsFromImage() {

        // Call selectImage() and return a JSONArray to JavaScript Interface

    }
}