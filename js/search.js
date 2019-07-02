window.onload = function() {

    //搜索框 delete事件
    $('.search .iconfont').click(function() {
        $('.search input').val('');
        $(this).css('display', 'none');
        $('.s-list').css('display', 'none');
    });

    //搜索框focus，blur事件
    $('.search input').focus(function() {
        $(this).css('border-bottom', '0.01rem solid #fff');
    }).blur(function() {
        $(this).css('border-bottom', '0.01rem solid #ccc');
    });

    //搜索框input事件 ajax请求歌曲数据
    $('.search input').bind('input propertychange', function() {
        if ($(this).val() == '') {
            $('.search .iconfont').css('display', 'none');
            $('.s-list').css('display', 'none');
            return;
        }
        $('.search .iconfont').css('display', 'block');

        $.ajax({
            url: `http://localhost:3000/search?keywords=${$(this).val()}`,
            success: function({ result: { songs } }) {
                if (!songs) return;
                let songObj = {};
                songs.forEach((item, index) => {
                    if (!item.name.indexOf($('.search input').val()) == 0) return;
                    songObj[item.name] = item.id;
                });
                let html = '';
                let nameArr = [],
                    idArr = [];
                for (let key in songObj) {
                    nameArr.push(key);
                    idArr.push(songObj[key]);
                    if ((html.split('li')).length - 1 <= 18) {
                        html += `<li class="s-l-item">
                                <span class="iconfont icon-changyongicon-1"></span>
                                <span class="songname">${key}</span>    
                            </li>
                        `;
                    }
                }
                $('.s-list ul').html(`
                    <li class="s-l-title">
                        <span>搜索&nbsp;&nbsp;&nbsp;&nbsp;“${$('.search input').val()}”</span>
                    </li>${html}
                `);
                [...$('.s-list ul li:not(.s-l-title)')].forEach((ele, index) => {
                    ele.index = index;
                    ele.onclick = function() {
                        $('.search input').val(nameArr[ele.index]);
                        $.get(
                            `http://localhost:3000/search?keywords=${nameArr[ele.index]}`,
                            function({ result: { songs } }) {
                                if (!songs) return;
                                let html = '';
                                songs.forEach((item, index) => {
                                    //正则匹配关键词改变CSS样式
                                    if (item.name.indexOf(nameArr[ele.index]) != -1) {
                                        let n = item.name.indexOf(nameArr[ele.index]),
                                            reg1 = new RegExp(`(.{${n}})(.*)`, 'i');
                                        item.name = item.name.replace(reg1, `$1<span class="blue">$2`);
                                        let m = item.name.indexOf(nameArr[ele.index]) + nameArr[ele.index].length,
                                            reg2 = new RegExp(`(.{${m}})(.*)`, 'i');
                                        item.name = item.name.replace(reg2, '$1</span>$2');

                                        let o = item.artists[0].name.indexOf(nameArr[ele.index]),
                                            reg3 = new RegExp(`(.{${o}})(.*)`, 'i');
                                        item.artists[0].name = item.artists[0].name.replace(reg3, `$1<span class="blue">$2`);
                                        let p = item.artists[0].name.indexOf(nameArr[ele.index]) + nameArr[ele.index].length,
                                            reg4 = new RegExp(`(.{${p}})(.*)`, 'i');
                                        item.artists[0].name = item.artists[0].name.replace(reg4, '$1</span>$2');

                                        let i = item.album.name.indexOf(nameArr[ele.index]),
                                            reg5 = new RegExp(`(.{${i}})(.*)`, 'i');
                                        item.album.name = item.album.name.replace(reg5, `$1<span class="blue">$2`);
                                        let j = item.album.name.indexOf(nameArr[ele.index]) + nameArr[ele.index].length,
                                            reg6 = new RegExp(`(.{${j}})(.*)`, 'i');
                                        item.album.name = item.album.name.replace(reg6, '$1</span>$2');
                                    }

                                    html += `
                                        <li class="r-c-item">
                                            <a href="./play.html?id=${item.id}">
                                                <div class="song">
                                                    <div class="s-name">
                                                        ${item.name}
                                                    </div>
                                                    <div class="s-desc">
                                                        ${item.artists[0].name}&nbsp;-&nbsp;${item.album.name}
                                                    </div>
                                                </div>
                                                <div class="play">
                                                    <span class="iconfont iconbofang1"></span>
                                                    <span class="iconfont icon-more1170511easyiconnet"></span>
                                                </div>
                                            </a>
                                        </li>
                                    `
                                });
                                $('.r-c-list').html(html);
                                $('.s-list').css('display', 'none');
                                $('#hot').css('display', 'none');
                                $('#history').css('display', 'none');
                                $('#result').css('display', 'block')
                            }
                        )
                    }
                });
            },
            error: function(err) {
                console.log(err.responseText);
            }
        });

        $('.s-list').css('display', 'block');

    });


    //删除历史记录
    $('.iconlajixiang').click(function() {
        $('body').css('background-color', '#f6f6f6');
        $('.delete').css('display', 'block');
        $('.d-b-no').click(function() {
            $('.delete').css('display', 'none');
            $('body').css('background-color', '#fff');
        });
        $('.d-b-yes').click(function() {
            $('.history-list ul').html('');
            $('.delete').css('display', 'none');
            $('body').css('background-color', '#fff');
        })
    })

}