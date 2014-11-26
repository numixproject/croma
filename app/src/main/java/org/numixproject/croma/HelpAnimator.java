package org.numixproject.croma;


import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;

public class HelpAnimator implements Animation.AnimationListener {
    private Animation animation;
    private View noColorHelp;
    public HelpAnimator(View noColorHelp) {
        this.noColorHelp = noColorHelp;
    }

    public void cancelGracefully() {
        if (animation != null) {
            animation.setDuration(300);
       }
    }
    @Override
    public void onAnimationStart(Animation animation) {
        noColorHelp.bringToFront();
        this.animation = animation;
    }

    @Override
    public void onAnimationEnd(Animation animation) {
        //ignore
    }

    @Override
    public void onAnimationRepeat(Animation animation) {
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            //ignore
            e.printStackTrace();
        }
    }
}
