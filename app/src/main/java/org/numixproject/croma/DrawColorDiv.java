package org.numixproject.croma;


import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.view.View;

public class DrawColorDiv extends View {
    int color;
    int radius;

    Paint paint = new Paint();

    DrawColorDiv(Context c, int color, int radius) {
        super(c);

        this.color = color;
        this.radius = radius;
    }

    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        paint.setAntiAlias(true);
        paint.setColor(Color.rgb(255, 255, 255));

        canvas.drawCircle(radius, radius, radius, paint);

        paint.setColor(color);
        paint.setAlpha(255);

        canvas.drawCircle(radius, radius, radius - 4, paint);
        invalidate();
    }

}