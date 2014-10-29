package org.numixproject.croma;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ImageFormat;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.YuvImage;
import android.hardware.Camera;
import android.util.Log;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.widget.RelativeLayout;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;

public class CameraPreview extends SurfaceView implements SurfaceHolder.Callback,View.OnTouchListener {
    private SurfaceHolder mHolder;
    private Camera mCamera;
    private RelativeLayout cameraPreview;
    private ArrayList<Integer> colors;

    public CameraPreview(Activity activity,Camera camera) {
        super(activity);

        mCamera = camera;

        this.cameraPreview = (RelativeLayout) activity.findViewById(R.id.camera_preview);

        colors = new ArrayList<Integer>();

        mHolder = getHolder();
        mHolder.addCallback(this);
    }

    public ArrayList<Integer> getColors() {
        return colors;
    }

    public void surfaceCreated(SurfaceHolder holder) {
        // The Surface has been created, now tell the camera where to draw the preview.
        try {
            mCamera.setPreviewDisplay(holder);
            mCamera.startPreview();
        } catch (IOException e) {
            Log.d("CameraPreview", "Error setting camera preview: " + e.getMessage());
        }
    }

    public void surfaceDestroyed(SurfaceHolder holder) {
        mCamera.release();
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int w, int h) {
        //No need to change preview, using orientation portrait
    }

    @Override
    public boolean onTouch(final View view, final MotionEvent motionEvent) {
        if (motionEvent.getAction() == MotionEvent.ACTION_DOWN) {
            System.out.println("Touched...");
        } else if (motionEvent.getAction() == MotionEvent.ACTION_UP) {
            System.out.println("Removed...");
        }

        System.out.println("Motion event :" +  motionEvent.getX() + "," + motionEvent.getY());

        final int x = (int)motionEvent.getX();
        final int y = (int)motionEvent.getY();

        mCamera.setPreviewCallback(new Camera.PreviewCallback() {

            @Override
            public void onPreviewFrame(byte[] bytes, Camera camera) {
                camera.setPreviewCallback(null);

                Log.d("View Dimension:", view.getWidth() + "," + view.getHeight());

                Bitmap bitmap = getBitmap(bytes, camera);
                bitmap = rotate(bitmap, 90);

                Log.d("Image Dimension:", bitmap.getWidth() + "," + bitmap.getHeight());

                bitmap = Bitmap.createScaledBitmap(bitmap, view.getWidth() , view.getHeight(), true);

                System.out.println("Motion event :->" +  motionEvent.getX() + "," + motionEvent.getY());

                Bitmap mutableBitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true);

                //mutableBitmap = rotate(mutableBitmap, 90);
                int color = mutableBitmap.getPixel(x, y);

                Paint paint = new Paint();
                paint.setAntiAlias(true);
                paint.setColor(Color.RED);

                Bitmap cpBitmap = Bitmap.createBitmap(cameraPreview.getWidth(), cameraPreview.getHeight(), Bitmap.Config.ARGB_8888);

                Canvas cc = new Canvas(cpBitmap);
                Canvas canvas = new Canvas(mutableBitmap);

                canvas.drawCircle(x, y, 10, paint);
                cc.drawCircle(x, y, 10, paint);

                cameraPreview.draw(cc);

                View vc = getColorView(getContext(), x, y, color);

                colors.add(color);

                cameraPreview.addView(vc);
            }
        });

        return true;
    }



    private View getColorView(Context ct,int x, int y, int color) {
        RelativeLayout.LayoutParams params;

        params = new RelativeLayout.LayoutParams(50, 50);

        params.leftMargin = x - 25;
        params.topMargin = y - 25;

        RelativeLayout r = new RelativeLayout(ct);

        r.setLayoutParams(params);

        DrawColorDiv dc = new DrawColorDiv(ct, color);
        r.addView(dc);

        return r;
    }

    private Bitmap rotate(Bitmap b, int a) {
        Matrix matrix = new Matrix();
        matrix.postRotate(90);

        Bitmap rotatedBitmap = Bitmap.createBitmap(b , 0, 0, b.getWidth(), b.getHeight(), matrix, true);

        return rotatedBitmap;
    }

    private Bitmap getBitmap(byte data[], Camera camera) {
        // Convert to JPG
        Camera.Size previewSize = camera.getParameters().getPreviewSize();
        YuvImage yuvimage=new YuvImage(data, ImageFormat.NV21, previewSize.width, previewSize.height, null);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        yuvimage.compressToJpeg(new Rect(0, 0, previewSize.width, previewSize.height), 80, baos);

        byte[] jdata = baos.toByteArray();

        // Convert to Bitmap
        Bitmap bmp = BitmapFactory.decodeByteArray(jdata, 0, jdata.length);

        return bmp;
    }
}