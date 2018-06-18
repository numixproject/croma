package org.numixproject.croma;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import java.util.ArrayList;
import java.util.List;

import me.croma.image.Color;


public class PickColorActivity extends Activity {
    private static final int REQ_CODE_COLOR_PICKER = 346732;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = new Intent(this, ColorPickerActivity.class);

        startActivityForResult(intent, PickColorActivity.REQ_CODE_COLOR_PICKER);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);

        if (resultCode == Activity.RESULT_OK && requestCode == PickColorActivity.REQ_CODE_COLOR_PICKER) {
            final ArrayList<Integer> colors = intent.getIntegerArrayListExtra("colors");

            List<Color> list = new ArrayList<Color>();

            for (Integer c : colors) {
                list.add(new Color(c));
            }

            Uri uri = Uri.parse("croma://" + Utils.makePaletteUrl((Utils.makePaletteQuery(list))));

            Intent croma = new Intent(this, MainActivity.class);

            croma.setAction(Intent.ACTION_VIEW);
            croma.setData(uri);

            startActivity(croma);

        }

        finish();
    }
}
