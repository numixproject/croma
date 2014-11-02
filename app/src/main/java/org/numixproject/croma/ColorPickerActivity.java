package org.numixproject.croma;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.hardware.Camera;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.Toast;

import java.util.List;


public class ColorPickerActivity extends Activity {
    private Camera mCamera;
    private CameraPreview mPreview;
    private ImageButton doneButton;
    private Orientation orientation;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.picker);
        setRequestedOrientation (ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        doneButton = (ImageButton) findViewById(R.id.done_button);
        orientation = new Orientation(this, doneButton);
        if (orientation.canDetectOrientation()) orientation.enable();

        // Create an instance of Camera
        mCamera = getCameraInstance();

        // Get Camera parameters
        Camera.Parameters params = mCamera.getParameters();

        List<String> focusModes = params.getSupportedFocusModes();

        if (focusModes.contains(Camera.Parameters.FOCUS_MODE_AUTO)) {
            params.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO); // Autofocus mode supported
        }

        // Set Camera parameters
        mCamera.setParameters(params);
        mCamera.setDisplayOrientation(90);

        // Create our Preview view and set it as the content of our activity.
        mPreview = new CameraPreview(this, mCamera);

        RelativeLayout preview = (RelativeLayout) findViewById(R.id.camera_preview);
        preview.setOnTouchListener(mPreview);
        preview.addView(mPreview);

        doneButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.putIntegerArrayListExtra("colors", mPreview.getColors());
                setResult(RESULT_OK, intent);
                System.out.println("Done....");
                finish();
            }
        });
    }

    /** Check if this device has a camera */
    private boolean checkCameraHardware(Context context) {
        if (context.getPackageManager().hasSystemFeature(PackageManager.FEATURE_CAMERA)){
            // this device has a camera
            return true;
        } else {
            // no camera on this device
            return false;
        }
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        orientation.disable();
    }

    /** A safe way to get an instance of the Camera object. */
    public static Camera getCameraInstance(){
        Camera c = null;
        try {
            c = Camera.open(); // attempt to get a Camera instance
        } catch (Exception e){
            System.out.println("Error: Unable to open camera " + e);
            // Camera is not available (in use or does not exist)
        }

        return c; // returns null if camera is unavailable
    }

}
