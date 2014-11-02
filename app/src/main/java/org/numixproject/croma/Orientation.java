package org.numixproject.croma;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.view.OrientationEventListener;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;


class Orientation extends OrientationEventListener {
    private ImageButton doneButton;
    private Bitmap icon;
    private Context context;
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
            Bitmap newIcon = Utils.rotate(icon, (angle));
            Drawable d = new BitmapDrawable(this.context.getResources(), newIcon);
            this.doneButton.setImageDrawable(d);
            System.out.println("Orientation changed" + i);
        }

    }
}
