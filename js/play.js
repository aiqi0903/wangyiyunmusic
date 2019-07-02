window.onload = function() {
    //初始化
    localStorage.setItem('id', '435307908'); //你的(我的天空Remix) 歌曲id

    //获取路由地址的参数id并放入本地存储
    (function(url) {
        if (!url.includes('?')) return;
        let parameter = url.split('?')[1];
        localStorage.setItem(parameter.split('=')[0], parameter.split('=')[1]);
    })(location.href)

    //back 按钮
    $('#header .back').click(function() {
        window.history.back();
    });

    //header获取歌曲歌名及歌手名、歌手图片 turntable转盘 ajax获取歌曲专辑图片
    $.get(
        `http://localhost:3000/song/detail?ids=${localStorage.getItem('id')}`,
        function({ songs }) {
            $('title').html(songs[0].name);
            $('.s-i-name').text(songs[0].name);
            $('.s-i-author').html(`${songs[0].ar[0].name}&nbsp;>`)
            $('#turntable img').attr('src', songs[0].al.picUrl);
            $.get(
                `http://localhost:3000/artists?id=${songs[0].ar[0].id}`,
                function({ artist }) {
                    $('.s-i-img img').attr('src', artist.img1v1Url);
                }
            )
        }
    )

    //ajx请求 歌曲播放
    window._audio = document.createElement('audio');
    $.get(
        `http://localhost:3000/song/url?id=${localStorage.getItem('id')}`,
        function({ data }) {
            _audio.src = data[0].url;
            _audio.play();

            //播放与暂停
            let mark = true;

            $('.c-c-play').click(function() {
                let icon = mark ? 'iconbofang1' : 'iconzanting';
                mark ? _audio.pause() : _audio.play();
                $(this).html(`<span class="iconfont ${icon}"></span>`);
                mark = !mark;
            })

            _audio.onplay = function() {
                $('#turntable').css('animation', 'rotate 10s linear infinite');
                $('#turntable').css('animation-play-state', 'running');
            }

            _audio.onpause = function() {
                $('#turntable').css('animation-play-state', 'paused');
            }

            _audio.addEventListener('canplay', function() {
                totalT = _audio.duration;
                $('.totalTime').text(formatTime(totalT));
            });

            _audio.addEventListener('ended', function() {
                $('#turntable').css('animation', '');
                $('.c-c-play').html(`<span class="iconfont iconbofang1"></span>`)
                mark = !mark;
            });

            //定义总时长和当前播放时长
            let totalT = 0,
                presentT = 0;
            //实现进度条
            _audio.addEventListener('timeupdate', function() {
                presentT = this.currentTime;
                $('.presentTime').text(formatTime(presentT));
                $('.c-p-b-bg').css('width', `${presentT/totalT*100}%`);
                $('.c-p-b-ball').css('left', `${presentT/totalT*100}%`);
            });
            //实现进度播放
            $('.c-p-bar').click(function(e) {
                //获取点击相对长度
                let length = e.pageX - this.offsetLeft;
                //获取点击位置占进度条元素长度的百分比;
                let percent_bar = length / this.offsetWidth;
                //改变进度
                presentT = percent_bar * totalT;
                _audio.currentTime = presentT;
                $('.c-p-b-bg').css('width', `${percent_bar*(this.offsetWidth)/3.375*100}rem`);
                $('.c-p-b-ball').css('left', `${percent_bar*(this.offsetWidth)/3.375*100}rem`);
            })

            //lyric ajax获取歌词
            $.get(
                `http://localhost:3000/lyric?id=${localStorage.getItem('id')}`,
                function({ lrc: { lyric } }) {
                    let lyricData = lyric.split('[');
                    lyricData.forEach((item, index) => {
                        if (!item) return;
                        let lyricArr = item.split(']');
                        let lyricTime = lyricArr[0].split('.')[0],
                            lyricStr = lyricArr[1];
                        let timeArr = lyricTime.split(':');
                        let time = timeArr[0] * 60 + timeArr[1] * 1;
                        //创建p标签并将歌词添加到页面中
                        let p = document.createElement('p');
                        p.id = 'ly' + time;
                        p.className = 'l-c-p';
                        p.innerText = lyricStr;
                        $('.lyric-container').append(p);
                    });
                    _audio.addEventListener('timeupdate', function() {
                        let currentTime = parseInt(this.currentTime);
                        [...$('.l-c-p')].forEach((ele, index) => {
                            if (ele.id == 'ly' + currentTime) {
                                $('.lyric-container').css('marginTop', `${-ele.offsetTop/100}rem`);
                                $(`.l-c-p:not(#${ele.id})`).css('color', '#7f7676');
                                ele.style.color = "#fff";
                            }
                        })
                    });
                }
            );

            //实现歌词界面与唱片播放页面切换
            let mark2 = true;
            $('#lyric').click(function() {
                if (mark2) {
                    $('#turntable').css('opacity', 0);
                    $('#lyric').css('opacity', 1);
                } else {
                    $('#turntable').css('opacity', 1);
                    $('#lyric').css('opacity', 0);
                }
                mark2 = !mark2;
            });
        }
    )


    //util工具函数
    //格式化歌曲时间
    function formatTime(time) {
        let m = parseInt(time % 3600 / 60),
            s = parseInt(time % 60);
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return m + ':' + s;
    }

}