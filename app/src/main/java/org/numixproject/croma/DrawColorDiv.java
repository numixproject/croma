package org.numixproject.croma;


import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.view.View;

public class DrawColorDiv extends View {
    Context context;
    int color;
    public DrawColorDiv(Context mContext, int color) {
        super(mContext);
        context = mContext;
        this.color = color;
    }

    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        Paint paint = new Paint();
        paint.setColor(Color.argb(80, 255, 255, 255));
       /* paint.setStrokeWidth(3.0f);
        paint.setStyle(Paint.Style.STROKE);*/
        canvas.drawCircle(25, 25, 25, paint);
        paint.setColor(this.color);
        paint.setAlpha(255);
        canvas.drawCircle(25, 25,22, paint);
        invalidate();
    }

}