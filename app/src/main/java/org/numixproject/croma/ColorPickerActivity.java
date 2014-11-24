package org.numixproject.croma;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.hardware.Camera;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;


public class ColorPickerActivity extends Activity {
    private Camera mCamera;
    private CameraPreview mPreview;
    private ImageButton doneButton;
    private RotateView orientation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.picker);
        setRequestedOrientation (ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

        if (!Utils.checkCameraHardware(this)) {
            Toast.makeText(this, R.string.no_camera_message, Toast.LENGTH_LONG).show();

            this.finish();
            return;
        }

        doneButton = (ImageButton) findViewById(R.id.done_button);
        orientation = new RotateView(this, doneButton);

        if (orientation.canDetectOrientation()) {
            orientation.enable();
        }

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
        RelativeLayout rl = (RelativeLayout) this.findViewById(R.id.camera_preview);
        mPreview = new CameraPreview(this, mCamera, rl);

        RelativeLayout preview = (RelativeLayout) findViewById(R.id.camera_preview);
        preview.setOnTouchListener(mPreview);
        preview.addView(mPreview);

        doneButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
            if (mPreview.getColors().size() != 0) {
                Set<Integer> set = mPreview.getColors();
                Intent intent = new Intent();
                ArrayList<Integer> al = new ArrayList<Integer>(set.size());
                for (int c : set) {
                    al.add(c);
                }
                intent.putIntegerArrayListExtra("colors", al);
                setResult(RESULT_OK, intent);
                finish();
            } else {
                Toast.makeText(ColorPickerActivity.this, R.string.no_color_message, Toast.LENGTH_LONG).show();
            }
            }
        });
    }


    @Override
    public void onDestroy() {
        super.onDestroy();

        if (orientation != null) {
            orientation.disable();
        }
    }

    // Safely way get an instance of the Camera object.
    public static Camera getCameraInstance(){
        Camera c = null;

        try {
            c = Camera.open(); // Attempt to get a Camera instance
        } catch (Exception e){
            // Camera is not available (in use or does not exist)
            e.printStackTrace();
        }

        return c; // Returns null if camera is unavailable
    }

}
