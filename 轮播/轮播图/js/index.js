(function() {
    //1. 获取DOM元素
    var wrapper = document.querySelector('.wrapper');
    var prevBtn = document.querySelector('.prev-btn');
    var nextBtn = document.querySelector('.next-btn');
    var idots   = Array.from(document.querySelectorAll('.pagenation-item'));
    // 记录当前是否正在做切换
    var isAnimating = false;
    var curIndex    = 1;
    //2. 左右切换
    prevBtn.onclick = function() {
        // 判断，如果当前正在做切换
        // 那么就终止用户操作
        if(isAnimating) {return};
        if(curIndex == 1) {
            curIndex = 6;
        }else {
            curIndex--;
        }
        tab(+500);
        updateIdots();
    }
    nextBtn.onclick = function() {
        if(isAnimating) {return};
        if(curIndex == 6) {
            curIndex = 1;
        }else {
            curIndex++;
        }
        tab(-500);
        updateIdots();
    }
    // 3. 点击小圆点切换
    idots.forEach(function(idot, index) {
        idot.dataset.index = index + 1;    
        idot.onclick = function() {
            var index = this.dataset.index;
            // 异常处理 
            // index == curIndex用两个等于， 因为两者数据类型不相同
            if(index == curIndex || isAnimating) {
                return;
            }
            // -500         -1500
            //   1             3
            //  curIndex     index
            // 1 -> 3  -> 1000 ->  -(3-1)*500
            // 3 -> 1  -> 1000 ->  -(1-3)*500
            // var offset = -500 * (index - curIndex);
            
            var offset = 500 * (curIndex - index);
            tab(offset);
            // 更新当前显示下标
            curIndex = index;
            updateIdots();
        }
    }); 
    // 4. 自动播放
    var container = document.querySelector('.container');
    // 由于启动定时器和定时器没有在同一作用于中
    var timer = null;
    play();
    container.onmouseenter = stop;
    container.onmouseleave = play;

    function play() {
        timer = setInterval(function() {
            nextBtn.onclick();
        }, 3000);
    }
    function stop() {
        clearInterval(timer);
    }
    function updateIdots() {
        for(var i = 0, len = idots.length; i < len; i++) {
            if(idots[i].classList.contains('show')) {
                idots[i].classList.remove('show');
                break;
            }
        }
        idots[curIndex - 1].classList.add('show');
    }
    function tab(offset) {
        isAnimating = true;
        // 当前偏移
        var curLeft = parseInt(getStyle(wrapper, "left"));
        // 目标Left值
        var tarLeft = curLeft + offset;
        // 帧动画效果 
        var duration = 500;
        var interval = 15;
        var frames = duration / interval;
        var speed  = offset / frames;
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
        var t = setInterval(function() {
            // 更新当前位置
            curLeft = parseInt(getStyle(wrapper, "left"));
            // 判断
            // offset > 0 && curLeft < tarLeft
            // offset < 0 && curLeft > tarLeft
            if((offset > 0 && curLeft < tarLeft) || (offset < 0 && curLeft > tarLeft)) {
                wrapper.style.left = curLeft + speed + "px";
            }else {
                // 清除定时器
                clearInterval(t);
                isAnimating = false;
                // 修正位置
                wrapper.style.left = tarLeft + "px";
                // 无限滚动
                if(parseInt(getStyle(wrapper, "left")) < -500 * 6) {
                    wrapper.style.left = "-500px";
                }else if (parseInt(getStyle(wrapper, "left")) > -500) {
                    wrapper.style.left = -500 * 6 + "px";
                }
            }

        }, interval);

        // wrapper.style.left = tarLeft + "px";
        // wrapper.style.left = parseInt(getStyle(wrapper, "left")) + offset + "px";
        // if(parseInt(getStyle(wrapper, "left")) < -500 * 6) {
        //     wrapper.style.left = "-500px";
        // }else if (parseInt(getStyle(wrapper, "left")) > -500) {
        //     wrapper.style.left = -500 * 6 + "px";
        // }
    }
})();