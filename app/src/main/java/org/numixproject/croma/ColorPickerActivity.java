package org.numixproject.croma;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.hardware.Camera;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import android.widget.Toast;

import java.util.List;


public class ColorPickerActivity extends Activity {
    private Camera mCamera;
    private CameraPreview mPreview;
    private Button doneButton;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_color_picker);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        doneButton = (Button) findViewById(R.id.done_button);
        // Create an instance of Camera
        mCamera = getCameraInstance();
        // get Camera parameters

        Camera.Parameters params = mCamera.getParameters();

        List<String> focusModes = params.getSupportedFocusModes();
        if (focusModes.contains(Camera.Parameters.FOCUS_MODE_AUTO)) {
            params.setFocusMode(Camera.Parameters.FOCUS_MODE_AUTO);
            // Autofocus mode is supported
        }
        // set Camera parameters
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
                intent.putIntegerArrayListExtra("colors", (java.util.ArrayList<Integer>) mPreview.getColors());
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
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        // Checks the orientation of the screen
        if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            Toast.makeText(this, "landscape", Toast.LENGTH_SHORT).show();
        } else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT){
            Toast.makeText(this, "portrait", Toast.LENGTH_SHORT).show();
        }
        // Checks the orientation of the screen for landscape and portrait and set portrait mode always
        if (newConfig.orientation == ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE) {
            mCamera.setDisplayOrientation(0);
            setRequestedOrientation (ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        } else if (newConfig.orientation == ActivityInfo.SCREEN_ORIENTATION_PORTRAIT){
            mCamera.setDisplayOrientation(90);
            setRequestedOrientation (ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        } else if (newConfig.orientation == ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT){
            mCamera.setDisplayOrientation(270);
            setRequestedOrientation (ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        } else if (newConfig.orientation == ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE){
            mCamera.setDisplayOrientation(180);
            setRequestedOrientation (ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        }

    }

    /** A safe way to get an instance of the Camera object. */
    public static Camera getCameraInstance(){
        Camera c = null;
        try {
            c = Camera.open(); // attempt to get a Camera instance
        }
        catch (Exception e){
            System.out.println("Error: Unable to open camera " + e);
            // Camera is not available (in use or does not exist)
        }
        return c; // returns null if camera is unavailable
    }

}
