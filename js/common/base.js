;!function () {
  window.baseController = {
    init: function () {
      this.mounted(this).handleBind(this);
    },
    getData: function (url, type, param, callback, loading) {
      var index;
      
      if (loading == false) {
        index = null;
      } else {
        index = layer.load(1);
      }
      
      
      var params = $.extend({}, param);
      
      $.ajax({
        type: type,
        url: "/" + url,
        data: params,
        dataType: dataTypeXpx,
        xhrFields: {withCredentials: true},
        success: function (data) {
          typeof callback == 'function' && callback(data);
          layer.close(index);
          return false;
        },
        error: function () {
          layer.close(index);
          layer.msg('网络出现问题，请重试！');
          return false;
        }
      });
    },
    mounted: function (opt) {
      
      Util.imgZoom($(".imgZoomT"), true);
      
      return this;
    },
    handleBind: function (opt) {
      
      
      //登录模块弹窗
      $(document).on('click', '.nav .btn', function () {
        layer.open({
          type: 1,
          title: false,
          area: ['700px', '496px'],
          shadeClose: true,
          move: false,
          content: $("#loginHtml").html(),
          success: function (layero, index) {
            nccode();
            
          }
        });
        
        
      });
      
      $(document).on('click', '.login-layer .tab li', function () {
        var index = $(this).index();
        $(this).addClass('curr').siblings('li').removeClass('curr');
        $('.login-layer .show-box').eq(index).show().siblings('.show-box').hide();
      });
      
      $(document).on('click', '.link2', function () {
        $(".register-layer").show();
        $(".login-layer").hide();
      });
      
      $(document).on('click', '.link1', function () {
        $(".findpwd-layer").show();
        $(".login-layer").hide();
      });
      
      $(document).on('input propertychange', '#mobile', function () {
        var val = $(this).val();
        $(this).parent().parent().find('.btn').addClass('status');
        $(this).parent().parent().find('.inp-button').addClass('active');
      });
      
      //发送验证码
      $(document).on('click', '#code', function () {
        var $codetext = $(this);
        
        //开始倒计时
        var second = 60, timer = null;
        
        timer = setInterval(function () {
          
          second -= 1;
          
          if (second > 0) {
            
            $codetext.val(second + '秒');
            
            $codetext.attr('disabled', "true");
            
            $codetext.addClass('btnDisabled');
            
          } else {
            
            clearInterval(timer);
            
            $codetext.removeAttr('disabled');
            
            $codetext.val('重新获取');
            
            $codetext.removeClass('btnDisabled');
            
            
          }
        }, 1000);
      });
      
      
      //选择国家地区
      $(document).on('click', '.choice', function (event) {
        $(".lately").hide();
        if ($(this).hasClass('choice-curr')) {
          $(this).removeClass('choice-curr');
        } else {
          $(this).addClass('choice-curr');
        }
        $(".choice .h-search-area").toggle();
        
        event.stopPropagation();
        
      });
      
      $(document).on('click', '.h-search-area .list dd', function () {
        var text = $(this).text();
        $(".choice").find('.text').text(text);
      });
      
      
      //搜索
      $(document).on('focus', '#lately', function () {
        $('.h-search-area').hide();
        $('.lately').show();
      });
      
      //搜索提交
      $(document).on('focus', '#searchBtn', function () {
        window.location.href = '/search.html'
      });
      
      
      //关闭搜索区域
      $(document).click(function (e) {
        var target = $(e.target);
        if (target.closest(".h-search-box").length != 0) return;
        $('.lately').hide();
      });
      
      
      return this;
    },
  }, $(function () {
    baseController.init();
  })
}();

(function (window) {
  Util = {
    /**
     * 设置cookie
     * @param name
     * @param value
     * @param time
     * @param domain
     * @returns {boolean}
     */
    setCookie: function (name, value, time, domain) {
      domain = domain ? ";domain=" + domain : "";
      var Days = time;
      var exp = new Date();
      exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
      document.cookie = name + "=" + value + ";expires=" + exp.toGMTString() + ";path=/" + domain;
      return true;
    },
    /**
     * 获取cookie
     * @param name
     * @returns {*}
     */
    getCookie: function (name) {
      var strCookie = document.cookie;
      var arrCookie = strCookie.split("; ");
      for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (name == arr[0]) {
          return arr[1];
        }
      }
      return "";
    },
    /**
     * 删除cookie
     * @param name
     */
    delCookie: function (name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.getCookie(name);
      if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    /**
     * 获取参数
     * @param value
     * @returns {*}
     */
    getRequest: function (value) {
      if (window.location.pathname == "/s/") {
        var url = unescape(location.search);
      } else {
        var url = decodeURI(location.search);
      }
      var object = {};
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          object[strs[i].split("=")[0]] = strs[i].split("=")[1]
        }
      }
      return object[value];
    },
    /**
     * tab切换
     * @param obj
     * @param callback
     * @param currentClass
     */
    tabs: function (obj, callback, currentClass) {
      if (typeof currentClass == 'undefined') {
        currentClass = 'curr';
      }
      
      $(obj).on('click', function () {
        if ($(this).hasClass("disabled")) {
          return;
        }
        var index = $(this).index();
        var val = $(this).attr('data-value');
        $(obj).removeClass(currentClass);
        $(this).addClass(currentClass);
        
        typeof callback == 'function' && callback(index, val);
      });
    },
    /**
     *时分秒倒计时方法
     */
    timergo: function (time) {
      var endTime = new Date(Number(time));
      var ts = endTime - new Date();
      if (ts > 0) {
        var dd = parseInt(ts / 1000 / 60 / 60 / 24, 10);
        var hh = parseInt(ts / 1000 / 60 / 60 % 24, 10);
        var mm = parseInt(ts / 1000 / 60 % 60, 10);
        var ss = parseInt(ts / 1000 % 60, 10);
        dd = dd < 10 ? ("0" + dd) : dd;   //天
        hh = hh < 10 ? ("0" + hh) : hh;   //时
        mm = mm < 10 ? ("0" + mm) : mm;   //分
        ss = ss < 10 ? ("0" + ss) : ss;   //秒
        
        
        $("#timer_d").text(Number(dd) + '天');
        $("#timer_h").text(Number(dd) * 24 + Number(hh) + '时');
        $("#timer_m").text(mm + '分');
        $("#timer_s").text(ss + '秒');
        
        setTimeout(function () {
          Util.timergo(time);
        }, 1000);
        
      } else {
        $("#timer_d").text(0 + '天');
        $("#timer_h").text(0 + '时');
        $("#timer_m").text(0 + '分');
        $("#timer_s").text(0 + '秒');
      }
    },
    imgZoom: function (imgObj, cut) {
      imgObj.each(function () {
        var me = $(this);
        var imgPath = me.attr("src");
        var boxW = me.parent().width();
        var boxH = me.parent().height();
        var rate = boxW / boxH;
        var newImg = new Image();
        newImg.onload = function () {
          var imgW = newImg.width;
          var imgH = newImg.height;
          if (imgW / imgH == rate) {
            me.css({
              width: boxW + "px",
              height: boxH + "px",
              display: "block"
            });
            return;
          }
          if (cut) {
            if (imgW / imgH >= rate) {
              me.css({
                height: "100%",
                width: "auto",
                display: "block"
              });
              me.css({
                marginLeft: (boxW - me.width()) / 2 + "px",
                marginTop: "0px"
              });
            } else {
              me.css({
                width: "100%",
                height: "auto",
                display: "block"
              });
              me.css({
                marginTop: (boxH - me.height()) / 2 + "px",
                marginLeft: "0px"
              });
            }
          } else {
            if (imgW / imgH > rate) {
              me.css({
                width: "100%",
                height: "auto",
                display: "block"
              });
              me.css({
                marginTop: (boxH - me.height()) / 2 + "px",
                marginLeft: "0px"
              });
            } else {
              me.css({
                height: "100%",
                width: "auto",
                display: "block"
              });
              me.css({
                marginLeft: (boxW - me.width()) / 2 + "px",
                marginTop: "0px"
              });
            }
          }
        }
        newImg.src = imgPath;
      });
    }
  };
  if (typeof define === "function" && define.amd) {
    return Util;
  } else {
    window.Util = Util;
  }
})(window);



