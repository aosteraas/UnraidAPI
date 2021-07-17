export const mainHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<title>Tower/Main</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta http-equiv="Content-Security-Policy" content="block-all-mixed-content">
<meta name="format-detection" content="telephone=no">
<meta name="viewport" content="width=1600">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="same-origin">
<link type="image/png" rel="shortcut icon" href="/webGui/images/green-on.png">
<link type="text/css" rel="stylesheet" href="/webGui/styles/default-fonts.css?v=1607102280">
<link type="text/css" rel="stylesheet" href="/webGui/styles/default-cases.css?v=1586620022">
<link type="text/css" rel="stylesheet" href="/webGui/styles/font-awesome.css?v=1545863026">
<link type="text/css" rel="stylesheet" href="/webGui/styles/context.standalone.css?v=1616868912">
<link type="text/css" rel="stylesheet" href="/webGui/styles/jquery.sweetalert.css?v=1616868912">
<link type="text/css" rel="stylesheet" href="/webGui/styles/default-black.css?v=1603267810">
<link type="text/css" rel="stylesheet" href="/webGui/styles/dynamix-black.css?v=1606841542">

<style>
.inline_help{display:none}
.upgrade_notice{position:fixed;top:1px;left:0;width:100%;height:40px;line-height:40px;color:#e68a00;background:#feefb3;border-bottom:#e68a00 1px solid;text-align:center;font-size:1.4rem;z-index:999}
.upgrade_notice i{margin:14px;float:right;cursor:pointer}
.back_to_top{display:none;position:fixed;bottom:30px;right:12px;color:#e22828;font-size:2.5rem;z-index:999}
#header.image{background-image:url(/webGui/images/banner.png)}
</style>

<script src="/webGui/javascript/dynamix.js?v=1596576684"></script>
<script src="/webGui/javascript/translate.en_US.js?v=1589088326"></script>
<script>
Shadowbox.init({skipSetup:true});

// server uptime
var uptime = 1131039.57;
var expiretime = 0;
var before = new Date();

// page timer events
var timers = {};

function pauseEvents(id) {
  $.each(timers, function(i,timer){
    if (!id || i==id) clearTimeout(timer);
  });
}
function resumeEvents(id,delay) {
  var startDelay = delay||50;
  $.each(timers, function(i,timer) {
    if (!id || i==id) timers[i] = setTimeout(i+'()', startDelay);
    startDelay += 50;
  });
}
function plus(value,single,plural,last) {
  return value>0 ? (value+' '+(value==1?single:plural)+(last?'':', ')) : '';
}
function updateTime() {
  var now = new Date();
  var days = parseInt(uptime/86400);
  var hour = parseInt(uptime/3600%24);
  var mins = parseInt(uptime/60%60);
  $('span.uptime').html(((days|hour|mins)?plus(days,"day","days",(hour|mins)==0)+plus(hour,"hour","hours",mins==0)+plus(mins,"minute","minutes",true):"less than a minute"));
  uptime += Math.round((now.getTime() - before.getTime())/1000);
  before = now;
  if (expiretime > 0) {
    var remainingtime = expiretime - now.getTime()/1000;
    if (remainingtime > 0) {
      days = parseInt(remainingtime/86400);
      hour = parseInt(remainingtime/3600%24);
      mins = parseInt(remainingtime/60%60);
      if (days) {
        $('#licenseexpire').html(plus(days,"day","days",true)+" remaining");
      } else if (hour) {
        $('#licenseexpire').html(plus(hour,"hour","hours",true)+" remaining").addClass('orange-text');
      } else if (mins) {
        $('#licenseexpire').html(plus(mins,"minute","minutes",true)+" remaining").addClass('red-text');
      } else {
        $('#licenseexpire').html("less than a minute remaining").addClass('red-text');
      }
    } else {
      $('#licenseexpire').addClass('red-text');
    }
  }
  setTimeout(updateTime,1000);
}
function refresh(top) {
  if (typeof top === 'undefined') {
    for (var i=0,element; element=document.querySelectorAll('input,button,select')[i]; i++) { element.disabled = true; }
    for (var i=0,link; link=document.getElementsByTagName('a')[i]; i++) { link.style.color = "gray"; } //fake disable
    location = location;
  } else {
    $.cookie('top',top,{path:'/'});
    location = location;
  }
}
function initab() {
  $.removeCookie('one',{path:'/'});
  $.removeCookie('tab',{path:'/'});
}
function settab(tab) {
  $.cookie('tab',tab,{path:'/'});
  $.cookie('one','tab1',{path:'/'});
}
function done(key) {
  var url = location.pathname.split('/');
  var path = '/'+url[1];
  if (key) for (var i=2; i<url.length; i++) if (url[i]==key) break; else path += '/'+url[i];
  $.removeCookie('one',{path:'/'});
  location.replace(path);
}
function chkDelete(form, button) {
  button.value = form.confirmDelete.checked ? "Delete" : "Apply";
  button.disabled = false;
}
function openBox(cmd,title,height,width,load,func,id) {
  // open shadowbox window (run in foreground)
  var uri = cmd.split('?');
  var run = uri[0].substr(-4)=='.php' ? cmd+(uri[1]?'&':'?')+'done=Done' : '/logging.htm?cmd='+cmd+'&csrf_token=18FA89EE4D74E62D&done=Done';
  var options = load ? (func ? {modal:true,onClose:function(){setTimeout(func+'('+'"'+(id||'')+'")',0);}} : {modal:true,onClose:function(){location=location;}}) : {modal:false};
  Shadowbox.open({content:run, player:'iframe', title:title, height:Math.min(height,screen.availHeight), width:Math.min(width,screen.availWidth), options:options});
}
function openWindow(cmd,title,height,width) {
  // open regular window (run in background)
  var window_name = title.replace(/ /g,"_");
  var form_html = '<form action="/logging.htm" method="post" target="'+window_name+'">'+'<input type="hidden" name="csrf_token" value="18FA89EE4D74E62D" />'+'<input type="hidden" name="title" value="'+title+'" />';
  var vars = cmd.split('&');
  form_html += '<input type="hidden" name="cmd" value="'+vars[0]+'">';
  for (var i = 1; i < vars.length; i++) {
    var pair = vars[i].split('=');
    form_html += '<input type="hidden" name="'+pair[0]+'" value="'+pair[1]+'">';
  }
  form_html += '</form>';
  var form = $(form_html);
  $('body').append(form);
  var top = (screen.availHeight-height)/2;
  if (top < 0) {top = 0; height = screen.availHeight;}
  var left = (screen.availWidth-width)/2;
  if (left < 0) {left = 0; width = screen.availWidth;}
  var options = 'resizeable=yes,scrollbars=yes,height='+height+',width='+width+',top='+top+',left='+left;
  window.open('', window_name, options);
  form.submit();
}
function showStatus(name,plugin,job) {
  $.post('/webGui/include/ProcessStatus.php',{name:name,plugin:plugin,job:job},function(status){$(".tabs").append(status);});
}
function showFooter(data, id) {
  if (id !== undefined) $('#'+id).remove();
  $('#copyright').prepend(data);
}
function showNotice(data) {
  $('#user-notice').html(data.replace(/<a>(.*)<\/a>/,"<a href='/Plugins'>$1</a>"));
}

// Banner warning system

var bannerWarnings = [];
var currentBannerWarning = 0;
var bannerWarningInterval = false;
var osUpgradeWarning = false;

function addBannerWarning(text,warning=true,noDismiss=false) {
  var cookieText = text.replace(/[^a-z0-9]/gi,'');
  if ($.cookie(cookieText) == "true") return false;
  if (warning) text = "<i class='fa fa-warning' style='float:initial;'></i> "+text;
  if ( bannerWarnings.indexOf(text) < 0 ) {
    var arrayEntry = bannerWarnings.push("placeholder") - 1;
    if (!noDismiss) text = text + "<a class='bannerDismiss' onclick='dismissBannerWarning("+arrayEntry+",&quot;"+cookieText+"&quot;)'></a>";
    bannerWarnings[arrayEntry] = text;
  } else return bannerWarnings.indexOf(text);

  if (!bannerWarningInterval) {
    showBannerWarnings();
    bannerWarningInterval = setInterval(showBannerWarnings,10000);
  }
  return arrayEntry;
}

function dismissBannerWarning(entry,cookieText) {
  $.cookie(cookieText,"true",{expires:365,path:'/'});
  removeBannerWarning(entry);
}

function removeBannerWarning(entry) {
  bannerWarnings[entry] = false;
  showBannerWarnings();
}

function bannerFilterArray(array) {
  var newArray = [];
  array.filter(function(value,index,arr) {
    if (value) newArray.push(value);
  });
  return newArray;
}

function showBannerWarnings() {
  var allWarnings = bannerFilterArray(Object.values(bannerWarnings));
  if (allWarnings.length == 0) {
    $(".upgrade_notice").hide();
    clearInterval(bannerWarningInterval);
    bannerWarningInterval = false;
    return;
  }
  if (currentBannerWarning >= allWarnings.length) currentBannerWarning = 0;
  $(".upgrade_notice").show().html(allWarnings[currentBannerWarning]);
  currentBannerWarning++;
}

function addRebootNotice(message="You must reboot for changes to take effect") {
  addBannerWarning("<i class='fa fa-warning' style='float:initial;'></i> "+message,false,true);
  $.post("/plugins/dynamix.plugin.manager/scripts/PluginAPI.php",{action:'addRebootNotice',message:message});
}

function removeRebootNotice(message="You must reboot for changes to take effect") {
  var bannerIndex = bannerWarnings.indexOf("<i class='fa fa-warning' style='float:initial;'></i> "+message);
  if ( bannerIndex < 0 ) {
    return;
  }
  removeBannerWarning(bannerIndex);
  $.post("/plugins/dynamix.plugin.manager/scripts/PluginAPI.php",{action:'removeRebootNotice',message:message});
}

function showUpgrade(text,noDismiss=false) {
  if ($.cookie('os_upgrade')==null) {
    if (osUpgradeWarning) removeBannerWarning(osUpgradeWarning);
    osUpgradeWarning = addBannerWarning(text.replace(/<a>(.*)<\/a>/,"<a href='#' onclick='openUpgrade()'>$1</a>").replace(/<b>(.*)<\/b>/,"<a href='#' onclick='document.rebootNow.submit()'>$1</a>"),false,noDismiss);
  }
}
function hideUpgrade(set) {
  removeBannerWarning(osUpgradeWarning);
  if (set)
    $.cookie('os_upgrade','true',{path:'/'});
  else
    $.removeCookie('os_upgrade',{path:'/'});
}
function openUpgrade() {
  hideUpgrade();
  swal({title:"Update Unraid OS",text:"Do you want to update to the new version?",type:'warning',html:true,showCancelButton:true,confirmButtonText:"Proceed",cancelButtonText:"Cancel"},function(){
    openBox("/plugins/dynamix.plugin.manager/scripts/plugin&arg1=update&arg2=unRAIDServer.plg","Update Unraid OS",600,900,true);
  });
}
function notifier() {
  var tub1 = 0, tub2 = 0, tub3 = 0;
  $.post('/webGui/include/Notify.php',{cmd:'get'},function(json) {
    if (json && /^<!DOCTYPE html>/.test(json)) {
      // Session is invalid, user has logged out from another tab
      $(location).attr('href','/');
    }
    var data = $.parseJSON(json);
    $.each(data, function(i, notify) {
      $.jGrowl(notify.subject+'<br>'+notify.description, {
        group: notify.importance,
        header: notify.event+': '+notify.timestamp,
        theme: notify.file,
        click: function(e,m,o) { if (notify.link) location=notify.link;},
        beforeOpen: function(e,m,o){if ($('div.jGrowl-notification').hasClass(notify.file)) return(false);},
        beforeClose: function(e,m,o){$.post('/webGui/include/Notify.php',{cmd:'archive',file:notify.file});},
        afterOpen: function(e,m,o){if (notify.link) $(e).css("cursor","pointer");}
      });
    });
    timers.notifier = setTimeout(notifier,5000);
  });
}
function digits(number) {
  if (number < 10) return 'one';
  if (number < 100) return 'two';
  return 'three';
}
function openNotifier(filter) {
  $.post('/webGui/include/Notify.php',{cmd:'get'},function(json) {
    var data = $.parseJSON(json);
    $.each(data, function(i, notify) {
      if (notify.importance == filter) {
        $.jGrowl(notify.subject+'<br>'+notify.description, {
          group: notify.importance,
          header: notify.event+': '+notify.timestamp,
          theme: notify.file,
          click: function(e,m,o) { if (notify.link) location=notify.link;},
          beforeOpen: function(e,m,o){if ($('div.jGrowl-notification').hasClass(notify.file)) return(false);},
          beforeClose: function(e,m,o){$.post('/webGui/include/Notify.php',{cmd:'archive',file:notify.file});},
          afterOpen: function(e,m,o){if (notify.link) $(e).css("cursor","pointer");}
        });
      }
    });
  });
}
function closeNotifier(filter) {
  clearTimeout(timers.notifier);
  $.post('/webGui/include/Notify.php',{cmd:'get'},function(json) {
    var data = $.parseJSON(json);
    $.each(data, function(i, notify) {
      if (notify.importance == filter) $.post('/webGui/include/Notify.php',{cmd:'archive',file:notify.file});
    });
    $('div.jGrowl').find('.'+filter).find('div.jGrowl-close').trigger('click');
    setTimeout(notifier,100);
  });
}
function viewHistory(filter) {
  location.replace('/Tools/NotificationsArchive?filter='+filter);
}
$(function() {
  var tab = $.cookie('one')||$.cookie('tab')||'tab1';
  if (tab=='tab0') tab = 'tab'+$('input[name$="tabs"]').length; else if ($('#'+tab).length==0) {initab(); tab = 'tab1';}
  if ($.cookie('help')=='help') {$('.inline_help').show(); $('#nav-item.HelpButton').addClass('active');}
  $('#'+tab).attr('checked', true);
  updateTime();
  $.jGrowl.defaults.closeTemplate = '<i class="fa fa-close"></i>';
  $.jGrowl.defaults.closerTemplate = '<div class="top">[ close all notifications ]</div>';
  $.jGrowl.defaults.sticky = true;
  $.jGrowl.defaults.check = 100;
  $.jGrowl.defaults.position = 'top-right';
  $.jGrowl.defaults.themeState = '';
  Shadowbox.setup('a.sb-enable', {modal:true});
});
var mobiles=['ipad','iphone','ipod','android'];
var device=navigator.platform.toLowerCase();
for (var i=0,mobile; mobile=mobiles[i]; i++) {
  if (device.indexOf(mobile)>=0) {$('#footer').css('position','static'); break;}
}
$.ajaxPrefilter(function(s, orig, xhr){
  if (s.type.toLowerCase() == "post" && !s.crossDomain) {
    s.data = s.data || "";
    s.data += s.data?"&":"";
    s.data += "csrf_token=18FA89EE4D74E62D";
  }
});

// add any pre-existing reboot notices  
$(function() {
});
</script>
</head>
<body>
 <div id="template">
  <div class="upgrade_notice" style="display:none"></div>
  <div id="header" class="">
   <div class="logo">
   <a href="https://unraid.net" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 222.36 39.04"><defs><linearGradient id="header-logo" x1="47.53" y1="79.1" x2="170.71" y2="-44.08" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e32929"/><stop offset="1" stop-color="#ff8d30"/></linearGradient></defs><title>unraid.net</title><path d="M146.7,29.47H135l-3,9h-6.49L138.93,0h8l13.41,38.49h-7.09L142.62,6.93l-5.83,16.88h8ZM29.69,0V25.4c0,8.91-5.77,13.64-14.9,13.64S0,34.31,0,25.4V0H6.54V25.4c0,5.17,3.19,7.92,8.25,7.92s8.36-2.75,8.36-7.92V0ZM50.86,12v26.5H44.31V0h6.11l17,26.5V0H74V38.49H67.9ZM171.29,0h6.54V38.49h-6.54Zm51.07,24.69c0,9-5.88,13.8-15.17,13.8H192.67V0H207.3c9.18,0,15.06,4.78,15.06,13.8ZM215.82,13.8c0-5.28-3.3-8.14-8.52-8.14h-8.08V32.77h8c5.33,0,8.63-2.8,8.63-8.08ZM108.31,23.92c4.34-1.6,6.93-5.28,6.93-11.55C115.24,3.68,110.18,0,102.48,0H88.84V38.49h6.55V5.66h6.87c3.8,0,6.21,1.82,6.21,6.71s-2.41,6.76-6.21,6.76H98.88l9.21,19.36h7.53Z" fill="url(#header-logo)"/></svg>
</a>
   Version: 6.9.2&nbsp;<a href='#' title='View Release Notes' onclick="openBox('/plugins/dynamix.plugin.manager/include/ShowChanges.php?tmp=1&file=/var/tmp/unRAIDServer.txt','Release Notes',600,900);return false"><span class='fa fa-info-circle fa-fw'></span></a>   </div>
   <div class="block">
    <span class="text-left">Server<br>Description<br>Registration<br>Uptime</span>
    <span class="text-right">Tower &bullet; 192.168.1.200<br/>Media server<br/>
    <a href="/Tools/Registration" title="Go to Registration page">Unraid OS <span id="licensetype">Plus</span><span id="licenseexpire"></span></a><br/>
    <span class="uptime"></span></span>
   </div>
  </div>
  <a href="#" class="back_to_top" title="Back To Top"><i class="fa fa-arrow-circle-up"></i></a>
<div id='menu'><div id='nav-block'><div id='nav-left'><div id='nav-item'><a href='/Dashboard' onclick='initab()'>Dashboard</a></div><div id='nav-item' class='active'><a href='/Main' onclick='initab()'>Main</a></div><div id='nav-item'><a href='/Shares' onclick='initab()'>Shares</a></div><div id='nav-item'><a href='/Users' onclick='initab()'>Users</a></div><div id='nav-item'><a href='/Settings' onclick='initab()'>Settings</a></div><div id='nav-item'><a href='/Plugins' onclick='initab()'>Plugins</a></div><div id='nav-item'><a href='/Docker' onclick='initab()'>Docker</a></div><div id='nav-item'><a href='/VMs' onclick='initab()'>VMs</a></div><div id='nav-item'><a href='/Apps' onclick='initab()'>Apps</a></div><div id='nav-item'><a href='/Stats' onclick='initab()'>Stats</a></div><div id='nav-item'><a href='/Tools' onclick='initab()'>Tools</a></div></div><div id='nav-right'><script>
// hide switch button when no other language packs
$(function(){$('#nav-item.LanguageButton').hide();});

function LanguageButton() {
  var locale = '';
  if (locale) {
    switchLanguage('');
    $.cookie('locale',locale,{path:'/'});
  } else {
    switchLanguage($.cookie('locale'));
    $.removeCookie('locale');
  }
}

function switchLanguage(lang) {
  $.post('/webGui/include/LanguageReset.php',{lang:lang},function(){location.reload();});
}
</script><div id='nav-item' class='LanguageButton util'><a href='#' onclick='LanguageButton();return false;' title="Switch Language"><i class='icon-u-switch system'></i><span>Switch Language</span></a></div><script>if (typeof _ != 'function') function _(t) {return t;}</script><script>
function systemTemp() {
  $.post('/plugins/dynamix.system.temp/include/SystemTemp.php',{unit:'C',dot:'.'},function(data) {
    showFooter(data,'temp');
    if ($('#mb-temp').length) {
      var temp = $('span#temp').text();
      var unit = temp.indexOf('C')>0 ? 'C' : 'F';
      temp = temp.split(unit);
      if (temp[0]) $('#cpu-temp').html('Temperature: '+temp[0]+unit);
      if (temp[1]) $('#mb-temp').html('Temperature: '+temp[1]+unit);
    }
    timers.systemTemp = setTimeout(systemTemp,10000);
  });
}
setTimeout(systemTemp,100);
</script>
<div id='nav-user'></div><script>
function LogoutButton() {
  var id = window.setTimeout(null,0);
  while (id--) window.clearTimeout(id);
  window.location.href = '/logout';
}
</script>
<div id='nav-item' class='LogoutButton util'><a href='#' onclick='LogoutButton();return false;' title="Logout"><i class='icon-u-logout system'></i><span>Logout</span></a></div><script>
function TerminalButton() {
  if (/MSIE|Edge/.test(navigator.userAgent)) {
    swal({title:"Unsupported Feature",text:"Sorry, this feature is not supported by MSIE/Edge.<br>Please try a different browser",html:true,type:'error',confirmButtonText:"Ok"});
    return;
  }
  var d = new Date();
  var height = 600;
  var width = 900;
  var top = (screen.height-height)/2;
  var left = (screen.width-width)/2;
  window.open('/webterminal/', 'Web Terminal '+d.getTime(), 'resizeable=yes,scrollbars=yes,height='+height+',width='+width+',top='+top+',left='+left).focus();
}
</script>
<div id='nav-item' class='TerminalButton util'><a href='/webterminal/' onclick='TerminalButton();return false;' title="Terminal"><i class='icon-u-terminal system'></i><span>Terminal</span></a></div><script>
function FeedbackButton() {
  openBox("/webGui/include/Feedback.php","Feedback",600,600,false);
}
</script><div id='nav-item' class='FeedbackButton util'><a href='#' onclick='FeedbackButton();return false;' title="Feedback"><i class='icon-u-chat system'></i><span>Feedback</span></a></div><script>
function InfoButton() {
  openBox("/webGui/include/SystemInformation.php?more=/Tools/SystemProfiler","System Information",600,600);
}
</script><div id='nav-item' class='InfoButton util'><a href='#' onclick='InfoButton();return false;' title="Info"><i class='icon-u-display system'></i><span>Info</span></a></div><script>
function LogButton() {
  openWindow("/webGui/scripts/tail_log&arg1=syslog&arg2=","System Log",600,900);
}
</script>
<div id='nav-item' class='LogButton util'><a href='#' onclick='LogButton();return false;' title="Log"><i class='icon-u-log system'></i><span>Log</span></a></div><script>
function HelpButton() {
  if ($('#nav-item.HelpButton').toggleClass('active').hasClass('active')) {
    $('.inline_help').show('slow');
    $.cookie('help','help',{path:'/'});
  } else {
    $('.inline_help').hide('slow');
    $.removeCookie('help',{path:'/'});
  }
}
</script><div id='nav-item' class='HelpButton util'><a href='#' onclick='HelpButton();return false;' title="Help"><i class='icon-u-help system'></i><span>Help</span></a></div><script type="text/javascript">
	ud_url = location.pathname.split('/');
	if (ud_url[1] == "Main" && ud_url.length > 2)
	{
		var InitTab = $.cookie('tab');
		$.cookie('tab','tab1',{path:'/'});
		$(window).unload(function() {
			$.cookie('one',InitTab,{path:'/'});
		});
	}
</script>
<div id='nav-user'></div>

<div id='nav-user'></div>

<script>
if ( typeof addRebootNotice !== "function" ) {
// add any pre-existing reboot notices	
	$(function() {
	});
	
	function addRebootNotice(message="You must reboot for changes to take effect") {
		addBannerWarning(message,true,true);
		$.post("/plugins/community.applications/scripts/PluginAPI.php",{action:'addRebootNotice',message:message});
	}
}
</script><div id='nav-user'></div><style>
/* Additional CSS for when user supplies element */
.ca_element_notice{padding-right:20px;width:100%;height:40px;line-height:40px;color:#e68a00;background:#feefb3;border-bottom:#e68a00 1px solid;text-align:center;font-size:1.4rem;z-index:900;display:none;}
.ca_PluginUpdateDismiss{float:right;margin-right:20px;cursor:pointer;}
.ca_pluginUpdateInfo{cursor:pointer;}
.ca_PluginUpdateInstall{cursor:pointer;}
a.bannerInfo {cursor:pointer;text-decoration:none;}
.bannerInfo::before {content:"\f05a";font-family:fontAwesome;color:#e68a00;}
</style>
<script>

function ca_hidePluginUpdate(plugin,version,element) {
	$.cookie(plugin,version);
	$(element).hide();
}

function ca_pluginUpdateInstall(plugin) {
	openBox("/plugins/dynamix.plugin.manager/scripts/plugin&arg1=update&arg2="+plugin,"Installing Update",600,900,true,"window.location.reload()");
}

function ca_pluginUpdateShowInfo(cmd,title,height,width,load,func,id) {
	// open shadowbox window (run in foreground)
	var run = cmd.split('?')[0].substr(-4)=='.php' ? cmd : '/logging.htm?cmd='+cmd+'&csrf_token=18FA89EE4D74E62D';
	var options = load ? (func ? {modal:true,onClose:function(){setTimeout(func+'('+'"'+(id||'')+'")',0);}} : {modal:false,onClose:function(){location=location;}}) : {modal:false};
	Shadowbox.open({content:run, player:'iframe', title:title, height:Math.min(height,screen.availHeight), width:Math.min(width,screen.availWidth), options:options});
}

function caPluginUpdateCheck(plugin,options=[],callback) {
	var pluginFilename = plugin.substr(0, plugin.lastIndexOf("."));
	console.time("checkPlugin "+plugin);
	console.log("checkPlugin  "+plugin);
	$.post("/plugins/dynamix.plugin.manager/scripts/PluginAPI.php",{action:'checkPlugin',options:{plugin:plugin,name:options.name}},function(caAPIresult) {
		console.groupCollapsed("Result checkPlugin "+plugin);
		console.log(caAPIresult);
		console.timeEnd("checkPlugin "+plugin);
		console.groupEnd();
		var result = JSON.parse(caAPIresult);

		if ( options.debug == true ) result.updateAvailable = true;
		if ( ! options.element && ! options.dontShow ) {
			if ( result.updateAvailable ) {
				var HTML = result.updateMessage+" <a class='ca_PluginUpdateInstall' onclick='ca_pluginUpdateInstall(&quot;"+plugin+"&quot;);'>"+result.linkMessage+"</a> <a class='bannerInfo fa fa-info-circle' onclick='ca_pluginUpdateShowInfo(&quot;/plugins/dynamix.plugin.manager/include/ShowChanges.php?file=%2Ftmp%2Fplugins%2F"+pluginFilename+".txt&quot;,&quot;Release Notes&quot;,600,900); return false;'></a>";
				addBannerWarning(HTML,false,options.noDismiss);
			}
		} else {
			if ( $.cookie(plugin) != result.version ) {
				if ( result.updateAvailable ) {
					var HTML = result.updateMessage+" <a class='ca_PluginUpdateInstall' onclick='ca_pluginUpdateInstall(&quot;"+plugin+"&quot;);'>"+result.linkMessage+"</a> <a class='bannerInfo fa fa-info-circle' onclick='ca_pluginUpdateShowInfo(&quot;/plugins/dynamix.plugin.manager/include/ShowChanges.php?file=%2Ftmp%2Fplugins%2F"+pluginFilename+".txt&quot;,&quot;Release Notes&quot;,600,900); return false;'></a>";
					if ( ! options.noDismiss ) {
						HTML = HTML.concat("<span class='ca_PluginUpdateDismiss'><i class='fa fa-close' onclick='ca_hidePluginUpdate(&quot;"+plugin+"&quot;,&quot;"+result.version+"&quot;,&quot;"+options.element+"&quot;);'></i>");
					}
					result.HTML = HTML;

					if ( ! options.dontShow ) {
						$(options.element).html(HTML);
						$(options.element).addClass("ca_element_notice").show();
					}
				}
			}
		}
		if ( typeof options === "function" ) {
			callback = options;
		}
		if ( typeof callback === "function" ) {
			callback(JSON.stringify(result));
		}
	});
}

</script>
<div id='nav-user'></div></div></div></div><div class='tabs'><div class='tab'><input type='radio' id='tab1' name='tabs'><div class='content shift'><div id='title'><span class='left'><i class='fa fa-database title'></i>Array Devices</span></div>
<script>
function toggle_state(device,name,action) {
  var event = null;
  var button = null;
  if (name) {
    var array = ["parity","disk","array"];
    var pools = ["cache"];
    var flash = ["flash"];
    var group = name.replace(/(\d+|\*)$/,'');
    if (array.includes(group)) event = 'array_status';
    else if (pools.includes(group)) event = 'pool_status';
    else if (flash.includes(group)) event = 'boot_status';
    else event = 'open_status';
    if (name.slice(-1)!='*') {
      $('#dev-'+name).removeClass('fa-circle fa-square fa-warning fa-times').addClass('fa-refresh fa-spin');
    } else {
      if (group=='array') {
        $('[id^="dev-parity"]').removeClass('fa-circle fa-square fa-warning fa-times').addClass('fa-refresh fa-spin');
        $('[id^="dev-disk"]').removeClass('fa-circle fa-square fa-warning fa-times').addClass('fa-refresh fa-spin');
      } else {
        $('[id^="dev-'+group+'"]').removeClass('fa-circle fa-square fa-warning fa-times').addClass('fa-refresh fa-spin');
      }
    }
  } else if (device!='Clear') {
    $('[id^="dev-"]').removeClass('fa-circle fa-square fa-warning fa-times').addClass('fa-refresh fa-spin');
    button = '[id^=button-]';
  }
  pauseEvents(event);
  $.post('/webGui/include/ToggleState.php',{device:device,name:name,action:action,state:'STARTED',csrf:'18FA89EE4D74E62D'},function(){resumeEvents(event,500);if (button) $(button).prop('disabled',false);});
}
function display_diskio() {
  if ($.cookie('diskio')===undefined) {
    $('span.number').show(); $('span.diskio').hide();
  } else {
    $('span.diskio').show(); $('span.number').hide();
  }
}
function toggle_diskio(init) {
  if (!init) {
    if ($.cookie('diskio')===undefined) $.cookie('diskio','diskio',{path:'/',expires:3650}); else $.removeCookie('diskio',{path:'/'});
  }
  if ($.cookie('diskio')===undefined) {
    $('i.toggle').removeClass('fa-tachometer').addClass('fa-list');
  } else {
    $('i.toggle').removeClass('fa-list').addClass('fa-tachometer');
  }
  display_diskio();
}
function array_status() {
  var diskio = $.cookie('diskio')===undefined ? 0 : 1;
  $.post('/webGui/include/DeviceList.php',{path:'Main',device:'array'},function(data) {
    if (data) {$('#array_devices').html(data); display_diskio();}
    timers.array_status = setTimeout(array_status,3000);
  });
}
$('#tab1').bind({click:function() {$('i.toggle').show('slow');}});

array_status();
</script>

<table class="disk_status wide">
<thead><tr><td>Device</td><td>Identification</td><td>Temp.</td><td>Reads</td><td>Writes</td><td>Errors</td><td>FS</td><td>Size</td><td>Used</td><td>Free</td><td>View</td></tr></thead>
<tbody id="array_devices">
<tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr><tr class='tr_last'><td colspan='11'>&nbsp;</td></tr></tbody>
</table>

<blockquote class='inline_help'>
  <p><strong>Colored Status Indicator</strong> the significance of the color indicator at the beginning of each line in <em>Array Devices</em> is as follows:</p>
  
  <p><i class='fa fa-circle orb green-orb'></i>Normal operation, device is active.</p>
  
  <p><i class='fa fa-circle orb grey-orb'></i>Device is in standby mode (spun-down).</p>
  
  <p><i class='fa fa-warning orb yellow-orb'></i>Device contents emulated.</p>
  
  <p><i class='fa fa-times orb red-orb'></i>Device is disabled, contents emulated.</p>
  
  <p><i class='fa fa-square orb blue-orb'></i>New device.</p>
  
  <p><i class='fa fa-square orb grey-orb'></i>No device present, position is empty.</p>
  
  <p><strong>Identification</strong> is the <em>signature</em> that uniquely identifies a storage device. The signature
  includes the device model number, serial number, linux device id, and the device size.</p>
  
  <p><strong>Temp.</strong> (temperature) is read directly from the device. You configure which units to use on
  the <a href="Settings/DisplaySettings">Display Preferences</a> page.  We do not read the temperature of spun-down hard
  drives since this typically causes them to spin up; instead we display the <code>*</code> symbol.  We also
  display the <code>*</code> symbol for SSD and Flash devices, though sometimes these devices do report a valid
  temperature, and sometimes they return the value <code>0</code>.</p>
  
  <p><strong>Size, Used, Free</strong> reports the total device size, used space, and remaining space for files.  These
  units are also configured on the <a href="Settings/DisplaySettings">Display Preferences</a> page.  The
  amount of space used will be non-zero even for an empty disk due to file system overhead.</p>
  
  <p><em>Note: for a multi-device cache pool, this data is for the entire pool as returned by btrfs.</em></p>
  
  <p><strong>Reads, Writes</strong> are a count of I/O requests sent to the device I/O drivers.  These statistics may
  be cleared at any time, refer to the Array Status section below.</p>
  
  <p><strong>Errors</strong> counts the number of <em>unrecoverable</em> errors reported by the device
  I/O drivers. Missing data due to unrecoverable array read errors is filled in on-the-fly using parity
  reconstruct (and we attempt to write this data back to the sector(s) which failed). Any unrecoverable
  write error results in <em>disabling</em> the disk.</p>
  
  <p><strong>FS</strong> indicates the file system detected in partition 1 of the device.</p>
  
  <p><strong>View</strong> column contains a folder icon indicating the device is <em>mounted</em>. Click the icon to
  browse the file system.</p>
  
  <p>If "Display array totals" is enable on the <a href="Settings/DisplaySettings">Display Preferences</a> page, a
  <strong>Total</strong> line is included which provides a tally of the device statistics, including the average temperature
  of your devices.</p>
  
  <p>The Array must be Stopped in order to change Array device assignments.</p>
  
  <p>An Unraid array consists of one or two Parity disks and a number of Data disks. The Data
  disks are exclusively used to store user data, and the Parity disk(s) provides the redundancy necessary
  to recover from disk failures.</p>
  
  <p>Since data is not striped across the array, the Parity disk(s) must be as large, or larger than the largest Data
  disk.  Parity should also be your highest performance drive.</p>
  
  <p>Each Data disk has its own file system and can be exported as a
  separate share.</p>
  
  <p>Click on the Device name to configure individual device settings and launch certain utilities.</p>
</blockquote>

</p>
<div id='title'><span class='left'><i class='fa fa-bullseye title'></i>Pool Devices</span></div><p></p>

<link type="text/css" rel="stylesheet" href="/webGui/styles/jquery.ui.css?v=1594915397">

<link type="text/css" rel="stylesheet" href="/plugins/dynamix.docker.manager/styles/style-black.css?v=1541002926">

<style>
table.divider{margin-top:20px}
</style>

<script>
function validate(poolname) {
  var valid = /^[a-z_]([a-z0-9_-]*[a-z_])*$/;
  var reserved = ["parity","parity2","parity3","diskP","diskQ","diskR","disk","disks","flash","boot","user","user0","dev","disk0","disk1","disk2","disk3","disk4","disk5","disk6","disk7","disk8","disk9","disk10","disk11","disk12","disk13","disk14","disk15","disk16","disk17","disk18","disk19","disk20","disk21","disk22","disk23","disk24","disk25","disk26","disk27","disk28","disk29","disk30","disk31"];
  var shares = ["aotm","appdata","Backup","Data","DockerBackup","domains","isos","Movies","My Media","system","TV","vm","yctm"];
  var pools = ["cache"];
  if (!poolname.trim()) return false;
  if (reserved.includes(poolname)) {
    swal({title:"Invalid pool name",text:"Do not use reserved names",html:true,type:'error',confirmButtonText:"Ok"});
    return false;
  } else if (shares.includes(poolname)) {
    swal({title:"Invalid pool name",text:"Do not use user share names",html:true,type:'error',confirmButtonText:"Ok"});
    return false;
  } else if (pools.includes(poolname)) {
    swal({title:"Invalid pool name",text:"Pool name already exists",html:true,type:'error',confirmButtonText:"Ok"});
    return false;
  } else if (!valid.test(poolname)) {
    swal({title:"Invalid pool name",text:"Use only lowercase with no special characters or leading/trailing digits",type:'error',html:true,confirmButtonText:"Ok"});
    return false;
  } else {
    return true;
  }
}
function addPoolPopup() {
  var popup = $('#dialogAddPool');
  // Load popup with the template info
  popup.html($("#templatePopupPool").html());
  // Start Dialog section
  popup.dialog({
    title: "Add Pool",
    resizable: false,
    width: 600,
    modal: true,
    show : {effect:'fade', duration:250},
    hide : {effect:'fade', duration:250},
    buttons: {
    "Add": function() {
        if (validate($(this).find('input[name="poolName"]').val())) {
          $(this).find('form').submit();
          $(this).dialog('close');
        }
      },
    "Cancel": function() {
        $(this).dialog('close');
      }
    }
  });
  $(".ui-dialog .ui-dialog-titlebar").addClass('menu');
  $(".ui-dialog .ui-dialog-title").css({'text-align':'center','width':'100%'});
  $(".ui-dialog .ui-dialog-content").css({'padding-top':'15px','vertical-align':'bottom'});
  $(".ui-widget-content").css({'background':'#1c1c1c'});
  $(".ui-button-text").css({'padding':'0px 5px'});
}

function pool_status() {
  $.post('/webGui/include/DeviceList.php',{path:'Main',device:'cache'},function(d) {
    if (!d) return;
    d = d.split('\0');
    for (var i=0,data; data=d[i]; i++) {
      if (data) $('#pool_device'+i).html(data); display_diskio();
    }
    timers.pool_status = setTimeout(pool_status,3000);
  });
}
$('#tab2').bind({click:function() {$('i.toggle').show('slow');}});

pool_status();
</script>

<p></p>

<table class="disk_status wide">
<thead><tr><td>Device</td><td>Identification</td><td>Temp.</td><td>Reads</td><td>Writes</td><td>Errors</td><td>FS</td><td>Size</td><td>Used</td><td>Free</td><td>View</td></tr></thead>
<tbody id="pool_device0">
<tr><td colspan='11'>&nbsp;</td></tr><tr><td colspan='11'>&nbsp;</td></tr></tbody>
</table>

<p>
<blockquote class='inline_help'>
  <p><strong>Colored Status Indicator</strong> the significance of the color indicator at the beginning of each line in <em>Pool Devices</em> is as follows:</p>
  
  <p><i class='fa fa-circle orb green-orb'></i>Normal operation, device is active.</p>
  
  <p><i class='fa fa-circle orb grey-orb'></i>Device is in standby mode (spun-down).</p>
  
  <p><i class='fa fa-square orb blue-orb'></i>New device.</p>
  
  <p><i class='fa fa-square orb grey-orb'></i>No device present, position is empty.</p>
  
  <p><strong>Pool Devices</strong> is a single device, or pool of multiple devices, <em>outside</em> the Unraid array.  It may be exported for network access just
  like an Array device.  Being outside the Unraid array results in significantly faster write access.</p>
  
  <p>There are two ways to configure the Pool devices:</p>
  
  <ol>
  <li>As a single device, or</li>
  <li>As a multi-device pool.</li>
  </ol>
  
  <p>When configured as a single device you may format the device using any supported file system (btrfs, reiserfs,
  or xfs).  This configuration offers the highest performance, but at the cost of no data protection - if the
  single pool device fails all data contained on it may be lost.</p>
  
  <p>When configured as a multi-device pool, Unraid OS will automatically select <em>btrfs-raid1</em> format (for both data
  and meta-data).  btrfs permits any number of devices to be added to the pool and each copy of data is guaranteed
  to be written to two different devices.  Hence the pool can withstand a single-disk failure without losing data.</p>
  
  <p>When <a href="/Settings/ShareSettings">User Shares</a> are enabled, user shares may be configured to
  automatically make use of the Pool device in order to
  speed up writes.  A special background process called the <em>mover</em> can be scheduled to run
  periodically to move user share files off the Cache and onto the Array.</p>
</blockquote>

</p>
<div id='title'><span class='left'><i class='fa fa-paw title'></i>Boot Device</span></div>
<script>
function boot_status() {
  $.post('/webGui/include/DeviceList.php',{path:'Main',device:'flash'},function(data) {
    if (data) {$('#boot_device').html(data); display_diskio();}
    timers.boot_status = setTimeout(boot_status,3000);
  });
}
$('#tab3').bind({click:function() {$('i.toggle').show('slow');}});

boot_status();
</script>

<table class="disk_status wide">
<thead><tr><td>Device</td><td>Identification</td><td>Temp.</td><td>Reads</td><td>Writes</td><td>Errors</td><td>FS</td><td>Size</td><td>Used</td><td>Free</td><td>View</td></tr></thead>
<tbody id="boot_device">
<tr><td colspan='11'>&nbsp;</td></tr></tbody>
</table>

<blockquote class='inline_help'>
  <p>Vital array configuration is maintained on the USB Flash device; for this reason, it must remain
  plugged in to your server.  Click on <a href="/Main/Flash?name=flash">Flash</a> to see the GUID and registration
  information, and to configure export settings.  Since the USB Flash device is formatted using FAT file system,
  it may only be exported using SMB protocol.</p>
</blockquote>
<div id='title'><span class='left'><i class='fa fa-unlink title'></i>Unassigned Devices</span></div><p><script>if (typeof _ != 'function') function _(t) {return t;}</script></p>

<script type="text/javascript" src="/webGui/javascript/jquery.switchbutton.js?v=1535741906"></script>

<link type="text/css" rel="stylesheet" href="/webGui/styles/jquery.ui.css?v=1594915397">

<link type="text/css" rel="stylesheet" href="/webGui/styles/jquery.switchbutton.css?v=1548293345">

<link type="text/css" rel="stylesheet" href="/webGui/styles/jquery.filetree.css?v=1538184067">

<script src="/webGui/javascript/jquery.filetree.js?v=1535741906"></script>

<script type="text/javascript" src="/plugins/unassigned.devices/assets/arrive.min.js?v=1498045920"></script>

<style>
    table.disk_mounts {padding: 0px 0px 0px 0px;border-collapse:collapse;white-space:nowrap;}
    table.disk_mounts thead tr>td{text-align:left;width:8%;}
    table.disk_mounts tr>td+td{text-align:left;}
    table.disk_mounts tr>td+td+td{text-align:center;}
    table.disk_mounts tr>td+td+td+td{text-align:right;}
    table.disk_mounts tr>td+td+td+td+td+td+td{text-align:center;}
    table.disk_mounts tr>td+td+td+td+td+td+td+td{text-align:right;}
    table.disk_mounts tr>td+td+td+td+td+td+td+td+td+td+td+td{text-align:center;}

    table.usb_absent {padding: 0px 0px 0px 0px;border-collapse:collapse;white-space:nowrap;}
    table.usb_absent thead tr>td{text-align:left;width:8%;}
    table.usb_absent tr>td+td{text-align:left;}
    table.usb_absent tr>td+td+td+td{text-align:center;}

    table.samba_mounts {padding: 0px 0px 0px 0px;border-collapse:collapse;white-space:nowrap;}
    table.samba_mounts thead tr>td{text-align:left;width:8%;}
    table.samba_mounts tr>td+td{text-align:left;}
    table.samba_mounts tr>td+td+td+td{text-align:center;}
    table.samba_mounts tr>td+td+td+td+td+td+td{text-align:right;}
    table.samba_mounts tr>td+td+td+td+td+td+td+td+td+td+td+td+td{text-align:center}

    button.mount {padding:2px 4px 3px 6px;margin:1px 0px 1px 0px;}
    i.partition-hdd{margin:5px; 0px; 0px; 0px;}
    i.hdd{margin:5px; 0px; 0px; 0px;}
    i.share{margin:5px 5px 0px 0px;}
    i.mount-share{margin:5px 5px 0px 0px;}
    i.partition-script{margin-left: 10px; margin-right: 6px;}
    .exec{cursor: pointer;}
    i.fa-append{margin:0px;font-size: 0.8em;position: relative; left:-0.3em;top:0.7em;}
    .underline{text-decoration: underline;}

    form.inline{display:inline;margin: 0px; padding: 0px;}

    .fileTree {
        width: 305px;
        max-height: 150px;
        overflow: scroll;
        position: absolute;
        z-index: 100;
        display: none;
        color:initial;
    }

  .image-radio input{margin:0;padding:0;-webkit-appearance:none;-moz-appearance:none;appearance:none;}
  .image-radio input:active +.image-radio-label{opacity: .9;}
  .image-radio input:checked +.image-radio-label{ -webkit-filter: none;-moz-filter: none;filter: none;}
  .image-radio-label{cursor:pointer; background-size:contain; background-repeat:no-repeat;display:inline-block; width:100px;height:70px; -webkit-transition: all 100ms ease-in;-moz-transition: all 100ms ease-in;transition: all 100ms ease-in;-webkit-filter: brightness(1.8) grayscale(1) opacity(.7);-moz-filter: brightness(1.8) grayscale(1) opacity(.7);filter: brightness(1.8) grayscale(1) opacity(.7);}
  .image-radio-label:hover{-webkit-filter: brightness(1.2) grayscale(.5) opacity(.9);-moz-filter: brightness(1.2) grayscale(.5) opacity(.9);filter: brightness(1.2) grayscale(.5) opacity(.9);}
  .image-radio-linux{background-image: url(/plugins/unassigned.devices/icons/nfs-radio.png)}
  .image-radio-windows{background-image: url(/plugins/unassigned.devices/icons/smb-radio.png)}
</style>

<script type="text/javascript">

    
    function rm_preclear(dev) {
        $.post(UDURL,{action:"rm_preclear",device:dev}).always(function(){usb_disks(tab_usbdisks)});
    }

    function spin_down_disk(dev) {
        document.getElementById('disk_orb-'+dev).className = "fa fa-refresh fa-spin orb grey-orb";
        $.post(UDURL,{action:"spin_down_disk",device:dev});
    }

    function spin_up_disk(dev) {
        document.getElementById('disk_orb-'+dev).className = "fa fa-refresh fa-spin orb grey-orb ";
        $.post(UDURL,{action:"spin_up_disk",device:dev});
    }

    if (typeof " ".formatUnicorn !== "function")
    {
      String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
      function () {
          "use strict";
          var str = this.toString();
          if (arguments.length) {
              var t = typeof arguments[0];
              var key;
              var args = ("string" === t || "number" === t) ?
                  Array.prototype.slice.call(arguments)
                  : arguments[0];

              for (key in args) {
                  str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
              }
          }

          return str;
      };
    }

    (function ($) {
        $.fn.getHiddenDimensions = function (includeMargin)
        {
            var $item = this,
            props = { position: 'absolute', visibility: 'hidden', display: 'block' },
            dim = { width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 },
            $hiddenParents = $item.parents().andSelf().not(':visible'),
            includeMargin = (includeMargin == null) ? false : includeMargin;

            var oldProps = [];
            $hiddenParents.each(function ()
            {
                var old = {};

                for (var name in props)
                {
                    old[name] = this.style[name];
                    this.style[name] = props[name];
                }

                oldProps.push(old);
            });

            dim.width = $item.width();
            dim.outerWidth = $item.outerWidth(includeMargin);
            dim.innerWidth = $item.innerWidth();
            dim.height = $item.height();
            dim.innerHeight = $item.innerHeight();
            dim.outerHeight = $item.outerHeight(includeMargin);

            $hiddenParents.each(function (i)
            {
                var old = oldProps[i];
                for (var name in props)
                {
                    this.style[name] = old[name];
                }
            });

            return dim;
        }
    }(jQuery));

    function openWindow_fsck(cmd,title,height,width) {
        var run = cmd;
        var top = (screen.height-height)/2;
        var left = (screen.width-width)/2;
        var options = 'resizeable=yes,scrollbars=yes,height='+height+',width='+width+',top='+top+',left='+left;
        window.open(run, 'log', options);
    }

    function disk_op(el, op, device) {
        /* add spinning and disable button */
        $("button[device='"+device+"']").html("<i class='fa fa-circle-o-notch fa-spin'></i> "+(op == "mount" ? "Mounting" : "Unmounting"));
        $("button[device='"+device+"']").prop("disabled","true");
        /* disable partition buttons */
        td = $("button[device='"+device+"']").closest('td');
        tr = td.closest('tr');
        part = tr.is('.toggle-parts');
        disk = tr.find('span[hdd]').attr("hdd");
        if (disk) {
            tr.siblings('tr.toggle-'+disk).find('.mount').html(td.html());
        } else if (part) {
            tr.prev('tr.toggle-disk').find('.mount').html(td.html());
        }
        $.post(UDURL,{'action':op,'device':device});
    }

    function usb_disks(tabnum)
    {
        /* save table widths */
        if (! diskinfo)
        {
            tableWidths = $("#usb_devices_list > table > thead > tr").children("td").map(function(i,v){return $(this).getHiddenDimensions().outerWidth;});

            $("#usb_devices_list > table > thead > tr").children("td").each(function(i,v)
            {
                if (i in tableWidths)
                {
                    $(this).css("width", tableWidths[i]);
                }
            });
        }

        $.post(UDURL,{action:"get_content",display:display},function(data)
        {
            maxWidth = [];
            var toggled = $("tr.toggle-parts").filter(":visible").map(function(){return $(this).attr("name");}).get();
            if (data)
            {
                $('#usb_devices_list').html(data);

            }
            $.each(toggled, function(k,v)
            {
                if(v.length)
                {
                    $("tr[name='"+v+"']").prev().find("i.fa-plus-square").removeClass("fa-plus-square").addClass("fa-minus-square");
                    $("tr[name='"+v+"']").css("display", "table-row");
                }
            });
        });
    }

    function ping_poll(tabnum)
    {
        $.post(UDURL,{action:"update_ping"}).done(function() {
            setTimeout(ping_poll, 15000, tabnum);
        });
    }

    function refresh_page(tabnum)
    {
        diskio = $.cookie('diskio')===undefined ? 0 : 1;
        $.post(UDURL,{action:"refresh_page",disk_display:diskio}).done(function() {
            setTimeout(refresh_page, 3000, tabnum);
        });
    }

    var ud_Reload = new NchanSubscriber('/sub/reload');
    ud_Reload.on('message',function(data)
    {
        if (data) {
            usb_disks(tab_usbdisks);
        }
    });

    function load_hosts(el, action) {
        var target = $(el).parents("div").find("*[name='IP']");
        var old = $(el).html();
        $(el).html("<i class='fa fa-circle-o-notch fa-spin'></i> Searching");
        $.post(UDURL,{'action': action, 'var': vars, 'network': network, 'workgroup': workgroup}).done(function(data)
        {
            $(el).html(old);
            if (data) {
                var hosts = data.split('\n');
                if (hosts.length) {
                    var add = "<select name='IP' class='swal-content__input' required>";
                    for(var i = 0;i < hosts.length;i++)
                    {
                        if (hosts[i].length)
                        {
                            add += "<option value='"+hosts[i].trim()+"'>"+hosts[i].trim()+"</option>";
                        }
                    }
                    target.replaceWith(add+"</select>")
                } else {
                    target.replaceWith("<input type='text' name='IP' class='swal-content__input' autocomplete='off'>");
                }
            }
        });
    }

    function load_shares(el, ip, user, pass, action) {
        var old = $(el).html();
        var target = $(el).parents("div").find("*[name='SHARE']");
        $(el).html("<i class='fa fa-circle-o-notch fa-spin'></i> Loading");
        var opts = new Object();
        opts["action"] = action;
        opts["IP"] = ip;
        opts["USER"] = user;
        opts["PASS"] = pass;
        $.post(UDURL,opts).done(function(data)
        {
            $(el).html(old);
            if (data != "") {
                var shares = data.split('\n');
                if (shares.length) {
                    var add = "<select name='SHARE' class='swal-content__input' required>";
                    for(var i = 0;i < shares.length;i++) {
                        if (shares[i].length) {
                            add += "<option value='"+shares[i]+"'>"+shares[i]+"</option>";
                        }
                    }
                    target.replaceWith(add+"</select>");
                } else {
                    target.replaceWith("<input type='text' name='SHARE' class='swal-content__input' autocomplete='off' required>");
                }
            } else {
                target.replaceWith("<input type='text' name='SHARE' class='swal-content__input' autocomplete='off' required>");
            }
        });
    }

    function get_tab_title_by_name(name) {
        var tab     = $("input[name$=tabs] + label").filter(function(){return $(this).text() === name;}).prev();
        var title   = $("div#title > span.left"     ).filter(function(){return $(this).text() === name;}).parent();
        if (tab.length) {
            return tab
        } else if (title.length) {
            return title
        } else {
            return $(document)
        }
    }

    function addButtonTab(Button, Name, autoHide, Append)
    {
        if (typeof(autoHide) == "undefined") autoHide = true;
        if (typeof(Append)   == "undefined") Append  = true;

        var Target      = get_tab_title_by_name(Name);
        var elementId   = 'event-' + new Date().getTime() * Math.floor(Math.random()*100000);
        var element = $("<span id='"+elementId+"' class='status'>"+Button+"</span>");

        if (element.find("input[type='button']").length)
        {
            element.addClass("vhshift");
            element.find("input[type='button']").prop("style","padding-top: 5px; padding-bottom: 5px; margin-top:-3px; margin-bottom:0;");
        }

        if (Target.prop('nodeName') === "DIV")
        {
            element.addClass("vhshift");
            if (Append)
            {
                Target.append(element);
            }
            else
            {
                Target.prepend(element);
            }
        }
        else if (Target.prop('nodeName') === "INPUT")
        {
            element.css("display","none");

            if (Append)
            {
                $('.tabs').append(element);
            }
            else
            {
                $('.tabs').prepend(element);
            }

            Target.bind({click:function()
            {
                $('#'+elementId).fadeIn('slow');}
            });

            if (Target.is(':checked') || ! autoHide) {
                $('#'+elementId).fadeIn('slow');
            }

            $("input[name$=tabs]").each(function()
            {
                if (! $(this).is(Target) && autoHide )
                {
                    $(this).bind({click:function()
                    {
                        $('#'+elementId).fadeOut('slow');}
                    });
                }
            });
        }
        else
        {
            return false;
        }
    }

    function rescan_disks() {
        $.post(UDURL,{action:"rescan_disks"});
        swalShowResult(true);
    }

    function swalShowResult(success) {
        opts = (success) ? {title:"Success!",icon:"success"} : {title:"Fail!",icon:"error"};
        swal2({title:opts.title,icon:opts.icon,text:" ",buttons:{confirm:{visible:false},cancel:{visible:false}},timer:1800});
    }

    function doUnassignedDevicesSurvey(surveyName, surveyOption) {
        var survey = $("div[data-survey-name="+ surveyName +"]");
        var numQuestions = survey.find("div[data-question]").length;
        var surveyData = new Array
        var index = 0;

        var evalCondition = function(obj, selector){
        if (obj.find(selector).length) {
            evaled = $.trim(obj.find(selector).eq(0).text())
            if (evaled.length ) {
                return eval(evaled);
            }
            return null;
        }
    }

    var getAttr = function(obj, name, defaultValue) {
        return (typeof obj.attr(name) !== "undefined") ? obj.attr(name) : defaultValue;
    }

    function showSwal(direction="=") {
        switch(direction) {
            case '>':index++;break;
            case '<':index--;break;
        }
        if(index >= numQuestions){return true;}
        question  = survey.find("div[data-question]").eq(index);
        condition = question.find("div[data-question-condition]").eq(0);

        if (condition.length && ! eval($.trim(condition.text())) ) {
            showSwal(direction);
        }

        content = question.find("div[data-question-content]").html();
        format = question.find("div[data-question-format]");
        if (format.length) { 
            eval("formatOpts = " + $.trim(format.text()));
            content = content.formatUnicorn(formatOpts);
        }

        has_checked = ["checkbox","radio","option"];
        restore_content=$("<div></div>").html(content);
        restore_content.find(":input").each(function(i,v) {
            name = $(this).prop("name");
            if (name in surveyData) {
                if ($.inArray($(this).prop("type"), has_checked) != -1 ) {
                    if ( $(this).val() == surveyData[name] ) { 
                        $(this).attr("checked",true);
                    }
                } else if ($(this).prop("type") == "select-one") {
                $(this).find("option[value="+ surveyData[name] +"]").attr("selected",true);
                } else { 
                    $(this).attr("value",surveyData[name]);
                }
            }
        });
        content = restore_content[0].outerHTML;
        button = {back:getAttr(question, "data-question-button-back","Back"),cancel:getAttr(question, "data-question-button-cancel","Cancel"),
                    done:getAttr(question, "data-question-button-done","Done"),next:getAttr(question, "data-question-button-next","Next")};

        swalOpts = new Object;
        swalOpts.title   = question.attr("data-question-title");
        swalOpts.content = {element:"div",attributes:{innerHTML:content}};
        swalOpts.icon    =  getAttr(question, "data-question-icon","info");
        swalOpts.closeOnClickOutside = false;
        swalOpts.buttons = new Object;
        swalOpts.buttons.confirm = (index > 0) ? {text: button.cancel, value: null,  visible: true, className: "", closeModal: true} : {text: "", value: null, visible: false, className: "", closeModal: true};
        swalOpts.buttons.cancel  = (index > 0) ? {text: button.back,   value: false, visible: true, className: "", closeModal: false} :
                                             {text: button.cancel, value: null,  visible: true, className: "", closeModal: true};
        swalOpts.buttons.next    = (index == numQuestions - 1 ) ? {text:button.done, value: true, visible: true, className: "", closeModal: false}:
                                                              {text:button.next, value: true, visible: true, className: "", closeModal: false};
        swal2(swalOpts).then( (response) => {
            emptyInputs = $.grep($(".swal-modal").find(":input"), function (e,v){ e = $(e);
                switch (e.prop('type')) {
                    case 'radio': if (e.is(":checked")){surveyData[e.prop("name")] = e.val();}; n=$(":input[name="+e.prop("name")+"]"); return (n.is("[required]") && ! n.is(":checked")); break;
                    case 'option':
                    case 'checkbox': if(e.is(":checked")){surveyData[e.prop("name")] = e.val()}; return (e.is("[required]") && ! e.is(":checked")); break;
                    case 'select-one': if (e.has(":checked")){surveyData[e.prop("name")] = e.find(":checked").val();}; n=$(":input[name="+e.prop("name")+"]"); return (n.is("[required]") && ! n.has(":checked")); break;

                    default: if (e.val()||e.prop("name")){surveyData[e.prop("name")] = e.val()}; return (e.is("[required]") && ! e.val()); break;
                }
            });
            if (response)
            {
                if (emptyInputs.length) {
                    return "=";
                } else if (! emptyInputs.length && index <= numQuestions - 1) {
                    evaled = evalCondition(question, "div[data-question-done]");
                    if (index < numQuestions - 1) {
                        if (evaled !== null && evaled === true) return ">";
                            if (evaled !== null && evaled === false) return "<";
                            else return ">";
                        } else if(index == numQuestions - 1) {
                            if (evaled !== null && evaled === false) return "=";
                            $(".swal-button--cancel").prop("disabled",true);
                            $(".swal-button--confirm").prop("disabled",true);
                            evalCondition(survey,"div[data-survey-done]");
                            if (getAttr(survey.find("div[data-survey-done]").eq(0),"data-survey-done-wait", "true") == "false" ) {
                                setTimeout(() => { swal2({buttons:{confirm:{visible:false},cancel:{visible:false}},timer:100}) }, 1500)
                            }
                            return true;
                        }
            }
        } else {
            if ( response === false && index <= numQuestions ) {
                return "<";
            } else if ( response === null  ) { 
                return true;
            }
        }
        return "=";
        }).then( (response2) => {
            if (typeof response2 !== "boolean") return showSwal(response2);
                else return false;
        });
    }
    showSwal();
}
</script>



<blockquote class='inline_help'>
  <p>Turn on the <strong>Disks</strong> switch to change the web page to show disk devices. Turn off the <strong>Diskss</strong> switch to change the web page to hide disk devices.</p>
  
  <p>Turn on the <strong>Shares</strong> switch to change the web page to show shares. Turn off the <strong>Shares</strong> switch to change the web page to hide shares.</p>
  
  <p>Turn on the <strong>Historical</strong> switch to show Historical disk devices. Turn off <strong>Hstorical</strong> switch to switch back to not show Historical disk devices.</p>
  
  <p>Click on the <i style='color:black;font-weight:bold;' class="fa fa-refresh"></i> icon to refresh disks and configuration.</p>
  
  <p>Click on the <i style='color:black;font-weight:bold;' class="fa fa-gear"></i> icon to go to the UD Settings.</p>
  
  <p>You can spin a disk up or down by clicking on the disk ball <i class='fa fa-circle orb green-orb'></i>or <i class='fa fa-circle orb grey-orb'></i>indicator.  Applies to version 6.9 RC2 and later only.
  </p>
</blockquote>

<div id="usb_devices_list">
</div>


<blockquote class='inline_help'>
  <p><strong>Unassigned Devices is called UD for short.</strong></p>
  
  <p>Hover your mouse over an any active area on the UD page and a tool tip will show you what clicking that area does.
  You can mount USB devices, sata drives, Remote SMB/NFS shares, and ISO Files with UD.  Any devices with the auto mount switch on will be mounted when the array is started.  All drives and SMB/NFS Mounts are unmounted when the array is stopped on the 'stopping_svcs' event.
  If you want to share your drive, you can turn on the Share switch.  The default for Remote SMB shares is Public read/write access.  Enable SMB Security by user in the Unassigned Devices Settings.  NFS shares are exported and access is read/write.  The export of NFS devices is enabled in the Unassigned Devices settings. You can also enable a common script that will be executed on every disk mount.  In order to share any UD device, sharing needs to be enabled in the UD Settings and the switch turned on to share the particular device.  SMB/NFS remove shares and ISO mounts are always shared.
  After entering a mount point, press &lt;Enter&gt; to save the change.</p>
  
  <p>Additional options are available when you click on the <i style='color:black;font-weight:bold;' class="fa fa-plus-square"></i> icon by device identification.  When the disk is unmounted, the mount point of the device can be changed.  The disk label will also be changed.  A disk can be formatted and an fsck run to check the disk.</p>
  
  <p>The 'Settings->Unassigned Devices' security settings for SMB and NFS must be set correctly for SMB and NFS sharing to work properly.</p>
  
  <p>If the mount button is grayed out for a SMB/NFS remote share, the remote server is not responding to a ping.  The remote share server must respond to a ping or UD will consider it off-line.</p>
  
  <p>UD has a destructive mode that allows deleting disk partitions and formatting disks.  If Destructive Mode is not turned on in the UD Settings, you WILL NOT be able to format a disk or remove partitions.  Go the the 'Settings->Unassigned Devices' to set the destructive mode.</p>
  
  <p><strong>To format a disk:</strong></p>
  
  <ul>
  <li>Destructive mode must be enabled.</li>
  <li>Disk must have all partitions removed.  Unmount disk, click on the <i style='color:black;font-weight:bold;' class='fa fa-plus-square'></i> icon,, and click on all <i style='color:red;font-weight:bold;' class='fa fa-remove hdd'></i> icons to delete partitions.</li>
  <li>If the disk has been precelared and shows a grayed 'Format' button, click on the <i style='color:black;font-weight:bold;' class='fa fa-plus-square'></i> icon, then click on the <i style='color:red;font-weight:bold;' class='fa fa-remove hdd'></i> icon to delete the preclear status file.</li>
  </ul>
  
  <p><strong>Note: A disk partitioned in UD is compatible with the array disk partitioning and can be added to the array.  Supported file formats are XFS, XFS encrypted, BTRFS and BTRFS encrypted.</strong></p>
  
  <p><strong>Encrypted Disks:</strong></p>
  
  <ul>
  <li>Any disk formatted in UD that is encrypted will use the array password/passphrase and can be incorporated into the array.  Or you can set a unique password when it is formatted.  If you set a password on the disk when it is formatted, you will need to enter a disk password in Unassignd Devices->Settings for that disk.</li>
  <li>Any disk that was not encrypted with the Array password/passphrase can be mounted by setting a per disk passord set in Unassigned Devices->Settings.</li>
  </ul>
  
  <p><strong>Unassigned devices script:</strong></p>
  
  <p>UD includes a script that is used for mounting and unmounting devices and SMB/NFS mounts. These scripts can be used from the command line or in your scripts as necessary.</p>
  
  <ul>
  <li>'/usr/local/sbin/rc.unassigned mount autodevices' - all devices set to auto mount will be mounted.</li>
  <li>'/usr/local/sbin/rc.unassigned mount autoshares' - all SMB/NFS mounts set to auto mount will be mounted.</li>
  <li>'/usr/local/sbin/rc.unassigned umount auto' - all devices and SMB/NFS mounts set to auto mount will be unmounted.</li>
  <li>'/usr/local/sbin/rc.unassigned umount all' - all devices and SMB/NFS mounts are unmounted in preparation for shutting down the array.</li>
  <li>'/usr/local/sbin/rc.unassigned mount /dev/sdX or devX' - mount device sdX where 'X' is the device designator.  The devX is the device name in the UD page.  If the device name is 'Dev 1', then use dev1 as the device to mount.</li>
  <li>'/usr/local/sbin/rc.unassigned umount /dev/sdX or devX' - unmount device sdX where 'X' is the device designator. The devX is the device name in the UD page.  If the device name is 'Dev 1', then use dev1 as the device to unmount. You can use this command in a UD script to unmount the device when the script has completed.</li>
  <li>'/usr/local/sbin/rc.unassigned spindown devX' - spin down a disk.  The devX is the device name in the UD page.  If the device name is 'Dev 1', then use dev1 as the device to spin down.  SSDs will not spin down.</li>
  </ul>
  
  <p>Be careful using the /dev/sdX designation because it can change after a reboot.
  </p>
</blockquote>

<script type="text/javascript">
    var maxWidth    = [];
    var tableWidths = [];
    var display     = {"font":"","date":"%c","time":"%R","number":".,","unit":"C","scale":"-1","resize":"0","wwn":"0","total":"1","banner":"","header":"","background":"","dashapps":"icons","tabs":"1","users":"Tasks:3","usage":"0","text":"1","warning":"70","critical":"90","hot":"45","max":"55","theme":"black","locale":"","raw":"","rtl":"","align":"right","view":"","refresh":"3000","sysinfo":"\/Tools\/SystemProfiler"};
    var vars        = {"version":"6.9.2","MAX_ARRAYSZ":"30","MAX_CACHESZ":"30","NAME":"Tower","timeZone":"Australia\/Sydney","COMMENT":"Media server","SECURITY":"user","WORKGROUP":"WORKGROUP","DOMAIN":"","DOMAIN_SHORT":"","hideDotFiles":"no","localMaster":"yes","enableFruit":"yes","USE_NETBIOS":"yes","USE_WSD":"yes","WSD_OPT":"","USE_NTP":"yes","NTP_SERVER1":"time1.google.com","NTP_SERVER2":"time2.google.com","NTP_SERVER3":"time3.google.com","NTP_SERVER4":"time4.google.com","DOMAIN_LOGIN":"Administrator","SYS_MODEL":"Custom","SYS_ARRAY_SLOTS":"24","SYS_FLASH_SLOTS":"1","USE_SSL":"auto","PORT":"80","PORTSSL":"443","LOCAL_TLD":"local","BIND_MGT":"no","USE_TELNET":"yes","PORTTELNET":"23","USE_SSH":"yes","PORTSSH":"22","USE_UPNP":"no","START_PAGE":"Main","startArray":"yes","spindownDelay":"0","spinupGroups":"no","defaultFsType":"xfs","shutdownTimeout":"90","luksKeyfile":"\/root\/keyfile","poll_attributes":"1800","poll_attributes_default":"1800","poll_attributes_status":"default","queueDepth":"auto","nr_requests":"128","nr_requests_default":"Auto","nr_requests_status":"user-set","md_scheduler":"auto","md_scheduler_default":"auto","md_scheduler_status":"default","md_num_stripes":"1280","md_num_stripes_default":"1280","md_num_stripes_status":"default","md_queue_limit":"80","md_queue_limit_default":"80","md_queue_limit_status":"default","md_sync_limit":"5","md_sync_limit_default":"5","md_sync_limit_status":"default","md_write_method":"auto","md_write_method_default":"auto","md_write_method_status":"default","shareDisk":"auto","shareUser":"e","shareUserInclude":"","shareUserExclude":"","shareSMBEnabled":"yes","shareNFSEnabled":"no","shareInitialOwner":"Administrator","shareInitialGroup":"Domain Users","shareCacheEnabled":"yes","shareCacheFloor":"2000000","shareMoverSchedule":"0 0 * * *","shareMoverLogging":"no","fuse_remember":"330","fuse_remember_default":"330","fuse_remember_status":"default","fuse_directio":"auto","fuse_directio_default":"auto","fuse_directio_status":"default","fuse_useino":"yes","shareAvahiEnabled":"yes","shareAvahiSMBName":"%h","shareAvahiSMBModel":"Xserve","shfs_logging":"1","safeMode":"no","startMode":"Normal","configValid":"yes","joinStatus":"Not joined","deviceCount":"9","flashGUID":"0781-5567-0000-180108114403","flashProduct":"Cruzer_Blade","flashVendor":"SanDisk","regBuildTime":"1617821152","regCheck":"","regFILE":"\/boot\/config\/Plus.key","regGUID":"0781-5567-0000-180108114403","regTy":"Plus","regTo":"Aaron Osteraas","regTm":"1585846020","regTm2":"0","regGen":"0","sbClean":"no","sbName":"\/boot\/config\/super.dat","sbVersion":"2.9.4","sbUpdated":"1625493794","sbEvents":"241","sbState":"1","sbSynced":"1625387849","sbSyncErrs":"0","sbSynced2":"1625493794","sbSyncExit":"0","sbNumDisks":"7","mdColor":"green-on","mdNumDisks":"6","mdNumDisabled":"1","mdNumInvalid":"1","mdNumMissing":"0","mdNumNew":"0","mdNumErased":"0","mdResync":"0","mdResyncCorr":"0","mdResyncPos":"0","mdResyncDb":"0","mdResyncDt":"0","mdResyncAction":"check Q","mdResyncSize":"9766436812","mdState":"STARTED","mdVersion":"2.9.17","fsState":"Started","fsProgress":"","fsCopyPrcnt":"0","fsNumMounted":"6","fsNumUnmountable":"0","fsUnmountableMask":"","shareCount":"13","shareSMBCount":"9","shareNFSCount":"0","shareMoverActive":"no","reservedNames":"parity,parity2,parity3,diskP,diskQ,diskR,disk,disks,flash,boot,user,user0,dev,disk0,disk1,disk2,disk3,disk4,disk5,disk6,disk7,disk8,disk9,disk10,disk11,disk12,disk13,disk14,disk15,disk16,disk17,disk18,disk19,disk20,disk21,disk22,disk23,disk24,disk25,disk26,disk27,disk28,disk29,disk30,disk31","csrf_token":"18FA89EE4D74E62D"};
    var network     = [];
    var workgroup   = "";

    /* Reload page if browser back button was used */
    window.addEventListener( "pageshow", function ( event )
    {
        var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
        if ( historyTraversal ) {
            /* Handle page restore. */
            window.location.reload();
        }
    });

    var workgroup = 'WORKGROUP';
network.push({gateway:'192.168.1.200', ip:'192.168.1.200', netmask:'255.255.255.0'});

    var tab_usbdisks    = $('input[name$="tabs"]').length;
    var UDURL       = '/plugins/unassigned.devices/UnassignedDevices.php';
    var diskinfo        = "";

    if (typeof swal2 === "undefined")
    {
        $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '/plugins/unassigned.devices/assets/sweetalert2.css?v=1583086826') );
        $.getScript( '/plugins/unassigned.devices/assets/sweetalert2.js');
    }

    /* Bind Arrive events */
    $("#usb_devices_list").arrive("tr",{onceOnly:false},function()
    {
        tr = $(this);

        maxWidth.push(tr.find("td:nth-child(2) > span").getHiddenDimensions().width );
        $(".usb_disks > thead > tr > td:nth-child(2)").css("min-width", Math.max.apply(Math, maxWidth) + 10 );

        tr.find("span.toggle-hdd").click(function(e)
        {
            $(this).disableSelection();disk = $(this).attr("hdd");el = $(this);
            $(".toggle-"+disk).slideToggle(0,function(){
                if ( $("tr.toggle-"+disk+":first").is(":visible") ){
                    el.find(".fa-append").addClass("fa-minus-square").removeClass("fa-plus-square");
                } else {
                    el.find(".fa-append").removeClass("fa-minus-square").addClass("fa-plus-square");
                }
            });
        });
        tr.find( "button[role$=mount]" ).on( "click", function()
        {
            disk_op(this, $(this).attr("role"), $(this).attr("device"));
        });
        tr.find("button[role=format]").click(function(){format_disk(this, $(this).attr("context"), $(this).attr("device"));});
    });

    $( "#usb_devices_list" ).arrive(".show-shares", {onceOnly:false}, function()
    {
        $(this).css("display", $(".shares-switch").is(":checked") ? "block" : "none");
    });

    $( "#usb_devices_list" ).arrive(".show-disks", {onceOnly:false}, function()
    {
        $(this).css("display", $(".disks-switch").is(":checked") ? "block" : "none");
    });

    $( "#usb_devices_list" ).arrive(".show-historical", {onceOnly:false}, function()
    {
        $(this).css("display", $(".historical-switch").is(":checked") ? "block" : "none");
    });

    $(function()
    {
        /* Add icons to Tab/Title bar */
        $('#tab4').bind({click:function() {$('i.toggle').show('slow');}});
        if ($.cookie('diskio')===undefined) {
            $('i.toggle').removeClass('fa-tachometer').addClass('fa-list');
        } else {
            $('i.toggle').removeClass('fa-list').addClass('fa-tachometer');
        }
        addButtonTab('<a title="Unassigned Devices Settings" href="/Settings/UnassignedDevicesSettings"><i class="fa fa-gear"></i></a>',
                                 "Unassigned Devices");
        addButtonTab('<a style="cursor:pointer;" onclick="rescan_disks()" title="Refresh Disks and Configuration"><i class="fa fa-refresh"></i></a>',
                                 "Unassigned Devices");
        addButtonTab('<a style="cursor:pointer;" title="Switch On to Show Historical Devices"><input type="checkbox" class="historical-switch"></a>',
                                 "Unassigned Devices");
        addButtonTab('<a style="cursor:pointer;" title="Switch On to Show SMB/NFS/ISO Shares"><input type="checkbox" class="shares-switch"></a>',
                                 "Unassigned Devices");
        addButtonTab('<a style="cursor:pointer;" title="Switch On to Show Disk Devices"><input type="checkbox" class="disks-switch"></a>',
                                 "Unassigned Devices");

        /* Add switchButton to Tab/Title bar */
        $('.disks-switch').switchButton({ labels_placement: "left", on_label: "Disks", off_label: "Disks", checked: $.cookie('unassigned-disks-view') != 'false'});
        $('.disks-switch').change(function()
        {
            $('.show-disks').slideToggle('slow');
            $.cookie('unassigned-disks-view', $('.disks-switch').is(':checked') ? 'true' : 'false', { expires: 3650, path:'/' });
        });

        $('.shares-switch').switchButton({ labels_placement: "left", on_label: "Shares", off_label: "Shares", checked: $.cookie('unassigned-shares-view') != 'false'});
        $('.shares-switch').change(function()
        {
            $('.show-shares').slideToggle('slow');
            $.cookie('unassigned-shares-view', $('.shares-switch').is(':checked') ? 'true' : 'false', { expires: 3650, path:'/' });
        });

        $('.historical-switch').switchButton({ labels_placement: "left", on_label: "Historical", off_label: "Historical", checked: $.cookie('unassigned-historical-view') != 'false'});
        $('.historical-switch').change(function()
        {
            $('.show-historical').slideToggle('slow');
            $.cookie('unassigned-historical-view', $('.historical-switch').is(':checked') ? 'true' : 'false', { expires: 3650, path:'/' });
        });

        /* Load contents if tab is checked */
        if ($('#tab'+tab_usbdisks).is(':checked')) {
            $('#tab'+tab_usbdisks).trigger("click");
            $.removeCookie('one',{path:'/'});
        }

        usb_disks(tab_usbdisks);
        ping_poll(tab_usbdisks);
        refresh_page(tab_usbdisks);
        ud_Reload.start();
    });
</script>

<div style="display:none;" data-survey-name="add_iso_share" data-survey-title="Add ISO File Share">
    <div data-question data-question-title="Choose ISO File" data-question-button-done="Add">
        <div data-question-format>
            ["data-pickroot","ISO_FILE"]
        </div>
        <div data-question-content>
            <input type='text' name='{1}' placeholder="Click to select ISO file" data-pickcloseonfile='true' data-pickfilter='iso' {0}='/mnt/user/' data-pickfolders='true' required='required' class='swal-content__input' autocomplete="off" >
        </div>
        <div data-question-load></div>
        <div data-question-done>
            (surveyData["ISO_FILE"].toLowerCase().indexOf(".iso") !== -1)
        </div>
    </div>
    <div data-survey-done>
        var opts = {action:"add_iso_share",ISO_FILE:surveyData["ISO_FILE"]};
        if (opts.ISO_FILE) {
            $.post("/plugins/unassigned.devices/UnassignedDevices.php",opts).done(function(data)
            {
                swalShowResult((data == "true") ? true : false);
            },"json").fail(function(){swalShowResult(false);});
        }
    </div>
    <div>
        <script type="text/javascript">
            $(document).on("click","input[name=ISO_FILE]",function() {
                if (! $(this).siblings("div.fileTree").length) {
                    $(this).fileTreeAttach();
                    $(this).trigger("click");
                }
                $(this).next("div.fileTree").css("text-align","left").css("z-index","10001").css("left","20px").css("width",$(this).width()+13)
            });
            $(function() {
                window.add_iso_share = function(){doUnassignedDevicesSurvey("add_iso_share")}
            })
        </script>
    </div>
</div>

<div style="display:none;" data-survey-name="format_disk" data-survey-title="Partition and Format Disk">
    <div data-question data-question-title="Choose File System Format">
        <div data-question-format>
            [surveyOption.type,surveyOption.device]
        </div>
        <div data-question-content>
            <select name="FS" class="swal-content__input">
                <option value="xfs">XFS</option>
                <option value="btrfs">BTRFS</option>
                                <option value="xfs-encrypted">XFS - encrypted</option>
                <option value="btrfs-encrypted">BTRFS - encrypted</option>
                                <option value="ntfs">NTFS</option>
                <option value="exfat">exFAT</option>
                <option value="fat32">FAT32</option>
            </select>
            <p><span style="font-weight:bold;">Note:</span> An XFS or BTRFS disk partitioned in UD is compatible with the array disk partitioning and can be added to the array.</p>
        </div>
        <div data-question-load></div>
        <div data-question-done></div>
    </div>

    <div data-question data-question-title="Password">
        <div data-question-condition>
            surveyData['FS'] == 'xfs-encrypted' || surveyData['FS'] == 'btrfs-encrypted'
        </div>
        <div data-question-content>
            <div class="swal-content">
                <input type="password" class="swal-content__input" name="PASS" autocomplete="new-password" placeholder="Password">
                <p>Enter the password to use for this disk. Leave blank to use the array password/passphrase. If using a disk password, be sure to enter the password for this disk in UD Settings so it can be mounted.</p>
                <p><span style="font-weight:bold;">Note:</span> Remember your password. It cannot be recovered!</p>
            </div>
        </div>
    </div>

    <div data-question data-question-title="" data-question-button-done=Format data-question-icon="warning">
        <div data-question-format>
            [surveyOption.type,surveyOption.device]
        </div>
        <div data-question-content>
            <div class="swal-title">Any data on this disk will be lost!</div>
            <div style="margin-bottom: 25px;font-size: 20px;">Type <span class="red">'Yes'</span> to format:</div>
            <input type="text" name="confim-yes" class="swal-content__input" autocomplete="off" required >
        </div>
        <div data-question-load></div>
        <div data-question-done>
            (surveyData["confim-yes"] == "Yes")
        </div>
    </div>
    <div data-survey-done data-survey-done-wait="true">
        $("button[device='"+surveyOption.device+"']").prop('disabled',true);
        $("button[device='"+surveyOption.device+"']").html("<i class='fa fa-circle-o-notch fa-spin'></i> Formatting");
        $.post(UDURL,{action:"format_"+surveyOption.type,device:surveyOption.device, fs:surveyData["FS"], pass:surveyData["PASS"]}, function(data)
        {
            $("button[device='"+surveyOption.device+"']").prop('disabled',true);
            $("button[device='"+surveyOption.device+"']").html( data.status ? "Formated" : "Format failed" );
            swalShowResult(data.status);
        },"json").fail(function(){swalShowResult(false);});
    </div>
    <div>
        <script type="text/javascript">
            $(function() {
                window.format_disk = function(bt, type, device){doUnassignedDevicesSurvey("format_disk",{el:bt,type:type,device:device});}
            });
        </script>
    </div>
</div>

<div style="display:none;" data-survey-name="remove_partiton" data-survey-title="">
    <div data-question data-question-title="" data-question-button-done="Remove" data-question-icon="warning">
        <div data-question-format>
            [surveyOption.partition,surveyOption.device]
        </div>
        <div data-question-content>
            <div class="swal-title">Any data on this disk will be lost!</div>
            <div class="swal-title" style="font-size: 20px;">Remove partition <span class="red">{0}</span> from disk <span class="red">{1}</span></div>
            <div style="margin-bottom: 25px;font-size: 20px;">Type <span class="red">'Yes'</span> to confirm:</div>
                <input type="text" name="confim-yes" class="swal-content__input" autocomplete="off" required >
        </div>
        <div data-question-load></div>
        <div data-question-done>
            (surveyData["confim-yes"] == "Yes")
        </div>
    </div>
    <div data-survey-done >
        $("span[device='"+surveyOption.device+surveyOption.partition+"']").prop('disabled',true);
        $("span[device='"+surveyOption.device+surveyOption.partition+"']").html("<i class='fa fa-circle-o-notch fa-spin'></i> Removing");
        $.post(UDURL,{action:"rm_partition",device:surveyOption.device,partition:surveyOption.partition}).done(function(data)
        {
            swalShowResult((data == "true") ? true : false);
        },"json").fail(function(){swalShowResult(false);});
    </div>
    <div>
        <script type="text/javascript">
            $(function() {
                window.rm_partition = function(bt, device, partition){doUnassignedDevicesSurvey("remove_partiton",{el:bt,device:device,partition:partition});}
            });
        </script>
    </div>
</div>

<div style="display:none;" data-survey-name="remove_iso_share" data-survey-title="Remove ISO File mount">
    <div data-question data-question-title="" data-question-button-done="Remove" data-question-icon="warning">
        <div data-question-format>
            [surveyOption]
        </div>
        <div data-question-content>
            <div class="swal-title" style="font-size: 20px;">This will remove the ISO file share for:</div>
            <div style="margin-bottom: 15px;margin-top: 15px;">
                <span style="font-weight: bold;">{0}</span>
            </div>
            <div class="swal-title" style="font-size: 20px;">
                <span class="red" style="font-weight: bold;">Are you sure?</span>
            </div>
        </div>
        <div data-question-load></div>
        <div data-question-done></div>
    </div>
    <div data-survey-done>
        $.post(UDURL,{action:"remove_iso_config",device:surveyOption}).done(function(data)
        {
            swalShowResult((data == "true") ? true : false);
        },"json").fail(function(){swalShowResult(false);});
    </div>
    <div>
        <script type="text/javascript">
            $(function() {
                window.remove_iso_config = function(i){doUnassignedDevicesSurvey("remove_iso_share",i);}
        });
    </script>
    </div>
</div>

<div style="display:none;" data-survey-name="remove_disk_config" data-survey-title="Remove Disk Config">
    <div data-question data-question-title="" data-question-button-done="Remove" data-question-icon="warning">
        <div data-question-format>
            [surveyOption]
        </div>
        <div data-question-content>
            <div class="swal-title" style="font-size: 20px;">This will remove the saved configuration of:</div>
            <div style="margin-bottom: 15px;margin-top: 15px;">
                <span style="font-weight: bold;">{0}</span>
            </div>
            <div class="swal-title" style="font-size: 20px;">
                <span class="red" style="font-weight: bold;">Are you sure?</span>
            </div>
        </div>
        <div data-question-load></div>
        <div data-question-done></div>
    </div>
    <div data-survey-done>
        $.post(UDURL,{action:"remove_config",serial:surveyOption}).done(function(data)
        {
            swalShowResult((data == "true") ? true : false);
        },"json").fail(function(){swalShowResult(false);});
    </div>
    <div>
        <script type="text/javascript">
            $(function(){
                window.remove_disk_config = function(i){doUnassignedDevicesSurvey("remove_disk_config",i);}
            });
        </script>
    </div>
</div>

<div style="display:none;" data-survey-name="remove_remote_share" data-survey-title="Remove SMB/NFS mount?">
    <div data-question data-question-title="" data-question-button-done="Remove" data-question-icon="warning">
        <div data-question-format>
            [surveyOption, (surveyOption.startsWith("//") ? "SMB" : "NFS")]
        </div>
        <div data-question-content>
            <div class="swal-title" style="font-size: 20px;">This will remove the remote <span style="font-weight: bold;">{1}</span> share for:</div>
            <div style="margin-bottom: 15px;margin-top: 15px;">
                <span style="font-weight: bold;">{0}</span>
            </div>
            <div class="swal-title" style="font-size: 20px;">
                <span class="red" style="font-weight: bold;">Are you sure?</span>
            </div>
        </div>
        <div data-question-load></div>
        <div data-question-done></div>
    </div>
    <div data-survey-done>
        $.post(UDURL,{action:"remove_samba_config",device:surveyOption}).done(function(data)
        {
            swalShowResult((data == "true") ? true : false);
        },"json").fail(function(){swalShowResult(false);});
    </div>
    <div>
        <script type="text/javascript">
            $(function(){
                window.remove_samba_config = function(i){doUnassignedDevicesSurvey("remove_remote_share",i);}
            });
        </script>
    </div>
</div>

<div style="display:none;" data-survey-name="add_remote_share" data-survey-title="Add Remote Share">
    <div data-question data-question-title="Click on Icon to Choose Protocol">
        <div data-question-format>
            ["nfs_radio","smb_radio"]
        </div>
        <div data-question-content>
            <div class="image-radio">
                <input type="radio" id="{0}" name="PROTOCOL" value="NFS" required="">
                <label class="image-radio-label image-radio-linux" for="{0}"></label>
                <input type="radio" id="{1}" name="PROTOCOL" value="SMB" required="">
                <label class="image-radio-label image-radio-windows" for="{1}"></label>
                <p>WARNING: Use caution when using a remote share local mount in a Docker Container or VM for critical data.  Media mapped to apps like Plex should not be a problem.  Remote share mounts are dependent on a solid and reliable network connection and that can difficult to achieve. If the remote share goes offline, you may have problems!</p>
            </div>
        </div>
    </div>
    <div data-question data-question-title="Choose Server">
        <div data-question-format>
            [surveyData["PROTOCOL"] == "SMB" ? "list_samba_hosts" : "list_nfs_hosts"]
        </div>
        <div data-question-content>
            <input type='text' class="swal-content__input" name='IP' autocomplete="off" required><br/>
            <button class="swal-button" onclick='load_hosts(this,"{0}")'>Search For Servers</button>
            <p>Search for Servers, or enter the Server name/IP address manually.</p>
        </div>
    </div>
    <div data-question data-question-title="Username">
        <div data-question-condition>
            surveyData['PROTOCOL'] == 'SMB';
        </div>
        <div data-question-content>
            <div class="swal-content">
                <input type="text" class="swal-content__input" name="USER" autocomplete="off" placeholder="Username">
                <p>Enter the Username if the share is password protected. You will need to enter credentials for Windows 10 shares just to list them.</p>
            </div>
        </div>
    </div>
    <div data-question data-question-title="Password">
        <div data-question-condition>
            surveyData['PROTOCOL'] == 'SMB'
        </div>
        <div data-question-content>
            <div class="swal-content">
                <input type="password" class="swal-content__input" name="PASS" autocomplete="new-password" placeholder="Password">
                <p>Enter the Password if the share is password protected. You will need to enter credentials for Windows 10 shares just to list them.</p>
            </div>
        </div>
    </div>
    <div data-question data-question-title="Domain">
        <div data-question-condition>
            surveyData['PROTOCOL'] == 'SMB'
        </div>
        <div data-question-content>
            <div class="swal-content">
                <input type="text" class="swal-content__input" name="DOMAIN" autocomplete="off" placeholder="Domain">
                <p>Enter the Domain for the share if on a Domain.</p>
            </div>
        </div>
    </div>
    <div data-question data-question-title="Choose Share">
        <div data-question-format>
            [surveyData['PROTOCOL'], surveyData['IP'], surveyData['USER'], surveyData['PASS'], surveyData['DOMAIN'], (surveyData['PROTOCOL'] == 'SMB' ? 'list_samba_shares' : 'list_nfs_shares')]
        </div>
        <div data-question-content>
            <input type='text' class="swal-content__input" autocomplete="off" name='SHARE' required><br />
            <button class="swal-button" onclick='load_shares(this, "{1}", "{2}", "{3}", "{5}")'>Load Shares</button>
            <p>Search for Shares or enter the Share name manually.</p>
        </div>
        <div data-question-done>
            (surveyData["SHARE"].length)
        </div>
    </div>
    <div data-survey-done>
        var opts = new Object();
        opts["action"]   = "add_samba_share";
        opts["PROTOCOL"] = surveyData['PROTOCOL'];
        opts["IP"]       = surveyData['IP'];
        opts["USER"]     = surveyData['USER'];
        opts["DOMAIN"]   = surveyData['DOMAIN'];
        opts["PASS"]     = surveyData['PASS'];
        opts["SHARE"]    = surveyData['SHARE'];
        if (opts.SHARE && opts.IP) {
            $.post(UDURL,opts).done(function(data)
            {
                swalShowResult((data == "true") ? true : false);
            },"json").fail(function(){swalShowResult(false);});
        }
    </div>
    <div>
        <script type="text/javascript">
            $(function(){
                window.add_samba_share = function(i){doUnassignedDevicesSurvey("add_remote_share",i);}
            });
        </script>
    </div>
</div>

<div style="display:none;" data-survey-name="change_mountpoint" data-survey-title="">
    <div data-question data-question-title="Change Disk Mount Point" data-question-button-done="Change">
        <div data-question-format>
            [surveyOption.mountpoint]
        </div>
        <div data-question-content>
            <input type="text" class="swal-content__input" name="MOUNTPOINT" value={0} placeholder="Mount Point" required>
            <p>Changing the Mount Point will also change the disk label.</p>
        </div>
        <div data-question-load></div>
        <div data-question-done>
            (surveyData["MOUNTPOINT"].length)
        </div>
    </div>
    <div data-survey-done data-survey-done-wait="true">
        $.post(UDURL,{action:"chg_mountpoint",serial:surveyOption.serial,partition:surveyOption.partition,device:surveyOption.device,fstype:surveyOption.fstype,mountpoint:surveyData['MOUNTPOINT']}).done(function(data)
        {
            swalShowResult((data == "true") ? true : false);
        },"json").fail(function(){swalShowResult(false);});
    </div>
    <div>
        <script type="text/javascript">
            $(function() {
                window.chg_mountpoint = function(serial, partition, device, fstype, mountpoint){doUnassignedDevicesSurvey("change_mountpoint",{serial:serial,partition:partition,device:device,fstype:fstype,mountpoint:mountpoint});}
            });
        </script>
    </div>
</div>

<div style="display:none;" data-survey-name="change_samba_mountpoint" data-survey-title="">
    <div data-question data-question-title="Change SMB/NFS Mount Point" data-question-button-done="Change">
        <div data-question-format>
            [surveyOption.mountpoint]
        </div>
        <div data-question-content>
            <input type="text" class="swal-content__input" name="MOUNTPOINT" value={0} placeholder="Mount Point" required>
        </div>
        <div data-question-load></div>
        <div data-question-done>
            (surveyData["MOUNTPOINT"].length)
        </div>
    </div>
    <div data-survey-done data-survey-done-wait="true">
        $.post(UDURL,{action:"chg_samba_mountpoint",device:surveyOption.device,mountpoint:surveyData['MOUNTPOINT']}).done(function(data)
        {
            swalShowResult((data == "true") ? true : false);
        },"json").fail(function(){swalShowResult(false);});
    </div>
    <div>
        <script type="text/javascript">
            $(function() {
                window.chg_samba_mountpoint = function(device, mountpoint){doUnassignedDevicesSurvey("change_samba_mountpoint",{device:device,mountpoint:mountpoint});}
            });
        </script>
    </div>
</div>

<div style="display:none;" data-survey-name="change_iso_mountpoint" data-survey-title="">
    <div data-question data-question-title="Change ISO File Mount Point" data-question-button-done="Change">
        <div data-question-format>
            [surveyOption.mountpoint]
        </div>
        <div data-question-content>
            <input type="text" class="swal-content__input" name="MOUNTPOINT" value={0} placeholder="Mount Point" required>
        </div>
        <div data-question-load></div>
        <div data-question-done>
            (surveyData["MOUNTPOINT"].length)
        </div>
    </div>
    <div data-survey-done data-survey-done-wait="true">
        $.post(UDURL,{action:"chg_iso_mountpoint",device:surveyOption.device,mountpoint:surveyData['MOUNTPOINT']}).done(function(data)
        {
            swalShowResult((data == "true") ? true : false);
        },"json").fail(function(){swalShowResult(false);});
    </div>
    <div>
        <script type="text/javascript">
            $(function() {
                window.chg_iso_mountpoint = function(device, mountpoint){doUnassignedDevicesSurvey("change_iso_mountpoint",{device:device,mountpoint:mountpoint});}
            });
        </script>
    </div>
</div>

<div id='title'><span class='left'><i class='fa fa-snowflake-o title'></i>Array Operation</span></div><p></p>

<style>
tr#copy,tr#file{display:none}
td.gap{padding-left:26px!important}
td.wrap{white-space:normal!important}
span#pass{display:none;margin-left:20px}
</style>

<script src="/webGui/javascript/jquery.base64.js?v=1572800053"></script>

<script>
var ctrl = '<span class="status vhshift"><a style="cursor:pointer" class="tooltip_diskio" title="Toggle reads/writes display" onclick="toggle_diskio();return false"><i class="toggle fa"></i></a></span>';

function selectInput(form) {
  if (form.input.value == 'text') {
    form.file.value = '';
    form.local.value = '';
    $('#file').hide();
    $('input[name="text"],input[name="copy"]').attr('type',$('input[name="showPass"]').prop('checked')?'text':'password');
    var item = $('input[name="confirmStart"]').length ? $('input[name="confirmStart"]') : $('#cmdStart');
    item.prop('disabled',$('#copy').is(':visible') ? (form.text.value!=form.copy.value || form.text.value=='') : form.text.value=='');
  } else {
    form.text.value = '';
    form.copy.value = '';
    $('#text').hide();
    $('#copy').hide();
    $('#file').show();
    $('#pass').hide();
    var item = $('input[name="confirmStart"]').length ? $('input[name="confirmStart"]') : $('#cmdStart');
    item.prop('disabled',!form.file.value);
  }
}
function getFileContent(event,form) {
  var input = event.target;
  var reader = new FileReader();
  reader.onload = function(){form.file.value=reader.result;selectInput(form);};
  reader.readAsDataURL(input.files[0]);
}
function prepareInput(form) {
  $(form).append('<input type="hidden" name="cmdStart" value="Start">');
  if (form.input === undefined) {
    form.submit();
    return;
  }
  form.input.disabled = true;
  form.local.disabled = true;
  form.file.disabled = true;
  form.text.disabled = true;
  form.copy.disabled = true;
  if (form.text.value) {
    var valid = new RegExp('^[ -~]+$');
    if (valid.test(form.text.value)) {
      $(form).append('<input type="hidden" name="luksKey" value="'+base64(form.text.value)+'">');
      form.submit();
    } else {
      form.input.disabled = false;
      form.local.disabled = false;
      form.file.disabled = false;
      form.text.disabled = false;
      form.copy.disabled = false;
      swal({title:"Printable Characters Only",text:"Use <b>ASCII</b> characters from space &apos; &apos; to tilde &apos;~&apos;<br>Otherwise use the <b>keyfile</b> method for UTF8 input",html:true,type:'error',confirmButtonText:"Ok"});
    }
    return;
  }
  var data = {};
  data['#file'] = 'unused';
  data['#include'] = 'webGui/include/KeyUpload.php';
  data['file'] = form.file.value;
  $.post('/update.php',data,function(){form.submit();});
}
function parityWarning(form) {
  if (form.md_invalidslot.checked) {
    var text = "<i>Dual parity</i> valid requires <b>ALL</b> disks in their original slots";
  } else {
    var text = "<i>Parity</i> disk(s) content will be overwritten";
  }
  swal({title:"Proceed to start",text:text,html:true,type:'warning',showCancelButton:true,confirmButtonText:"Proceed",cancelButtonText:"Cancel"},function(){prepareInput(form);});
}
function tab0() {
  $.removeCookie('one',{path:'/'});
  $.cookie('tab','tab0',{path:'/'});
}
function parityStatus() {
  $.post('/webGui/include/DeviceList.php',{path:'Main',device:'parity'},function(data) {
    if (data) {$.each(data.split(';'),function(k,v) {if ($('#line'+k).length>0) $('#line'+k).html(v);});}
    timers.parityStatus = setTimeout(parityStatus,3000);
    if (!data && $('#cancelButton').length>0 && $('#cancelButton').val()=="Cancel") {
      $('#cancelButton').val('Done').prop('onclick',null).off('click').click(function(){refresh();});
      $('#cancelText').html('');
      $('#line4').html("completed");
    }
  });
}
function stopArray(form) {
  $(form).append('<input type="hidden" name="cmdStop" value="Stop">');
  swal({title:"Proceed?",text:"This will stop the array",type:'warning',html:true,showCancelButton:true,confirmButtonText:"Proceed",cancelButtonText:"Cancel"},function(p){if (p) form.submit(); else $('input[name="cmdStop"]').remove();});
}
function stopParity(form,text) {
  $(form).append('<input type="hidden" name="cmdNoCheck" value="Cancel">');
  swal({title:"Proceed?",text:"This will stop the running operation: "+text,type:'warning',html:true,showCancelButton:true,confirmButtonText:"Proceed",cancelButtonText:"Cancel"},function(p){if (p) form.submit(); else $('input[name="cmdNoCheck"]').remove();});
}
function pauseParity(form) {
  $(form).append('<input type="hidden" name="cmdNoCheck" value="Pause">');
  $('#pauseButton').val("Resume").prop('onclick',null).off('click').click(function(){resumeParity(form);});
  form.submit();
}
function resumeParity(form) {
  $(form).append('<input type="hidden" name="cmdCheck" value="Resume">');
  $('#pauseButton').val("Pause").prop('onclick',null).off('click').click(function(){pauseParity(form);});
  form.submit();
}
function shutdown_now(form,cmd) {
  $(form).append('<input type="hidden" name="cmd" value="'+cmd+'">');
  switch (cmd) {
    case 'reboot': var text = "This will reboot the system"; break;
    case 'shutdown': var text = "This will shutdown the system"; break;
  }
  swal({title:"Proceed?",text:text,type:'warning',html:true,showCancelButton:true,confirmButtonText:"Proceed",cancelButtonText:"Cancel"},function(p){if (p) form.submit(); else $('input[name="cmd"]').remove();});
}
function toggleApply(checked) {
  $('input[name="#apply"]').prop('disabled',!checked);
}
parityStatus();
$('div[id=title]:not(":last, .disable_diskio")').each(function(){$(this).append(ctrl);});
$('.tooltip_diskio').tooltipster({delay:100,trigger:'custom',triggerOpen:{mouseenter:true},triggerClose:{click:false,scroll:true,mouseleave:true}});
toggle_diskio(true);
$(function(){
  var form = document.arrayOps;
  if (form.input !== undefined) selectInput(form);
});
function formatWarning(val) {
  if (val==true)
    swal({
      title:"Format Unmountable disks",
      text: "Create an empty file system on the disks shown as <b>Unmountable</b> discarding all data currently on the disks and update parity to reflect this. "+
            "This is typically done when a new disk is added to the array to get it ready for files to be written to it.<br>"+
            "<p><br>**WARNING**"+
            "<p>A format is <b>NEVER</b> part of a data recovery or disk rebuild process and if done in such circumstances will normally lead to loss of all data on the disks being formatted.",
      type: "warning",
      confirmButtonText:"Ok",
      html: true
    });
}
</script>

<form name="arrayOps" method="POST" action="/update.htm" target="progressFrame">
<input type="hidden" name="startState" value="STARTED">
<input type="hidden" name="file" value="">
<table class="array_status">

<p>    <tr><td><a class='info'><i class='fa fa-circle orb green-orb'></i><span>Started, array protected</span></a><strong>Started</strong></td>
    <td><input type="button" value="Stop" onclick="stopArray(this.form)"></td>
    <td id="stop"><strong>Stop</strong> will take the array off-line.</td></tr>
          <tr><td>Parity is valid.</td><td><input type="submit" name="cmdCheck" value="Check"></td><td><strong>Check</strong> will start <b>Parity-Check</b>.&nbsp;&nbsp;<a href="/Main/Settings/Scheduler">(Schedule)</a>
          <br><input type="checkbox" name="optionCorrect" value="correct" checked><small>Write corrections to parity</small></td></tr>
        <tr><td></td><td><input type="button" value="History" onclick="openBox('/webGui/include/ParityHistory.php','Parity/Read-Check History',600,900,false)"></td>
          <td class="wrap">Last check completed on <b>Tue 06 Jul 2021 12:03:14 AM AEST <span class='green-text'>(eleven days ago)</span></b><br>Finding <b>0</b> errors          <i class="fa fa-fw fa-clock-o"></i>Duration: 1 day, 5 hours, 25 minutes, 45 seconds. Average speed: 94.4 MB/sec</td></tr>
  <tr><td></td><td class="line" colspan="2"></td></tr></p>

</table>
</form>

<p><!-- markdown fix --></p>

<table class="array_status noshift">

<p><tr><td></td><td><input type="button" id="button-up" onclick="$('[id^=button-]').prop('disabled',true);toggle_state('up')" value="Spin Up"><input type="button" id="button-down" onclick="$('[id^=button-]').prop('disabled',true);toggle_state('down')" value="Spin Down"></td>
 <td><strong>Spin Up</strong> will immediately spin up all disks.<br><strong>Spin Down</strong> will immediately spin down all disks.</td></tr>
 <tr><td></td><td><input type="button" value="Clear Stats" onclick="toggle_state('Clear')"></td><td><strong>Clear Stats</strong> will immediately clear all disk statistics.</td></tr>
 <tr><td></td><td class="line" colspan="2"></td></tr></p>

</table>


<form name="mover_schedule" method="POST" action="/update.htm" target="progressFrame">
<table class="array_status noshift">

<p><tr><td></td>
 <td><input type="submit" name="cmdStartMover" value="Move"></td><td><strong>Move</strong> will immediately invoke the Mover.&nbsp;&nbsp;<a href="/Main/Settings/Scheduler">(Schedule)</a></td>
 </tr></p>

</table>
</form>

<p><!-- markdown fix --></p>

<form name="shutdownOps" method="POST" action="/webGui/include/Boot.php">
<table class="array_status noshift">

<p><tr><td></td><td><input type="button" name="reboot" value="Reboot" onclick="shutdown_now(this.form,'reboot')"><input type="button" name="shutdown" value="Shutdown" onclick="shutdown_now(this.form,'shutdown')"></td>
 <td><strong>Reboot</strong> will activate a <i>clean</i> system reset.<br><strong>Shutdown</strong> will activate a <i>clean</i> system power down.<br><input type="checkbox" name="safemode"><small>Reboot in safe mode</small></td></tr>
 <tr><td></td><td class="line" colspan="2"></td></tr></p>

</table>
</form>

<p><!-- markdown fix --></p>
<p><blockquote class='inline_help'>
  <p><strong>Colored Status Indicator</strong> the significance of the color indicator of the <em>Array</em> is as follows:</p>
  
  <p><i class='fa fa-circle orb green-orb'></i>Array is Started and Parity is valid.</p>
  
  <p><i class='fa fa-circle orb grey-orb'></i>Array is Stopped, Parity is valid.</p>
  
  <p><i class='fa fa-warning orb yellow-orb'></i>Array is Started, but Parity is invalid.</p>
  
  <p><i class='fa fa-warning orb grey-orb'></i>Array is Stopped, Parity is invalid.</p>
</blockquote>
</p>
</div></div>
<div class="spinner fixed"></div>
<form name="rebootNow" method="POST" action="/webGui/include/Boot.php"><input type="hidden" name="cmd" value="reboot"></form>
<iframe id="progressFrame" name="progressFrame" frameborder="0"></iframe>
<div id="footer"><span id="statusraid"><span id="statusbar"><span class='green strong'><i class='fa fa-play-circle'></i> Array Started</span></span></span><span id='countdown'></span><span id='user-notice' class='red-text'></span><span id='copyright'>Unraid&reg; webGui &copy;2021, Lime Technology, Inc. <a href='http://lime-technology.com/wiki/index.php/Official_Documentation' target='_blank' title="Online manual"><i class='fa fa-book'></i> manual</a></span></div><script>
// Firefox specific workaround
if (typeof InstallTrigger!=='undefined') $('#nav-block').addClass('mozilla');

function parseINI(data){
  var regex = {
    section: /^\s*\[\s*\"*([^\]]*)\s*\"*\]\s*$/,
    param: /^\s*([^=]+?)\s*=\s*\"*(.*?)\s*\"*$/,
    comment: /^\s*;.*$/
  };
  var value = {};
  var lines = data.split(/[\r\n]+/);
  var section = null;
  lines.forEach(function(line) {
    if (regex.comment.test(line)) {
      return;
    } else if (regex.param.test(line)) {
      var match = line.match(regex.param);
      if (section) {
        value[section][match[1]] = match[2];
      } else {
        value[match[1]] = match[2];
      }
    } else if (regex.section.test(line)) {
      var match = line.match(regex.section);
      value[match[1]] = {};
      section = match[1];
    } else if (line.length==0 && section) {
      section = null;
    };
  });
  return value;
}
// unraid animated logo
var unraid_logo = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 133.52 76.97" class="unraid_mark"><defs><linearGradient id="unraid_logo" x1="23.76" y1="81.49" x2="109.76" y2="-4.51" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e32929"/><stop offset="1" stop-color="#ff8d30"/></linearGradient></defs><path d="m70,19.24zm57,0l6.54,0l0,38.49l-6.54,0l0,-38.49z" fill="url(#unraid_logo)" class="unraid_mark_9"/><path d="m70,19.24zm47.65,11.9l-6.55,0l0,-23.79l6.55,0l0,23.79z" fill="url(#unraid_logo)" class="unraid_mark_8"/><path d="m70,19.24zm31.77,-4.54l-6.54,0l0,-14.7l6.54,0l0,14.7z" fill="url(#unraid_logo)" class="unraid_mark_7"/><path d="m70,19.24zm15.9,11.9l-6.54,0l0,-23.79l6.54,0l0,23.79z" fill="url(#unraid_logo)" class="unraid_mark_6"/><path d="m63.49,19.24l6.51,0l0,38.49l-6.51,0l0,-38.49z" fill="url(#unraid_logo)" class="unraid_mark_5"/><path d="m70,19.24zm-22.38,26.6l6.54,0l0,23.78l-6.54,0l0,-23.78z" fill="url(#unraid_logo)" class="unraid_mark_4"/><path d="m70,19.24zm-38.26,43.03l6.55,0l0,14.73l-6.55,0l0,-14.73z" fill="url(#unraid_logo)" class="unraid_mark_3"/><path d="m70,19.24zm-54.13,26.6l6.54,0l0,23.78l-6.54,0l0,-23.78z" fill="url(#unraid_logo)" class="unraid_mark_2"/><path d="m70,19.24zm-63.46,38.49l-6.54,0l0,-38.49l6.54,0l0,38.49z" fill="url(#unraid_logo)" class="unraid_mark_1"/></svg>';

var watchdog = new NchanSubscriber('/sub/var');
watchdog.on('message', function(data) {
  var ini = parseINI(data);
  var state = ini['fsState'];
  var progress = ini['fsProgress'];
  var status;
  if (state=='Stopped') {
    status = "<span class='red strong'><i class='fa fa-stop-circle'></i> Array Stopped</span>";
  } else if (state=='Started') {
    status = "<span class='green strong'><i class='fa fa-play-circle'></i> Array Started</span>";
  } else if (state=='Formatting') {
    status = "<span class='green strong'><i class='fa fa-play-circle'></i> Array Started</span>&bullet;<span class='orange strong'>Formatting device(s)</span>";
  } else {
    status = "<span class='orange strong'><i class='fa fa-pause-circle'></i> "+_('Array '+state)+"</span>";
  }
  if (ini['mdResyncPos']>0) {
    var action;
    if (ini['mdResyncAction'].indexOf("recon")>=0) action = "Parity-Sync / Data-Rebuild";
    else if (ini['mdResyncAction'].indexOf("clear")>=0) action = "Clearing";
    else if (ini['mdResyncAction']=="check") action = "Read-Check";
    else if (ini['mdResyncAction'].indexOf("check")>=0) action = "Parity-Check";
    action += " "+(ini['mdResyncPos']/(ini['mdResyncSize']/100+1)).toFixed(1)+" %";
    status += "&bullet;<span class='orange strong'>"+action.replace('.','.')+"</span>";
    if (ini['mdResync']==0) status += "(Paused)";
  }
  if (progress) status += "&bullet;<span class='blue strong'>"+_(progress)+"</span>";
  $('#statusbar').html(status);
});
var backtotopoffset = 250;
var backtotopduration = 500;
$(window).scroll(function() {
  if ($(this).scrollTop() > backtotopoffset) {
    $('.back_to_top').fadeIn(backtotopduration);
  } else {
    $('.back_to_top').fadeOut(backtotopduration);
  }
  var top = $('div#header').height()-1; // header height has 1 extra pixel to cover overlap
  $('div#menu').css($(this).scrollTop() > top ? {position:'fixed',top:'0'} : {position:'absolute',top:top+'px'});
});
$('.back_to_top').click(function(event) {
  event.preventDefault();
  $('html,body').animate({scrollTop:0},backtotopduration);
  return false;
});
$(function() {
  $('div.spinner.fixed').html(unraid_logo);
  setTimeout(function(){$('div.spinner').not('.fixed').each(function(){$(this).html(unraid_logo);});},500); // display animation if page loading takes longer than 0.5s
  shortcut.add('F1',function(){HelpButton();});
  $.post('/webGui/include/Notify.php',{cmd:'init'},function(){timers.notifier = setTimeout(notifier,0);});
  $('input[value="Apply"],input[value="Apply"],input[name="cmdEditShare"],input[name="cmdUserEdit"]').prop('disabled',true);
  $('form').find('select,input[type=text],input[type=number],input[type=password],input[type=checkbox],input[type=radio],input[type=file],textarea').each(function(){$(this).on('input change',function() {
    var form = $(this).parentsUntil('form').parent();
    form.find('input[value="Apply"],input[value="Apply"],input[name="cmdEditShare"],input[name="cmdUserEdit"]').not('input.lock').prop('disabled',false);
    form.find('input[value="Done"],input[value="Done"]').not('input.lock').val("Reset").prop('onclick',null).off('click').click(function(){refresh(form.offset().top)});
  });});

  var top = ($.cookie('top')||0) - $('.tabs').offset().top - 75;
  if (top>0) {$('html,body').scrollTop(top);}
  $.removeCookie('top',{path:'/'});
  if (location.pathname.search(/\/(AddVM|UpdateVM|AddContainer|UpdateContainer)/)==-1) {
    $('blockquote.inline_help').each(function(i) {
      $(this).attr('id','helpinfo'+i);
      var pin = $(this).prev();
      if (!pin.prop('nodeName')) pin = $(this).parent().prev();
      while (pin.prop('nodeName') && pin.prop('nodeName').search(/(table|dl)/i)==-1) pin = pin.prev();
      pin.find('tr:first,dt:last').each(function() {
        var node = $(this);
        var name = node.prop('nodeName').toLowerCase();
        if (name=='dt') {
          while (!node.html() || node.html().search(/(<input|<select|nbsp;)/i)>=0 || name!='dt') {
            if (name=='dt' && node.is(':first-of-type')) break;
            node = node.prev();
            name = node.prop('nodeName').toLowerCase();
          }
          node.css('cursor','help').click(function(){$('#helpinfo'+i).toggle('slow');});
        } else {
          if (node.html() && (name!='tr' || node.children('td:first').html())) node.css('cursor','help').click(function(){$('#helpinfo'+i).toggle('slow');});
        }
      });
    });
  }
  $('form').append($('<input>').attr({type:'hidden', name:'csrf_token', value:'18FA89EE4D74E62D'}));
  watchdog.start();
});
</script>
</body>
</html>
`;

export const dashboardHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
<title>Tower/Dashboard</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta http-equiv="Content-Security-Policy" content="block-all-mixed-content">
<meta name="format-detection" content="telephone=no">
<meta name="viewport" content="width=1600">
<meta name="robots" content="noindex, nofollow">
<meta name="referrer" content="same-origin">
<link type="image/png" rel="shortcut icon" href="/webGui/images/green-on.png">
<link type="text/css" rel="stylesheet" href="/webGui/styles/default-fonts.css?v=1607102280">
<link type="text/css" rel="stylesheet" href="/webGui/styles/default-cases.css?v=1586620022">
<link type="text/css" rel="stylesheet" href="/webGui/styles/font-awesome.css?v=1545863026">
<link type="text/css" rel="stylesheet" href="/webGui/styles/context.standalone.css?v=1616868912">
<link type="text/css" rel="stylesheet" href="/webGui/styles/jquery.sweetalert.css?v=1616868912">
<link type="text/css" rel="stylesheet" href="/webGui/styles/default-black.css?v=1603267810">
<link type="text/css" rel="stylesheet" href="/webGui/styles/dynamix-black.css?v=1606841542">

<style>
.inline_help{display:none}
.upgrade_notice{position:fixed;top:1px;left:0;width:100%;height:40px;line-height:40px;color:#e68a00;background:#feefb3;border-bottom:#e68a00 1px solid;text-align:center;font-size:1.4rem;z-index:999}
.upgrade_notice i{margin:14px;float:right;cursor:pointer}
.back_to_top{display:none;position:fixed;bottom:30px;right:12px;color:#e22828;font-size:2.5rem;z-index:999}
#header.image{background-image:url(/webGui/images/banner.png)}
</style>

<script src="/webGui/javascript/dynamix.js?v=1596576684"></script>
<script src="/webGui/javascript/translate.en_US.js?v=1589088326"></script>
<script>
Shadowbox.init({skipSetup:true});

// server uptime
var uptime = 1124295.63;
var expiretime = 0;
var before = new Date();

// page timer events
var timers = {};

function pauseEvents(id) {
  $.each(timers, function(i,timer){
    if (!id || i==id) clearTimeout(timer);
  });
}
function resumeEvents(id,delay) {
  var startDelay = delay||50;
  $.each(timers, function(i,timer) {
    if (!id || i==id) timers[i] = setTimeout(i+'()', startDelay);
    startDelay += 50;
  });
}
function plus(value,single,plural,last) {
  return value>0 ? (value+' '+(value==1?single:plural)+(last?'':', ')) : '';
}
function updateTime() {
  var now = new Date();
  var days = parseInt(uptime/86400);
  var hour = parseInt(uptime/3600%24);
  var mins = parseInt(uptime/60%60);
  $('span.uptime').html(((days|hour|mins)?plus(days,"day","days",(hour|mins)==0)+plus(hour,"hour","hours",mins==0)+plus(mins,"minute","minutes",true):"less than a minute"));
  uptime += Math.round((now.getTime() - before.getTime())/1000);
  before = now;
  if (expiretime > 0) {
    var remainingtime = expiretime - now.getTime()/1000;
    if (remainingtime > 0) {
      days = parseInt(remainingtime/86400);
      hour = parseInt(remainingtime/3600%24);
      mins = parseInt(remainingtime/60%60);
      if (days) {
        $('#licenseexpire').html(plus(days,"day","days",true)+" remaining");
      } else if (hour) {
        $('#licenseexpire').html(plus(hour,"hour","hours",true)+" remaining").addClass('orange-text');
      } else if (mins) {
        $('#licenseexpire').html(plus(mins,"minute","minutes",true)+" remaining").addClass('red-text');
      } else {
        $('#licenseexpire').html("less than a minute remaining").addClass('red-text');
      }
    } else {
      $('#licenseexpire').addClass('red-text');
    }
  }
  setTimeout(updateTime,1000);
}
function refresh(top) {
  if (typeof top === 'undefined') {
    for (var i=0,element; element=document.querySelectorAll('input,button,select')[i]; i++) { element.disabled = true; }
    for (var i=0,link; link=document.getElementsByTagName('a')[i]; i++) { link.style.color = "gray"; } //fake disable
    location = location;
  } else {
    $.cookie('top',top,{path:'/'});
    location = location;
  }
}
function initab() {
  $.removeCookie('one',{path:'/'});
  $.removeCookie('tab',{path:'/'});
}
function settab(tab) {
  $.cookie(($.cookie('one')==null?'tab':'one'),tab,{path:'/'});
}
function done(key) {
  var url = location.pathname.split('/');
  var path = '/'+url[1];
  if (key) for (var i=2; i<url.length; i++) if (url[i]==key) break; else path += '/'+url[i];
  $.removeCookie('one',{path:'/'});
  location.replace(path);
}
function chkDelete(form, button) {
  button.value = form.confirmDelete.checked ? "Delete" : "Apply";
  button.disabled = false;
}
function openBox(cmd,title,height,width,load,func,id) {
  // open shadowbox window (run in foreground)
  var uri = cmd.split('?');
  var run = uri[0].substr(-4)=='.php' ? cmd+(uri[1]?'&':'?')+'done=Done' : '/logging.htm?cmd='+cmd+'&csrf_token=18FA89EE4D74E62D&done=Done';
  var options = load ? (func ? {modal:true,onClose:function(){setTimeout(func+'('+'"'+(id||'')+'")',0);}} : {modal:true,onClose:function(){location=location;}}) : {modal:false};
  Shadowbox.open({content:run, player:'iframe', title:title, height:Math.min(height,screen.availHeight), width:Math.min(width,screen.availWidth), options:options});
}
function openWindow(cmd,title,height,width) {
  // open regular window (run in background)
  var window_name = title.replace(/ /g,"_");
  var form_html = '<form action="/logging.htm" method="post" target="'+window_name+'">'+'<input type="hidden" name="csrf_token" value="18FA89EE4D74E62D" />'+'<input type="hidden" name="title" value="'+title+'" />';
  var vars = cmd.split('&');
  form_html += '<input type="hidden" name="cmd" value="'+vars[0]+'">';
  for (var i = 1; i < vars.length; i++) {
    var pair = vars[i].split('=');
    form_html += '<input type="hidden" name="'+pair[0]+'" value="'+pair[1]+'">';
  }
  form_html += '</form>';
  var form = $(form_html);
  $('body').append(form);
  var top = (screen.availHeight-height)/2;
  if (top < 0) {top = 0; height = screen.availHeight;}
  var left = (screen.availWidth-width)/2;
  if (left < 0) {left = 0; width = screen.availWidth;}
  var options = 'resizeable=yes,scrollbars=yes,height='+height+',width='+width+',top='+top+',left='+left;
  window.open('', window_name, options);
  form.submit();
}
function showStatus(name,plugin,job) {
  $.post('/webGui/include/ProcessStatus.php',{name:name,plugin:plugin,job:job},function(status){$(".tabs").append(status);});
}
function showFooter(data, id) {
  if (id !== undefined) $('#'+id).remove();
  $('#copyright').prepend(data);
}
function showNotice(data) {
  $('#user-notice').html(data.replace(/<a>(.*)<\/a>/,"<a href='/Plugins'>$1</a>"));
}

// Banner warning system

var bannerWarnings = [];
var currentBannerWarning = 0;
var bannerWarningInterval = false;
var osUpgradeWarning = false;

function addBannerWarning(text,warning=true,noDismiss=false) {
  var cookieText = text.replace(/[^a-z0-9]/gi,'');
  if ($.cookie(cookieText) == "true") return false;
  if (warning) text = "<i class='fa fa-warning' style='float:initial;'></i> "+text;
  if ( bannerWarnings.indexOf(text) < 0 ) {
    var arrayEntry = bannerWarnings.push("placeholder") - 1;
    if (!noDismiss) text = text + "<a class='bannerDismiss' onclick='dismissBannerWarning("+arrayEntry+",&quot;"+cookieText+"&quot;)'></a>";
    bannerWarnings[arrayEntry] = text;
  } else return bannerWarnings.indexOf(text);

  if (!bannerWarningInterval) {
    showBannerWarnings();
    bannerWarningInterval = setInterval(showBannerWarnings,10000);
  }
  return arrayEntry;
}

function dismissBannerWarning(entry,cookieText) {
  $.cookie(cookieText,"true",{expires:365,path:'/'});
  removeBannerWarning(entry);
}

function removeBannerWarning(entry) {
  bannerWarnings[entry] = false;
  showBannerWarnings();
}

function bannerFilterArray(array) {
  var newArray = [];
  array.filter(function(value,index,arr) {
    if (value) newArray.push(value);
  });
  return newArray;
}

function showBannerWarnings() {
  var allWarnings = bannerFilterArray(Object.values(bannerWarnings));
  if (allWarnings.length == 0) {
    $(".upgrade_notice").hide();
    clearInterval(bannerWarningInterval);
    bannerWarningInterval = false;
    return;
  }
  if (currentBannerWarning >= allWarnings.length) currentBannerWarning = 0;
  $(".upgrade_notice").show().html(allWarnings[currentBannerWarning]);
  currentBannerWarning++;
}

function addRebootNotice(message="You must reboot for changes to take effect") {
  addBannerWarning("<i class='fa fa-warning' style='float:initial;'></i> "+message,false,true);
  $.post("/plugins/dynamix.plugin.manager/scripts/PluginAPI.php",{action:'addRebootNotice',message:message});
}

function removeRebootNotice(message="You must reboot for changes to take effect") {
  var bannerIndex = bannerWarnings.indexOf("<i class='fa fa-warning' style='float:initial;'></i> "+message);
  if ( bannerIndex < 0 ) {
    return;
  }
  removeBannerWarning(bannerIndex);
  $.post("/plugins/dynamix.plugin.manager/scripts/PluginAPI.php",{action:'removeRebootNotice',message:message});
}

function showUpgrade(text,noDismiss=false) {
  if ($.cookie('os_upgrade')==null) {
    if (osUpgradeWarning) removeBannerWarning(osUpgradeWarning);
    osUpgradeWarning = addBannerWarning(text.replace(/<a>(.*)<\/a>/,"<a href='#' onclick='openUpgrade()'>$1</a>").replace(/<b>(.*)<\/b>/,"<a href='#' onclick='document.rebootNow.submit()'>$1</a>"),false,noDismiss);
  }
}
function hideUpgrade(set) {
  removeBannerWarning(osUpgradeWarning);
  if (set)
    $.cookie('os_upgrade','true',{path:'/'});
  else
    $.removeCookie('os_upgrade',{path:'/'});
}
function openUpgrade() {
  hideUpgrade();
  swal({title:"Update Unraid OS",text:"Do you want to update to the new version?",type:'warning',html:true,showCancelButton:true,confirmButtonText:"Proceed",cancelButtonText:"Cancel"},function(){
    openBox("/plugins/dynamix.plugin.manager/scripts/plugin&arg1=update&arg2=unRAIDServer.plg","Update Unraid OS",600,900,true);
  });
}
function notifier() {
  var tub1 = 0, tub2 = 0, tub3 = 0;
  $.post('/webGui/include/Notify.php',{cmd:'get'},function(json) {
    if (json && /^<!DOCTYPE html>/.test(json)) {
      // Session is invalid, user has logged out from another tab
      $(location).attr('href','/');
    }
    var data = $.parseJSON(json);
    $.each(data, function(i, notify) {
      $.jGrowl(notify.subject+'<br>'+notify.description, {
        group: notify.importance,
        header: notify.event+': '+notify.timestamp,
        theme: notify.file,
        click: function(e,m,o) { if (notify.link) location=notify.link;},
        beforeOpen: function(e,m,o){if ($('div.jGrowl-notification').hasClass(notify.file)) return(false);},
        beforeClose: function(e,m,o){$.post('/webGui/include/Notify.php',{cmd:'archive',file:notify.file});},
        afterOpen: function(e,m,o){if (notify.link) $(e).css("cursor","pointer");}
      });
    });
    timers.notifier = setTimeout(notifier,5000);
  });
}
function digits(number) {
  if (number < 10) return 'one';
  if (number < 100) return 'two';
  return 'three';
}
function openNotifier(filter) {
  $.post('/webGui/include/Notify.php',{cmd:'get'},function(json) {
    var data = $.parseJSON(json);
    $.each(data, function(i, notify) {
      if (notify.importance == filter) {
        $.jGrowl(notify.subject+'<br>'+notify.description, {
          group: notify.importance,
          header: notify.event+': '+notify.timestamp,
          theme: notify.file,
          click: function(e,m,o) { if (notify.link) location=notify.link;},
          beforeOpen: function(e,m,o){if ($('div.jGrowl-notification').hasClass(notify.file)) return(false);},
          beforeClose: function(e,m,o){$.post('/webGui/include/Notify.php',{cmd:'archive',file:notify.file});},
          afterOpen: function(e,m,o){if (notify.link) $(e).css("cursor","pointer");}
        });
      }
    });
  });
}
function closeNotifier(filter) {
  clearTimeout(timers.notifier);
  $.post('/webGui/include/Notify.php',{cmd:'get'},function(json) {
    var data = $.parseJSON(json);
    $.each(data, function(i, notify) {
      if (notify.importance == filter) $.post('/webGui/include/Notify.php',{cmd:'archive',file:notify.file});
    });
    $('div.jGrowl').find('.'+filter).find('div.jGrowl-close').trigger('click');
    setTimeout(notifier,100);
  });
}
function viewHistory(filter) {
  location.replace('/Tools/NotificationsArchive?filter='+filter);
}
$(function() {
  var tab = $.cookie('one')||$.cookie('tab')||'tab1';
  if (tab=='tab0') tab = 'tab'+$('input[name$="tabs"]').length; else if ($('#'+tab).length==0) {initab(); tab = 'tab1';}
  if ($.cookie('help')=='help') {$('.inline_help').show(); $('#nav-item.HelpButton').addClass('active');}
  $('#'+tab).attr('checked', true);
  updateTime();
  $.jGrowl.defaults.closeTemplate = '<i class="fa fa-close"></i>';
  $.jGrowl.defaults.closerTemplate = '<div class="top">[ close all notifications ]</div>';
  $.jGrowl.defaults.sticky = true;
  $.jGrowl.defaults.check = 100;
  $.jGrowl.defaults.position = 'top-right';
  $.jGrowl.defaults.themeState = '';
  Shadowbox.setup('a.sb-enable', {modal:true});
});
var mobiles=['ipad','iphone','ipod','android'];
var device=navigator.platform.toLowerCase();
for (var i=0,mobile; mobile=mobiles[i]; i++) {
  if (device.indexOf(mobile)>=0) {$('#footer').css('position','static'); break;}
}
$.ajaxPrefilter(function(s, orig, xhr){
  if (s.type.toLowerCase() == "post" && !s.crossDomain) {
    s.data = s.data || "";
    s.data += s.data?"&":"";
    s.data += "csrf_token=18FA89EE4D74E62D";
  }
});

// add any pre-existing reboot notices  
$(function() {
});
</script>
</head>
<body>
 <div id="template">
  <div class="upgrade_notice" style="display:none"></div>
  <div id="header" class="">
   <div class="logo">
   <a href="https://unraid.net" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 222.36 39.04"><defs><linearGradient id="header-logo" x1="47.53" y1="79.1" x2="170.71" y2="-44.08" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e32929"/><stop offset="1" stop-color="#ff8d30"/></linearGradient></defs><title>unraid.net</title><path d="M146.7,29.47H135l-3,9h-6.49L138.93,0h8l13.41,38.49h-7.09L142.62,6.93l-5.83,16.88h8ZM29.69,0V25.4c0,8.91-5.77,13.64-14.9,13.64S0,34.31,0,25.4V0H6.54V25.4c0,5.17,3.19,7.92,8.25,7.92s8.36-2.75,8.36-7.92V0ZM50.86,12v26.5H44.31V0h6.11l17,26.5V0H74V38.49H67.9ZM171.29,0h6.54V38.49h-6.54Zm51.07,24.69c0,9-5.88,13.8-15.17,13.8H192.67V0H207.3c9.18,0,15.06,4.78,15.06,13.8ZM215.82,13.8c0-5.28-3.3-8.14-8.52-8.14h-8.08V32.77h8c5.33,0,8.63-2.8,8.63-8.08ZM108.31,23.92c4.34-1.6,6.93-5.28,6.93-11.55C115.24,3.68,110.18,0,102.48,0H88.84V38.49h6.55V5.66h6.87c3.8,0,6.21,1.82,6.21,6.71s-2.41,6.76-6.21,6.76H98.88l9.21,19.36h7.53Z" fill="url(#header-logo)"/></svg>
</a>
   Version: 6.9.2&nbsp;<a href='#' title='View Release Notes' onclick="openBox('/plugins/dynamix.plugin.manager/include/ShowChanges.php?tmp=1&file=/var/tmp/unRAIDServer.txt','Release Notes',600,900);return false"><span class='fa fa-info-circle fa-fw'></span></a>   </div>
   <div class="block">
    <span class="text-left">Server<br>Description<br>Registration<br>Uptime</span>
    <span class="text-right">Tower &bullet; 192.168.1.200<br/>Media server<br/>
    <a href="/Tools/Registration" title="Go to Registration page">Unraid OS <span id="licensetype">Plus</span><span id="licenseexpire"></span></a><br/>
    <span class="uptime"></span></span>
   </div>
  </div>
  <a href="#" class="back_to_top" title="Back To Top"><i class="fa fa-arrow-circle-up"></i></a>
<div id='menu'><div id='nav-block'><div id='nav-left'><div id='nav-item' class='active'><a href='/Dashboard' onclick='initab()'>Dashboard</a></div><div id='nav-item'><a href='/Main' onclick='initab()'>Main</a></div><div id='nav-item'><a href='/Shares' onclick='initab()'>Shares</a></div><div id='nav-item'><a href='/Users' onclick='initab()'>Users</a></div><div id='nav-item'><a href='/Settings' onclick='initab()'>Settings</a></div><div id='nav-item'><a href='/Plugins' onclick='initab()'>Plugins</a></div><div id='nav-item'><a href='/Docker' onclick='initab()'>Docker</a></div><div id='nav-item'><a href='/VMs' onclick='initab()'>VMs</a></div><div id='nav-item'><a href='/Apps' onclick='initab()'>Apps</a></div><div id='nav-item'><a href='/Stats' onclick='initab()'>Stats</a></div><div id='nav-item'><a href='/Tools' onclick='initab()'>Tools</a></div></div><div id='nav-right'><script>
// hide switch button when no other language packs
$(function(){$('#nav-item.LanguageButton').hide();});

function LanguageButton() {
  var locale = '';
  if (locale) {
    switchLanguage('');
    $.cookie('locale',locale,{path:'/'});
  } else {
    switchLanguage($.cookie('locale'));
    $.removeCookie('locale');
  }
}

function switchLanguage(lang) {
  $.post('/webGui/include/LanguageReset.php',{lang:lang},function(){location.reload();});
}
</script><div id='nav-item' class='LanguageButton util'><a href='#' onclick='LanguageButton();return false;' title="Switch Language"><i class='icon-u-switch system'></i><span>Switch Language</span></a></div><script>if (typeof _ != 'function') function _(t) {return t;}</script><script>
function systemTemp() {
  $.post('/plugins/dynamix.system.temp/include/SystemTemp.php',{unit:'C',dot:'.'},function(data) {
    showFooter(data,'temp');
    if ($('#mb-temp').length) {
      var temp = $('span#temp').text();
      var unit = temp.indexOf('C')>0 ? 'C' : 'F';
      temp = temp.split(unit);
      if (temp[0]) $('#cpu-temp').html('Temperature: '+temp[0]+unit);
      if (temp[1]) $('#mb-temp').html('Temperature: '+temp[1]+unit);
    }
    timers.systemTemp = setTimeout(systemTemp,10000);
  });
}
setTimeout(systemTemp,100);
</script>
<div id='nav-user'></div><script>
function LogoutButton() {
  var id = window.setTimeout(null,0);
  while (id--) window.clearTimeout(id);
  window.location.href = '/logout';
}
</script>
<div id='nav-item' class='LogoutButton util'><a href='#' onclick='LogoutButton();return false;' title="Logout"><i class='icon-u-logout system'></i><span>Logout</span></a></div><script>
function TerminalButton() {
  if (/MSIE|Edge/.test(navigator.userAgent)) {
    swal({title:"Unsupported Feature",text:"Sorry, this feature is not supported by MSIE/Edge.<br>Please try a different browser",html:true,type:'error',confirmButtonText:"Ok"});
    return;
  }
  var d = new Date();
  var height = 600;
  var width = 900;
  var top = (screen.height-height)/2;
  var left = (screen.width-width)/2;
  window.open('/webterminal/', 'Web Terminal '+d.getTime(), 'resizeable=yes,scrollbars=yes,height='+height+',width='+width+',top='+top+',left='+left).focus();
}
</script>
<div id='nav-item' class='TerminalButton util'><a href='/webterminal/' onclick='TerminalButton();return false;' title="Terminal"><i class='icon-u-terminal system'></i><span>Terminal</span></a></div><script>
function FeedbackButton() {
  openBox("/webGui/include/Feedback.php","Feedback",600,600,false);
}
</script><div id='nav-item' class='FeedbackButton util'><a href='#' onclick='FeedbackButton();return false;' title="Feedback"><i class='icon-u-chat system'></i><span>Feedback</span></a></div><script>
function InfoButton() {
  openBox("/webGui/include/SystemInformation.php?more=/Tools/SystemProfiler","System Information",600,600);
}
</script><div id='nav-item' class='InfoButton util'><a href='#' onclick='InfoButton();return false;' title="Info"><i class='icon-u-display system'></i><span>Info</span></a></div><script>
function LogButton() {
  openWindow("/webGui/scripts/tail_log&arg1=syslog&arg2=","System Log",600,900);
}
</script>
<div id='nav-item' class='LogButton util'><a href='#' onclick='LogButton();return false;' title="Log"><i class='icon-u-log system'></i><span>Log</span></a></div><script>
function HelpButton() {
  if ($('#nav-item.HelpButton').toggleClass('active').hasClass('active')) {
    $('.inline_help').show('slow');
    $.cookie('help','help',{path:'/'});
  } else {
    $('.inline_help').hide('slow');
    $.removeCookie('help',{path:'/'});
  }
}
</script><div id='nav-item' class='HelpButton util'><a href='#' onclick='HelpButton();return false;' title="Help"><i class='icon-u-help system'></i><span>Help</span></a></div><script type="text/javascript">
	ud_url = location.pathname.split('/');
	if (ud_url[1] == "Main" && ud_url.length > 2)
	{
		var InitTab = $.cookie('tab');
		$.cookie('tab','tab1',{path:'/'});
		$(window).unload(function() {
			$.cookie('one',InitTab,{path:'/'});
		});
	}
</script>
<div id='nav-user'></div>

<div id='nav-user'></div>

<script>
if ( typeof addRebootNotice !== "function" ) {
// add any pre-existing reboot notices	
	$(function() {
	});
	
	function addRebootNotice(message="You must reboot for changes to take effect") {
		addBannerWarning(message,true,true);
		$.post("/plugins/community.applications/scripts/PluginAPI.php",{action:'addRebootNotice',message:message});
	}
}
</script><div id='nav-user'></div><style>
/* Additional CSS for when user supplies element */
.ca_element_notice{padding-right:20px;width:100%;height:40px;line-height:40px;color:#e68a00;background:#feefb3;border-bottom:#e68a00 1px solid;text-align:center;font-size:1.4rem;z-index:900;display:none;}
.ca_PluginUpdateDismiss{float:right;margin-right:20px;cursor:pointer;}
.ca_pluginUpdateInfo{cursor:pointer;}
.ca_PluginUpdateInstall{cursor:pointer;}
a.bannerInfo {cursor:pointer;text-decoration:none;}
.bannerInfo::before {content:"\f05a";font-family:fontAwesome;color:#e68a00;}
</style>
<script>

function ca_hidePluginUpdate(plugin,version,element) {
	$.cookie(plugin,version);
	$(element).hide();
}

function ca_pluginUpdateInstall(plugin) {
	openBox("/plugins/dynamix.plugin.manager/scripts/plugin&arg1=update&arg2="+plugin,"Installing Update",600,900,true,"window.location.reload()");
}

function ca_pluginUpdateShowInfo(cmd,title,height,width,load,func,id) {
	// open shadowbox window (run in foreground)
	var run = cmd.split('?')[0].substr(-4)=='.php' ? cmd : '/logging.htm?cmd='+cmd+'&csrf_token=18FA89EE4D74E62D';
	var options = load ? (func ? {modal:true,onClose:function(){setTimeout(func+'('+'"'+(id||'')+'")',0);}} : {modal:false,onClose:function(){location=location;}}) : {modal:false};
	Shadowbox.open({content:run, player:'iframe', title:title, height:Math.min(height,screen.availHeight), width:Math.min(width,screen.availWidth), options:options});
}

function caPluginUpdateCheck(plugin,options=[],callback) {
	var pluginFilename = plugin.substr(0, plugin.lastIndexOf("."));
	console.time("checkPlugin "+plugin);
	console.log("checkPlugin  "+plugin);
	$.post("/plugins/dynamix.plugin.manager/scripts/PluginAPI.php",{action:'checkPlugin',options:{plugin:plugin,name:options.name}},function(caAPIresult) {
		console.groupCollapsed("Result checkPlugin "+plugin);
		console.log(caAPIresult);
		console.timeEnd("checkPlugin "+plugin);
		console.groupEnd();
		var result = JSON.parse(caAPIresult);

		if ( options.debug == true ) result.updateAvailable = true;
		if ( ! options.element && ! options.dontShow ) {
			if ( result.updateAvailable ) {
				var HTML = result.updateMessage+" <a class='ca_PluginUpdateInstall' onclick='ca_pluginUpdateInstall(&quot;"+plugin+"&quot;);'>"+result.linkMessage+"</a> <a class='bannerInfo fa fa-info-circle' onclick='ca_pluginUpdateShowInfo(&quot;/plugins/dynamix.plugin.manager/include/ShowChanges.php?file=%2Ftmp%2Fplugins%2F"+pluginFilename+".txt&quot;,&quot;Release Notes&quot;,600,900); return false;'></a>";
				addBannerWarning(HTML,false,options.noDismiss);
			}
		} else {
			if ( $.cookie(plugin) != result.version ) {
				if ( result.updateAvailable ) {
					var HTML = result.updateMessage+" <a class='ca_PluginUpdateInstall' onclick='ca_pluginUpdateInstall(&quot;"+plugin+"&quot;);'>"+result.linkMessage+"</a> <a class='bannerInfo fa fa-info-circle' onclick='ca_pluginUpdateShowInfo(&quot;/plugins/dynamix.plugin.manager/include/ShowChanges.php?file=%2Ftmp%2Fplugins%2F"+pluginFilename+".txt&quot;,&quot;Release Notes&quot;,600,900); return false;'></a>";
					if ( ! options.noDismiss ) {
						HTML = HTML.concat("<span class='ca_PluginUpdateDismiss'><i class='fa fa-close' onclick='ca_hidePluginUpdate(&quot;"+plugin+"&quot;,&quot;"+result.version+"&quot;,&quot;"+options.element+"&quot;);'></i>");
					}
					result.HTML = HTML;

					if ( ! options.dontShow ) {
						$(options.element).html(HTML);
						$(options.element).addClass("ca_element_notice").show();
					}
				}
			}
		}
		if ( typeof options === "function" ) {
			callback = options;
		}
		if ( typeof callback === "function" ) {
			callback(JSON.stringify(result));
		}
	});
}

</script>
<div id='nav-user'></div></div></div></div><div class='tabs'><p></p>

<link type="text/css" rel="stylesheet" href="/webGui/styles/jquery.switchbutton.css?v=1548293345">

<link type="text/css" rel="stylesheet" href="/webGui/styles/jquery.ui.css?v=1594915397">

<style>
div.frame{float:left;margin:14px 0}
div#iframe-popup{display:none;-webkit-overflow-scrolling:touch}
div.last{padding-bottom:12px}
div.left{float:left;width:66%;margin-top:-12px}
div.right{float:right;margin:-20px 0 0 0;text-align:center}
.section,.next{cursor:grab}
span.ctrl{float:right;margin-right:10px}
span.outer{float:left}
span.inner{width:140px}
span.ups{width:200px;display:inline-block}
span.tx{width:75px;display:inline-block}
span.busy,i.inactive{opacity:0.5}
span#inbound{width:75px;display:inline-block}
span#load{width:120px;display:inline-block}
span#util{margin-left:20px}
span[id^=cpu],span[id^=sys]{width:0}
i.heat{margin-left:8px}
a.cpu_close,span.hand{cursor:pointer}
tr.hidden{display:none;height:0;lineheight:0}
td.none{text-align:center;padding-top:12px}
input[value=Edit]{margin:12px 0 0 0;padding:5px 10px}
.sys_view,.mb_view,.cpu_view,.cpu_open,.mem_view,.port_view,.ups_view,.fan_view,.docker_view,.vm_view,.parity_view,.array_view,.my_view,.extra_view{display:none}
.share1,.share2,.share3,.view1,.view2,.view3,.user1,.user2,.user3{display:none}
#shares_view_on,#users_view_on,#array_view_on,#extra_view_on{display:none}
._cache_view{display:none}
#_cache_view_on{display:none}
form[name=boot]{display:none}
.flat{height:0;lineheight:0}
.wrap{white-space:normal}
.switch-button-background{top:12px}
</style>

<p><script src="/webGui/javascript/jquery.switchbutton.js?v=1535741906"></script>
<script src="/plugins/dynamix.docker.manager/javascript/docker.js?v=1603557863"></script>
<script src="/plugins/dynamix.vm.manager/javascript/vmmanager.js?v=1584605456"></script></p>


<div class='frame'>
<table id='db-box1' class='share_status dashboard box1'>
<thead sort='0' class='sortable'><tr><td></td><td colspan='3' class='next'>Tower<i class='fa fa-fw chevron mt0' id='sys_view' onclick='toggleChevron("sys_view",0)'></i>
<a href='/Dashboard/Settings/Identification' title="Go to identification settings"><i class='fa fa-fw fa-cog chevron mt0'></i></a>
<span class='ctrl'>
<span class='fa fa-fw fa-stop-circle hand' title="Stop the array" onclick='StopArray()'></span>
<span class='fa fa-fw fa-refresh hand' title="Reboot the system" onclick='Reboot()'></span>
<span class='fa fa-fw fa-power-off hand' title="Shutdown the system" onclick='Shutdown()'></span></span>
</td><td></td></tr></thead>
<tbody sort='0' class='sys_view sortable'>
<tr><td></td><td colspan='3'>
<div class='left'>
<span class='header'>Description</span><span class='text'><br>
Media server<br>
Custom<br><br></span>
<span class='header'>Registration</span><br>Unraid OS <b><em>Plus</em></b><br><br>
<span class='header'>Uptime</span><br><span class='uptime'></span>
</div>
<div class='right'>
<span id='casing'>
<i id='mycase' class='case-mid-tower'></i><br>
</span>
<input type='button' value="Edit" style="margin-right:0" onclick='openBox("/webGui/include/SelectCase.php?file=case-model.cfg&csrf=18FA89EE4D74E62D","Select Case Model",700,980,true,"setCase");return false'>
</div>
</td><td></td></tr>
</tbody>
<thead sort='1'><tr class='hidden'><td></td><td colspan='3'></td><td></td></tr></thead>
<tbody sort='1' class='sortable'>
<tr><td></td><td colspan='3' class='next'><i class='icon-motherboard'></i><div class='section'>Motherboard<br><span id='mb-temp'></span><br><br></div>
<i class='fa fa-fw chevron' id='mb_view' onclick='toggleChevron("mb_view",0)'></i>
<a href='#' onclick='InfoButton();' title="Show Information"><i class='fa fa-fw fa-info-circle chevron'></i></a>
</td><td></td></tr>
<tr class='mb_view'><td></td><td colspan='3'>ASRock Z390 Pro4<br>American Megatrends Inc., Version P4.40<br>BIOS dated: Mon 02 Dec 2019 12:00:00 AM AEDT</td><td></td></tr>
</tbody>
<thead sort='2'><tr class='hidden'><td></td><td colspan='3'></td><td></td></tr></thead>
<tbody sort='2' class='sortable'>
<tr><td></td><td colspan='3' class='next'><i class='icon-cpu'></i><div class='section'>Processor<br>
<span id='load'>Load: <span class='cpu'>0%</span></span><span id='cpu-temp'></span><br><br></div>
<i class='fa fa-fw chevron' id='cpu_view' onclick='toggleChevron("cpu_view",1)'></i>
<a href='/Dashboard/Settings/CPUset' title="Go to CPU pinning settings"><i class='fa fa-fw fa-cog chevron'></i></a>
</td><td></td></tr>
<tr class='cpu_view'><td></td><td colspan='3'>Intel&#174; Core&#8482; i5-9600K CPU @ 3.70GHz<br>
<a onclick='toggleCPU()' title="Click to toggle details" class='cpu_close'>Show details</a></td><td></td></tr>
<tr class='cpu_open'><td></td><td>Overall Load:</td>
<td colspan='2'><span class='cpu load'>0%</span><div class='usage-disk sys'><span id='cpu'></span><span></span></div></td><td></td></tr>
<tr class='cpu_open'><td></td><td>CPU 0</td><td colspan='2'><span class='cpu0 load'>0%</span><div class='usage-disk sys'><span id='cpu0'></span><span></span></div></td><td></td></tr><tr class='cpu_open'><td></td><td>CPU 1</td><td colspan='2'><span class='cpu1 load'>0%</span><div class='usage-disk sys'><span id='cpu1'></span><span></span></div></td><td></td></tr><tr class='cpu_open'><td></td><td>CPU 2</td><td colspan='2'><span class='cpu2 load'>0%</span><div class='usage-disk sys'><span id='cpu2'></span><span></span></div></td><td></td></tr><tr class='cpu_open'><td></td><td>CPU 3</td><td colspan='2'><span class='cpu3 load'>0%</span><div class='usage-disk sys'><span id='cpu3'></span><span></span></div></td><td></td></tr><tr class='cpu_open'><td></td><td>CPU 4</td><td colspan='2'><span class='cpu4 load'>0%</span><div class='usage-disk sys'><span id='cpu4'></span><span></span></div></td><td></td></tr><tr class='cpu_open'><td></td><td>CPU 5</td><td colspan='2'><span class='cpu5 load'>0%</span><div class='usage-disk sys'><span id='cpu5'></span><span></span></div></td><td></td></tr></tbody>
<thead sort='3'><tr class='hidden'><td></td><td colspan='3'></td><td></td></tr></thead>
<tbody sort='3' class='sortable'>
<tr><td></td><td colspan='3' class='next'><i class='icon-ram'></i><div class='section'>Memory<br><span>16 GiB DDR4 <span id='util'>Utilization: <span class='sys0'>0%</span></span><br><br></div>
<i class='fa fa-fw chevron' id='mem_view' onclick='toggleChevron("mem_view",0)'></i>
<a href='/Dashboard/Tools/Processes' title="View Running Processes"><i class='fa fa-fw fa-info-circle chevron'></i></a>
</td><td></td></tr>
<tr class='mem_view'><td></td><td>Maximum size: 64 GiB</td><td><i class='mm'>RAM</i><span class='sys0 load'>0%</span><div class='usage-disk sys'><span id='sys0'></span><span></span></div></td>
<td><i class='mm'>Flash</i><span class='sys1 load'>0%</span><div class='usage-disk sys'><span id='sys1'></span><span></span></div></td><td></td></tr>
<tr class='mem_view'><td></td><td>Usable size: 15.3 GiB</td><td><i class='mm'>Log</i><span class='sys2 load'>0%</span><div class='usage-disk sys'><span id='sys2'></span><span></span></div></td>
<td><i class='mm'>Docker</i><span class='sys3 load'>0%</span><div class='usage-disk sys'><span id='sys3'></span><span></span></div></td><td></td></tr>
</tbody>
<thead sort='4'><tr class='hidden'><td></td><td colspan='3'></td><td></td></tr></thead>
<tbody sort='4' class='sortable'>
<tr><td></td><td colspan='3' class='next'><i class='icon-ethernet'></i><div class='section'>Interface<br>
<select name="port_select" onchange="portSelect(this.value)">
<option value='bond0'>bond0</option><option value='eth0'>eth0</option><option value='lo'>lo</option></select>
<span>Inbound: <span id='inbound'>---</span>Outbound: <span id='outbound'>---</span></span><br><br></div>
<i class='fa fa-fw chevron' id='port_view' onclick='toggleChevron("port_view",2)'></i>
<a href='/Dashboard/Settings/NetworkSettings' title="Go to network settings"><i class='fa fa-fw fa-cog chevron'></i></a>
</td><td></td></tr>
<tr class='port_view'><td></td>
<td><select class='port_view' name="enter_view" onchange="changeView(this.value)">
<option value='0'>General info</option><option value='1'>Counters info</option><option value='2'>Errors info</option></select></td>
<td><i class='view1'>Mode of operation</i><i class='view2'>Received packets</i><i class='view3'>Receive counters</i></td>
<td><i class='view1'></i><i class='view2'>Transmitted packets</i><i class='view3'>Transmit counters</i></td><td></td></tr>
<tr class='view1'><td></td><td>bond0</td><td colspan='2' id='main0'></td><td></td></tr><tr class='view1'><td></td><td>eth0</td><td colspan='2' id='main1'></td><td></td></tr><tr class='view1 last'><td></td><td>lo</td><td colspan='2' id='main2'></td><td></td></tr><tr class='view2'><td></td><td>bond0</td><td id='port0'></td><td id='port1'></td><td></td></tr><tr class='view2'><td></td><td>eth0</td><td id='port2'></td><td id='port3'></td><td></td></tr><tr class='view2 last'><td></td><td>lo</td><td id='port4'></td><td id='port5'></td><td></td></tr><tr class='view3'><td></td><td>bond0</td><td id='link0'></td><td id='link1'></td><td></td></tr><tr class='view3'><td></td><td>eth0</td><td id='link2'></td><td id='link3'></td><td></td></tr><tr class='view3'><td></td><td>lo</td><td id='link4'></td><td id='link5'></td><td></td></tr></tbody>
<thead sort='5'><tr class='hidden'><td></td><td colspan='3'></td><td></td></tr></thead>
<tbody sort='5' class='sortable'>
<tr><td></td><td colspan='3' class='next'><i class='icon-fan'></i><div class='section'>Airflow<br><span>Fan count: 3</span><br><br></div>
<i class='fa fa-fw chevron' id='fan_view' onclick='toggleChevron("fan_view",0)'></i>
</td><td></td></tr>
<tr class='fan_view'><td></td><td>FAN 0</td><td>FAN 1</td><td>FAN 2</td><tr class='fan_view'><td></td><td id='fan0'></td><td id='fan1'></td><td id='fan2'></td><td></td></tbody>
</table>

<table id='db-box3' class='share_status dashboard box3'>
<thead sort='0' class='sortable'><tr><td></td><td colspan='4' class='next'>Docker Containers<i class='fa fa-fw chevron mt0' id='docker_view' onclick='toggleChevron("docker_view",0)'></i>
<a href='/Dashboard/Settings/DockerSettings' title="Go to Docker settings"><i class='fa fa-fw fa-cog chevron mt0'></i></a>
<span class='info apps'><input type='checkbox' id='apps'></span></td><td></td></tr></thead>
<tbody sort='0' class='docker_view sortable'></tbody>
<thead sort='1' class='sortable'><tr><td></td><td colspan='4' class='next'>Virtual Machines<i class='fa fa-fw chevron mt0' id='vm_view' onclick='toggleChevron("vm_view",0)'></i>
<a href='/Dashboard/Settings/VMSettings' title="Go to VM settings"><i class='fa fa-fw fa-cog chevron mt0'></i></a>
<span class='info vms'><input type='checkbox' id='vms'></span></td><td></td></tr></thead>
<tbody sort='1' class='vm_view sortable'></tbody>
<thead sort='2' class='sortable'><tr><td></td><td colspan='4' class='next'>Shares<i class='fa fa-fw chevron mt0' id='shares_view' onclick='toggleChevron("shares_view",4)'></i>
<a href='/Shares' title="Go to Share settings"><i class='fa fa-fw fa-cog chevron mt0'></i></a><span class='info'>Share count: 13 with 0 cache only and 0 encrypted</span>
<select name="enter_share" onchange="changeMode(this.value)">
<option value='0'>SMB</option></select>
</td><td></td></tr>
<tr id='shares_view_on'><td></td><td>Name</td><td>Description</td><td>Security</td><td>Streams</td><td></td></tr>
</thead>
<tbody sort='2' class='smb share share1 sortable'><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=Data" class="blue-text" title="Data settings">Data</a></td><td></td><td>Public</td><td id='share1'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=DockerBackup" class="blue-text" title="DockerBackup settings">DockerBackup</a></td><td></td><td>Public</td><td id='share2'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=Movies" class="blue-text" title="Movies settings">Movies</a></td><td>ISO images</td><td>Public</td><td id='share3'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=My+Media" class="blue-text" title="My Media settings">My Media</a></td><td></td><td>Public</td><td id='share4'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=TV" class="blue-text" title="TV settings">TV</a></td><td></td><td>Public</td><td id='share5'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=aotm" class="blue-text" title="aotm settings">aotm</a></td><td></td><td><em>Private</em></td><td id='share6'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=appdata" class="blue-text" title="appdata settings">appdata</a></td><td>application data</td><td>-</td><td id='share7'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=backup" class="blue-text" title="backup settings">backup</a></td><td></td><td>Public</td><td id='share8'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=domains" class="blue-text" title="domains settings">domains</a></td><td>saved VM instances</td><td>-</td><td id='share9'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=isos" class="blue-text" title="isos settings">isos</a></td><td>ISO images</td><td>-</td><td id='share10'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=system" class="blue-text" title="system settings">system</a></td><td>system data</td><td>-</td><td id='share11'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=vm" class="blue-text" title="vm settings">vm</a></td><td></td><td>Public</td><td id='share12'>0</td><td></td></tr><tr><td></td><td><i class='icon-folder'></i><a href="/Dashboard/Shares/Share?name=yctm" class="blue-text" title="yctm settings">yctm</a></td><td></td><td><em>Secure</em></td><td id='share13'>0</td><td></td></tr></tbody>
<thead sort='3' class='sortable'><tr><td></td><td colspan='4' class='next'>Users<i class='fa fa-fw chevron mt0' id='users_view' onclick='toggleChevron("users_view",3)'></i>
<a href='/Users' title="Go to User settings"><i class='fa fa-fw fa-cog chevron mt0'></i></a><span class='info'>User count: 4 with 0 unprotected</span>
</td><td></td></tr><tr id='users_view_on'><td></td><td>Name</td><td>Description</td><td>Write</td><td>Read</td><td></td></tr></thead>
<tbody sort='3' class='smb user user1 sortable'><tr><td></td><td><i class='icon-user'></i><a href="/Dashboard/Users/UserEdit?name=root" class="blue-text" title="root settings">root</a></td><td>Console and webGui login account</td><td>-</td><td>-</td><td></td></tr><tr><td></td><td><i class='icon-user'></i><a href="/Dashboard/Users/UserEdit?name=guest" class="blue-text" title="guest settings">guest</a></td><td>guest</td><td>7</td><td>1</td><td></td></tr><tr><td></td><td><i class='icon-user'></i><a href="/Dashboard/Users/UserEdit?name=aaronosteraas" class="blue-text" title="aaronosteraas settings">aaronosteraas</a></td><td>Time Machine</td><td>8</td><td>1</td><td></td></tr><tr><td></td><td><i class='icon-user'></i><a href="/Dashboard/Users/UserEdit?name=yc" class="blue-text" title="yc settings">yc</a></td><td></td><td>8</td><td>0</td><td></td></tr></tbody>
</table>

<table id='db-box2' class='share_status dashboard box2'>
<thead sort='0' class='sortable'><tr><td></td><td colspan='5' class='next'>Parity<i class='fa fa-fw chevron mt0' id='parity_view' onclick='toggleChevron("parity_view",0)'></i>
<a href='/Dashboard/Settings/Scheduler' title="Go to scheduler settings"><i class='fa fa-fw fa-cog chevron mt0'></i></a>
<span class='info title'></span></td><td></td></tr></thead>
<tbody sort='0' class='parity_view sortable'>
<tr><td></td><td colspan='5' id='parity' class="wrap"></td><td></td></tr>
<tr><td></td><td colspan='5' id='program' class="wrap"></td><td></td></tr>
</tbody>
<thead sort='1' class='sortable'><tr><td></td><td colspan='5' class='next'>Array<i class='fa fa-fw chevron mt0' id='array_view' onclick='toggleChevron("array_view",0)'></i>
<a href='/Dashboard/Settings/DiskSettings' title="Go to disk settings"><i class='fa fa-fw fa-cog chevron mt0'></i></a>
<span class='info'>12.4 TB used of 26 TB (47.6 %)</span></td><td></td></tr>
<tr class='my_view'><td></td><td id='array_info' colspan='5'></td><td></td></tr>
<tr id='array_view_on'><td></td><td>Device</td><td>Status</td><td>Temp</td><td>SMART</td><td>Utilization</td><td></td></tr>
</thead>
<tbody sort='1' class='array_view sortable' id='array_list'></tbody>
<thead sort='2' class='sortable'><tr><td></td><td colspan='5' class='next'>Cache<i class='fa fa-fw chevron mt0' id='_cache_view' onclick='toggleChevron("_cache_view",0)'></i>
<a href='/Dashboard/Settings/DiskSettings' title="Go to disk settings"><i class='fa fa-fw fa-cog chevron mt0'></i></a>
<span class='info'>193 GB used of 1 TB (19.3 %)</span></td><td></td></tr>
<tr class='my_view'><td></td><td id='cache_info0' colspan='5'></td><td></td></tr>
<tr id='_cache_view_on'><td></td><td>Device</td><td>Status</td><td>Temp</td><td>SMART</td><td>Utilization</td><td></td></tr>
</thead>
<tbody sort='2' class='_cache_view sortable' id='cache_list0'></tbody>
<thead sort='3' class='sortable'><tr><td></td><td colspan='5' class='next'>Unassigned<i class='fa fa-fw chevron mt0' id='extra_view' onclick='toggleChevron("extra_view",0)'></i><span class='info'></span></td><td></td></tr>
<tr class='my_view'><td></td><td id='extra_info' colspan='5'></td><td></td></tr>
<tr id='extra_view_on'><td></td><td>Device</td><td>Status</td><td>Temp</td><td>SMART</td><td>Utilization</td><td></td></tr>
</thead>
<tbody sort='3' class='extra_view sortable' id='extra_list'></tbody>
</table>
</div>

<form name='boot' method='POST' action='/webGui/include/Boot.php'>
<input type='hidden' name='csrf_token' value='18FA89EE4D74E62D'>
<input type='hidden' name='cmd' value=''>
</form>

<div id="iframe-popup"></div>

<p>&nbsp;</p>

<script>
var timer30 = null;
var orange = 70;
var red = 90;
var timestamp = 0, rx_bytes = 0, tx_bytes = 0;
var ports = ["bond0","eth0","lo"];

if ($.cookie('port_select')!=null && !ports.includes($.cookie('port_select'))) $.removeCookie('port_select');
var port_select = $.cookie('port_select')||ports[0];

function noApps() {
  if ($('span.outer.apps:visible').length==0) $('#no_apps').show(); else $('#no_apps').hide();
}
function noVMs() {
  if ($('span.outer.vms:visible').length==0) $('#no_vms').show(); else $('#no_vms').hide();
}
function loadlist(init) {
  if (init) {
    $('#apps').switchButton({labels_placement:'left', off_label:"All Apps", on_label:"Started only", checked:$.cookie('my_apps')=='startedOnly'});
    $('#vms').switchButton({labels_placement:'left', off_label:"All VMs", on_label:"Started only", checked:$.cookie('my_vms')=='startedOnly'});
    $('#apps').change(function(){
      $('span.outer.apps.stopped').finish().toggle('fast',function(){noApps();})
      $('#apps').is(':checked') ? $.cookie('my_apps','startedOnly',{expires:3650}) : $.removeCookie('my_apps');
    });
    $('#vms').change(function(){
      $('span.outer.vms.stopped').finish().toggle('fast',function(){noVMs();});
      $('#vms').is(':checked') ? $.cookie('my_vms','startedOnly',{expires:3650}) : $.removeCookie('my_vms');
    });
    context.init({preventDoubleContext:false,left:true,above:false});
  }
  $.post('/webGui/include/DashboardApps.php',{display:'icons',docker:'12710',vms:'10452'},function(d) {
    var data = d.split(/\0/);
    $('.docker_view').html(data[0]);
    $('.vm_view').html(data[1]);
    var script = document.createElement('script');
    script.innerHTML = data[2];
    document.head.appendChild(script);
    if ($.cookie('my_apps')!=null) $('span.apps.stopped').hide(0,function(){noApps();});
    if ($.cookie('my_vms')!=null) $('span.vms.stopped').hide(0,function(){noVMs();});
    context.init({preventDoubleContext:false,left:true,above:false});
  });
}
function setCase() {
  $.post('/webGui/include/SelectCase.php',{mode:'get',file:'case-model.cfg'},function(model){
    if (!model) {
      $('#casing').html("<i id='mycase' class='fa fa-hdd-o'></i><br>");
    } else if (model.indexOf('.png')<0) {
      $('#casing').html("<i id='mycase' class='case-"+model+"'></i><br>");
    } else {
      var now = new Date();
      $('#casing').html("<img id='mycase' src='/webGui/images/"+model+"?v="+now.getTime()+"'><br>");
    }
  });
}

function changeMode(item) {
  var user = $.cookie('users_view');
  var share = $.cookie('shares_view');
  if (item==0) $.removeCookie('enter_share'); else $.cookie('enter_share',item,{expires:3650});
  if (item==0 && user==null) $('.smb.user1').show(); else $('.smb.user1').hide();
  if (item==0 && share==null) $('.smb.share1').show(); else $('.smb.share1').hide();
}
function changeView(item) {
  if (item==0) $.removeCookie('enter_view'); else $.cookie('enter_view',item,{expires:3650});
  if (item==0) $('.view1').show(); else $('.view1').hide();
  if (item==1) $('.view2').show(); else $('.view2').hide();
  if (item==2) $('.view3').show(); else $('.view3').hide();
  clearTimeout(timer30);
  update30();
}
function smartMenu(table) {
  $(table).find('[id^="smart-"]').each(function() {
    var opts = [];
    var id = '#'+$(this).attr('id');
    var page = $(this).attr('name');
    var view = $(this).attr('class');
    var disk = id.substr(id.indexOf('-')+1);
    opts.push({text:"Attributes",icon:'fa-sitemap',action:function(e){e.preventDefault();attributes(page,disk);}});
    opts.push({divider:true});
    opts.push({text:"Capabilities",icon:'fa-user',action:function(e){e.preventDefault();capabilities(page,disk);}});
    opts.push({divider:true});
    opts.push({text:"Identity",icon:'fa-home',action:function(e){e.preventDefault();identity(page,disk);}});
    if (view.search('green-text') == -1) {
      opts.push({divider:true});
      opts.push({text:"Acknowledge",icon:'fa-check-square-o',action:function(e){e.preventDefault();acknowledge(disk);}});
    }
    context.attach(id,opts);
  });
}
function portMenu() {
  var select = 'select[name="port_select"]';
  var option = $(select+' option');
  for (var i=0; i < option.length; i++) {
    if (option[i].value == port_select) {option[i].selected = true; break;}
  }
}
function portSelect(name) {
  $.cookie('port_select',name,{expires:3650});
  port_select = name;
  timestamp = 0, rx_bytes = 0, tx_bytes = 0;
}
function moreInfo(data,table) {
  var info = [];
  if (data[1]>0) info.push(data[1]+" failed device"+(data[1]==1?'':'s'));
  if (data[2]>0) info.push(data[2]+" heat warning"+(data[2]==1?'':'s'));
  if (data[3]>0) info.push(data[3]+" SMART error"+(data[3]==1?'':'s'));
  if (data[4]>0) info.push(data[4]+" utilization warning"+(data[4]==1?'':'s'));
  return info.length ? "<div class='last'><i class='icon-u-triangle failed'></i><span class='failed'>"+table+" has "+info.join('. ')+".</span></div>" : "";
}
function update5() {
  $.post('/webGui/include/DashUpdate.php',{cmd:'fan'},function(data) {
    $.each(data.split('\0'),function(k,v) {$('#fan'+k).html(v);});
  });
  $.post('/webGui/include/DashUpdate.php',{cmd:'speed',port:port_select,timestamp:timestamp,rx_bytes:rx_bytes,tx_bytes:tx_bytes,},function(d) {
    var data = d.split('\0');
    $('#inbound').text(data[0]);
    $('#outbound').text(data[1]);
    timestamp = data[2];
    rx_bytes = data[3];
    tx_bytes = data[4];
    setTimeout(update5,5000);
  });
}
function update15() {
  var tag = $('.smb').is(':visible') ? 'smb' : $('.nfs').is(':visible') ? 'nfs' : '';
  $.post('/webGui/include/DashUpdate.php',{cmd:'shares',com:tag,names:'Data,DockerBackup,Movies,My Media,TV,aotm,appdata,backup,domains,isos,system,vm,yctm'},function(data) {
    $.each(data.split('\0'),function(k,v) {$('#share'+(k+1)).html(v);});
  });
  $.post('/webGui/include/DashUpdate.php',{cmd:'status',number:'.,'},function(data) {$('span.info.title').html(data);});
  $.post('/webGui/include/DashUpdate.php',{cmd:'parity',time:'%c'},function(d) {
    var data = d.split('\0');
    $('#parity').html(data[0]);
    $('#program').html(data[1]);
    setTimeout(update15,15000);
  });
}
function update30() {
  var tag = $.cookie('enter_view')==0 ? 'main' : $.cookie('enter_view')==1 ? 'port' : $.cookie('enter_view')==2 ? 'link' : 'main';
  $.post('/webGui/include/DashUpdate.php',{cmd:'port',view:tag,ports:ports.join(',')},function(data) {
    $.each(data.split('\0'),function(k,v) {$('#'+tag+k).html(v);});
  });
  $.post('/webGui/include/DashUpdate.php',{cmd:'array',path:'Dashboard',hot:'45',max:'55',unit:'C',text:1,critical:'90',warning:'70'},function(d) {
    var data = d.split('\0');
    var info = moreInfo(data,"Array");
    $('#array_list').html(data[0]);
    $('#array_info').parent().css('display',info?'':'none');
    $('#array_info').html(info);
    smartMenu('#array_list');
    $.post('/webGui/include/DashUpdate.php',{cmd:'cache',path:'Dashboard',hot:'45',max:'55',unit:'C',text:1,critical:'90',warning:'70'},function(d) {
      var text = d.split('\r');
      for (var i=0,t; t=text[i]; i++) {
        var data = t.split('\0');
        var info = moreInfo(data,"Cache");
        $('#cache_list'+i).html(t);
        $('#cache_info'+i).parent().css('display',info?'':'none');
        $('#cache_info'+i).html(info);
        smartMenu('#cache_list'+i);
      }
      $.post('/webGui/include/DashUpdate.php',{cmd:'extra',path:'Dashboard',hot:'45',max:'55',unit:'C',text:1,critical:'90',warning:'70'},function(d) {
        var data = d.split('\0');
        var info = moreInfo(data,"Unassigned");
        $('#extra_list').html(data[0]);
        $('#extra_info').parent().css('display',info?'':'none');
        $('#extra_info').html(info);
        smartMenu('#extra_list');
      });
    });
    timer30 = setTimeout(update30,30000);
  });
}
function update60() {
  $.post('/webGui/include/DashUpdate.php',{cmd:'sys'},function(data) {
    $.each(data.split('\0'),function(k,v) {
      var load = v.slice(0,-1);
      if (load >= 90) var color = 'redbar';
      else if (load >= 70) var color = 'orangebar';
      else var color = '';
      $('.sys'+k).text(v);
      $('#sys'+k).finish().animate({width:v},{step:function(){$('#sys'+k).css('overflow','visible').removeClass().addClass(color);}});
    });
    setTimeout(update60,60000);
  });
}
function attributes(page,disk) {
  var tab = page=='New' ? 'tab2' : 'tab3';
  $.cookie('one',tab,{path:'/'});
  location.replace('/Dashboard/'+page+'?name='+disk);
}
function capabilities(page,disk) {
  var tab = page=='New' ? 'tab3' : 'tab4';
  $.cookie('one',tab,{path:'/'});
  location.replace('/Dashboard/'+page+'?name='+disk);
}
function identity(page,disk) {
  var tab = page=='New' ? 'tab4' : 'tab5';
  $.cookie('one',tab,{path:'/'});
  location.replace('/Dashboard/'+page+'?name='+disk);
}
function acknowledge(disk) {
  $.post('/webGui/include/Acknowledge.php',{disk:disk},function(){clearTimeout(timer30);update30();});
}
function dropdown(menu) {
  var select = 'select[name="'+menu+'"]';
  var size   = $(select+' option').length;
  var option = $.cookie(menu)||0;
  if (option >= size) option = size - 1;
  $(select+' option')[option].selected = true;
  $(select).change();
}
function toggleChevron(field,action) {
  switch (action) {
    case 0:
    case 1: var view = field; break;
    case 2: var view = $.cookie('enter_view')||0; view++; view = 'view'+view; break;
    case 3: var view = $.cookie('enter_share')||0; view++; view = 'user'+view; break;
    case 4: var view = $.cookie('enter_share')||0; view++; view = 'share'+view; break;
  }
  toggleView(field,false,view);
  var visible = $('.'+view).is(':visible');
  var chevron = visible ? 'fa-chevron-up' : 'fa-chevron-down';
  var remove  = visible ? 'fa-chevron-down' : 'fa-chevron-up';
  $('i#'+field).removeClass(remove).addClass(chevron);
  if (action==1) {
    if (visible) toggleCPU(true); else $('.cpu_open').hide();
  } else if (action==2) {
    $('.'+field).toggle();
  }
}
function toggleCPU(init) {
  if (!init) {if ($.cookie('cpu')===undefined) $.cookie('cpu','close',{expires:3650}); else $.removeCookie('cpu');}
  if ($.cookie('cpu_view')===undefined) {
    if ($.cookie('cpu')===undefined) {
      $('.cpu_open').show();
      $('.cpu_close').text("Hide details");
      $('.cpu_view').find('td').css('padding-bottom','0');
    } else {
      $('.cpu_open').hide();
      $('.cpu_close').text("Show details");
      $('.cpu_view').find('td').css('padding-bottom','20px');
    }
  } else {
    $('.cpu_open').hide();
  }
}
function toggleView(field,init,view) {
  if (!view) view = $.cookie(field)||field;
  if (!init) {if ($.cookie(field)===undefined) $.cookie(field,view,{expires:3650}); else $.removeCookie(field);}
  var visible = $.cookie(field)===undefined;
  if (visible) $('.'+view).show().removeClass('flat'); else $('.'+view).hide().addClass('flat');
  var unset = true;
  switch (field) {
  case 'users_view':
    visible = $('.user').is(':visible');
    unset = false;
  case 'shares_view':
    if (unset) visible = $('.share').is(':visible');
  case 'array_view':
  case '_cache_view':
  case 'extra_view':
    var on = $('#'+field+'_on');
    var off = $('#'+field+'_off');
    if (visible) {on.show(); off.hide();} else {off.show(); on.hide();}
    break;
  case 'docker_view':
    if (visible) $('span.info.apps').show(); else $('span.info.apps').hide();
    if (init) setTimeout(noApps,200); else noApps();
    break;
  case 'vm_view':
    if (visible) $('span.info.vms').show(); else $('span.info.vms').hide();
    if (init) setTimeout(noVMs,200); else noVMs();
    break;
  }
  if (init) {
    var chevron = visible ? 'fa-chevron-up' : 'fa-chevron-down';
    $('#'+field).addClass(chevron);
  }
}
function StopArray() {
  swal({title:"Proceed?",text:"This will stop the array",type:'warning',html:true,showCancelButton:true,confirmButtonText:"Proceed",cancelButtonText:"Cancel"},function(){StopArrayNow();});
}
function StopArrayNow() {
  $('span.hand').prop('onclick',null).off('click').addClass('busy').css('cursor','default');
  $.post('/update.htm',{startState:'STARTED',cmdStop:'Stop',csrf_token:'18FA89EE4D74E62D'},function(){refresh();});
}
function StartArray() {
  swal({title:"Proceed?",text:"This will start the array",type:'warning',html:true,showCancelButton:true,confirmButtonText:"Proceed",cancelButtonText:"Cancel"},function(){StartArrayNow();});
}
function StartArrayNow() {
  $('span.hand').prop('onclick',null).off('click').addClass('busy').css('cursor','default');
  $.post('/update.htm',{startState:'STARTED',cmdStart:'Start',csrf_token:'18FA89EE4D74E62D'},function(){refresh();});
}
function Reboot() {
  swal({title:"Proceed?",text:"This will reboot the system",type:'warning',html:true,showCancelButton:true,confirmButtonText:"Proceed",cancelButtonText:"Cancel"},function(){RebootNow();});
}
function RebootNow() {
  document.boot.cmd.value = 'reboot';
  document.boot.submit();
}
function Shutdown() {
  swal({title:"Proceed?",text:"This will shutdown the system",type:'warning',html:true,showCancelButton:true,confirmButtonText:"Proceed",cancelButtonText:"Cancel"},function(){ShutdownNow();});
}
function ShutdownNow() {
  document.boot.cmd.value = 'shutdown';
  document.boot.submit();
}


function sortTable(table,index) {
  if (!index) return;
  index = index.split(';');
  for (var i=0,n; n=index[i]; i++) {
    table.find('thead[sort="'+n+'"]').appendTo(table);
    table.find('tbody[sort="'+n+'"]').appendTo(table);
  }
}

function simplef() {
  var text = arguments[0];
  for (var i=1,arg; arg=arguments[i]; i++) text = text.replace('%s',arg);
  return text;
}

var cpuload = new NchanSubscriber('/sub/cpuload');
cpuload.on('message',function(data) {
/*
message should be something like: {"cpuload": {"cpu":[0,0],"cpu0":[0,0],"cpu1":[0,0],"cpu2":[0,0],"cpu3":[0,0]}}
The array values are [<load-percentage>,<guest-percentage>].  guest-percentage is that part of load-percentage that is being consumed by VM guests
var json = $.parseJSON(message);
$.each(json["cpuload"],function(k,v) {
  $('#'+k).animate({width:v[0]+'%'},{step:function(){$('#'+k).css('overflow','visible');}}).text(v[0]+'%');
});
*/
//data is the cpuload.ini file contents
  var ini = parseINI(data);
  $.each(ini,function(k,v) {
    var load = v['host'];
    if (load >= red) var color = 'redbar';
    else if (load >= orange) var color = 'orangebar';
    else var color = '';
    load += '%';
    $('.'+k).text(load);
    $('#'+k).finish().animate({width:load},{step:function(){$('#'+k).css('overflow','visible').removeClass().addClass(color);}});
  });
});
var sortableHelper = function(e,ui){
  var width = [];
  var table = ui.parent();
  ui.find('tr:first').children().each(function(){width.push($(this).width());});
  if (ui.prop('nodeName').toLowerCase()=='tbody') {
    var sort = ui.attr('sort');
    var head = table.find('thead[sort="'+sort+'"]');
    if (head.find('tr:first').is(':visible')) ui = head.clone();
  }
  ui.find('tr:first').children().each(function(i){$(this).width(width[i]);});
  return ui;
};

$(function() {
  $('table').sortable({helper:sortableHelper,items:'.sortable',handle:'.section,.next',cursor:'move',axis:'y',containment:'parent',delay:100,opacity:0.5,zIndex:9999,
  update:function(e,ui){
    var table = ui.item.parent();
    var index = [], prev = -1;
    if (ui.item.prop('nodeName').toLowerCase()=='tbody') {
      table.find('tbody').each(function(){
        var sort = $(this).attr('sort');
        var head = table.find('thead[sort="'+sort+'"]');
        if (sort != prev) {
          head.remove().insertBefore($(this));
          index.push(sort);
          prev = sort;
        } else {
          $(this).remove().insertAfter(head);
        }
      });
    } else {
      table.find('thead').each(function(){
        var sort = $(this).attr('sort');
        var body = table.find('tbody[sort="'+sort+'"]');
        body.remove().insertAfter($(this));
        index.push(sort);
      });
    }
    var sorted = true;
    for (var x = 0; x < index.length-1; x++) {
      if (index[x+1]-index[x]!=1) {sorted=false; break;}
    }
    sorted ? $.removeCookie(table.prop('id')) : $.cookie(table.prop('id'),index.join(';'),{expires:3650});
  }});
  dropdown('enter_share');
  dropdown('enter_view');
  update5();
  update15();
  update60();
  toggleCPU(true);
  toggleView('sys_view',true);
  toggleView('mb_view',true);
  toggleView('cpu_view',true);
  toggleView('mem_view',true);
  toggleView('port_view',true);
  toggleView('fan_view',true);
  toggleView('docker_view',true);
  toggleView('vm_view',true);
  toggleView('parity_view',true);
  toggleView('array_view',true);
  toggleView('_cache_view',true);
  toggleView('extra_view',true);
  toggleView('users_view',true);
  toggleView('shares_view',true);
  portMenu();
  loadlist(true);
  cpuload.start();
  sortTable($('#db-box1'),$.cookie('db-box1'));
  sortTable($('#db-box2'),$.cookie('db-box2'));
  sortTable($('#db-box3'),$.cookie('db-box3'));
});
</script>
</div></div>
<div class="spinner fixed"></div>
<form name="rebootNow" method="POST" action="/webGui/include/Boot.php"><input type="hidden" name="cmd" value="reboot"></form>
<iframe id="progressFrame" name="progressFrame" frameborder="0"></iframe>
<div id="footer"><span id="statusraid"><span id="statusbar"><span class='green strong'><i class='fa fa-play-circle'></i> Array Started</span></span></span><span id='countdown'></span><span id='user-notice' class='red-text'></span><span id='copyright'>Unraid&reg; webGui &copy;2021, Lime Technology, Inc. <a href='http://lime-technology.com/wiki/index.php/Official_Documentation' target='_blank' title="Online manual"><i class='fa fa-book'></i> manual</a></span></div><script>
// Firefox specific workaround
if (typeof InstallTrigger!=='undefined') $('#nav-block').addClass('mozilla');

function parseINI(data){
  var regex = {
    section: /^\s*\[\s*\"*([^\]]*)\s*\"*\]\s*$/,
    param: /^\s*([^=]+?)\s*=\s*\"*(.*?)\s*\"*$/,
    comment: /^\s*;.*$/
  };
  var value = {};
  var lines = data.split(/[\r\n]+/);
  var section = null;
  lines.forEach(function(line) {
    if (regex.comment.test(line)) {
      return;
    } else if (regex.param.test(line)) {
      var match = line.match(regex.param);
      if (section) {
        value[section][match[1]] = match[2];
      } else {
        value[match[1]] = match[2];
      }
    } else if (regex.section.test(line)) {
      var match = line.match(regex.section);
      value[match[1]] = {};
      section = match[1];
    } else if (line.length==0 && section) {
      section = null;
    };
  });
  return value;
}
// unraid animated logo
var unraid_logo = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 133.52 76.97" class="unraid_mark"><defs><linearGradient id="unraid_logo" x1="23.76" y1="81.49" x2="109.76" y2="-4.51" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#e32929"/><stop offset="1" stop-color="#ff8d30"/></linearGradient></defs><path d="m70,19.24zm57,0l6.54,0l0,38.49l-6.54,0l0,-38.49z" fill="url(#unraid_logo)" class="unraid_mark_9"/><path d="m70,19.24zm47.65,11.9l-6.55,0l0,-23.79l6.55,0l0,23.79z" fill="url(#unraid_logo)" class="unraid_mark_8"/><path d="m70,19.24zm31.77,-4.54l-6.54,0l0,-14.7l6.54,0l0,14.7z" fill="url(#unraid_logo)" class="unraid_mark_7"/><path d="m70,19.24zm15.9,11.9l-6.54,0l0,-23.79l6.54,0l0,23.79z" fill="url(#unraid_logo)" class="unraid_mark_6"/><path d="m63.49,19.24l6.51,0l0,38.49l-6.51,0l0,-38.49z" fill="url(#unraid_logo)" class="unraid_mark_5"/><path d="m70,19.24zm-22.38,26.6l6.54,0l0,23.78l-6.54,0l0,-23.78z" fill="url(#unraid_logo)" class="unraid_mark_4"/><path d="m70,19.24zm-38.26,43.03l6.55,0l0,14.73l-6.55,0l0,-14.73z" fill="url(#unraid_logo)" class="unraid_mark_3"/><path d="m70,19.24zm-54.13,26.6l6.54,0l0,23.78l-6.54,0l0,-23.78z" fill="url(#unraid_logo)" class="unraid_mark_2"/><path d="m70,19.24zm-63.46,38.49l-6.54,0l0,-38.49l6.54,0l0,38.49z" fill="url(#unraid_logo)" class="unraid_mark_1"/></svg>';

var watchdog = new NchanSubscriber('/sub/var');
watchdog.on('message', function(data) {
  var ini = parseINI(data);
  var state = ini['fsState'];
  var progress = ini['fsProgress'];
  var status;
  if (state=='Stopped') {
    status = "<span class='red strong'><i class='fa fa-stop-circle'></i> Array Stopped</span>";
  } else if (state=='Started') {
    status = "<span class='green strong'><i class='fa fa-play-circle'></i> Array Started</span>";
  } else if (state=='Formatting') {
    status = "<span class='green strong'><i class='fa fa-play-circle'></i> Array Started</span>&bullet;<span class='orange strong'>Formatting device(s)</span>";
  } else {
    status = "<span class='orange strong'><i class='fa fa-pause-circle'></i> "+_('Array '+state)+"</span>";
  }
  if (ini['mdResyncPos']>0) {
    var action;
    if (ini['mdResyncAction'].indexOf("recon")>=0) action = "Parity-Sync / Data-Rebuild";
    else if (ini['mdResyncAction'].indexOf("clear")>=0) action = "Clearing";
    else if (ini['mdResyncAction']=="check") action = "Read-Check";
    else if (ini['mdResyncAction'].indexOf("check")>=0) action = "Parity-Check";
    action += " "+(ini['mdResyncPos']/(ini['mdResyncSize']/100+1)).toFixed(1)+" %";
    status += "&bullet;<span class='orange strong'>"+action.replace('.','.')+"</span>";
    if (ini['mdResync']==0) status += "(Paused)";
  }
  if (progress) status += "&bullet;<span class='blue strong'>"+_(progress)+"</span>";
  $('#statusbar').html(status);
});
var backtotopoffset = 250;
var backtotopduration = 500;
$(window).scroll(function() {
  if ($(this).scrollTop() > backtotopoffset) {
    $('.back_to_top').fadeIn(backtotopduration);
  } else {
    $('.back_to_top').fadeOut(backtotopduration);
  }
  var top = $('div#header').height()-1; // header height has 1 extra pixel to cover overlap
  $('div#menu').css($(this).scrollTop() > top ? {position:'fixed',top:'0'} : {position:'absolute',top:top+'px'});
});
$('.back_to_top').click(function(event) {
  event.preventDefault();
  $('html,body').animate({scrollTop:0},backtotopduration);
  return false;
});
$(function() {
  $('div.spinner.fixed').html(unraid_logo);
  setTimeout(function(){$('div.spinner').not('.fixed').each(function(){$(this).html(unraid_logo);});},500); // display animation if page loading takes longer than 0.5s
  shortcut.add('F1',function(){HelpButton();});
  $.post('/webGui/include/Notify.php',{cmd:'init'},function(){timers.notifier = setTimeout(notifier,0);});
  $('input[value="Apply"],input[value="Apply"],input[name="cmdEditShare"],input[name="cmdUserEdit"]').prop('disabled',true);
  $('form').find('select,input[type=text],input[type=number],input[type=password],input[type=checkbox],input[type=radio],input[type=file],textarea').each(function(){$(this).on('input change',function() {
    var form = $(this).parentsUntil('form').parent();
    form.find('input[value="Apply"],input[value="Apply"],input[name="cmdEditShare"],input[name="cmdUserEdit"]').not('input.lock').prop('disabled',false);
    form.find('input[value="Done"],input[value="Done"]').not('input.lock').val("Reset").prop('onclick',null).off('click').click(function(){refresh(form.offset().top)});
  });});

  var top = ($.cookie('top')||0) - $('.tabs').offset().top - 75;
  if (top>0) {$('html,body').scrollTop(top);}
  $.removeCookie('top',{path:'/'});
  if (location.pathname.search(/\/(AddVM|UpdateVM|AddContainer|UpdateContainer)/)==-1) {
    $('blockquote.inline_help').each(function(i) {
      $(this).attr('id','helpinfo'+i);
      var pin = $(this).prev();
      if (!pin.prop('nodeName')) pin = $(this).parent().prev();
      while (pin.prop('nodeName') && pin.prop('nodeName').search(/(table|dl)/i)==-1) pin = pin.prev();
      pin.find('tr:first,dt:last').each(function() {
        var node = $(this);
        var name = node.prop('nodeName').toLowerCase();
        if (name=='dt') {
          while (!node.html() || node.html().search(/(<input|<select|nbsp;)/i)>=0 || name!='dt') {
            if (name=='dt' && node.is(':first-of-type')) break;
            node = node.prev();
            name = node.prop('nodeName').toLowerCase();
          }
          node.css('cursor','help').click(function(){$('#helpinfo'+i).toggle('slow');});
        } else {
          if (node.html() && (name!='tr' || node.children('td:first').html())) node.css('cursor','help').click(function(){$('#helpinfo'+i).toggle('slow');});
        }
      });
    });
  }
  $('form').append($('<input>').attr({type:'hidden', name:'csrf_token', value:'18FA89EE4D74E62D'}));
  watchdog.start();
});
</script>
</body>
</html>
`;
