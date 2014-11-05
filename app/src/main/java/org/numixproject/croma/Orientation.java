package org.numixproject.croma;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.view.OrientationEventListener;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationSet;
import android.view.animation.DecelerateInterpolator;
import android.view.animation.RotateAnimation;
import android.view.animation.TranslateAnimation;
import android.widget.Button;
import android.widget.ImageButton;


class Orientation extends OrientationEventListener {
    private ImageButton doneButton;
    private Bitmap icon;
    private Context context;
    private int preAngle = 90;
    public Orientation(Context context, ImageButton doneButton) {
        super(context);
        this.context = context;
        this.doneButton = doneButton;
        this.icon = BitmapFactory.decodeResource(context.getResources(),
                R.drawable.done);

    }

    @Override
    public void onOrientationChanged(int i) {
        if (i != OrientationEventListener.ORIENTATION_UNKNOWN) {
            int angle = i;
            //if ((angle <= 45 && angle >= 0) || (angle <= 360 && angle >= (360 - 45))) angle = i;
            if ( angle >= (270 - 45) && angle <= (360 - 45) || (angle >= 45 && angle <= (90 + 45))) angle += 180;
            angle %= 360;
           /* Bitmap newIcon = Utils.rotate(icon, (angle));
            Drawable d = new BitmapDrawable(this.context.getResources(), newIcon);
            this.doneButton.setImageDrawable(d);
           */
            angle = angle > 180 ? -(360 - angle) : angle;
            if (Math.abs(preAngle - angle) > 3) {
                AnimationSet animSet = new AnimationSet(true);
                animSet.setInterpolator(new DecelerateInterpolator());
                animSet.setFillAfter(true);
                animSet.setFillBefore(true);
                animSet.setFillEnabled(true);
                animSet.initialize(doneButton.getWidth(), doneButton.getHeight(), doneButton.getWidth(), doneButton.getHeight());
                final RotateAnimation animRotate = new RotateAnimation(preAngle, angle,
                        RotateAnimation.RELATIVE_TO_SELF, 0.5f,
                        RotateAnimation.RELATIVE_TO_SELF, 0.5f);

                animRotate.setDuration(500);
                animRotate.setFillAfter(true);
                animSet.addAnimation(animRotate);
                doneButton.startAnimation(animSet);

                //doneButton.animate();
                preAngle = angle;
            }

            System.out.println("Orientation changed" + i);
        }

    }
}
