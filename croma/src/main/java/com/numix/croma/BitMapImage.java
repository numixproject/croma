package com.numix.croma;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import java.io.File;

import me.croma.image.Color;
import me.croma.image.Image;


public class BitMapImage extends Image {
    private Bitmap image;

    public BitMapImage(Bitmap b) {
        super(b.getWidth(), b.getHeight());
        this.image = b;
    }
    public BitMapImage(File f) {
        this(BitMapImage.create(f));
    }

    private static Bitmap create(File f) {
        Bitmap image;
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inPreferredConfig = Bitmap.Config.ARGB_8888;
        image = BitmapFactory.decodeFile(f.getAbsolutePath(), options);

        return image;
    }


    @Override
    public Color getColor(int x, int y) {
        return new Color(image.getPixel(x, y));
    }

    @Override
    public BitMapImage getScaledInstance(int width, int height) {
        Bitmap resized = Bitmap.createScaledBitmap(this.image, width , height, true);
        return new BitMapImage(resized);
    }
}