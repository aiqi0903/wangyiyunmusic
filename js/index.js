window.onload = function() {

    //banner ajax请求轮播图数据
    let $banner = $('#banner-wrapper');
    $.get(
        'http://localhost:3000/banner',
        function({ banners }) {
            $banner.html('');
            let html = '';
            banners.forEach((item, index) => {
                html += `
                    <div class="swiper-slide">
                        <img class="banner-img" src="${item.imageUrl}" alt="" />
                        <sapn class="banner-imgtype" style="background-color:${item.titleColor};">${item.typeTitle}<span>
                    </div>
                `
                $banner.html(`
                    <div class="swiper-container">
                        <div class="swiper-wrapper">
                            ${html}
                        </div>
                        <div class="swiper-pagination"></div>
                    </div>
                `);
            });
            //开启swiper轮播插件
            new Swiper('.swiper-container', {
                autoplay: 4000,
                pagination: '.swiper-pagination',
                paginationClickable: true
            });
        }
    );

    //songsheet ajax请求歌单数据
    let $songList = $('.ss-c-list');
    $.get(
        'http://localhost:3000/personalized',
        function({ result }) {
            $songList.html('');
            let html = '';
            result.forEach((item, index) => {
                if (index < 6) {
                    html += `
                        <li class="ss-c-item">
                            <a href="#">
                                <div class="ss-c-i-img">
                                    <img src="${item.picUrl}" alt="">
                                    <div class="playcount">
                                        <span class="iconfont iconbofang"></span>
                                        <span class="num">${parseInt(item.playCount/10000)}w</span>
                                    </div>
                                </div>
                                <div class="ss-c-i-desc">
                                    ${item.name}
                                </div>
                            </a>
                        </li>
                    `
                }
            });
            $songList.html(html);
        }
    );

    //nav 设置日历日期
    $('.icon-rili i').text(new Date().getDate());

}