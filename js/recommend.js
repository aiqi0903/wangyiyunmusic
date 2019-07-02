window.onload = function() {
    var audio = document.createElement('audio');
    //初始化
    $('.initial').click(function() {
        audio.src = '../media/你的（我的天空Remix） - 张德帅Sway.mp3';
        audio.play();
        $('#control').css('display', 'block');
        let baseColor = $('.c-c-play').css('background-color'),
            barColor = $('.circle-bar-right').css('background-color');
        let percent;
        audio.ontimeupdate = function() {
            percent = (audio.currentTime / audio.duration) * 100;
            if (percent <= 50) {
                $('.circle-bar-right').css({
                    'transform': 'rotate(' + (percent * 3.6) + 'deg)',
                    'background-color': barColor
                });
            } else {
                $('.circle-bar-right').css({
                    'transform': 'rotate(0deg)',
                    'background-color': baseColor
                });
                $('.circle-bar-left').css('transform', 'rotate(' + ((percent - 50) * 3.6) + 'deg)');
            }
        }
        audio.onended = function() {
            $('.circle-bar-right').css({
                'transform': 'rotate(0deg)',
                'background-color': barColor
            });
            $('.circle-bar-left').css({
                'transform': 'rotate(0deg)',
                'background-color': barColor
            });
            $('.mask').html(`
                <span class="iconfont icon-bofang2"></span>
            `);
        }
    })

    //header ajax请求背景图
    $.get(
        'http://localhost:3000/banner',
        function({ banners }) {
            $('.h-bg').css('background', `
                url(${banners[Math.floor(Math.random()*banners.length)].imageUrl}) no-repeat 0 0/auto 100%
            `);
        }
    );

    //header-bg 设置日历日期
    $('.icon-rili i').text(new Date().getDate());

    //content ajax请求每日推荐歌曲(需登录)
    let $recommendList = $('.c-c-list');
    $.ajax({
        url: 'http://localhost:3000/recommend/songs',
        success: function({ recommend }) {
            $recommendList.html('');
            let html = '';
            let idList = [],
                nameList = [],
                authorList = [],
                imgList = [];
            recommend.forEach((item, index) => {
                idList.push(item.id);
                nameList.push(item.name);
                authorList.push(item.artists[0].name);
                imgList.push(item.album.picUrl);
                html += `
                            <li class="c-c-item">
                                <a href="#control">
                                    <div class="info">
                                        <div class="info-img">
                                            <img src="${item.album.picUrl}" alt="">
                                        </div>
                                        <div class="info-title">
                                            <div class="info-text">
                                                ${item.name}
                                            </div>
                                            <div class="info-desc">
                                                ${item.artists[0].name}&nbsp;-&nbsp;${item.album.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="play">
                                        <span class="iconfont icon-bofang1"></span>
                                        <span class="iconfont icon-more1170511easyiconnet"></span>
                                    </div>
                                </a>
                            </li>
                        `
            });
            $recommendList.html(html);

            //点击歌曲列表项 ajax请求歌曲url,并进行播放
            window._audio = document.createElement('audio');
            [...$('.c-c-item')].forEach((ele, index) => {
                ele.index = index; //解决事件异步
                ele.onclick = function() {
                    $.get(
                        `http://localhost:3000/song/url?id=${idList[this.index]}`,
                        function({ data }) {
                            _audio.src = data[0].url;
                            _audio.play();
                        }
                    );
                    $('#control a').attr('href', `./play.html?id=${idList[this.index]}`);
                    $('.mask').html(`
                                <span class="iconfont icon-zanting"></span>
                            `);
                    $('.song-container').html(`
                                <div class="s-c-img">
                                    <img src="${imgList[this.index]}" alt="">
                                </div>
                                <div class="s-c-info">
                                    <div class="s-c-i-title">
                                        ${nameList[this.index]}
                                    </div>
                                    <div class="s-c-i-desc">
                                        ${authorList[this.index]}
                                    </div>
                                </div>
                            `);
                    $('#control').css('display', 'block');

                    //圆环进度条(有点bug 再次点击歌曲会短时间的出现一半的进度红条)
                    let baseColor = $('.c-c-play').css('background-color'),
                        barColor = $('.circle-bar-left').css('background-color');

                    _audio.addEventListener('timeupdate', function() {
                        let percent = (_audio.currentTime / _audio.duration) * 100;
                        if (percent <= 50) {
                            $('.circle-bar-right').css({
                                'transform': 'rotate(' + (percent * 3.6) + 'deg)',
                                'background-color': barColor
                            });
                        } else {
                            $('.circle-bar-right').css({
                                'transform': 'rotate(0deg)',
                                'background-color': baseColor
                            });
                            $('.circle-bar-left').css('transform', 'rotate(' + ((percent - 50) * 3.6) + 'deg)');
                        }
                    })

                    _audio.addEventListener('ended', function() {
                        $('.circle-bar-right').css({
                            'transform': 'rotate(0deg)',
                            'background-color': barColor
                        });
                        $('.circle-bar-left').css({
                            'transform': 'rotate(0deg)',
                            'background-color': barColor
                        });
                        $('.mask').html(`
                                    <span class="iconfont icon-bofang2"></span>
                                `);
                    })
                }
            })
        },
        error: function(err) {
            console.log(err);
        }
    });


}